<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->with(['category', 'unit'])
            ->withSum('stocks as total_stock', 'qty');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('code', 'like', '%' . $search . '%')
                  ->orWhere('sku', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('category_id') && $request->input('category_id') !== '') {
            $query->where('category_id', $request->input('category_id'));
        }

        $products = $query->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $categories = Category::orderBy('name')->get(['id', 'name']);
        $units = Unit::orderBy('name')->get(['id', 'name', 'symbol']);

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'units' => $units,
            'filters' => $request->only(['search', 'category_id']),
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
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'sku' => 'required|string|max:100|unique:products,sku',
            'code' => 'required|string|max:100|unique:products,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'minimum_stock' => 'required|integer|min:0',
        ], [
            'sku.required' => 'SKU wajib diisi.',
            'sku.unique' => 'SKU sudah terdaftar.',
            'code.required' => 'Kode barang wajib diisi.',
            'code.unique' => 'Kode barang sudah terdaftar.',
            'name.required' => 'Nama barang wajib diisi.',
            'minimum_stock.required' => 'Stok minimum wajib diisi.',
        ]);

        $validated['is_active'] = true;
        $validated['is_hold'] = false;

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Barang berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Product $product): Response
    {
        $product->load(['category', 'unit', 'stocks.warehouse']);
        $product->total_stock = $product->stocks->sum('qty');

        return Inertia::render('products/show', [
            'product' => $product,
            'canManage' => $request->user()->roleModel->code === 'admin_gudang' || $request->user()->roleModel->code === 'super_admin',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $this->authorizeManagement($request);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'sku' => 'required|string|max:100|unique:products,sku,' . $product->id,
            'code' => 'required|string|max:100|unique:products,code,' . $product->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'minimum_stock' => 'required|integer|min:0',
        ], [
            'sku.required' => 'SKU wajib diisi.',
            'sku.unique' => 'SKU sudah terdaftar.',
            'code.required' => 'Kode barang wajib diisi.',
            'code.unique' => 'Kode barang sudah terdaftar.',
            'name.required' => 'Nama barang wajib diisi.',
            'minimum_stock.required' => 'Stok minimum wajib diisi.',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success', 'Barang berhasil diperbarui.');
    }

    /**
     * Toggle active status.
     */
    public function toggleActive(Request $request, Product $product): RedirectResponse
    {
        $this->authorizeManagement($request);

        $product->update([
            'is_active' => !$product->is_active,
        ]);

        $status = $product->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->route('products.index')
            ->with('success', "Barang berhasil {$status}.");
    }

    /**
     * Toggle hold status.
     */
    public function toggleHold(Request $request, Product $product): RedirectResponse
    {
        $this->authorizeManagement($request);

        $product->update([
            'is_hold' => !$product->is_hold,
        ]);

        $status = $product->is_hold ? 'ditangguhkan' : 'diaktifkan kembali';

        return redirect()->route('products.index')
            ->with('success', "Barang berhasil {$status}.");
    }

    /**
     * Helper to authorize management actions.
     */
    private function authorizeManagement(Request $request): void
    {
        $role = $request->user()->roleModel->code;
        if ($role !== 'admin_gudang' && $role !== 'super_admin') {
            abort(403, 'Anda tidak memiliki hak akses untuk mengelola barang.');
        }
    }
}
