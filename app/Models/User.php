<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property int $role
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $code_user
 * @property string $username
 * @property string $password
 * @property bool $is_active
 * @property Carbon|null $email_verified_at
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['role', 'name', 'email', 'phone', 'code_user', 'username', 'password', 'is_active'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    // ──────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────

    /**
     * Role yang dimiliki user.
     *
     * Menggunakan nama 'roleModel' karena kolom FK di tabel users bernama 'role',
     * sehingga menghindari konflik dengan nama kolom.
     *
     * @return BelongsTo<Role, $this>
     */
    public function roleModel(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role');
    }

    /**
     * Warehouse yang di-assign ke user.
     *
     * @return BelongsToMany<Warehouse, $this>
     */
    public function warehouses(): BelongsToMany
    {
        return $this->belongsToMany(Warehouse::class, 'warehouse_users');
    }

    /**
     * Audit logs yang dibuat oleh user.
     *
     * @return HasMany<AuditLog, $this>
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    /**
     * Notifikasi yang dimiliki user.
     *
     * @return HasMany<Notification, $this>
     */
    public function customNotifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    // ──────────────────────────────────────
    // Role Helper Methods
    // ──────────────────────────────────────

    /**
     * Cek apakah user adalah Super Admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->roleModel?->code === 'super_admin';
    }

    /**
     * Cek apakah user adalah Manager.
     */
    public function isManager(): bool
    {
        return $this->roleModel?->code === 'manager';
    }

    /**
     * Cek apakah user adalah Admin Gudang.
     */
    public function isAdminGudang(): bool
    {
        return $this->roleModel?->code === 'admin_gudang';
    }

    /**
     * Cek apakah user adalah Pemohon.
     */
    public function isPemohon(): bool
    {
        return $this->roleModel?->code === 'pemohon';
    }

    /**
     * @return HasMany<StockOpname, $this>
     */
    public function createdStockOpnames(): HasMany
    {
        return $this->hasMany(StockOpname::class, 'created_by');
    }

    /**
     * @return HasMany<StockOpname, $this>
     */
    public function approvedStockOpnames(): HasMany
    {
        return $this->hasMany(StockOpname::class, 'approved_by');
    }
}
