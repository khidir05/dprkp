<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $outbound_id
 * @property int $product_id
 * @property int $qty
 * @property Carbon|null $created_at
 */
#[Fillable([
    'outbound_id',
    'product_id',
    'qty',
])]
class OutboundItem extends Model
{
    public const UPDATED_AT = null;

    /**
     * @return BelongsTo<OutboundTransaction, $this>
     */
    public function outboundTransaction(): BelongsTo
    {
        return $this->belongsTo(OutboundTransaction::class, 'outbound_id');
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
