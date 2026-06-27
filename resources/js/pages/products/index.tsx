import { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Eye, ToggleLeft, ToggleRight, Lock, Unlock } from 'lucide-react';
import type { Product, Category, Unit } from '@/types';

type Props = {
    products: {
        data: (Product & { total_stock?: number })[];
        links: any[];
    };
    categories: Category[];
    units: Unit[];
    filters: {
        search?: string;
        category_id?: string;
    };
    canManage: boolean;
};

export default function ProductsIndex({ products, categories, units, filters, canManage }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategoryId, setSelectedCategoryId] = useState(filters.category_id || 'all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        category_id: '',
        unit_id: '',
        sku: '',
        code: '',
        name: '',
        description: '',
        minimum_stock: 0,
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
        setIsDialogOpen(true);
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setData({
            category_id: String(product.category_id),
            unit_id: String(product.unit_id),
            sku: product.sku,
            code: product.code,
            name: product.name,
            description: product.description || '',
            minimum_stock: product.minimum_stock,
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
                    headers={['SKU / Kode', 'Nama Barang', 'Kategori', 'Satuan', 'Min. Stok', 'Total Stok', 'Status', 'Aksi']}
                    items={products.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari barang..."
                    onAddClick={canManage ? openAddDialog : undefined}
                    addText="Tambah Barang"
                    paginationLinks={products.links}
                    renderRow={(product, idx) => (
                        <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4">
                                <div className="text-xs text-muted-foreground font-mono">{product.sku}</div>
                                <div className="text-sm font-semibold font-mono">{product.code}</div>
                            </td>
                            <td className="p-4 font-medium">{product.name}</td>
                            <td className="p-4 text-muted-foreground text-sm">{product.category?.name || '-'}</td>
                            <td className="p-4 text-sm">
                                <Badge variant="secondary" className="font-normal">
                                    {product.unit?.symbol || '-'}
                                </Badge>
                            </td>
                            <td className="p-4 text-center font-mono text-sm">{product.minimum_stock}</td>
                            <td className="p-4 text-center font-mono text-sm font-semibold">
                                {product.total_stock ?? 0}
                            </td>
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
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingProduct ? 'Edit Barang' : 'Tambah Barang Baru'}</DialogTitle>
                                <DialogDescription>
                                    Isi data barang secara lengkap untuk dimasukkan ke master data.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
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
