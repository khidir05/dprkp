<?php

namespace App\Http\Controllers;

use App\Models\ItemRequest;
use App\Models\OutboundTransaction;
use App\Models\OutboundItem;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class OutboundController extends Controller
{
    /**
     * Process an outbound transaction from an approved request.
     */
    public function store(Request $request, ItemRequest $itemRequest): RedirectResponse
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'admin_gudang' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Admin Gudang yang dapat memproses pengeluaran barang.');
        }

        // Verify Admin Gudang is assigned to the target warehouse
        if ($user->roleModel->code === 'admin_gudang') {
            $isAssigned = $user->warehouses()->where('warehouses.id', $itemRequest->warehouse_id)->exists();
            if (!$isAssigned) {
                abort(403, 'Anda tidak memiliki hak akses untuk memproses barang keluar dari gudang ini.');
            }
        }

        if ($itemRequest->status !== 'approved') {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Hanya permintaan dengan status Disetujui yang dapat diproses keluar.');
        }

        // Load items
        $itemRequest->load('requestItems.product');

        // Check if there are items to dispatch
        $hasItemsToDispatch = false;
        foreach ($itemRequest->requestItems as $item) {
            if ($item->qty_approved > 0) {
                $hasItemsToDispatch = true;
                break;
            }
        }

        if (!$hasItemsToDispatch) {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Permintaan ini tidak memiliki barang yang disetujui untuk dikirim.');
        }

        // 1. Verify Stocks
        foreach ($itemRequest->requestItems as $item) {
            if ($item->qty_approved > 0) {
                $stock = Stock::where('warehouse_id', $itemRequest->warehouse_id)
                    ->where('product_id', $item->product_id)
                    ->first();

                if (!$stock || $stock->qty < $item->qty_approved) {
                    $stockQty = $stock ? $stock->qty : 0;
                    return redirect()->route('requests.show', $itemRequest->id)
                        ->with('error', "Stok barang '{$item->product->name}' tidak mencukupi di gudang ini. Tersedia: {$stockQty}, Butuh: {$item->qty_approved}.");
                }
            }
        }

        // 2. Perform Outbound inside Transaction
        DB::transaction(function() use ($itemRequest, $user, $request) {
            // Generate outbound transaction number
            $count = OutboundTransaction::whereDate('created_at', today())->count() + 1;
            $transactionNumber = 'OUT-' . date('Ymd') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $outbound = OutboundTransaction::create([
                'request_id' => $itemRequest->id,
                'transaction_number' => $transactionNumber,
                'transaction_date' => now()->toDateString(),
                'processed_by' => $user->id,
                'warehouse_id' => $itemRequest->warehouse_id,
                'notes' => $request->input('notes') ?? null,
                'created_at' => now(),
            ]);

            foreach ($itemRequest->requestItems as $item) {
                if ($item->qty_approved > 0) {
                    OutboundItem::create([
                        'outbound_id' => $outbound->id,
                        'product_id' => $item->product_id,
                        'qty' => $item->qty_approved,
                        'created_at' => now(),
                    ]);

                    // Decrement stock
                    $stock = Stock::where('warehouse_id', $itemRequest->warehouse_id)
                        ->where('product_id', $item->product_id)
                        ->first();
                    $stock->decrement('qty', $item->qty_approved);
                }
            }

            // Update request status to completed (dispatched)
            $itemRequest->update([
                'status' => 'completed',
            ]);
        });

        return redirect()->route('requests.show', $itemRequest->id)
            ->with('success', 'Transaksi barang keluar berhasil diproses. Barang telah dikirim dan stok gudang didecrement.');
    }
}
