<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
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

        // Admin Gudang
        User::create([
            'role' => $roles['admin_gudang']->id,
            'name' => 'Admin Gudang',
            'email' => 'admingudang@dprkp.go.id',
            'phone' => '081200000003',
            'code_user' => 'GD-001',
            'username' => 'admingudang',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

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
    }
}
