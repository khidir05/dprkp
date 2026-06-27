<?php

namespace App\Http\Controllers;

use App\Models\ItemRequest;
use App\Models\GoodsReceipt;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class GoodsReceiptController extends Controller
{
    /**
     * Record a goods receipt confirmation (Pemohon confirms they received the items).
     */
    public function store(Request $request, ItemRequest $itemRequest): RedirectResponse
    {
        $user = $request->user();
        if ($user->id !== $itemRequest->requester_id && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya pemohon asli yang mengajukan barang yang dapat mengonfirmasi penerimaan.');
        }

        if ($itemRequest->status !== 'completed') {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Hanya permintaan dengan status Completed / Sudah Dikirim yang dapat dikonfirmasi penerimaannya.');
        }

        if ($itemRequest->goodsReceipt()->exists()) {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Penerimaan barang untuk permintaan ini sudah dikonfirmasi sebelumnya.');
        }

        GoodsReceipt::create([
            'request_id' => $itemRequest->id,
            'received_by' => $user->id,
            'received_at' => now(),
            'notes' => $request->input('notes') ?? null,
            'created_at' => now(),
        ]);

        return redirect()->route('requests.show', $itemRequest->id)
            ->with('success', 'Konfirmasi penerimaan barang berhasil disimpan.');
    }
}
