<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $request_id
 * @property int $product_id
 * @property int $qty_requested
 * @property int|null $qty_approved
 * @property Carbon|null $created_at
 */
#[Fillable([
    'request_id',
    'product_id',
    'qty_requested',
    'qty_approved',
])]
class RequestItem extends Model
{
    public const UPDATED_AT = null;

    /**
     * @return BelongsTo<ItemRequest, $this>
     */
    public function itemRequest(): BelongsTo
    {
        return $this->belongsTo(ItemRequest::class, 'request_id');
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
