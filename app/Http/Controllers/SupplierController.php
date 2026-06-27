<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Supplier::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%')
                  ->orWhere('address', 'like', '%' . $search . '%');
        }

        $suppliers = $query->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('suppliers/index', [
            'suppliers' => $suppliers,
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
            'name' => 'required|string|max:255|unique:suppliers,name',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ], [
            'name.required' => 'Nama supplier wajib diisi.',
            'name.unique' => 'Nama supplier sudah digunakan.',
        ]);

        $validated['is_active'] = true;

        Supplier::create($validated);

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        $this->authorizeManagement($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:suppliers,name,' . $supplier->id,
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ], [
            'name.required' => 'Nama supplier wajib diisi.',
            'name.unique' => 'Nama supplier sudah digunakan.',
        ]);

        $supplier->update($validated);

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier berhasil diperbarui.');
    }

    /**
     * Toggle the active status of the supplier.
     */
    public function toggleActive(Request $request, Supplier $supplier): RedirectResponse
    {
        $this->authorizeManagement($request);

        $supplier->update([
            'is_active' => !$supplier->is_active,
        ]);

        $status = $supplier->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->route('suppliers.index')
            ->with('success', "Supplier berhasil {$status}.");
    }

    /**
     * Helper to authorize management actions.
     */
    private function authorizeManagement(Request $request): void
    {
        $role = $request->user()->roleModel->code;
        if ($role !== 'admin_gudang' && $role !== 'super_admin') {
            abort(403, 'Anda tidak memiliki hak akses untuk mengelola supplier.');
        }
    }
}
