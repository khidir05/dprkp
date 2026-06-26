<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $product_name
 * @property int $qty_needed
 * @property string|null $notes
 * @property string $status Enum: open, processed, closed
 * @property int $created_by
 * @property Carbon|null $created_at
 */
#[Fillable(['product_name', 'qty_needed', 'notes', 'status', 'created_by'])]
class UnavailableItem extends Model
{
    public const UPDATED_AT = null;

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
