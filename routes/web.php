<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\InboundController;
use App\Http\Controllers\ItemRequestController;
use App\Http\Controllers\OutboundController;
use App\Http\Controllers\GoodsReceiptController;
use App\Http\Controllers\StockMutationController;
use App\Http\Controllers\StockAlertController;
use App\Http\Controllers\UnavailableItemController;
use App\Http\Controllers\RestockListController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StockOpnameController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Stocks & Inbound Routes
    Route::get('stocks', [StockController::class, 'index'])->name('stocks.index');
    Route::resource('inbound', InboundController::class)->only(['index', 'create', 'store', 'show']);

    // Stock Alert Routes
    Route::get('alerts', [StockAlertController::class, 'index'])->name('alerts.index');
    Route::post('alerts/{alert}/hold', [StockAlertController::class, 'hold'])->name('alerts.hold');
    Route::post('alerts/{alert}/release', [StockAlertController::class, 'release'])->name('alerts.release');
    Route::post('alerts/{alert}/restock', [StockAlertController::class, 'restock'])->name('alerts.restock');
    Route::post('alerts/{alert}/close', [StockAlertController::class, 'close'])->name('alerts.close');

    // Unavailable Items Routes
    Route::resource('unavailable-items', UnavailableItemController::class)->only(['index', 'store', 'destroy']);
    Route::post('unavailable-items/{item}/process', [UnavailableItemController::class, 'process'])->name('unavailable-items.process');
    Route::post('unavailable-items/{item}/close', [UnavailableItemController::class, 'close'])->name('unavailable-items.close');

    // Restock List Routes
    Route::get('restock', [RestockListController::class, 'index'])->name('restock.index');
    Route::patch('restock/{restock}/status', [RestockListController::class, 'updateStatus'])->name('restock.update-status');

    // Stock Mutation Routes
    Route::resource('mutations', StockMutationController::class)->only(['index', 'create', 'store', 'show']);
    Route::patch('mutations/{mutation}/approve', [StockMutationController::class, 'approve'])->name('mutations.approve');
    Route::patch('mutations/{mutation}/reject', [StockMutationController::class, 'reject'])->name('mutations.reject');

    // Stock Opname Routes
    Route::resource('stock-opnames', StockOpnameController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update']);
    Route::patch('stock-opnames/{stockOpname}/approve', [StockOpnameController::class, 'approve'])->name('stock-opnames.approve');
    Route::patch('stock-opnames/{stockOpname}/cancel', [StockOpnameController::class, 'cancel'])->name('stock-opnames.cancel');

    // Item Request Routes
    Route::resource('requests', ItemRequestController::class)->only(['index', 'create', 'store', 'show']);
    Route::patch('requests/{itemRequest}/approve', [ItemRequestController::class, 'approve'])->name('requests.approve');
    Route::patch('requests/{itemRequest}/reject', [ItemRequestController::class, 'reject'])->name('requests.reject');
    Route::delete('requests/{itemRequest}/cancel', [ItemRequestController::class, 'cancel'])->name('requests.cancel');

    // Outbound & Receipt processing
    Route::post('requests/{itemRequest}/outbound', [OutboundController::class, 'store'])->name('requests.outbound');
    Route::post('requests/{itemRequest}/receive', [GoodsReceiptController::class, 'store'])->name('requests.receive');

    // Master Data Routes
    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('units', UnitController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('suppliers', SupplierController::class)->only(['index', 'store', 'update']);
    Route::patch('suppliers/{supplier}/toggle-active', [SupplierController::class, 'toggleActive'])->name('suppliers.toggle-active');

    Route::resource('warehouses', WarehouseController::class)->only(['index', 'store', 'update']);
    Route::patch('warehouses/{warehouse}/toggle-active', [WarehouseController::class, 'toggleActive'])->name('warehouses.toggle-active');
    Route::post('warehouses/{warehouse}/assign-users', [WarehouseController::class, 'assignUsers'])->name('warehouses.assign-users');

    Route::resource('products', ProductController::class)->only(['index', 'store', 'show', 'update']);
    Route::patch('products/{product}/toggle-active', [ProductController::class, 'toggleActive'])->name('products.toggle-active');
    Route::patch('products/{product}/toggle-hold', [ProductController::class, 'toggleHold'])->name('products.toggle-hold');

    // User Management (Super Admin only)
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::post('users', [UserManagementController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::patch('users/{user}/toggle-active', [UserManagementController::class, 'toggleActive'])->name('users.toggle-active');

        Route::get('users/registration-links', [UserManagementController::class, 'linksIndex'])->name('users.links');
        Route::post('users/registration-links', [UserManagementController::class, 'storeLink'])->name('users.store-link');
        Route::delete('users/registration-links/{link}', [UserManagementController::class, 'deleteLink'])->name('users.delete-link');

        // Audit Logs Route (Super Admin only)
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    });

    // In-App Notifications Routes (All authenticated users)
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notification}/read', [NotificationController::class, 'read'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationController::class, 'readAll'])->name('notifications.read-all');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Reports Route (SA, Manager, Admin Gudang)
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
});

require __DIR__.'/settings.php';
