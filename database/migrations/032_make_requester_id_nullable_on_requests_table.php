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
            $table->foreignId('requester_id')->nullable()->change();
            $table->string('requester_name')->nullable()->after('requester_id');
            $table->string('requester_dept')->nullable()->after('requester_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->foreignId('requester_id')->nullable(false)->change();
            $table->dropColumn(['requester_name', 'requester_dept']);
        });
    }
};
