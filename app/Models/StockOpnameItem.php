<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $stock_opname_id
 * @property int $product_id
 * @property int $qty_system
 * @property int $qty_physical
 * @property int $qty_difference
 * @property string|null $notes
 * @property Carbon|null $created_at
 */
#[Fillable(['stock_opname_id', 'product_id', 'qty_system', 'qty_physical', 'qty_difference', 'notes'])]
class StockOpnameItem extends Model
{
    public const UPDATED_AT = null;

    /**
     * @return BelongsTo<StockOpname, $this>
     */
    public function stockOpname(): BelongsTo
    {
        return $this->belongsTo(StockOpname::class, 'stock_opname_id');
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
