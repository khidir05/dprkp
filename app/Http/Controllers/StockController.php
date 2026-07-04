<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    /**
     * Display a listing of stock levels.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $query = Stock::query()->with(['product.category', 'product.unit', 'warehouse']);

        // Limit stocks for admin_gudang to their assigned warehouses
        if ($user->roleModel->code === 'admin_gudang') {
            $assignedWarehouseIds = $user->warehouses()->pluck('warehouses.id');
            $query->whereIn('warehouse_id', $assignedWarehouseIds);
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('product', function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('code', 'like', '%' . $search . '%')
                  ->orWhere('sku', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('warehouse_id') && $request->input('warehouse_id') !== 'all') {
            $query->where('warehouse_id', $request->input('warehouse_id'));
        }

        $stocks = $query->orderBy('qty', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Limit warehouses list for filter
        if ($user->roleModel->code === 'admin_gudang') {
            $warehouses = $user->warehouses()->orderBy('name')->get(['warehouses.id', 'warehouses.name', 'warehouses.code']);
        } else {
            $warehouses = Warehouse::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']);
        }

        return Inertia::render('stocks/index', [
            'stocks' => $stocks,
            'warehouses' => $warehouses,
            'filters' => $request->only(['search', 'warehouse_id']),
            'role' => $user->roleModel->code,
        ]);
    }
}
