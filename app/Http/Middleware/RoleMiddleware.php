<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! $user->roleModel) {
            abort(403, 'Akses ditolak.');
        }

        $userRoleCode = $user->roleModel->code;

        foreach ($roles as $role) {
            if ($userRoleCode === $role) {
                return $next($request);
            }
        }

        abort(403, 'Anda tidak memiliki akses untuk halaman ini.');
    }
}
