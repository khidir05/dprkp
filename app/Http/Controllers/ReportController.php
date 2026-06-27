<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use App\Models\Product;
use App\Models\Stock;
use App\Models\InboundTransaction;
use App\Models\OutboundTransaction;
use App\Models\StockMutation;
use App\Models\ItemRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    /**
     * Display reports and handle queries.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code === 'pemohon') {
            abort(403, 'Akses ditolak.');
        }

        $role = $user->roleModel->code;
        $isGudang = $role === 'admin_gudang';
        $assignedWarehouseIds = $isGudang ? $user->warehouses()->pluck('warehouses.id') : collect([]);

        // Get filter options
        if ($isGudang) {
            $warehouses = $user->warehouses()->where('is_active', true)->get(['warehouses.id', 'warehouses.name']);
        } else {
            $warehouses = Warehouse::where('is_active', true)->get(['id', 'name']);
        }

        // Get request filters
        $type = $request->input('type', 'stock');
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());
        $warehouseId = $request->input('warehouse_id', 'all');

        $reportData = [];

        // Parse date filters
        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // 1. STOCK REPORT QUERY
        if ($type === 'stock') {
            $stockQuery = Stock::query()->with(['product.unit', 'product.category', 'warehouse']);

            if ($isGudang) {
                $stockQuery->whereIn('warehouse_id', $assignedWarehouseIds);
            }

            if ($warehouseId !== 'all') {
                $stockQuery->where('warehouse_id', $warehouseId);
            }

            $reportData = $stockQuery->get();
        }

        // 2. INBOUND REPORT QUERY
        elseif ($type === 'inbound') {
            $inboundQuery = InboundTransaction::query()
                ->with(['warehouse', 'supplier', 'createdBy', 'inboundItems.product.unit'])
                ->whereBetween('created_at', [$start, $end]);

            if ($isGudang) {
                $inboundQuery->whereIn('warehouse_id', $assignedWarehouseIds);
            }

            if ($warehouseId !== 'all') {
                $inboundQuery->where('warehouse_id', $warehouseId);
            }

            $reportData = $inboundQuery->orderByDesc('created_at')->get();
        }

        // 3. OUTBOUND REPORT QUERY
        elseif ($type === 'outbound') {
            $outboundQuery = OutboundTransaction::query()
                ->with(['warehouse', 'itemRequest.requester', 'processedBy', 'outboundItems.product.unit'])
                ->whereBetween('created_at', [$start, $end]);

            if ($isGudang) {
                $outboundQuery->whereIn('warehouse_id', $assignedWarehouseIds);
            }

            if ($warehouseId !== 'all') {
                $outboundQuery->where('warehouse_id', $warehouseId);
            }

            $reportData = $outboundQuery->orderByDesc('created_at')->get();
        }

        // 4. MUTATION REPORT QUERY
        elseif ($type === 'mutation') {
            $mutationQuery = StockMutation::query()
                ->with(['product.unit', 'fromWarehouse', 'toWarehouse', 'createdBy', 'approvedBy'])
                ->whereBetween('created_at', [$start, $end]);

            if ($isGudang) {
                $mutationQuery->where(function($q) use ($assignedWarehouseIds) {
                    $q->whereIn('from_warehouse_id', $assignedWarehouseIds)
                      ->orWhereIn('to_warehouse_id', $assignedWarehouseIds);
                });
            }

            if ($warehouseId !== 'all') {
                $mutationQuery->where(function($q) use ($warehouseId) {
                    $q->where('from_warehouse_id', $warehouseId)
                      ->orWhere('to_warehouse_id', $warehouseId);
                });
            }

            $reportData = $mutationQuery->orderByDesc('created_at')->get();
        }

        // 5. ITEM REQUEST REPORT QUERY
        elseif ($type === 'request') {
            $requestQuery = ItemRequest::query()
                ->with(['warehouse', 'requester', 'requestItems.product.unit'])
                ->whereBetween('created_at', [$start, $end]);

            if ($isGudang) {
                $requestQuery->whereIn('warehouse_id', $assignedWarehouseIds);
            }

            if ($warehouseId !== 'all') {
                $requestQuery->where('warehouse_id', $warehouseId);
            }

            $reportData = $requestQuery->orderByDesc('created_at')->get();
        }

        return Inertia::render('reports/index', [
            'type' => $type,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'warehouse_id' => $warehouseId,
            'warehouses' => $warehouses,
            'reportData' => $reportData,
            'role' => $role,
        ]);
    }
}
