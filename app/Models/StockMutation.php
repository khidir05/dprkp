<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $mutation_number
 * @property int $product_id
 * @property int $qty
 * @property string $mutation_type
 * @property string|null $reason
 * @property string $status pending|approved|rejected
 * @property int $created_by
 * @property int|null $approved_by
 * @property int|null $from_warehouse_id
 * @property int|null $to_warehouse_id
 * @property Carbon|null $approved_at
 * @property string|null $rejection_reason
 * @property Carbon|null $created_at
 */
#[Fillable([
    'mutation_number',
    'product_id',
    'qty',
    'mutation_type',
    'reason',
    'status',
    'created_by',
    'approved_by',
    'from_warehouse_id',
    'to_warehouse_id',
    'approved_at',
    'rejection_reason',
])]
class StockMutation extends Model
{
    public const UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
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
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * @return BelongsTo<Warehouse, $this>
     */
    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id');
    }

    /**
     * @return BelongsTo<Warehouse, $this>
     */
    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id');
    }
}
