<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;
use App\Models\Warehouse;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

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

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'ilike', '%' . $search . '%')
                  ->orWhere('code', 'ilike', '%' . $search . '%')
                  ->orWhere('sku', 'ilike', '%' . $search . '%')
                  ->orWhere('brand', 'ilike', '%' . $search . '%')
                  ->orWhere('packaging', 'ilike', '%' . $search . '%')
                  ->orWhere('description', 'ilike', '%' . $search . '%')
                  ->orWhereHas('category', function($cat) use ($search) {
                      $cat->where('name', 'ilike', '%' . $search . '%');
                  });
            });
        }

        if ($request->filled('category_id') && $request->input('category_id') !== 'all') {
            $query->where('category_id', $request->input('category_id'));
        }

        $products = $query->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $categories = Category::orderBy('name')->get(['id', 'name']);
        $units = Unit::orderBy('name')->get(['id', 'name', 'symbol']);

        $user = $request->user();
        $isSuperAdmin = $user->roleModel?->code === 'super_admin';
        $isAdminGudang = $user->roleModel?->code === 'admin_gudang';

        $warehouses = [];
        $userWarehouse = null;

        if ($isSuperAdmin) {
            $warehouses = Warehouse::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']);
        } elseif ($isAdminGudang) {
            $userWarehouse = $user->warehouses()->where('is_active', true)->first(['warehouses.id', 'warehouses.name', 'warehouses.code']);
            if (!$userWarehouse) {
                $userWarehouse = Warehouse::where('is_active', true)->first(['id', 'name', 'code']);
            }
        }

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'units' => $units,
            'warehouses' => $warehouses,
            'userWarehouse' => $userWarehouse,
            'filters' => $request->only(['search', 'category_id']),
            'canManage' => $isAdminGudang || $isSuperAdmin,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $this->authorizeManagement($request);

        $user = $request->user();
        $isSuperAdmin = $user->roleModel?->code === 'super_admin';
        $isAdminGudang = $user->roleModel?->code === 'admin_gudang';

        $rules = [
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'sku' => 'required|string|max:100|unique:products,sku',
            'code' => 'required|string|max:100|unique:products,code',
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'packaging' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'minimum_stock' => 'required|integer|min:0',
            'initial_stock' => 'nullable|integer|min:0',
        ];

        if ($isSuperAdmin) {
            $rules['warehouse_id'] = 'required|exists:warehouses,id';
        }

        $validator = Validator::make($request->all(), $rules, [
            'warehouse_id.required' => 'Gudang tujuan wajib dipilih.',
            'warehouse_id.exists' => 'Gudang tujuan tidak valid.',
            'sku.required' => 'SKU wajib diisi.',
            'sku.unique' => 'SKU sudah terdaftar.',
            'code.required' => 'Kode barang wajib diisi.',
            'code.unique' => 'Kode barang sudah terdaftar.',
            'name.required' => 'Nama barang wajib diisi.',
            'minimum_stock.required' => 'Stok minimum wajib diisi.',
        ]);

        if ($validator->fails()) {
            if ($request->wantsJson() || $request->ajax() || $request->has('ajax') || $request->acceptsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal membuat produk. Silakan periksa kembali form.',
                    'errors' => $validator->errors()
                ], 422);
            }

            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();
        $targetWarehouseId = null;

        if ($isSuperAdmin) {
            $targetWarehouseId = $validated['warehouse_id'];
        } elseif ($isAdminGudang) {
            $assignedWarehouse = $user->warehouses()->where('is_active', true)->first();
            $targetWarehouseId = $assignedWarehouse ? $assignedWarehouse->id : Warehouse::where('is_active', true)->value('id');
        }

        $initialStock = isset($validated['initial_stock']) ? (int)$validated['initial_stock'] : 0;
        unset($validated['warehouse_id'], $validated['initial_stock']);

        $validated['is_active'] = true;
        $validated['is_hold'] = false;

        $product = null;
        DB::transaction(function () use ($validated, $targetWarehouseId, $initialStock, &$product) {
            $product = Product::create($validated);

            if ($targetWarehouseId) {
                Stock::create([
                    'warehouse_id' => $targetWarehouseId,
                    'product_id' => $product->id,
                    'qty' => $initialStock,
                ]);
            }
        });

        if ($request->wantsJson() || $request->ajax() || $request->has('ajax') || $request->acceptsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Barang berhasil ditambahkan.',
                'product' => $product->load(['category', 'unit'])
            ]);
        }

        return redirect()->route('products.index')
            ->with('success', 'Barang berhasil ditambahkan.');
    }

    /**
     * Import multiple products from parsed excel/csv data.
     */
    public function import(Request $request): \Illuminate\Http\JsonResponse
    {
        $this->authorizeManagement($request);

        $user = $request->user();
        $isSuperAdmin = $user->roleModel?->code === 'super_admin';

        $rules = [
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string|max:255',
            'items.*.sku' => 'nullable|string|max:100',
            'items.*.code' => 'nullable|string|max:100',
            'items.*.category' => 'nullable|string|max:255',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.brand' => 'nullable|string|max:255',
            'items.*.packaging' => 'nullable|string|max:255',
            'items.*.minimum_stock' => 'nullable|numeric|min:0',
            'items.*.initial_stock' => 'nullable|numeric|min:0',
            'items.*.description' => 'nullable|string',
        ];

        if ($isSuperAdmin) {
            $rules['warehouse_id'] = 'required|exists:warehouses,id';
        }

        $validator = Validator::make($request->all(), $rules, [
            'items.required' => 'Data barang tidak boleh kosong.',
            'items.min' => 'Minimal ada 1 data barang untuk diimport.',
            'warehouse_id.required' => 'Gudang tujuan wajib dipilih.',
            'warehouse_id.exists' => 'Gudang tujuan tidak valid.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi data import gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        $targetWarehouseId = null;
        if ($isSuperAdmin) {
            $targetWarehouseId = $request->input('warehouse_id');
        } else {
            $assignedWarehouse = $user->warehouses()->where('is_active', true)->first();
            $targetWarehouseId = $assignedWarehouse ? $assignedWarehouse->id : Warehouse::where('is_active', true)->value('id');
        }

        if (!$targetWarehouseId) {
            return response()->json([
                'success' => false,
                'message' => 'Gudang sasaran tidak ditemukan atau Anda belum di-assign ke gudang manapun.'
            ], 422);
        }

        $items = $request->input('items', []);
        $createdCount = 0;
        $updatedCount = 0;

        DB::transaction(function () use ($items, $targetWarehouseId, &$createdCount, &$updatedCount) {
            $categories = Category::all()->keyBy(fn($c) => strtolower(trim($c->name)));
            $unitsByName = Unit::all()->keyBy(fn($u) => strtolower(trim($u->name)));
            $unitsBySymbol = Unit::all()->keyBy(fn($u) => strtolower(trim($u->symbol)));

            $defaultCategory = Category::firstOrCreate(['name' => 'Umum'], ['description' => 'Kategori Umum']);
            $defaultUnit = Unit::firstOrCreate(['name' => 'Pcs', 'symbol' => 'pcs']);

            foreach ($items as $idx => $row) {
                $name = trim($row['name'] ?? '');
                if (!$name) continue;

                $code = trim($row['code'] ?? '');
                $sku = trim($row['sku'] ?? '');
                $categoryName = trim($row['category'] ?? '');
                $unitName = trim($row['unit'] ?? '');
                $brand = trim($row['brand'] ?? '') ?: null;
                $packaging = trim($row['packaging'] ?? '') ?: null;
                $minStock = isset($row['minimum_stock']) ? (int)$row['minimum_stock'] : 0;
                $initStock = isset($row['initial_stock']) ? (int)$row['initial_stock'] : 0;
                $description = trim($row['description'] ?? '') ?: null;

                // Auto generate code/sku if empty
                if (!$code) {
                    $code = 'BRG-' . str_pad((Product::max('id') ?? 0) + $idx + 1, 5, '0', STR_PAD_LEFT);
                }
                if (!$sku) {
                    $sku = 'SKU-' . strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $name), 0, 6)) . '-' . rand(100, 999);
                }

                // Resolve Category
                $catId = $defaultCategory->id;
                if ($categoryName) {
                    $catKey = strtolower($categoryName);
                    if (isset($categories[$catKey])) {
                        $catId = $categories[$catKey]->id;
                    } else {
                        $newCat = Category::create(['name' => $categoryName]);
                        $categories[$catKey] = $newCat;
                        $catId = $newCat->id;
                    }
                }

                // Resolve Unit
                $unitId = $defaultUnit->id;
                if ($unitName) {
                    $unitKey = strtolower($unitName);
                    if (isset($unitsByName[$unitKey])) {
                        $unitId = $unitsByName[$unitKey]->id;
                    } elseif (isset($unitsBySymbol[$unitKey])) {
                        $unitId = $unitsBySymbol[$unitKey]->id;
                    } else {
                        $newUnit = Unit::create(['name' => $unitName, 'symbol' => strtolower($unitName)]);
                        $unitsByName[$unitKey] = $newUnit;
                        $unitsBySymbol[strtolower($newUnit->symbol)] = $newUnit;
                        $unitId = $newUnit->id;
                    }
                }

                // Find existing product by code or sku
                $product = Product::where('code', $code)->orWhere('sku', $sku)->first();

                if ($product) {
                    $product->update([
                        'name' => $name,
                        'category_id' => $catId,
                        'unit_id' => $unitId,
                        'brand' => $brand ?? $product->brand,
                        'packaging' => $packaging ?? $product->packaging,
                        'minimum_stock' => $minStock,
                        'description' => $description ?? $product->description,
                        'is_active' => true,
                    ]);
                    $updatedCount++;
                } else {
                    $product = Product::create([
                        'code' => $code,
                        'sku' => $sku,
                        'name' => $name,
                        'category_id' => $catId,
                        'unit_id' => $unitId,
                        'brand' => $brand,
                        'packaging' => $packaging,
                        'minimum_stock' => $minStock,
                        'description' => $description,
                        'is_active' => true,
                        'is_hold' => false,
                    ]);
                    $createdCount++;
                }

                // Create or update stock in target warehouse
                $stock = Stock::firstOrCreate(
                    ['warehouse_id' => $targetWarehouseId, 'product_id' => $product->id],
                    ['qty' => 0]
                );

                if ($initStock > 0) {
                    $stock->qty = $initStock;
                    $stock->save();
                }
            }
        });

        $warehouseName = Warehouse::find($targetWarehouseId)?->name ?? 'Gudang';

        return response()->json([
            'success' => true,
            'message' => "Berhasil mengimport {$createdCount} barang baru dan memperbarui {$updatedCount} barang ke {$warehouseName}.",
            'created_count' => $createdCount,
            'updated_count' => $updatedCount,
        ]);
    }

    /**
     * Download template for importing products.
     */
    public function downloadTemplate(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $headers = [
            'Kode Barang',
            'SKU',
            'Nama Barang',
            'Kategori',
            'Satuan',
            'Merk',
            'Kemasan',
            'Stok Minimum',
            'Stok Awal',
            'Deskripsi',
        ];

        $sampleData = [
            [
                'BRG-0001',
                'ATK-PNC-2B',
                'Pensil 2B Faber Castell',
                'Alat Tulis Kantor',
                'Pcs',
                'Faber Castell',
                'Box',
                '10',
                '50',
                'Pensil ujian 2B hitam pekat',
            ],
            [
                'BRG-0002',
                'ATK-KTS-A4',
                'Kertas HVS A4 80gr',
                'Alat Tulis Kantor',
                'Rim',
                'PaperOne',
                'Dus',
                '5',
                '20',
                'Kertas cetak dokumen resmi',
            ],
            [
                'BRG-0003',
                'KBR-CLN-FLR',
                'Wipol Karbol Pembersih Lantai 750ml',
                'Alat Kebersihan',
                'Botol',
                'Wipol',
                'Botol',
                '5',
                '15',
                'Cairan pembersih dan disinfektan lantai',
            ],
        ];

        $filename = 'template_import_barang.csv';

        $handle = fopen('php://temp', 'r+');
        fputs($handle, "\xEF\xBB\xBF");
        fputcsv($handle, $headers);

        foreach ($sampleData as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return response($content, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
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
            'brand' => 'nullable|string|max:255',
            'packaging' => 'nullable|string|max:255',
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
