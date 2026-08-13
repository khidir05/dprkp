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
            $table->string('nip')->nullable()->after('requester_dept');
            $table->string('nama_atasan')->nullable()->after('nip');
            $table->string('jabatan_atasan')->nullable()->after('nama_atasan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->dropColumn(['nip', 'nama_atasan', 'jabatan_atasan']);
        });
    }
};
