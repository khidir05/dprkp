<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->string('nama_penatausahaan')->nullable()->after('jabatan_atasan');
            $table->string('jabatan_penatausahaan')->nullable()->after('nama_penatausahaan');
            $table->string('nip_penatausahaan')->nullable()->after('jabatan_penatausahaan');
            $table->string('nama_pengurus_barang')->nullable()->after('nip_penatausahaan');
            $table->string('jabatan_pengurus_barang')->nullable()->after('nama_pengurus_barang');
            $table->string('nip_pengurus_barang')->nullable()->after('jabatan_pengurus_barang');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->dropColumn([
                'nama_penatausahaan',
                'jabatan_penatausahaan',
                'nip_penatausahaan',
                'nama_pengurus_barang',
                'jabatan_pengurus_barang',
                'nip_pengurus_barang'
            ]);
        });
    }
};
