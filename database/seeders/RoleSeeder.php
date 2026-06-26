<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Seed the roles table.
     */
    public function run(): void
    {
        $roles = [
            [
                'code' => 'super_admin',
                'nama' => 'Super Admin',
                'label' => 'SA',
                'description' => 'Pemilik sistem yang memiliki akses penuh terhadap seluruh data, konfigurasi, aktivitas pengguna, dan laporan.',
                'created_at' => now(),
            ],
            [
                'code' => 'manager',
                'nama' => 'Manager',
                'label' => 'MG',
                'description' => 'Bertanggung jawab terhadap persetujuan transaksi dan pengawasan operasional inventaris.',
                'created_at' => now(),
            ],
            [
                'code' => 'admin_gudang',
                'nama' => 'Admin Gudang',
                'label' => 'GD',
                'description' => 'Bertanggung jawab atas operasional stok dan transaksi inventaris.',
                'created_at' => now(),
            ],
            [
                'code' => 'pemohon',
                'nama' => 'Pemohon',
                'label' => 'PM',
                'description' => 'Unit kerja yang mengajukan kebutuhan barang kepada gudang.',
                'created_at' => now(),
            ],
        ];

        DB::table('roles')->insert($roles);
    }
}
