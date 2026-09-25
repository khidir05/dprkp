import { useState, useRef } from 'react';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit2, Eye, ToggleLeft, ToggleRight, Lock, Unlock, FileSpreadsheet, Download, Upload, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import type { Product, Category, Unit } from '@/types';

type WarehouseOption = {
    id: number;
    name: string;
    code: string;
};

type Props = {
    products: {
        data: (Product & { total_stock?: number })[];
        links: any[];
    };
    categories: Category[];
    units: Unit[];
    warehouses?: WarehouseOption[];
    userWarehouse?: WarehouseOption | null;
    filters: {
        search?: string;
        category_id?: string;
    };
    canManage: boolean;
};

type ParsedImportItem = {
    code: string;
    sku: string;
    name: string;
    category: string;
    unit: string;
    brand: string;
    packaging: string;
    minimum_stock: number;
    initial_stock: number;
    description: string;
};

export default function ProductsIndex({ products, categories, units, warehouses = [], userWarehouse = null, filters, canManage }: Props) {
    const { auth } = usePage().props as any;
    const userRole = auth.user?.role_model?.code;
    const isSuperAdmin = userRole === 'super_admin';
    const isAdminGudang = userRole === 'admin_gudang';
    const isPemohon = userRole === 'pemohon';

    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategoryId, setSelectedCategoryId] = useState(filters.category_id || 'all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Import Dialog States
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [importWarehouseId, setImportWarehouseId] = useState<string>('');
    const [parsedItems, setParsedItems] = useState<ParsedImportItem[]>([]);
    const [importFileName, setImportFileName] = useState<string>('');
    const [isParsing, setIsParsing] = useState(false);
    const [isSubmittingImport, setIsSubmittingImport] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        category_id: '',
        unit_id: '',
        warehouse_id: '',
        sku: '',
        code: '',
        name: '',
        brand: '',
        packaging: '',
        description: '',
        minimum_stock: 0,
        initial_stock: 0,
    });

    const handleSearchChange = (val: string) => {
        setSearch(val);
        reloadPage(val, selectedCategoryId);
    };

    const handleCategoryFilterChange = (val: string) => {
        setSelectedCategoryId(val);
        reloadPage(search, val);
    };

    const reloadPage = (searchVal: string, catVal: string) => {
        const url = new URL(window.location.href);
        if (searchVal) {
            url.searchParams.set('search', searchVal);
        } else {
            url.searchParams.delete('search');
        }

        if (catVal && catVal !== 'all') {
            url.searchParams.set('category_id', catVal);
        } else {
            url.searchParams.delete('category_id');
        }

        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
    };

    const openAddDialog = () => {
        setEditingProduct(null);
        reset();
        clearErrors();
        if (isAdminGudang && userWarehouse) {
            setData('warehouse_id', String(userWarehouse.id));
        } else {
            setData('warehouse_id', '');
        }
        setIsDialogOpen(true);
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setData({
            category_id: String(product.category_id),
            unit_id: String(product.unit_id),
            warehouse_id: '',
            sku: product.sku,
            code: product.code,
            name: product.name,
            brand: product.brand || '',
            packaging: product.packaging || '',
            description: product.description || '',
            minimum_stock: product.minimum_stock,
            initial_stock: 0,
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            put(`/products/${editingProduct.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post('/products', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const toggleStatus = (product: Product) => {
        router.patch(`/products/${product.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const toggleHold = (product: Product) => {
        router.patch(`/products/${product.id}/toggle-hold`, {}, {
            preserveScroll: true,
        });
    };

    // ─────────────────────────────────────────
    // Import Functions
    // ─────────────────────────────────────────
    const openImportDialog = () => {
        setParsedItems([]);
        setImportFileName('');
        if (isAdminGudang && userWarehouse) {
            setImportWarehouseId(String(userWarehouse.id));
        } else {
            setImportWarehouseId('');
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsImportDialogOpen(true);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportFileName(file.name);
        setIsParsing(true);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const rawData = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '' });

                if (rawData.length < 2) {
                    toast.error('File kosong atau tidak memiliki baris data.');
                    setIsParsing(false);
                    return;
                }

                // Headers row (index 0)
                const headerRow = (rawData[0] || []).map((h: any) => String(h).toLowerCase().trim());

                // Find column index helpers with exact priority and substring fallback
                const findColIdx = (keywords: string[]) => {
                    const exactIdx = headerRow.findIndex((h: string) => keywords.some((k) => h === k));
                    if (exactIdx !== -1) return exactIdx;
                    return headerRow.findIndex((h: string) => keywords.some((k) => h.includes(k)));
                };

                const colCode = findColIdx(['kode barang', 'kode', 'code', 'product code']);
                const colSku = findColIdx(['sku', 'kode sku']);
                const colName = findColIdx(['nama barang', 'nama produk', 'nama', 'name', 'product name', 'barang', 'produk']);
                const colCat = findColIdx(['kategori', 'category', 'jenis']);
                const colUnit = findColIdx(['satuan', 'unit', 'uom']);
                const colBrand = findColIdx(['merk', 'brand']);
                const colPackaging = findColIdx(['kemasan', 'packaging']);

                // Minimum stock column detection
                const colMinStock = headerRow.findIndex((h: string) =>
                    ['stok minimum', 'min stock', 'minimum_stock', 'min_stock', 'stok min', 'minimum', 'min'].some((k) => h === k || h.includes(k))
                );

                // Initial stock column detection (MUST NOT be minimum stock)
                const colInitStock = headerRow.findIndex((h: string) => {
                    if (h.includes('min') || h.includes('minimum')) return false;
                    return ['stok awal', 'initial_stock', 'stok_awal', 'qty awal', 'jumlah awal', 'stok masuk', 'stok fisik', 'total stok', 'stok', 'qty', 'jumlah', 'quantity', 'stock'].some((k) => h === k || h.includes(k));
                });

                const colDesc = findColIdx(['deskripsi', 'description', 'keterangan', 'spesifikasi']);

                const parseNumber = (val: any) => {
                    if (val === undefined || val === null || val === '') return 0;
                    const clean = String(val).replace(/[^0-9.-]/g, '');
                    const num = parseFloat(clean);
                    return isNaN(num) ? 0 : Math.round(num);
                };

                const items: ParsedImportItem[] = [];

                for (let i = 1; i < rawData.length; i++) {
                    const row = rawData[i];
                    if (!row || row.length === 0) continue;

                    const name = colName !== -1 && row[colName] ? String(row[colName]).trim() : '';
                    if (!name) continue; // skip row without product name

                    const code = colCode !== -1 && row[colCode] ? String(row[colCode]).trim() : '';
                    const sku = colSku !== -1 && row[colSku] ? String(row[colSku]).trim() : '';
                    const category = colCat !== -1 && row[colCat] ? String(row[colCat]).trim() : '';
                    const unit = colUnit !== -1 && row[colUnit] ? String(row[colUnit]).trim() : '';
                    const brand = colBrand !== -1 && row[colBrand] ? String(row[colBrand]).trim() : '';
                    const packaging = colPackaging !== -1 && row[colPackaging] ? String(row[colPackaging]).trim() : '';
                    const minStock = colMinStock !== -1 ? parseNumber(row[colMinStock]) : 0;
                    const initStock = colInitStock !== -1 ? parseNumber(row[colInitStock]) : 0;
                    const desc = colDesc !== -1 && row[colDesc] ? String(row[colDesc]).trim() : '';

                    items.push({
                        code,
                        sku,
                        name,
                        category,
                        unit,
                        brand,
                        packaging,
                        minimum_stock: minStock,
                        initial_stock: initStock,
                        description: desc,
                    });
                }

                if (items.length === 0) {
                    toast.error('Tidak ditemukan data barang yang valid pada file tersebut.');
                } else {
                    setParsedItems(items);
                    toast.success(`Berhasil memuat ${items.length} baris data barang.`);
                }
            } catch (err: any) {
                console.error(err);
                toast.error('Gagal membaca file Excel/CSV: ' + (err.message || 'Format tidak didukung'));
            } finally {
                setIsParsing(false);
            }
        };

        reader.onerror = () => {
            toast.error('Terjadi kesalahan saat membaca file.');
            setIsParsing(false);
        };

        reader.readAsBinaryString(file);
    };

    const handleExecuteImport = async () => {
        if (parsedItems.length === 0) {
            toast.error('Belum ada data barang yang diunggah.');
            return;
        }

        const targetWh = isSuperAdmin ? importWarehouseId : (userWarehouse?.id ? String(userWarehouse.id) : '');
        if (isSuperAdmin && !targetWh) {
            toast.error('Silakan pilih gudang tujuan import terlebih dahulu.');
            return;
        }

        setIsSubmittingImport(true);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch('/products/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    warehouse_id: targetWh ? parseInt(targetWh) : null,
                    items: parsedItems,
                }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                toast.success(result.message || 'Import data barang berhasil!');
                setIsImportDialogOpen(false);
                router.reload();
            } else {
                toast.error(result.message || 'Gagal melakukan import data.');
            }
        } catch (err: any) {
            toast.error('Terjadi kesalahan jaringan saat melakukan import.');
        } finally {
            setIsSubmittingImport(false);
        }
    };

    const downloadExcelTemplate = () => {
        const headers = [
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
        const sampleData = [
            [
                'BRG-0001',
                'ATK-PNC-2B',
                'Pensil 2B Faber Castell',
                'Alat Tulis Kantor',
                'Pcs',
                'Faber Castell',
                'Box',
                10,
                50,
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
                5,
                20,
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
                5,
                15,
                'Cairan pembersih dan disinfektan lantai',
            ],
        ];

        const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
        ws['!cols'] = [
            { wch: 14 },
            { wch: 16 },
            { wch: 32 },
            { wch: 20 },
            { wch: 12 },
            { wch: 16 },
            { wch: 12 },
            { wch: 14 },
            { wch: 12 },
            { wch: 35 },
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template Master Barang');
        XLSX.writeFile(wb, 'template_import_barang.xlsx');
    };

    const downloadCsvTemplate = () => {
        window.location.href = '/products/template';
    };

    return (
        <>
            <Head title="Master Barang" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daftar Barang</h1>
                        <p className="text-muted-foreground">Kelola master data barang, spesifikasi, dan stok minimum.</p>
                    </div>

                    <div className="w-full md:w-48">
                        <Label htmlFor="filter-category" className="sr-only">Filter Kategori</Label>
                        <Select value={selectedCategoryId} onValueChange={handleCategoryFilterChange}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DataTable
                    headers={isPemohon 
                        ? ['Nama Barang', 'Kategori', 'Satuan', 'Total Stok', 'Aksi']
                        : ['SKU / Kode', 'Nama Barang', 'Kategori', 'Satuan', 'Min. Stok', 'Total Stok', 'Status', 'Aksi']
                    }
                    items={products.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari barang..."
                    onAddClick={canManage ? openAddDialog : undefined}
                    addText="Tambah Barang"
                    extraActions={
                        canManage ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 gap-1.5 border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30 font-semibold cursor-pointer"
                                onClick={openImportDialog}
                            >
                                <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Import Excel / CSV</span>
                            </Button>
                        ) : undefined
                    }
                    paginationLinks={products.links}
                    renderRow={(product) => (
                        <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                            {!isPemohon && (
                                <td className="p-4">
                                    <div className="text-xs text-muted-foreground font-mono">{product.sku}</div>
                                    <div className="text-sm font-semibold font-mono">{product.code}</div>
                                </td>
                            )}
                            <td className="p-4 font-medium">
                                <div>{product.name}</div>
                                {(product.brand || product.packaging) && (
                                    <div className="text-xs text-muted-foreground mt-0.5 font-normal">
                                        {product.brand && <span>Merk: {product.brand}</span>}
                                        {product.brand && product.packaging && <span className="mx-1.5">&bull;</span>}
                                        {product.packaging && <span>Kemasan: {product.packaging}</span>}
                                    </div>
                                )}
                            </td>
                            <td className="p-4 text-muted-foreground text-sm">{product.category?.name || '-'}</td>
                            <td className="p-4 text-sm">
                                <Badge variant="secondary" className="font-normal">
                                    {product.unit?.symbol || '-'}
                                </Badge>
                            </td>
                            {!isPemohon && <td className="p-4 text-center font-mono text-sm">{product.minimum_stock}</td>}
                            <td className="p-4 text-center font-mono text-sm font-semibold">
                                {product.total_stock ?? 0}
                            </td>
                            {!isPemohon && (
                                <td className="p-4 space-y-1">
                                    <div className="flex flex-col gap-1 items-start">
                                        <Badge variant={product.is_active ? 'default' : 'secondary'} className="text-xs">
                                            {product.is_active ? 'Aktif' : 'Non-aktif'}
                                        </Badge>
                                        {product.is_hold && (
                                            <Badge variant="destructive" className="text-xs">
                                                Ditangguhkan
                                            </Badge>
                                        )}
                                    </div>
                                </td>
                            )}
                            <td className="p-4">
                                <div className="flex gap-1.5">
                                    <Button asChild variant="outline" size="icon" className="h-8 w-8 text-neutral-600">
                                        <Link href={`/products/${product.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    {canManage && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => openEditDialog(product)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                                onClick={() => toggleHold(product)}
                                                title={product.is_hold ? 'Aktifkan Kembali' : 'Tangguhkan'}
                                            >
                                                {product.is_hold ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className={`h-8 w-8 ${product.is_active ? 'text-neutral-600' : 'text-emerald-600'}`}
                                                onClick={() => toggleStatus(product)}
                                                title={product.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            >
                                                {product.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )}
                />

                {/* Create / Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[540px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingProduct ? 'Edit Barang' : 'Tambah Barang Baru'}</DialogTitle>
                                <DialogDescription>
                                    Isi data barang secara lengkap untuk dimasukkan ke master data.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                                {/* Warehouse Destination Indicator / Selector */}
                                {!editingProduct && (
                                    <>
                                        {isSuperAdmin ? (
                                            <div className="grid gap-2 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl">
                                                <Label htmlFor="warehouse_id" className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                                                    Gudang Tujuan <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={data.warehouse_id}
                                                    onValueChange={(val) => setData('warehouse_id', val)}
                                                >
                                                    <SelectTrigger id="warehouse_id" className="h-10 bg-white dark:bg-zinc-900">
                                                        <SelectValue placeholder="Pilih Gudang Sasaran..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {warehouses.map((wh) => (
                                                            <SelectItem key={wh.id} value={String(wh.id)}>
                                                                {wh.name} ({wh.code})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.warehouse_id && <p className="text-xs text-red-500 font-medium">{errors.warehouse_id}</p>}
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl text-xs flex items-center justify-between">
                                                <span className="text-muted-foreground">Lokasi Gudang:</span>
                                                <Badge variant="outline" className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800">
                                                    {userWarehouse?.name || 'Gudang Ditugaskan'} ({userWarehouse?.code || 'AUTO'})
                                                </Badge>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            placeholder="Contoh: ATK-PNC-HB"
                                            required
                                        />
                                        {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="code">Kode Barang</Label>
                                        <Input
                                            id="code"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder="Contoh: BRG-0001"
                                            required
                                        />
                                        {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Barang</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Pensil 2B Steadler"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="brand">Merk</Label>
                                        <Input
                                            id="brand"
                                            value={data.brand}
                                            onChange={(e) => setData('brand', e.target.value)}
                                            placeholder="Contoh: Steadler, Sinar Dunia"
                                        />
                                        {errors.brand && <p className="text-xs text-red-500">{errors.brand}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="packaging">Kemasan</Label>
                                        <Input
                                            id="packaging"
                                            value={data.packaging}
                                            onChange={(e) => setData('packaging', e.target.value)}
                                            placeholder="Contoh: Rim, Pack, Box"
                                        />
                                        {errors.packaging && <p className="text-xs text-red-500">{errors.packaging}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category_id">Kategori</Label>
                                        <Select
                                            value={data.category_id}
                                            onValueChange={(val) => setData('category_id', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && <p className="text-xs text-red-500">{errors.category_id}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="unit_id">Satuan</Label>
                                        <Select
                                            value={data.unit_id}
                                            onValueChange={(val) => setData('unit_id', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Satuan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {units.map((unit) => (
                                                    <SelectItem key={unit.id} value={String(unit.id)}>
                                                        {unit.name} ({unit.symbol})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.unit_id && <p className="text-xs text-red-500">{errors.unit_id}</p>}
                                    </div>
                                </div>

                                <div className={`grid ${!editingProduct ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                    <div className="grid gap-2">
                                        <Label htmlFor="minimum_stock">Stok Minimum</Label>
                                        <Input
                                            id="minimum_stock"
                                            type="number"
                                            value={data.minimum_stock}
                                            onChange={(e) => setData('minimum_stock', parseInt(e.target.value) || 0)}
                                            min={0}
                                            required
                                        />
                                        {errors.minimum_stock && <p className="text-xs text-red-500">{errors.minimum_stock}</p>}
                                    </div>
                                    {!editingProduct && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="initial_stock">Stok Awal (Gudang)</Label>
                                            <Input
                                                id="initial_stock"
                                                type="number"
                                                value={data.initial_stock}
                                                onChange={(e) => setData('initial_stock', parseInt(e.target.value) || 0)}
                                                min={0}
                                                placeholder="0"
                                            />
                                            {errors.initial_stock && <p className="text-xs text-red-500">{errors.initial_stock}</p>}
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Spesifikasi atau deskripsi barang..."
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={processing}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Import Excel / CSV Dialog */}
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogContent className="sm:max-w-[760px] max-h-[90vh] flex flex-col p-6">
                        <DialogHeader className="pb-2">
                            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                                <span>Import Data Barang (Excel / CSV)</span>
                            </DialogTitle>
                            <DialogDescription>
                                Unggah file Excel (.xlsx, .xls, .xlsb) atau .csv untuk menambahkan atau memperbarui data master barang secara massal.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 flex-1 overflow-y-auto py-2 pr-1">
                            {/* Download Templates Banner */}
                            <div className="p-3.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">Download Contoh Template</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">Gunakan format template standar agar proses import berjalan sempurna.</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={downloadExcelTemplate}
                                        className="h-8 text-xs font-semibold gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Template .xlsx</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={downloadCsvTemplate}
                                        className="h-8 text-xs font-semibold gap-1.5"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Template .csv</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Warehouse Target Selector */}
                            <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="import_warehouse" className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                                        Gudang Sasaran Penempatan Stok <span className="text-red-500">*</span>
                                    </Label>
                                    {isAdminGudang && (
                                        <span className="text-[11px] text-muted-foreground italic">(Otomatis gudang tugas Anda)</span>
                                    )}
                                </div>

                                {isSuperAdmin ? (
                                    <Select
                                        value={importWarehouseId}
                                        onValueChange={setImportWarehouseId}
                                    >
                                        <SelectTrigger id="import_warehouse" className="h-10 bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-800">
                                            <SelectValue placeholder="-- Pilih Gudang untuk Mengalokasikan Stok --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouses.map((wh) => (
                                                <SelectItem key={wh.id} value={String(wh.id)}>
                                                    {wh.name} ({wh.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="p-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-semibold flex items-center justify-between">
                                        <span>{userWarehouse?.name || 'Gudang Penugasan Anda'}</span>
                                        <Badge variant="outline" className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
                                            {userWarehouse?.code || 'DEFAULT'}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* File Upload Dropzone */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider">Pilih File Spreadsheet</Label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                                        importFileName 
                                            ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10' 
                                            : 'border-slate-200 dark:border-zinc-800 hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-zinc-900/50'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept=".xlsx,.xls,.xlsb,.csv"
                                        className="hidden"
                                    />
                                    {isParsing ? (
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
                                            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">Sedang memproses dan membaca lembar data...</p>
                                        </div>
                                    ) : importFileName ? (
                                        <div className="flex flex-col items-center justify-center space-y-1.5">
                                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{importFileName}</p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                                                {parsedItems.length} baris barang siap diimport &bull; Klik untuk ganti file
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Upload className="h-8 w-8 text-slate-400 dark:text-zinc-500" />
                                            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Klik untuk memilih atau seret file <span className="font-mono text-indigo-600">.xlsx / .xlsb / .csv</span> ke sini
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">Mendukung file Excel dan CSV hingga 5.000 baris</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Preview Table of Parsed Items */}
                            {parsedItems.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold uppercase tracking-wider">
                                            Preview Data ({parsedItems.length} Barang)
                                        </Label>
                                        <span className="text-[11px] text-muted-foreground">Menampilkan 5 baris pertama</span>
                                    </div>

                                    <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                                        <Table>
                                            <TableHeader className="bg-slate-50 dark:bg-zinc-900">
                                                <TableRow>
                                                    <TableHead className="font-bold py-2">Kode</TableHead>
                                                    <TableHead className="font-bold py-2">Nama Barang</TableHead>
                                                    <TableHead className="font-bold py-2">Kategori</TableHead>
                                                    <TableHead className="font-bold py-2">Satuan</TableHead>
                                                    <TableHead className="font-bold py-2 text-right">Stok Awal</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {parsedItems.slice(0, 5).map((it, idx) => (
                                                    <TableRow key={idx} className="border-b border-slate-100 dark:border-zinc-800">
                                                        <TableCell className="font-mono text-muted-foreground">{it.code || '(Auto)'}</TableCell>
                                                        <TableCell className="font-semibold text-slate-800 dark:text-zinc-200">{it.name}</TableCell>
                                                        <TableCell>{it.category || 'Umum'}</TableCell>
                                                        <TableCell>{it.unit || 'Pcs'}</TableCell>
                                                        <TableCell className="text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                            {it.initial_stock}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {parsedItems.length > 5 && (
                                        <p className="text-[11px] text-center text-muted-foreground italic">
                                            ... dan {parsedItems.length - 5} data barang lainnya
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <DialogFooter className="pt-3 border-t border-slate-100 dark:border-zinc-800 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsImportDialogOpen(false)}
                                disabled={isSubmittingImport}
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                onClick={handleExecuteImport}
                                disabled={isSubmittingImport || parsedItems.length === 0 || (isSuperAdmin && !importWarehouseId)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 cursor-pointer shadow-md"
                            >
                                {isSubmittingImport ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        <span>Mengimport {parsedItems.length} Barang...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Proses Import ({parsedItems.length}) Barang</span>
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Daftar Barang',
            href: '/products',
        },
    ],
};
