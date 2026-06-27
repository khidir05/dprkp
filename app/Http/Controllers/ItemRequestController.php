<?php

namespace App\Http\Controllers;

use App\Models\ItemRequest;
use App\Models\RequestItem;
use App\Models\Warehouse;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class ItemRequestController extends Controller
{
    /**
     * Display a listing of requests.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $query = ItemRequest::query()->with(['requester', 'warehouse', 'approvedBy']);

        // Role-based filtering
        if ($user->roleModel->code === 'pemohon') {
            // Pemohon only sees their own requests
            $query->where('requester_id', $user->id);
        } elseif ($user->roleModel->code === 'admin_gudang') {
            // Admin Gudang only sees requests for their assigned warehouses
            $assignedWarehouseIds = $user->warehouses()->pluck('warehouses.id');
            $query->whereIn('warehouse_id', $assignedWarehouseIds)
                  ->whereIn('status', ['approved', 'completed']); // Gudang only sees approved/completed requests to prepare
        }

        // Search & Status filters
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('request_number', 'like', '%' . $search . '%')
                  ->orWhere('notes', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $requests = $query->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('requests/index', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status']),
            'role' => $user->roleModel->code,
        ]);
    }

    /**
     * Show the form for creating a new request.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'pemohon' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya pemohon yang dapat membuat permintaan barang.');
        }

        $warehouses = Warehouse::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']);
        $products = Product::where('is_active', true)->where('is_hold', false)->orderBy('name')->get(['id', 'name', 'code', 'sku']);

        return Inertia::render('requests/create', [
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created request.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'pemohon' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya pemohon yang dapat membuat permintaan barang.');
        }

        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty_requested' => 'required|integer|min:1',
        ], [
            'items.required' => 'Minimal harus ada 1 barang yang diajukan.',
            'items.*.qty_requested.min' => 'Jumlah barang minimal 1.',
        ]);

        DB::transaction(function() use ($validated, $user) {
            // Auto generate request number
            $count = ItemRequest::whereDate('created_at', today())->count() + 1;
            $requestNumber = 'REQ-' . date('Ymd') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $itemRequest = ItemRequest::create([
                'request_number' => $requestNumber,
                'requester_id' => $user->id,
                'request_date' => now()->toDateString(),
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
                'warehouse_id' => $validated['warehouse_id'],
            ]);

            foreach ($validated['items'] as $item) {
                RequestItem::create([
                    'request_id' => $itemRequest->id,
                    'product_id' => $item['product_id'],
                    'qty_requested' => $item['qty_requested'],
                    'qty_approved' => null, // filled upon manager approval
                ]);
            }
        });

        return redirect()->route('requests.index')
            ->with('success', 'Permintaan barang berhasil diajukan dan sedang menunggu persetujuan Manager.');
    }

    /**
     * Display details of a request.
     */
    public function show(Request $request, ItemRequest $itemRequest): Response
    {
        $itemRequest->load([
            'requester', 
            'warehouse', 
            'approvedBy', 
            'requestItems.product.unit',
            'outboundTransaction.processedBy',
            'goodsReceipt.receivedBy'
        ]);

        // Load stocks count in this warehouse for each requested product (helps Manager & Gudang check stock levels)
        foreach ($itemRequest->requestItems as $item) {
            $stock = \App\Models\Stock::where('warehouse_id', $itemRequest->warehouse_id)
                ->where('product_id', $item->product_id)
                ->first();
            $item->available_stock = $stock ? $stock->qty : 0;
        }

        return Inertia::render('requests/show', [
            'itemRequest' => $itemRequest,
            'role' => $request->user()->roleModel->code,
        ]);
    }

    /**
     * Approve the request (Manager only).
     */
    public function approve(Request $request, ItemRequest $itemRequest): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat menyetujui permintaan barang.');
        }

        if ($itemRequest->status !== 'pending') {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Permintaan ini sudah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:request_items,id',
            'items.*.qty_approved' => 'required|integer|min:0',
        ]);

        DB::transaction(function() use ($validated, $itemRequest, $request) {
            foreach ($validated['items'] as $itemData) {
                $item = RequestItem::find($itemData['id']);
                $item->update([
                    'qty_approved' => $itemData['qty_approved'],
                ]);
            }

            $itemRequest->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);
        });

        return redirect()->route('requests.show', $itemRequest->id)
            ->with('success', 'Permintaan barang disetujui dan siap diproses oleh Admin Gudang.');
    }

    /**
     * Reject the request (Manager only).
     */
    public function reject(Request $request, ItemRequest $itemRequest): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat menolak permintaan barang.');
        }

        if ($itemRequest->status !== 'pending') {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Permintaan ini sudah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ], [
            'rejection_reason.required' => 'Alasan penolakan wajib diisi.',
        ]);

        $itemRequest->update([
            'status' => 'rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return redirect()->route('requests.show', $itemRequest->id)
            ->with('success', 'Permintaan barang telah ditolak.');
    }

    /**
     * Cancel the request (Pemohon only).
     */
    public function cancel(Request $request, ItemRequest $itemRequest): RedirectResponse
    {
        if ($request->user()->id !== $itemRequest->requester_id && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Anda tidak memiliki hak untuk membatalkan permintaan ini.');
        }

        if ($itemRequest->status !== 'pending') {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Hanya permintaan bertatus Pending yang dapat dibatalkan.');
        }

        $itemRequest->delete(); // Or update to a 'cancelled' status if available, but since migration enum is just pending/approved/rejected/completed, delete is appropriate or we can just delete it as planned.

        return redirect()->route('requests.index')
            ->with('success', 'Permintaan barang berhasil dibatalkan/dihapus.');
    }
}
