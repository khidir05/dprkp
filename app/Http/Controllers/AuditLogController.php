<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Display a listing of audit logs (Super Admin only).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'super_admin') {
            abort(403, 'Akses ditolak. Hanya Super Admin yang dapat melihat audit log.');
        }

        $query = AuditLog::query()->with('user');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('description', 'like', '%' . $search . '%')
                  ->orWhere('action', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function($qu) use ($search) {
                      $qu->where('name', 'like', '%' . $search . '%');
                  });
            });
        }

        if ($request->has('module') && $request->input('module') !== 'all') {
            $query->where('module', $request->input('module'));
        }

        $logs = $query->orderByDesc('created_at')
            ->paginate(25)
            ->withQueryString();

        // Get unique modules for filtering dropdown
        $modules = AuditLog::select('module')->distinct()->pluck('module');

        return Inertia::render('audit/index', [
            'logs' => $logs,
            'modules' => $modules,
            'filters' => $request->only(['search', 'module']),
        ]);
    }
}
