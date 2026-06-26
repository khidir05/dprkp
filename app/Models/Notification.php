<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $message
 * @property string $type
 * @property bool $is_read
 * @property Carbon|null $read_at
 * @property string|null $ref_table
 * @property int|null $ref_id
 * @property Carbon|null $created_at
 */
#[Fillable(['user_id', 'title', 'message', 'type', 'is_read', 'read_at', 'ref_table', 'ref_id'])]
class Notification extends Model
{
    public const UPDATED_AT = null;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'read_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
