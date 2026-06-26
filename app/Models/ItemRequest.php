<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $request_number
 * @property int $requester_id
 * @property Carbon $request_date
 * @property string $status pending|approved|rejected|completed
 * @property string|null $notes
 * @property int|null $approved_by
 * @property int $warehouse_id
 * @property Carbon|null $approved_at
 * @property string|null $rejection_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'request_number',
    'requester_id',
    'request_date',
    'status',
    'notes',
    'approved_by',
    'warehouse_id',
    'approved_at',
    'rejection_reason',
])]
class ItemRequest extends Model
{
    protected $table = 'requests';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'request_date' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
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
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * @return HasMany<RequestItem, $this>
     */
    public function requestItems(): HasMany
    {
        return $this->hasMany(RequestItem::class, 'request_id');
    }

    /**
     * @return HasOne<OutboundTransaction, $this>
     */
    public function outboundTransaction(): HasOne
    {
        return $this->hasOne(OutboundTransaction::class, 'request_id');
    }

    /**
     * @return HasOne<GoodsReceipt, $this>
     */
    public function goodsReceipt(): HasOne
    {
        return $this->hasOne(GoodsReceipt::class, 'request_id');
    }
}
