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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('category_id')
                ->constrained('categories');

            $table->foreignId('unit_id')
                ->constrained('units');

            $table->string('sku')->unique();
            $table->string('code')->unique();

            $table->string('name');
            $table->text('description')->nullable();

            $table->integer('minimum_stock')->default(0);

            $table->boolean('is_active')->default(true);
            $table->boolean('is_hold')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
