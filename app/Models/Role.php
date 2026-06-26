<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $code
 * @property string $nama
 * @property string $label
 * @property string|null $description
 * @property Carbon|null $created_at
 */
#[Fillable(['code', 'nama', 'label', 'description'])]
class Role extends Model
{
    const UPDATED_AT = null;

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role');
    }
}
