<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $opname_number
 * @property int $warehouse_id
 * @property Carbon $opname_date
 * @property string $status draft|completed|cancelled
 * @property string|null $notes
 * @property int $created_by
 * @property int|null $approved_by
 * @property Carbon|null $approved_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['opname_number', 'warehouse_id', 'opname_date', 'status', 'notes', 'created_by', 'approved_by', 'approved_at'])]
class StockOpname extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'opname_date' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Warehouse, $this>
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
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
     * @return HasMany<StockOpnameItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(StockOpnameItem::class, 'stock_opname_id');
    }
}
