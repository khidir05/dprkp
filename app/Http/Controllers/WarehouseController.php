<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Warehouse::query()->with('users');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', '%' . $search . '%')
                  ->orWhere('code', 'like', '%' . $search . '%')
                  ->orWhere('address', 'like', '%' . $search . '%');
        }

        $warehouses = $query->orderBy('code')
            ->paginate(10)
            ->withQueryString();

        // Get active users for assignment (usually Admin Gudang & Pemohon)
        $assignableUsers = User::where('is_active', true)
            ->with('roleModel')
            ->get(['id', 'name', 'email', 'role']);

        return Inertia::render('warehouses/index', [
            'warehouses' => $warehouses,
            'assignableUsers' => $assignableUsers,
            'filters' => $request->only(['search']),
            'canManage' => $request->user()->roleModel->code === 'admin_gudang' || $request->user()->roleModel->code === 'super_admin',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorizeManagement($request);

        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:warehouses,code',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
        ], [
            'code.required' => 'Kode gudang wajib diisi.',
            'code.unique' => 'Kode gudang sudah digunakan.',
            'name.required' => 'Nama gudang wajib diisi.',
        ]);

        $validated['is_active'] = true;

        Warehouse::create($validated);

        return redirect()->route('warehouses.index')
            ->with('success', 'Gudang berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Warehouse $warehouse): RedirectResponse
    {
        $this->authorizeManagement($request);

        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:warehouses,code,' . $warehouse->id,
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
        ], [
            'code.required' => 'Kode gudang wajib diisi.',
            'code.unique' => 'Kode gudang sudah digunakan.',
            'name.required' => 'Nama gudang wajib diisi.',
        ]);

        $warehouse->update($validated);

        return redirect()->route('warehouses.index')
            ->with('success', 'Gudang berhasil diperbarui.');
    }

    /**
     * Toggle the active status of the warehouse.
     */
    public function toggleActive(Request $request, Warehouse $warehouse): RedirectResponse
    {
        $this->authorizeManagement($request);

        $warehouse->update([
            'is_active' => !$warehouse->is_active,
        ]);

        $status = $warehouse->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->route('warehouses.index')
            ->with('success', "Gudang berhasil {$status}.");
    }

    /**
     * Assign users to the warehouse.
     */
    public function assignUsers(Request $request, Warehouse $warehouse): RedirectResponse
    {
        $this->authorizeManagement($request);

        $validated = $request->validate([
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $warehouse->users()->sync($validated['user_ids'] ?? []);

        return redirect()->route('warehouses.index')
            ->with('success', 'Petugas gudang berhasil disinkronisasi.');
    }

    /**
     * Helper to authorize management actions.
     */
    private function authorizeManagement(Request $request): void
    {
        $role = $request->user()->roleModel->code;
        if ($role !== 'admin_gudang' && $role !== 'super_admin') {
            abort(403, 'Anda tidak memiliki hak akses untuk mengelola gudang.');
        }
    }
}
