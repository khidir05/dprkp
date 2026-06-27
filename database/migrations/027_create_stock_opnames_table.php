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
        Schema::create('stock_opnames', function (Blueprint $table) {
            $table->id();
            $table->string('opname_number')->unique();
            $table->foreignId('warehouse_id')
                ->constrained('warehouses')
                ->cascadeOnUpdate();
            $table->date('opname_date');
            $table->enum('status', ['draft', 'completed', 'cancelled'])->default('draft');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnUpdate();
            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_opnames');
    }
};
