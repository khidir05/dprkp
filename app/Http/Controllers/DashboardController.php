<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\ItemRequest;
use App\Models\StockMutation;
use App\Models\StockAlert;
use App\Models\RestockList;
use App\Models\InboundTransaction;
use App\Models\OutboundTransaction;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $user->roleModel->code;
        $stats = [];

        if ($role === 'super_admin') {
            $stats = [
                'users_count' => User::count(),
                'warehouses_count' => Warehouse::count(),
                'products_count' => Product::count(),
                'inbounds_count' => InboundTransaction::count(),
                'outbounds_count' => OutboundTransaction::count(),
                'recent_requests' => ItemRequest::with(['createdBy', 'warehouse'])->latest()->take(5)->get(),
                'recent_inbounds' => InboundTransaction::with(['warehouse', 'supplier', 'createdBy'])->latest()->take(5)->get(),
            ];
        } elseif ($role === 'manager') {
            $stats = [
                'pending_requests_count' => ItemRequest::where('status', 'pending')->count(),
                'pending_mutations_count' => StockMutation::where('status', 'pending')->count(),
                'active_alerts_count' => StockAlert::whereIn('status', ['open', 'restock', 'hold'])->count(),
                'pending_restocks_count' => RestockList::whereIn('status', ['pending', 'reviewed'])->count(),
                'monthly_request_trends' => ItemRequest::select(
                    DB::raw("to_char(created_at, 'YYYY-MM') as month"),
                    DB::raw("count(*) as count")
                )
                ->groupBy('month')
                ->orderBy('month')
                ->take(6)
                ->get(),
                'recent_pending_requests' => ItemRequest::with(['createdBy', 'warehouse'])->where('status', 'pending')->latest()->take(5)->get(),
            ];
        } elseif ($role === 'admin_gudang') {
            $warehouseIds = $user->warehouses()->pluck('warehouses.id');

            // Count pending outbound dispatches for warehouses managed by this admin
            $pendingDispatches = ItemRequest::whereIn('warehouse_id', $warehouseIds)
                ->where('status', 'approved')
                ->count();

            // Count low stock items in their warehouses
            $lowStockCount = Stock::whereIn('warehouse_id', $warehouseIds)
                ->whereHas('product', function($q) {
                    $q->whereColumn('stocks.qty', '<=', 'products.minimum_stock');
                })->count();

            $stats = [
                'assigned_warehouses' => $user->warehouses()->get(['warehouses.id', 'warehouses.name']),
                'inbounds_count' => InboundTransaction::whereIn('warehouse_id', $warehouseIds)->count(),
                'outbounds_count' => OutboundTransaction::whereIn('warehouse_id', $warehouseIds)->count(),
                'pending_dispatches_count' => $pendingDispatches,
                'low_stock_count' => $lowStockCount,
                'recent_inbounds' => InboundTransaction::with(['supplier', 'createdBy', 'warehouse'])
                    ->whereIn('warehouse_id', $warehouseIds)
                    ->latest()
                    ->take(5)
                    ->get(),
                'recent_dispatches' => OutboundTransaction::with(['recipient', 'createdBy', 'warehouse'])
                    ->whereIn('warehouse_id', $warehouseIds)
                    ->latest()
                    ->take(5)
                    ->get(),
            ];
        } elseif ($role === 'pemohon') {
            $stats = [
                'total_requests' => ItemRequest::where('requester_id', $user->id)->count(),
                'pending_requests' => ItemRequest::where('requester_id', $user->id)->where('status', 'pending')->count(),
                'approved_requests' => ItemRequest::where('requester_id', $user->id)->where('status', 'approved')->count(),
                'completed_requests' => ItemRequest::where('requester_id', $user->id)->where('status', 'completed')->count(),
                'recent_requests' => ItemRequest::with('warehouse')
                    ->where('requester_id', $user->id)
                    ->latest()
                    ->take(5)
                    ->get(),
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'role' => $role,
        ]);
    }
}
