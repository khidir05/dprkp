<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $request_id
 * @property int $received_by
 * @property Carbon $received_at
 * @property string|null $notes
 * @property Carbon|null $created_at
 */
#[Fillable([
    'request_id',
    'received_by',
    'received_at',
    'notes',
])]
class GoodsReceipt extends Model
{
    public const UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'received_at' => 'datetime',
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
    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}
