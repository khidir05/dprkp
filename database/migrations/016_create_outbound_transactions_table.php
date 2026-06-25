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
        Schema::create('outbound_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('request_id')
                ->constrained('requests')
                ->cascadeOnUpdate();

            $table->string('transaction_number')
                ->unique();

            $table->date('transaction_date');

            $table->foreignId('processed_by')
                ->constrained('users')
                ->cascadeOnUpdate();

            $table->foreignId('warehouse_id')
                ->constrained('warehouses');

            $table->text('notes')->nullable();

            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outbound_transactions');
    }
};
