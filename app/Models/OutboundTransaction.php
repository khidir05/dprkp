<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $request_id
 * @property string $transaction_number
 * @property Carbon $transaction_date
 * @property int $processed_by
 * @property int $warehouse_id
 * @property string|null $notes
 * @property Carbon|null $created_at
 */
#[Fillable([
    'request_id',
    'transaction_number',
    'transaction_date',
    'processed_by',
    'warehouse_id',
    'notes',
])]
class OutboundTransaction extends Model
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
     * @return BelongsTo<ItemRequest, $this>
     */
    public function itemRequest(): BelongsTo
    {
        return $this->belongsTo(ItemRequest::class, 'request_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * @return BelongsTo<Warehouse, $this>
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * @return HasMany<OutboundItem, $this>
     */
    public function outboundItems(): HasMany
    {
        return $this->hasMany(OutboundItem::class, 'outbound_id');
    }
}
