<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $module
 * @property string $action
 * @property string|null $description
 * @property string|null $ip_address
 * @property Carbon|null $created_at
 */
#[Fillable(['user_id', 'module', 'action', 'description', 'ip_address'])]
class AuditLog extends Model
{
    const UPDATED_AT = null;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
