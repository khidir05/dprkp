<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Unit::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', '%' . $search . '%')
                  ->orWhere('symbol', 'like', '%' . $search . '%');
        }

        $units = $query->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('units/index', [
            'units' => $units,
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
            'name' => 'required|string|max:255|unique:units,name',
            'symbol' => 'required|string|max:50|unique:units,symbol',
        ], [
            'name.required' => 'Nama satuan wajib diisi.',
            'name.unique' => 'Nama satuan sudah digunakan.',
            'symbol.required' => 'Simbol/satuan wajib diisi.',
            'symbol.unique' => 'Simbol satuan sudah digunakan.',
        ]);

        Unit::create($validated);

        return redirect()->route('units.index')
            ->with('success', 'Satuan berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Unit $unit): RedirectResponse
    {
        $this->authorizeManagement($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:units,name,' . $unit->id,
            'symbol' => 'required|string|max:50|unique:units,symbol,' . $unit->id,
        ], [
            'name.required' => 'Nama satuan wajib diisi.',
            'name.unique' => 'Nama satuan sudah digunakan.',
            'symbol.required' => 'Simbol/satuan wajib diisi.',
            'symbol.unique' => 'Simbol satuan sudah digunakan.',
        ]);

        $unit->update($validated);

        return redirect()->route('units.index')
            ->with('success', 'Satuan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Unit $unit): RedirectResponse
    {
        $this->authorizeManagement($request);

        if ($unit->products()->exists()) {
            return redirect()->route('units.index')
                ->with('error', 'Satuan tidak dapat dihapus karena masih digunakan oleh barang terkait.');
        }

        $unit->delete();

        return redirect()->route('units.index')
            ->with('success', 'Satuan berhasil dihapus.');
    }

    /**
     * Helper to authorize management actions.
     */
    private function authorizeManagement(Request $request): void
    {
        $role = $request->user()->roleModel->code;
        if ($role !== 'admin_gudang' && $role !== 'super_admin') {
            abort(403, 'Anda tidak memiliki hak akses untuk mengelola satuan.');
        }
    }
}
