<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $supplier_id
 * @property string $transaction_number
 * @property string|null $reference_document
 * @property Carbon $transaction_date
 * @property string|null $notes
 * @property int $created_by
 * @property int $warehouse_id
 * @property Carbon|null $created_at
 */
#[Fillable([
    'supplier_id',
    'transaction_number',
    'reference_document',
    'transaction_date',
    'notes',
    'created_by',
    'warehouse_id',
])]
class InboundTransaction extends Model
{
    public const UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Supplier, $this>
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsTo<Warehouse, $this>
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * @return HasMany<InboundItem, $this>
     */
    public function inboundItems(): HasMany
    {
        return $this->hasMany(InboundItem::class, 'inbound_id');
    }
}
