<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $report_type
 * @property string $export_format
 * @property Carbon|null $created_at
 */
#[Fillable(['user_id', 'report_type', 'export_format'])]
class ReportExport extends Model
{
    public const UPDATED_AT = null;

    /**
     * The table associated with the model.
     */
    protected $table = 'reports_exports';

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
