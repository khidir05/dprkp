<?php

namespace App\Http\Controllers;

use App\Models\StockOpname;
use App\Models\StockOpnameItem;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class StockOpnameController extends Controller
{
    /**
     * Display a listing of stock opnames.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code === 'pemohon') {
            abort(403, 'Akses ditolak. Pemohon tidak dapat melihat opname stok.');
        }

        $query = StockOpname::query()->with(['warehouse', 'createdBy', 'approvedBy']);

        // Filter for Admin Gudang (only see opnames in their assigned warehouses)
        if ($user->roleModel->code === 'admin_gudang') {
            $assignedWarehouseIds = $user->warehouses()->pluck('warehouses.id');
            $query->whereIn('warehouse_id', $assignedWarehouseIds);
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('opname_number', 'like', '%' . $search . '%')
                  ->orWhereHas('warehouse', function($wh) use ($search) {
                      $wh->where('name', 'like', '%' . $search . '%');
                  });
            });
        }

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $opnames = $query->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('stock-opnames/index', [
            'opnames' => $opnames,
            'filters' => $request->only(['search', 'status']),
            'role' => $user->roleModel->code,
        ]);
    }

    /**
     * Show the form for creating a new stock opname.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'admin_gudang' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Akses ditolak. Hanya Admin Gudang atau Super Admin yang dapat membuat opname stok.');
        }

        // Get allowed warehouses
        if ($user->roleModel->code === 'admin_gudang') {
            $warehouses = $user->warehouses()->where('is_active', true)->get(['warehouses.id', 'warehouses.name', 'warehouses.code']);
        } else {
            $warehouses = Warehouse::where('is_active', true)->get(['id', 'name', 'code']);
        }

        $warehouseId = $request->input('warehouse_id');
        $products = [];

        if ($warehouseId) {
            if ($user->roleModel->code === 'admin_gudang') {
                $isAssigned = $user->warehouses()->where('warehouses.id', $warehouseId)->exists();
                if (!$isAssigned) {
                    abort(403, 'Akses ditolak ke gudang ini.');
                }
            }

            $allProducts = Product::where('is_active', true)->with('unit')->orderBy('name')->get();
            $stocks = Stock::where('warehouse_id', $warehouseId)->pluck('qty', 'product_id');

            foreach ($allProducts as $product) {
                $products[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'code' => $product->code,
                    'sku' => $product->sku,
                    'unit' => $product->unit?->name ?? '',
                    'qty_system' => $stocks[$product->id] ?? 0,
                ];
            }
        }

        return Inertia::render('stock-opnames/create', [
            'warehouses' => $warehouses,
            'selectedWarehouseId' => $warehouseId ? (int)$warehouseId : null,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created stock opname in database.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'admin_gudang' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Akses ditolak.');
        }

        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'opname_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty_system' => 'required|integer|min:0',
            'items.*.qty_physical' => 'required|integer|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        if ($user->roleModel->code === 'admin_gudang') {
            $isAssigned = $user->warehouses()->where('warehouses.id', $validated['warehouse_id'])->exists();
            if (!$isAssigned) {
                abort(403, 'Anda tidak memiliki hak akses untuk mencatat opname stok di gudang ini.');
            }
        }

        DB::transaction(function() use ($validated, $user) {
            // Generate opname number: OPN-YYYYMMDD-XXXX
            $datePrefix = date('Ymd');
            $count = StockOpname::whereDate('created_at', today())->count() + 1;
            $opnameNumber = 'OPN-' . $datePrefix . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $opname = StockOpname::create([
                'opname_number' => $opnameNumber,
                'warehouse_id' => $validated['warehouse_id'],
                'opname_date' => $validated['opname_date'],
                'status' => 'draft',
                'notes' => $validated['notes'] ?? null,
                'created_by' => $user->id,
            ]);

            foreach ($validated['items'] as $item) {
                $qtySystem = (int)$item['qty_system'];
                $qtyPhysical = (int)$item['qty_physical'];
                $qtyDifference = $qtyPhysical - $qtySystem;

                StockOpnameItem::create([
                    'stock_opname_id' => $opname->id,
                    'product_id' => $item['product_id'],
                    'qty_system' => $qtySystem,
                    'qty_physical' => $qtyPhysical,
                    'qty_difference' => $qtyDifference,
                    'notes' => $item['notes'] ?? null,
                    'created_at' => now(),
                ]);
            }
        });

        return redirect()->route('stock-opnames.index')
            ->with('success', 'Draf opname stok berhasil disimpan.');
    }

    /**
     * Display the specified stock opname.
     */
    public function show(Request $request, StockOpname $stockOpname): Response
    {
        $user = $request->user();
        if ($user->roleModel->code === 'pemohon') {
            abort(403, 'Akses ditolak.');
        }

        if ($user->roleModel->code === 'admin_gudang') {
            $isAssigned = $user->warehouses()->where('warehouses.id', $stockOpname->warehouse_id)->exists();
            if (!$isAssigned) {
                abort(403, 'Akses ditolak.');
            }
        }

        $stockOpname->load(['warehouse', 'createdBy', 'approvedBy', 'items.product.unit']);

        return Inertia::render('stock-opnames/show', [
            'opname' => $stockOpname,
            'role' => $user->roleModel->code,
        ]);
    }

    /**
     * Show the form for editing the specified stock opname (only if draft).
     */
    public function edit(Request $request, StockOpname $stockOpname): Response
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'admin_gudang' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Akses ditolak.');
        }

        if ($stockOpname->status !== 'draft') {
            return redirect()->route('stock-opnames.show', $stockOpname->id)
                ->with('error', 'Hanya draf opname stok yang dapat diubah.');
        }

        if ($user->roleModel->code === 'admin_gudang') {
            $isAssigned = $user->warehouses()->where('warehouses.id', $stockOpname->warehouse_id)->exists();
            if (!$isAssigned) {
                abort(403, 'Akses ditolak.');
            }
        }

        $stockOpname->load(['warehouse', 'items.product.unit']);

        return Inertia::render('stock-opnames/edit', [
            'opname' => $stockOpname,
        ]);
    }

    /**
     * Update the specified stock opname in database.
     */
    public function update(Request $request, StockOpname $stockOpname): RedirectResponse
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'admin_gudang' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Akses ditolak.');
        }

        if ($stockOpname->status !== 'draft') {
            abort(400, 'Hanya draf opname stok yang dapat diupdate.');
        }

        if ($user->roleModel->code === 'admin_gudang') {
            $isAssigned = $user->warehouses()->where('warehouses.id', $stockOpname->warehouse_id)->exists();
            if (!$isAssigned) {
                abort(403, 'Akses ditolak.');
            }
        }

        $validated = $request->validate([
            'opname_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:stock_opname_items,id',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty_system' => 'required|integer|min:0',
            'items.*.qty_physical' => 'required|integer|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        DB::transaction(function() use ($stockOpname, $validated) {
            $stockOpname->update([
                'opname_date' => $validated['opname_date'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // Sync items: delete ones not in payload, update or create others
            $incomingItemIds = collect($validated['items'])->pluck('id')->filter()->toArray();
            $stockOpname->items()->whereNotIn('id', $incomingItemIds)->delete();

            foreach ($validated['items'] as $item) {
                $qtySystem = (int)$item['qty_system'];
                $qtyPhysical = (int)$item['qty_physical'];
                $qtyDifference = $qtyPhysical - $qtySystem;

                if (isset($item['id'])) {
                    StockOpnameItem::where('id', $item['id'])->update([
                        'qty_physical' => $qtyPhysical,
                        'qty_difference' => $qtyDifference,
                        'notes' => $item['notes'] ?? null,
                    ]);
                } else {
                    StockOpnameItem::create([
                        'stock_opname_id' => $stockOpname->id,
                        'product_id' => $item['product_id'],
                        'qty_system' => $qtySystem,
                        'qty_physical' => $qtyPhysical,
                        'qty_difference' => $qtyDifference,
                        'notes' => $item['notes'] ?? null,
                        'created_at' => now(),
                    ]);
                }
            }
        });

        return redirect()->route('stock-opnames.show', $stockOpname->id)
            ->with('success', 'Opname stok berhasil diperbarui.');
    }

    /**
     * Approve stock opname (Manager/Super Admin only).
     * Adjusts the actual stock quantities in `stocks` table.
     */
    public function approve(Request $request, StockOpname $stockOpname): RedirectResponse
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'manager' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager atau Super Admin yang dapat menyetujui opname stok.');
        }

        if ($stockOpname->status !== 'draft') {
            return redirect()->route('stock-opnames.show', $stockOpname->id)
                ->with('error', 'Hanya draf opname stok yang dapat disetujui.');
        }

        DB::transaction(function() use ($stockOpname, $user) {
            // Update stock quantities in the database
            foreach ($stockOpname->items as $item) {
                Stock::updateOrCreate(
                    [
                        'warehouse_id' => $stockOpname->warehouse_id,
                        'product_id' => $item->product_id,
                    ],
                    [
                        'qty' => $item->qty_physical,
                    ]
                );
            }

            // Set opname status to completed
            $stockOpname->update([
                'status' => 'completed',
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);
        });

        return redirect()->route('stock-opnames.show', $stockOpname->id)
            ->with('success', 'Opname stok disetujui. Stok sistem telah disesuaikan dengan kuantitas fisik.');
    }

    /**
     * Cancel stock opname (Manager/Super Admin only).
     */
    public function cancel(Request $request, StockOpname $stockOpname): RedirectResponse
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'manager' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager atau Super Admin yang dapat membatalkan opname stok.');
        }

        if ($stockOpname->status !== 'draft') {
            return redirect()->route('stock-opnames.show', $stockOpname->id)
                ->with('error', 'Hanya draf opname stok yang dapat dibatalkan.');
        }

        $stockOpname->update([
            'status' => 'cancelled',
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);

        return redirect()->route('stock-opnames.show', $stockOpname->id)
            ->with('success', 'Opname stok berhasil dibatalkan.');
    }
}
