<?php

namespace App\Http\Controllers;

use App\Models\StockMutation;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class StockMutationController extends Controller
{
    /**
     * Display a listing of mutations.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code === 'pemohon') {
            abort(403, 'Akses ditolak. Pemohon tidak dapat melihat mutasi internal.');
        }

        $query = StockMutation::query()->with(['product.unit', 'fromWarehouse', 'toWarehouse', 'createdBy']);

        // Filter for Admin Gudang (only see mutations involving their assigned warehouses)
        if ($user->roleModel->code === 'admin_gudang') {
            $assignedWarehouseIds = $user->warehouses()->pluck('warehouses.id');
            $query->where(function($q) use ($assignedWarehouseIds) {
                $q->whereIn('from_warehouse_id', $assignedWarehouseIds)
                  ->orWhereIn('to_warehouse_id', $assignedWarehouseIds);
            });
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('product', function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            })->orWhere('mutation_number', 'like', '%' . $search . '%');
        }

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $mutations = $query->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('mutations/index', [
            'mutations' => $mutations,
            'filters' => $request->only(['search', 'status']),
            'role' => $user->roleModel->code,
        ]);
    }

    /**
     * Show the form for creating a new mutation.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'admin_gudang' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Admin Gudang yang dapat mengajukan mutasi barang.');
        }

        // Filter warehouses for Admin Gudang (source warehouse must be managed by them)
        if ($user->roleModel->code === 'admin_gudang') {
            $fromWarehouses = $user->warehouses()->where('is_active', true)->get(['warehouses.id', 'warehouses.name', 'warehouses.code']);
        } else {
            $fromWarehouses = Warehouse::where('is_active', true)->get(['id', 'name', 'code']);
        }

        $toWarehouses = Warehouse::where('is_active', true)->get(['id', 'name', 'code']);
        $products = Product::where('is_active', true)->where('is_hold', false)->orderBy('name')->get(['id', 'name', 'code', 'sku']);

        return Inertia::render('mutations/create', [
            'fromWarehouses' => $fromWarehouses,
            'toWarehouses' => $toWarehouses,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created mutation (optimistic transfer: changes stocks immediately).
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'admin_gudang' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Admin Gudang yang dapat mengajukan mutasi barang.');
        }

        $validated = $request->validate([
            'from_warehouse_id' => 'required|exists:warehouses,id|different:to_warehouse_id',
            'to_warehouse_id' => 'required|exists:warehouses,id',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'reason' => 'nullable|string',
        ], [
            'from_warehouse_id.different' => 'Gudang asal dan gudang tujuan harus berbeda.',
            'qty.min' => 'Jumlah barang minimal 1.',
        ]);

        // If Gudang role, verify they manage the source warehouse
        if ($user->roleModel->code === 'admin_gudang') {
            $isAssigned = $user->warehouses()->where('warehouses.id', $validated['from_warehouse_id'])->exists();
            if (!$isAssigned) {
                abort(403, 'Anda tidak memiliki hak akses untuk memutasi barang dari gudang asal ini.');
            }
        }

        // Verify stock in source warehouse
        $sourceStock = Stock::where('warehouse_id', $validated['from_warehouse_id'])
            ->where('product_id', $validated['product_id'])
            ->first();

        if (!$sourceStock || $sourceStock->qty < $validated['qty']) {
            $available = $sourceStock ? $sourceStock->qty : 0;
            return redirect()->back()
                ->with('error', "Stok barang tidak mencukupi di gudang asal. Tersedia: {$available}, Diminta: {$validated['qty']}.");
        }

        DB::transaction(function() use ($validated, $user) {
            // 1. Generate mutation number
            $count = StockMutation::whereDate('created_at', today())->count() + 1;
            $mutationNumber = 'MUT-' . date('Ymd') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            // 2. Create mutation record (pending status)
            StockMutation::create([
                'mutation_number' => $mutationNumber,
                'product_id' => $validated['product_id'],
                'qty' => $validated['qty'],
                'mutation_type' => 'transfer',
                'reason' => $validated['reason'] ?? null,
                'status' => 'pending',
                'created_by' => $user->id,
                'from_warehouse_id' => $validated['from_warehouse_id'],
                'to_warehouse_id' => $validated['to_warehouse_id'],
                'created_at' => now(),
            ]);

            // 3. Subtract stock from source warehouse
            Stock::where('warehouse_id', $validated['from_warehouse_id'])
                ->where('product_id', $validated['product_id'])
                ->decrement('qty', $validated['qty']);

            // 4. Add stock to destination warehouse
            $destStock = Stock::where('warehouse_id', $validated['to_warehouse_id'])
                ->where('product_id', $validated['product_id'])
                ->first();

            if ($destStock) {
                $destStock->increment('qty', $validated['qty']);
            } else {
                Stock::create([
                    'warehouse_id' => $validated['to_warehouse_id'],
                    'product_id' => $validated['product_id'],
                    'qty' => $validated['qty'],
                ]);
            }
        });

        return redirect()->route('mutations.index')
            ->with('success', 'Mutasi barang berhasil diajukan. Stok gudang asal didecrement dan gudang tujuan diincrement.');
    }

    /**
     * Display details of a mutation.
     */
    public function show(Request $request, StockMutation $mutation): Response
    {
        if ($request->user()->roleModel->code === 'pemohon') {
            abort(403, 'Akses ditolak.');
        }

        $mutation->load(['product.unit', 'fromWarehouse', 'toWarehouse', 'createdBy', 'approvedBy']);

        return Inertia::render('mutations/show', [
            'mutation' => $mutation,
            'role' => $request->user()->roleModel->code,
        ]);
    }

    /**
     * Approve mutation (Manager only).
     */
    public function approve(Request $request, StockMutation $mutation): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat memverifikasi mutasi barang.');
        }

        if ($mutation->status !== 'pending') {
            return redirect()->route('mutations.show', $mutation->id)
                ->with('error', 'Mutasi ini sudah diproses sebelumnya.');
        }

        $mutation->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return redirect()->route('mutations.show', $mutation->id)
            ->with('success', 'Mutasi barang disetujui secara resmi.');
    }

    /**
     * Reject mutation (Manager only) -> Reverses stock changes!
     */
    public function reject(Request $request, StockMutation $mutation): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat memproses mutasi barang.');
        }

        if ($mutation->status !== 'pending') {
            return redirect()->route('mutations.show', $mutation->id)
                ->with('error', 'Mutasi ini sudah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        DB::transaction(function() use ($mutation, $validated, $request) {
            // Reversal of stock changes
            // 1. Add back to from_warehouse
            $sourceStock = Stock::where('warehouse_id', $mutation->from_warehouse_id)
                ->where('product_id', $mutation->product_id)
                ->first();

            if ($sourceStock) {
                $sourceStock->increment('qty', $mutation->qty);
            } else {
                Stock::create([
                    'warehouse_id' => $mutation->from_warehouse_id,
                    'product_id' => $mutation->product_id,
                    'qty' => $mutation->qty,
                ]);
            }

            // 2. Subtract from to_warehouse
            Stock::where('warehouse_id', $mutation->to_warehouse_id)
                ->where('product_id', $mutation->product_id)
                ->decrement('qty', $mutation->qty);

            // 3. Mark mutation as rejected
            $mutation->update([
                'status' => 'rejected',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'rejection_reason' => $validated['rejection_reason'],
            ]);
        });

        return redirect()->route('mutations.show', $mutation->id)
            ->with('success', 'Mutasi barang ditolak. Stok telah dikembalikan ke gudang asal (Reversal).');
    }
}
