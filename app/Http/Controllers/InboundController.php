<?php

namespace App\Http\Controllers;

use App\Models\InboundTransaction;
use App\Models\InboundItem;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InboundController extends Controller
{
    /**
     * Display a listing of inbound transactions.
     */
    public function index(Request $request): Response
    {
        $query = InboundTransaction::query()
            ->with(['supplier', 'warehouse', 'createdBy'])
            ->withCount('inboundItems');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('transaction_number', 'like', '%' . $search . '%')
                  ->orWhere('reference_document', 'like', '%' . $search . '%')
                  ->orWhere('notes', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('warehouse_id') && $request->input('warehouse_id') !== 'all') {
            $query->where('warehouse_id', $request->input('warehouse_id'));
        }

        $transactions = $query->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        $warehouses = Warehouse::where('is_active', true)->get(['id', 'name', 'code']);

        return Inertia::render('inbound/index', [
            'transactions' => $transactions,
            'warehouses' => $warehouses,
            'filters' => $request->only(['search', 'warehouse_id']),
            'canCreate' => $request->user()->roleModel->code === 'admin_gudang' || $request->user()->roleModel->code === 'super_admin',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $this->authorizeManagement($request);

        $user = $request->user();
        if ($user->roleModel->code === 'admin_gudang') {
            $warehouses = $user->warehouses()->where('is_active', true)->get(['warehouses.id', 'warehouses.name', 'warehouses.code']);
        } else {
            $warehouses = Warehouse::where('is_active', true)->get(['id', 'name', 'code']);
        }

        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']);
        $products = Product::where('is_active', true)->where('is_hold', false)->orderBy('name')->get(['id', 'name', 'code', 'sku']);

        // Auto-generate transaction number
        $count = InboundTransaction::whereDate('created_at', today())->count() + 1;
        $autoTransactionNumber = 'INB-' . date('Ymd') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

        return Inertia::render('inbound/create', [
            'suppliers' => $suppliers,
            'warehouses' => $warehouses,
            'products' => $products,
            'autoTransactionNumber' => $autoTransactionNumber,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorizeManagement($request);

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'transaction_number' => 'required|string|max:100|unique:inbound_transactions,transaction_number',
            'reference_document' => 'nullable|string|max:100',
            'transaction_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ], [
            'transaction_number.unique' => 'Nomor transaksi sudah digunakan.',
            'items.required' => 'Minimal harus ada 1 barang yang dimasukkan.',
            'items.*.qty.min' => 'Jumlah barang minimal 1.',
        ]);

        // If user is Admin Gudang, verify they are assigned to this warehouse
        $user = $request->user();
        if ($user->roleModel->code === 'admin_gudang') {
            $isAssigned = $user->warehouses()->where('warehouses.id', $validated['warehouse_id'])->exists();
            if (!$isAssigned) {
                abort(403, 'Anda tidak memiliki hak akses untuk memasukkan barang ke gudang ini.');
            }
        }

        DB::transaction(function() use ($validated, $user) {
            // 1. Create InboundTransaction
            $transaction = InboundTransaction::create([
                'supplier_id' => $validated['supplier_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'transaction_number' => $validated['transaction_number'],
                'reference_document' => $validated['reference_document'] ?? null,
                'transaction_date' => $validated['transaction_date'],
                'notes' => $validated['notes'] ?? null,
                'created_by' => $user->id,
                'created_at' => now(),
            ]);

            // 2. Loop items
            foreach ($validated['items'] as $item) {
                InboundItem::create([
                    'inbound_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'created_at' => now(),
                ]);

                // 3. Increment stock
                $stock = Stock::where('warehouse_id', $validated['warehouse_id'])
                    ->where('product_id', $item['product_id'])
                    ->first();

                if ($stock) {
                    $stock->increment('qty', $item['qty']);
                } else {
                    Stock::create([
                        'warehouse_id' => $validated['warehouse_id'],
                        'product_id' => $item['product_id'],
                        'qty' => $item['qty'],
                    ]);
                }
            }
        });

        return redirect()->route('inbound.index')
            ->with('success', 'Transaksi barang masuk berhasil dicatat dan stok telah diupdate.');
    }

    /**
     * Display the specified inbound transaction.
     */
    public function show(Request $request, InboundTransaction $inbound): Response
    {
        $inbound->load(['supplier', 'warehouse', 'createdBy', 'inboundItems.product.unit']);

        return Inertia::render('inbound/show', [
            'transaction' => $inbound,
        ]);
    }

    /**
     * Helper to authorize management actions.
     */
    private function authorizeManagement(Request $request): void
    {
        $role = $request->user()->roleModel->code;
        if ($role !== 'admin_gudang' && $role !== 'super_admin') {
            abort(403, 'Anda tidak memiliki hak akses untuk mengelola barang masuk.');
        }
    }
}
