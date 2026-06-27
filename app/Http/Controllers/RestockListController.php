<?php

namespace App\Http\Controllers;

use App\Models\RestockList;
use App\Models\StockAlert;
use App\Models\UnavailableItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class RestockListController extends Controller
{
    /**
     * Display a listing of restock items.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code === 'pemohon') {
            abort(403, 'Akses ditolak.');
        }

        $query = RestockList::query()->with([
            'product.unit',
            'reviewer',
            'source' => function ($morphTo) {
                $morphTo->morphWith([
                    UnavailableItem::class => ['creator'],
                    StockAlert::class => ['handler'],
                ]);
            }
        ]);

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        } else {
            // Default to active restock items
            $query->whereIn('status', ['pending', 'reviewed']);
        }

        $restocks = $query->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('restock/index', [
            'restocks' => $restocks,
            'filters' => $request->only(['status']),
            'role' => $user->roleModel->code,
        ]);
    }

    /**
     * Update the status of a restock list item.
     */
    public function updateStatus(Request $request, RestockList $restock): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat memperbarui status restock.');
        }

        $validated = $request->validate([
            'status' => 'required|in:reviewed,processed,closed',
        ]);

        DB::transaction(function() use ($restock, $validated, $request) {
            $status = $validated['status'];

            $restock->update([
                'status' => $status,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);

            // Sync status with originating source
            if ($status === 'processed') {
                if ($restock->source_type === 'StockAlert') {
                    // Close the stock alert
                    StockAlert::where('id', $restock->source_id)->update([
                        'status' => 'closed',
                        'handled_by' => $request->user()->id,
                        'handled_at' => now(),
                        'notes' => 'Restock selesai diproses.',
                    ]);
                } elseif ($restock->source_type === 'UnavailableItem') {
                    // Mark unavailable item as processed
                    UnavailableItem::where('id', $restock->source_id)->update([
                        'status' => 'processed',
                    ]);
                }
            } elseif ($status === 'closed') {
                if ($restock->source_type === 'StockAlert') {
                    // Close the stock alert
                    StockAlert::where('id', $restock->source_id)->update([
                        'status' => 'closed',
                        'handled_by' => $request->user()->id,
                        'handled_at' => now(),
                        'notes' => 'Pengajuan restock ditutup/dibatalkan.',
                    ]);
                } elseif ($restock->source_type === 'UnavailableItem') {
                    // Close the unavailable item
                    UnavailableItem::where('id', $restock->source_id)->update([
                        'status' => 'closed',
                    ]);
                }
            }
        });

        return redirect()->route('restock.index')
            ->with('success', 'Status restock barang berhasil diperbarui.');
    }
}
