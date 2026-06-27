<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\Stock;
use App\Models\StockOpname;
use App\Models\StockOpnameItem;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to the login page for stock opnames', function () {
    $response = $this->get(route('stock-opnames.index'));
    $response->assertRedirect(route('login'));
});

test('pemohon users are forbidden from accessing stock opnames', function () {
    $role = Role::create(['code' => 'pemohon', 'nama' => 'Pemohon', 'label' => 'PM']);
    $user = User::factory()->create(['role' => $role->id]);
    $this->actingAs($user);

    $response = $this->get(route('stock-opnames.index'));
    $response->assertStatus(403);
});

test('admin gudang can view and create draft stock opname', function () {
    $role = Role::create(['code' => 'admin_gudang', 'nama' => 'Admin Gudang', 'label' => 'GD']);
    $user = User::factory()->create(['role' => $role->id]);
    
    $warehouse = Warehouse::create(['code' => 'WH01', 'name' => 'Gudang Utama', 'is_active' => true]);
    $user->warehouses()->attach($warehouse);
    
    $category = \App\Models\Category::create(['name' => 'Bahan Bangunan']);
    $unit = \App\Models\Unit::create(['name' => 'Sack', 'symbol' => 'Zak']);

    $product = Product::create([
        'category_id' => $category->id,
        'unit_id' => $unit->id,
        'code' => 'P01',
        'name' => 'Semen Padang',
        'sku' => 'SEM-PDG',
        'minimum_stock' => 10,
        'is_active' => true
    ]);
    
    Stock::create([
        'warehouse_id' => $warehouse->id,
        'product_id' => $product->id,
        'qty' => 50
    ]);
    
    $this->actingAs($user);

    // Can visit index
    $response = $this->get(route('stock-opnames.index'));
    $response->assertOk();

    // Can visit create form
    $response = $this->get(route('stock-opnames.create') . "?warehouse_id={$warehouse->id}");
    $response->assertOk();

    // Can store draft opname
    $postResponse = $this->post(route('stock-opnames.store'), [
        'warehouse_id' => $warehouse->id,
        'opname_date' => now()->format('Y-m-d'),
        'notes' => 'Audit bulanan',
        'items' => [
            [
                'product_id' => $product->id,
                'qty_system' => 50,
                'qty_physical' => 45,
                'notes' => '5 rusak'
            ]
        ]
    ]);
    
    $postResponse->assertRedirect(route('stock-opnames.index'));
    $this->assertDatabaseHas('stock_opnames', [
        'warehouse_id' => $warehouse->id,
        'status' => 'draft',
        'notes' => 'Audit bulanan'
    ]);
    $this->assertDatabaseHas('stock_opname_items', [
        'qty_system' => 50,
        'qty_physical' => 45,
        'qty_difference' => -5,
        'notes' => '5 rusak'
    ]);
});

test('manager can approve stock opname and update stocks table', function () {
    $gdRole = Role::create(['code' => 'admin_gudang', 'nama' => 'Admin Gudang', 'label' => 'GD']);
    $mgRole = Role::create(['code' => 'manager', 'nama' => 'Manager', 'label' => 'MG']);
    
    $gudangUser = User::factory()->create(['role' => $gdRole->id]);
    $managerUser = User::factory()->create(['role' => $mgRole->id]);
    
    $warehouse = Warehouse::create(['code' => 'WH01', 'name' => 'Gudang Utama', 'is_active' => true]);
    $category = \App\Models\Category::create(['name' => 'Bahan Bangunan']);
    $unit = \App\Models\Unit::create(['name' => 'Sack', 'symbol' => 'Zak']);

    $product = Product::create([
        'category_id' => $category->id,
        'unit_id' => $unit->id,
        'code' => 'P01',
        'name' => 'Semen Padang',
        'sku' => 'SEM-PDG',
        'minimum_stock' => 10,
        'is_active' => true
    ]);
    
    $stock = Stock::create([
        'warehouse_id' => $warehouse->id,
        'product_id' => $product->id,
        'qty' => 50
    ]);

    $opname = StockOpname::create([
        'opname_number' => 'OPN-TEST-001',
        'warehouse_id' => $warehouse->id,
        'opname_date' => now()->format('Y-m-d'),
        'status' => 'draft',
        'created_by' => $gudangUser->id,
    ]);

    $opnameItem = StockOpnameItem::create([
        'stock_opname_id' => $opname->id,
        'product_id' => $product->id,
        'qty_system' => 50,
        'qty_physical' => 45,
        'qty_difference' => -5,
        'notes' => '5 rusak'
    ]);

    $this->actingAs($managerUser);

    // Can approve
    $approveResponse = $this->patch(route('stock-opnames.approve', $opname->id));
    $approveResponse->assertRedirect(route('stock-opnames.show', $opname->id));

    // Assert status updated to completed
    $this->assertDatabaseHas('stock_opnames', [
        'id' => $opname->id,
        'status' => 'completed',
        'approved_by' => $managerUser->id
    ]);

    // Assert stock qty updated to physical qty (45)
    $this->assertDatabaseHas('stocks', [
        'id' => $stock->id,
        'qty' => 45
    ]);
});
