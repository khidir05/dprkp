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
        Schema::create('unavailable_items', function (Blueprint $table) {
            $table->id();

            $table->string('product_name');

            $table->integer('qty_needed');

            $table->text('notes')->nullable();

            $table->enum('status', [
                'open',
                'processed',
                'closed'
            ])->default('open');

            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnUpdate();

            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unavailable_items');
    }
};
