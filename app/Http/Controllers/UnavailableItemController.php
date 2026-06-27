<?php

namespace App\Http\Controllers;

use App\Models\UnavailableItem;
use App\Models\RestockList;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class UnavailableItemController extends Controller
{
    /**
     * Display a listing of the unavailable items.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code === 'pemohon') {
            abort(403, 'Akses ditolak.');
        }

        $query = UnavailableItem::query()->with('creator');

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        } else {
            // Default to open items
            $query->where('status', 'open');
        }

        $items = $query->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        // Get list of active products for matching
        $products = Product::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code', 'sku']);

        return Inertia::render('unavailable-items/index', [
            'items' => $items,
            'products' => $products,
            'filters' => $request->only(['status']),
            'role' => $user->roleModel->code,
        ]);
    }

    /**
     * Store a newly created unavailable item.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'admin_gudang' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Admin Gudang yang dapat melaporkan barang tidak tersedia.');
        }

        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'qty_needed' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        UnavailableItem::create([
            'product_name' => $validated['product_name'],
            'qty_needed' => $validated['qty_needed'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'open',
            'created_by' => $user->id,
            'created_at' => now(),
        ]);

        return redirect()->route('unavailable-items.index')
            ->with('success', 'Barang tidak tersedia berhasil dilaporkan.');
    }

    /**
     * Match unavailable item to product & create restock entry.
     */
    public function process(Request $request, UnavailableItem $item): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat memproses laporan barang tidak tersedia.');
        }

        if ($item->status !== 'open') {
            return redirect()->back()->with('error', 'Item ini sudah diproses atau ditutup.');
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        DB::transaction(function() use ($item, $validated) {
            // Update item status
            $item->update([
                'status' => 'processed',
            ]);

            // Create RestockList entry
            RestockList::create([
                'product_id' => $validated['product_id'],
                'source_type' => 'UnavailableItem',
                'source_id' => $item->id,
                'status' => 'pending',
                'created_at' => now(),
            ]);
        });

        return redirect()->route('unavailable-items.index')
            ->with('success', 'Barang berhasil dipasangkan ke master barang dan masuk ke daftar restock.');
    }

    /**
     * Close the unavailable item report.
     */
    public function close(Request $request, UnavailableItem $item): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat menutup laporan barang tidak tersedia.');
        }

        DB::transaction(function() use ($item, $request) {
            $item->update([
                'status' => 'closed',
            ]);

            // Close associated RestockList if any
            RestockList::where('source_type', 'UnavailableItem')
                ->where('source_id', $item->id)
                ->update([
                    'status' => 'closed',
                    'reviewed_by' => $request->user()->id,
                    'reviewed_at' => now(),
                ]);
        });

        return redirect()->route('unavailable-items.index')
            ->with('success', 'Laporan barang tidak tersedia berhasil ditutup.');
    }

    /**
     * Delete/cancel unavailable item report (only for creator and if still open).
     */
    public function destroy(Request $request, UnavailableItem $item): RedirectResponse
    {
        if ($item->created_by !== $request->user()->id && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Anda tidak memiliki hak untuk menghapus laporan ini.');
        }

        if ($item->status !== 'open') {
            return redirect()->back()->with('error', 'Laporan yang sudah diproses tidak dapat dihapus.');
        }

        $item->delete();

        return redirect()->route('unavailable-items.index')
            ->with('success', 'Laporan barang tidak tersedia berhasil dihapus.');
    }
}
