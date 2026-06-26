<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $product_id
 * @property int $current_stock
 * @property int $minimum_stock
 * @property string $status Enum: open, restock, hold, closed
 * @property int|null $handled_by
 * @property Carbon|null $handled_at
 * @property string|null $notes
 * @property Carbon|null $created_at
 */
#[Fillable(['product_id', 'current_stock', 'minimum_stock', 'status', 'handled_by', 'handled_at', 'notes'])]
class StockAlert extends Model
{
    public const UPDATED_AT = null;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'handled_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}
