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
        $isAuthorized = ($user->roleModel->code === 'super_admin') ||
                        ($itemRequest->requester_id !== null && $user->id === $itemRequest->requester_id) ||
                        ($itemRequest->requester_id === null && in_array($user->roleModel->code, ['admin_gudang', 'manager']));

        if (!$isAuthorized) {
            abort(403, 'Anda tidak memiliki hak untuk mengonfirmasi penerimaan pengajuan ini.');
        }

        if ($itemRequest->status !== 'delivered') {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Hanya pengajuan dengan status Sampai yang dapat dikonfirmasi penerimaannya.');
        }

        if ($itemRequest->goodsReceipt()->exists()) {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Penerimaan barang untuk pengajuan ini sudah dikonfirmasi sebelumnya.');
        }

        \Illuminate\Support\Facades\DB::transaction(function() use ($itemRequest, $user, $request) {
            GoodsReceipt::create([
                'request_id' => $itemRequest->id,
                'received_by' => $user->id,
                'received_at' => now(),
                'notes' => $request->input('notes') ?? null,
                'created_at' => now(),
            ]);

            $itemRequest->update([
                'status' => 'completed',
            ]);
        });

        return redirect()->route('requests.show', $itemRequest->id)
            ->with('success', 'Konfirmasi penerimaan barang berhasil disimpan.');
    }
}
