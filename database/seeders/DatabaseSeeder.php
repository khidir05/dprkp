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
            Category::firstOrCreate(['name' => $cat['name']], $cat);
        }

        // Seed default units
        $units = [
            ['name' => 'Pieces', 'symbol' => 'pcs'],
            ['name' => 'Box', 'symbol' => 'box'],
            ['name' => 'Rim', 'symbol' => 'rim'],
            ['name' => 'Pack', 'symbol' => 'pack'],
        ];
        foreach ($units as $unit) {
            Unit::firstOrCreate(['symbol' => $unit['symbol']], $unit);
        }

        // Seed default warehouse
        $warehouse = Warehouse::firstOrCreate(
            ['code' => 'GDG-001'],
            [
                'name' => 'Gudang Utama',
                'address' => 'Jl. Jati Baru No. 1, Jakarta Pusat',
                'is_active' => true,
            ]
        );

        // Super Admin
        User::firstOrCreate(
            ['email' => 'superadmin@dprkp.go.id'],
            [
                'role' => $roles['super_admin']->id,
                'name' => 'Super Admin',
                'phone' => '081200000001',
                'code_user' => 'SA-001',
                'username' => 'superadmin',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );

        // Manager
        User::firstOrCreate(
            ['email' => 'manager@dprkp.go.id'],
            [
                'role' => $roles['manager']->id,
                'name' => 'Manager',
                'phone' => '081200000002',
                'code_user' => 'MG-001',
                'username' => 'manager',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );

        // Admin Gudang (Must be connected to "Gudang Utama")
        $adminGudang = User::firstOrCreate(
            ['email' => 'admingudang@dprkp.go.id'],
            [
                'role' => $roles['admin_gudang']->id,
                'name' => 'Admin Gudang',
                'phone' => '081200000003',
                'code_user' => 'GD-001',
                'username' => 'admingudang',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );
        $adminGudang->warehouses()->sync([$warehouse->id]);

        // Pemohon
        User::firstOrCreate(
            ['email' => 'pemohon@dprkp.go.id'],
            [
                'role' => $roles['pemohon']->id,
                'name' => 'Pemohon',
                'phone' => '081200000004',
                'code_user' => 'PM-001',
                'username' => 'pemohon',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );

        // Seed default supplier for central team (Penganggar / Tim Pusat)
        Supplier::firstOrCreate(
            ['name' => 'Penganggar (Tim Pusat)'],
            [
                'phone' => '02112345678',
                'address' => 'Kantor Pusat DPRKP DKI Jakarta',
                'is_active' => true,
            ]
        );
    }
}
