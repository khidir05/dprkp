<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\Category;
use App\Models\Unit;
use App\Models\Warehouse;
use App\Models\Supplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);

        $roles = Role::all()->keyBy('code');

        // Seed basic categories
        $categories = [
            ['name' => 'Alat Tulis Kantor', 'description' => 'Alat tulis kantor dan kebutuhan administrasi.'],
            ['name' => 'Elektronik & IT', 'description' => 'Perangkat elektronik dan aksesoris komputer.'],
            ['name' => 'Kebersihan & Sanitasi', 'description' => 'Peralatan dan bahan kebersihan.'],
            ['name' => 'Peralatan & Perkakas', 'description' => 'Peralatan penunjang kerja teknis.'],
            ['name' => 'Lain-lain', 'description' => 'Kategori umum lainnya.'],
        ];
        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // Seed default units
        $units = [
            ['name' => 'Pieces', 'symbol' => 'pcs'],
            ['name' => 'Box', 'symbol' => 'box'],
            ['name' => 'Rim', 'symbol' => 'rim'],
            ['name' => 'Pack', 'symbol' => 'pack'],
        ];
        foreach ($units as $unit) {
            Unit::create($unit);
        }

        // Seed default warehouse
        $warehouse = Warehouse::create([
            'code' => 'GDG-001',
            'name' => 'Gudang Utama',
            'address' => 'Jl. Jati Baru No. 1, Jakarta Pusat',
            'is_active' => true,
        ]);

        // Super Admin
        User::create([
            'role' => $roles['super_admin']->id,
            'name' => 'Super Admin',
            'email' => 'superadmin@dprkp.go.id',
            'phone' => '081200000001',
            'code_user' => 'SA-001',
            'username' => 'superadmin',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        // Manager
        User::create([
            'role' => $roles['manager']->id,
            'name' => 'Manager',
            'email' => 'manager@dprkp.go.id',
            'phone' => '081200000002',
            'code_user' => 'MG-001',
            'username' => 'manager',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        // Admin Gudang (Must be connected to "Gudang Utama")
        $adminGudang = User::create([
            'role' => $roles['admin_gudang']->id,
            'name' => 'Admin Gudang',
            'email' => 'admingudang@dprkp.go.id',
            'phone' => '081200000003',
            'code_user' => 'GD-001',
            'username' => 'admingudang',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $adminGudang->warehouses()->sync([$warehouse->id]);

        // Pemohon
        User::create([
            'role' => $roles['pemohon']->id,
            'name' => 'Pemohon',
            'email' => 'pemohon@dprkp.go.id',
            'phone' => '081200000004',
            'code_user' => 'PM-001',
            'username' => 'pemohon',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        // Seed default supplier for central team (Penganggar / Tim Pusat)
        Supplier::create([
            'name' => 'Penganggar (Tim Pusat)',
            'phone' => '02112345678',
            'address' => 'Kantor Pusat DPRKP DKI Jakarta',
            'is_active' => true,
        ]);
    }
}
