<?php

namespace App\Http\Controllers;

use App\Models\StockAlert;
use App\Models\Product;
use App\Models\Stock;
use App\Models\RestockList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class StockAlertController extends Controller
{
    /**
     * Display a listing of stock alerts.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code === 'pemohon') {
            abort(403, 'Akses ditolak.');
        }

        // 1. Auto-detect stock alerts before showing the list
        $this->detectStockAlerts();

        $query = StockAlert::query()->with(['product.unit', 'handler']);

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        } else {
            // Default to active alerts (open, restock, hold)
            $query->whereIn('status', ['open', 'restock', 'hold']);
        }

        $alerts = $query->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('alerts/index', [
            'alerts' => $alerts,
            'filters' => $request->only(['status']),
            'role' => $user->roleModel->code,
        ]);
    }

    /**
     * Put a product on hold.
     */
    public function hold(Request $request, StockAlert $alert): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat mengubah status alert.');
        }

        if ($alert->status === 'closed') {
            return redirect()->back()->with('error', 'Alert ini sudah ditutup.');
        }

        DB::transaction(function() use ($alert, $request) {
            $alert->update([
                'status' => 'hold',
                'handled_by' => $request->user()->id,
                'handled_at' => now(),
                'notes' => $request->input('notes') ?? 'Barang ditangguhkan (Hold) oleh Manager.',
            ]);

            // Update product status
            $alert->product->update(['is_hold' => true]);
        });

        return redirect()->back()->with('success', 'Barang berhasil ditangguhkan.');
    }

    /**
     * Release hold on a product.
     */
    public function release(Request $request, StockAlert $alert): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat mengubah status alert.');
        }

        if ($alert->status !== 'hold') {
            return redirect()->back()->with('error', 'Alert tidak dalam status hold.');
        }

        DB::transaction(function() use ($alert, $request) {
            $alert->update([
                'status' => 'open',
                'handled_by' => $request->user()->id,
                'handled_at' => now(),
                'notes' => 'Status hold dilepas.',
            ]);

            // Release product hold
            $alert->product->update(['is_hold' => false]);
        });

        return redirect()->back()->with('success', 'Penangguhan barang berhasil dilepas.');
    }

    /**
     * Create restock entry for this alert.
     */
    public function restock(Request $request, StockAlert $alert): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat mengubah status alert.');
        }

        if ($alert->status === 'closed') {
            return redirect()->back()->with('error', 'Alert ini sudah ditutup.');
        }

        DB::transaction(function() use ($alert, $request) {
            $alert->update([
                'status' => 'restock',
                'handled_by' => $request->user()->id,
                'handled_at' => now(),
                'notes' => $request->input('notes') ?? 'Pengajuan restock disetujui oleh Manager.',
            ]);

            // Create RestockList entry if not already exists
            $exists = RestockList::where('product_id', $alert->product_id)
                ->where('source_type', 'StockAlert')
                ->where('source_id', $alert->id)
                ->exists();

            if (!$exists) {
                RestockList::create([
                    'product_id' => $alert->product_id,
                    'source_type' => 'StockAlert',
                    'source_id' => $alert->id,
                    'status' => 'pending',
                    'created_at' => now(),
                ]);
            }
        });

        return redirect()->back()->with('success', 'Barang berhasil diajukan untuk restock.');
    }

    /**
     * Manually close the alert.
     */
    public function close(Request $request, StockAlert $alert): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat mengubah status alert.');
        }

        DB::transaction(function() use ($alert, $request) {
            $alert->update([
                'status' => 'closed',
                'handled_by' => $request->user()->id,
                'handled_at' => now(),
                'notes' => $request->input('notes') ?? 'Alert ditutup secara manual.',
            ]);

            // Release product hold if closed from hold
            if ($alert->product->is_hold) {
                $alert->product->update(['is_hold' => false]);
            }

            // Close associated RestockList if any
            RestockList::where('product_id', $alert->product_id)
                ->where('source_type', 'StockAlert')
                ->where('source_id', $alert->id)
                ->update([
                    'status' => 'closed',
                    'reviewed_by' => $request->user()->id,
                    'reviewed_at' => now(),
                ]);
        });

        return redirect()->back()->with('success', 'Alert berhasil ditutup.');
    }

    /**
     * Auto-detect stock alerts.
     */
    private function detectStockAlerts(): void
    {
        $products = Product::where('is_active', true)
            ->withSum('stocks as current_stock', 'qty')
            ->get();

        foreach ($products as $product) {
            $currentStock = $product->current_stock ?? 0;

            if ($currentStock <= $product->minimum_stock) {
                // Check if there is an active (non-closed) alert
                $activeAlert = StockAlert::where('product_id', $product->id)
                    ->where('status', '!=', 'closed')
                    ->first();

                if (!$activeAlert) {
                    StockAlert::create([
                        'product_id' => $product->id,
                        'current_stock' => $currentStock,
                        'minimum_stock' => $product->minimum_stock,
                        'status' => 'open',
                        'created_at' => now(),
                    ]);
                } else {
                    // Update current stock if changed
                    if ($activeAlert->current_stock !== $currentStock) {
                        $activeAlert->update([
                            'current_stock' => $currentStock,
                        ]);
                    }
                }
            } else {
                // If stock is now sufficient, auto-close active alerts (open, restock)
                // Do not auto-close 'hold' alerts since they are manually managed.
                StockAlert::where('product_id', $product->id)
                    ->whereIn('status', ['open', 'restock'])
                    ->update([
                        'status' => 'closed',
                        'notes' => 'Stok mencukupi (auto-closed)',
                        'handled_at' => now(),
                    ]);
            }
        }
    }
}
