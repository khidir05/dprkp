<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\RegistrationLink;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $this->authorizeAdmin($request);

        $query = User::query()->with('roleModel');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('username', 'like', '%' . $search . '%')
                  ->orWhere('code_user', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('role_id') && $request->input('role_id') !== '') {
            $query->where('role', $request->input('role_id'));
        }

        $users = $query->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $roles = Role::orderBy('nama')->get(['id', 'nama', 'label']);

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role_id']),
        ]);
    }

    /**
     * Store a newly created user directly (SA Admin bypass).
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'role' => 'required|exists:roles,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'username' => 'required|string|alpha_dash|max:255|unique:users,username',
            'phone' => 'nullable|string|max:50',
            'password' => 'required|string|min:8',
        ], [
            'email.unique' => 'Email sudah terdaftar.',
            'username.unique' => 'Username sudah terdaftar.',
            'username.alpha_dash' => 'Username hanya boleh mengandung huruf, angka, strip, dan underscore.',
        ]);

        $role = Role::find($validated['role']);
        $count = User::where('role', $role->id)->count() + 1;
        $codeUser = $role->label . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        User::create([
            'role' => $validated['role'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'code_user' => $codeUser,
            'is_active' => true,
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User berhasil dibuat secara langsung.');
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'role' => 'required|exists:roles,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'username' => 'required|string|alpha_dash|max:255|unique:users,username,' . $user->id,
            'phone' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:8',
        ], [
            'email.unique' => 'Email sudah terdaftar.',
            'username.unique' => 'Username sudah terdaftar.',
        ]);

        $updateData = [
            'role' => $validated['role'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'phone' => $validated['phone'] ?? null,
        ];

        // Regenerate code_user if role changed
        if ($user->role !== (int)$validated['role']) {
            $role = Role::find($validated['role']);
            $count = User::where('role', $role->id)->count() + 1;
            $updateData['code_user'] = $role->label . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
        }

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->route('users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Toggle active status.
     */
    public function toggleActive(Request $request, User $user): RedirectResponse
    {
        $this->authorizeAdmin($request);

        if ($user->id === $request->user()->id) {
            return redirect()->route('users.index')
                ->with('error', 'Anda tidak dapat menonaktifkan akun Anda sendiri.');
        }

        $user->update([
            'is_active' => !$user->is_active,
        ]);

        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->route('users.index')
            ->with('success', "Akun user {$user->name} berhasil {$status}.");
    }

    /**
     * Display a listing of registration links.
     */
    public function linksIndex(Request $request): Response
    {
        $this->authorizeAdmin($request);

        $links = RegistrationLink::with('role')
            ->orderByDesc('created_at')
            ->paginate(15);

        $roles = Role::orderBy('nama')->get(['id', 'nama', 'label']);

        return Inertia::render('users/links', [
            'links' => $links,
            'roles' => $roles,
            'appUrl' => config('app.url'),
        ]);
    }

    /**
     * Store a newly created registration link.
     */
    public function storeLink(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
            'expires_days' => 'required|integer|min:1|max:30',
        ]);

        RegistrationLink::create([
            'token' => (string) Str::uuid(),
            'role_id' => $validated['role_id'],
            'is_used' => false,
            'expires_at' => now()->addDays($validated['expires_days']),
        ]);

        return redirect()->route('users.links')
            ->with('success', 'Link registrasi baru berhasil dibuat.');
    }

    /**
     * Delete registration link.
     */
    public function deleteLink(Request $request, RegistrationLink $link): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $link->delete();

        return redirect()->route('users.links')
            ->with('success', 'Link registrasi berhasil dihapus.');
    }

    /**
     * Enforce Super Admin authorization check.
     */
    private function authorizeAdmin(Request $request): void
    {
        if ($request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Akses ditolak. Hanya Super Admin yang dapat mengelola pengguna.');
        }
    }
}
