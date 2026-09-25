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

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->whereHas('product', function($pq) use ($search) {
                    $pq->where('name', 'ilike', '%' . $search . '%')
                      ->orWhere('code', 'ilike', '%' . $search . '%')
                      ->orWhere('sku', 'ilike', '%' . $search . '%')
                      ->orWhere('brand', 'ilike', '%' . $search . '%')
                      ->orWhereHas('category', function($cat) use ($search) {
                          $cat->where('name', 'ilike', '%' . $search . '%');
                      });
                })->orWhereHas('warehouse', function($wh) use ($search) {
                    $wh->where('name', 'ilike', '%' . $search . '%')
                      ->orWhere('code', 'ilike', '%' . $search . '%');
                });
            });
        }

        if ($request->filled('warehouse_id') && $request->input('warehouse_id') !== 'all') {
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
