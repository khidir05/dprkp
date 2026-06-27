<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $category_id
 * @property int $unit_id
 * @property string $sku
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property int $minimum_stock
 * @property bool $is_active
 * @property bool $is_hold
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['category_id', 'unit_id', 'sku', 'code', 'name', 'description', 'minimum_stock', 'is_active', 'is_hold'])]
class Product extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_hold' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return BelongsTo<Unit, $this>
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * @return HasMany<Stock, $this>
     */
    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    /**
     * @return HasMany<StockAlert, $this>
     */
    public function stockAlerts(): HasMany
    {
        return $this->hasMany(StockAlert::class);
    }

    /**
     * @return HasMany<StockMutation, $this>
     */
    public function stockMutations(): HasMany
    {
        return $this->hasMany(StockMutation::class);
    }

    /**
     * @return HasMany<StockOpnameItem, $this>
     */
    public function stockOpnameItems(): HasMany
    {
        return $this->hasMany(StockOpnameItem::class);
    }
}
