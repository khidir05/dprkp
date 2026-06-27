<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditService
{
    /**
     * Log an action performed by the current user.
     */
    public static function log(string $module, string $action, ?string $description = null): void
    {
        // Audit log requires a valid logged-in user in database schema
        if (Auth::check()) {
            AuditLog::create([
                'user_id' => Auth::id(),
                'module' => $module,
                'action' => $action,
                'description' => $description,
                'ip_address' => Request::ip(),
                'created_at' => now(),
            ]);
        }
    }
}
