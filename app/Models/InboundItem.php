<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $inbound_id
 * @property int $product_id
 * @property int $qty
 * @property Carbon|null $created_at
 */
#[Fillable([
    'inbound_id',
    'product_id',
    'qty',
])]
class InboundItem extends Model
{
    public const UPDATED_AT = null;

    /**
     * @return BelongsTo<InboundTransaction, $this>
     */
    public function inboundTransaction(): BelongsTo
    {
        return $this->belongsTo(InboundTransaction::class, 'inbound_id');
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
