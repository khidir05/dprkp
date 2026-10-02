import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Minus, Trash2, Box, Boxes, Package, Search, X, Check, ClipboardList, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { Warehouse, Product } from '@/types';

type Props = {
    warehouses: Warehouse[];
    products: Product[];
};

type FormItem = {
    product_id: number;
    qty_requested: number;
    // Helper fields for UI
    sku: string;
    code: string;
    name: string;
    symbol: string;
    category?: string;
};

export default function RequestCreate({ warehouses, products }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        warehouse_id: '',
        notes: '',
        items: [] as FormItem[],
    });

    const [productSearch, setProductSearch] = useState('');

    const getProductStock = (product: Product, warehouseId: string) => {
        if (!warehouseId) return 0;
        const stock = product.stocks?.find((s: any) => String(s.warehouse_id) === String(warehouseId));
        return stock ? stock.qty : 0;
    };

    const availableProducts = products.filter((p) => {
        if (!data.warehouse_id) return false;
        const stockQty = getProductStock(p, data.warehouse_id);
        return stockQty > 0;
    });

    const filteredProducts = availableProducts.filter((p) => {
        if (!productSearch.trim()) return true;
        const q = productSearch.toLowerCase().trim();
        return (
            p.name.toLowerCase().includes(q) ||
            (p.code && p.code.toLowerCase().includes(q)) ||
            (p.sku && p.sku.toLowerCase().includes(q)) ||
            (p.category?.name && p.category.name.toLowerCase().includes(q))
        );
    });

    const handleAddProduct = (product: Product, addQty: number = 1) => {
        const stockQty = getProductStock(product, data.warehouse_id);
        if (stockQty <= 0) {
            toast.error(`Stok "${product.name}" di gudang ini kosong.`);
            return;
        }

        const exists = data.items.find((item) => item.product_id === product.id);
        const currentQty = exists ? exists.qty_requested : 0;
        const newQty = currentQty + addQty;

        if (newQty > stockQty) {
            toast.error(`Jumlah pengajuan (${newQty}) melebihi sisa stok di gudang (${stockQty} ${product.unit?.symbol || 'pcs'}).`);
            return;
        }

        if (exists) {
            setData('items', data.items.map((item) =>
                item.product_id === product.id
                    ? { ...item, qty_requested: newQty }
                    : item
            ));
            toast.success(`Jumlah "${product.name}" diupdate menjadi ${newQty} ${product.unit?.symbol || 'pcs'}.`);
        } else {
            const newItem: FormItem = {
                product_id: product.id,
                qty_requested: addQty,
                sku: product.sku,
                code: product.code,
                name: product.name,
                symbol: product.unit?.symbol || 'pcs',
                category: product.category?.name,
            };
            setData('items', [...data.items, newItem]);
            toast.success(`Barang "${product.name}" ditambahkan ke pengajuan.`);
        }
    };

    const handleUpdateItemQty = (productId: number, newQty: number) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        const stockQty = getProductStock(product, data.warehouse_id);

        if (newQty > stockQty) {
            toast.error(`Jumlah pengajuan tidak boleh melebihi sisa stok (${stockQty} ${product.unit?.symbol || 'pcs'}).`);
            setData('items', data.items.map((item) =>
                item.product_id === productId
                    ? { ...item, qty_requested: stockQty }
                    : item
            ));
            return;
        }

        if (newQty < 1) {
            handleRemoveItemByProductId(productId);
            return;
        }

        setData('items', data.items.map((item) =>
            item.product_id === productId
                ? { ...item, qty_requested: newQty }
                : item
        ));
    };

    const handleRemoveItemByProductId = (productId: number) => {
        const item = data.items.find((i) => i.product_id === productId);
        setData('items', data.items.filter((i) => i.product_id !== productId));
        if (item) {
            toast.info(`"${item.name}" dihapus dari pengajuan.`);
        }
    };

    const handleRemoveItem = (idx: number) => {
        setData('items', data.items.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.items.length === 0) {
            toast.error('Tambahkan minimal 1 barang ke dalam daftar pengajuan.');
            return;
        }

        post('/requests');
    };

    return (
        <>
            <Head title="Buat Pengajuan Barang" />
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <Link href="/requests">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Buat Pengajuan Barang</h1>
                        <p className="text-muted-foreground">Buat formulir pengajuan barang kebutuhan kantor kepada pihak gudang.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
                    {/* Left 2 columns: General Info & Items list */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="bg-muted/30">
                                <CardTitle>Detail Pengajuan</CardTitle>
                                <CardDescription>Tentukan lokasi gudang target barang yang diajukan.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 grid grid-cols-1 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="warehouse_id">Target Gudang Tujuan</Label>
                                    <Select
                                        value={data.warehouse_id}
                                        onValueChange={(val) => {
                                             if (data.items.length > 0) {
                                                 if (confirm('Mengubah gudang sasaran akan mengosongkan daftar barang pilihan Anda. Apakah Anda yakin?')) {
                                                     setData({
                                                         ...data,
                                                         warehouse_id: val,
                                                         items: []
                                                     });
                                                     setProductSearch('');
                                                     toast.info('Daftar barang pengajuan telah dikosongkan.');
                                                 }
                                             } else {
                                                 setData('warehouse_id', val);
                                                 setProductSearch('');
                                             }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Gudang Sasaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouses.map((w) => (
                                                <SelectItem key={w.id} value={String(w.id)}>
                                                    {w.name} ({w.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.warehouse_id && <p className="text-xs text-red-500">{errors.warehouse_id}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Keterangan / Keperluan Pengajuan</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Tulis alasan pengajuan atau keterangan pendukung..."
                                        rows={3}
                                    />
                                    {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Selected Items List */}
                        <Card>
                            <CardHeader className="bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <ClipboardList className="h-5 w-5 text-indigo-500" />
                                            <span>Daftar Pengajuan Barang</span>
                                        </CardTitle>
                                        <CardDescription>Daftar item barang yang sedang diajukan.</CardDescription>
                                    </div>
                                    {data.items.length > 0 && (
                                        <span className="text-xs font-semibold text-muted-foreground">
                                            {data.items.length} Jenis ({data.items.reduce((sum, item) => sum + item.qty_requested, 0)} Unit)
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {data.items.length > 0 ? (
                                    <div className="rounded-md border overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead>Nama Barang</TableHead>
                                                    <TableHead className="text-center w-[130px]">Sisa Stok Gudang</TableHead>
                                                    <TableHead className="text-right w-[180px]">Jumlah Diajukan</TableHead>
                                                    <TableHead className="w-[60px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.items.map((item, idx) => {
                                                    const product = products.find((p) => p.id === item.product_id);
                                                    const stockQty = product ? getProductStock(product, data.warehouse_id) : 0;
                                                    const isMaxReached = item.qty_requested >= stockQty;

                                                    return (
                                                        <TableRow key={idx}>
                                                            <TableCell>
                                                                <div className="font-medium text-sm">{item.name}</div>
                                                                <div className="text-[11px] text-muted-foreground font-mono">
                                                                    {item.sku || item.code ? `SKU: ${item.sku || item.code}` : ''}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-center font-mono">
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-muted text-foreground">
                                                                    {stockQty} {item.symbol}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex items-center justify-end gap-1.5">
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-7 w-7 rounded-md"
                                                                        onClick={() => handleUpdateItemQty(item.product_id, item.qty_requested - 1)}
                                                                        title="Kurangi 1 unit"
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </Button>
                                                                    <Input
                                                                        type="number"
                                                                        min={1}
                                                                        max={stockQty}
                                                                        value={item.qty_requested}
                                                                        onChange={(e) => handleUpdateItemQty(item.product_id, parseInt(e.target.value) || 1)}
                                                                        className="h-7 w-16 text-center font-mono font-bold text-xs p-1 rounded-md text-indigo-600 dark:text-indigo-400"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="icon"
                                                                        disabled={isMaxReached}
                                                                        className="h-7 w-7 rounded-md"
                                                                        onClick={() => handleUpdateItemQty(item.product_id, item.qty_requested + 1)}
                                                                        title={isMaxReached ? 'Maksimal stok tercapai' : 'Tambah 1 unit'}
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </Button>
                                                                    <span className="text-xs font-medium text-muted-foreground w-7 text-left pl-1">
                                                                        {item.symbol}
                                                                    </span>
                                                                </div>
                                                                {isMaxReached && (
                                                                    <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5 text-right">
                                                                        Maks. stok tercapai
                                                                    </div>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                                                    onClick={() => handleRemoveItem(idx)}
                                                                    title="Hapus barang ini"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                        <Box className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
                                        <p className="text-sm font-medium text-muted-foreground">Belum ada barang dimasukkan.</p>
                                        <p className="text-xs text-muted-foreground max-w-[280px] mx-auto mt-1">
                                            Pilih barang pada panel di sebelah kanan dan klik tombol <strong>+ Tambah</strong>.
                                        </p>
                                    </div>
                                )}
                                {errors.items && <p className="text-xs text-red-500 mt-2">{errors.items}</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column: Product Picker Panel (Search Box) */}
                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Package className="h-5 w-5 text-indigo-500" />
                                        <span>Katalog Barang Gudang</span>
                                    </CardTitle>
                                    {data.warehouse_id && (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                                            {availableProducts.length} Barang
                                        </span>
                                    )}
                                </div>
                                <CardDescription>Cari dan pilih barang yang memiliki stok di gudang sasaran.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                {!data.warehouse_id ? (
                                    <div className="p-6 text-center text-sm text-muted-foreground border rounded-lg bg-muted/20">
                                        Silakan pilih <strong>Target Gudang Tujuan</strong> terlebih dahulu pada form di sebelah kiri.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                            <Input
                                                type="text"
                                                placeholder="Ketik nama, kode, atau SKU..."
                                                value={productSearch}
                                                onChange={(e) => setProductSearch(e.target.value)}
                                                className="pl-9 pr-8 h-9 text-xs"
                                            />
                                            {productSearch && (
                                                <button
                                                    type="button"
                                                    onClick={() => setProductSearch('')}
                                                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Scrollable Product List Box */}
                                        <div className="border rounded-lg max-h-[360px] overflow-y-auto divide-y">
                                            {availableProducts.length === 0 ? (
                                                <div className="p-6 text-center text-xs text-muted-foreground">
                                                    Tidak ada barang yang memiliki stok pada gudang ini.
                                                </div>
                                            ) : filteredProducts.length === 0 ? (
                                                <div className="p-6 text-center text-xs text-muted-foreground">
                                                    Tidak ditemukan barang dengan kata kunci &quot;{productSearch}&quot;
                                                </div>
                                            ) : (
                                                filteredProducts.map((product) => {
                                                    const stockQty = getProductStock(product, data.warehouse_id);
                                                    const itemInCart = data.items.find((i) => i.product_id === product.id);
                                                    const isMaxReached = itemInCart && itemInCart.qty_requested >= stockQty;

                                                    return (
                                                        <div
                                                            key={product.id}
                                                            className={`p-3 space-y-2 transition-colors ${
                                                                itemInCart ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : 'hover:bg-muted/40'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <div className="font-semibold text-xs text-foreground">{product.name}</div>
                                                                    <div className="text-[11px] text-muted-foreground font-mono">
                                                                        {product.category?.name ? `${product.category.name} • ` : ''}
                                                                        {product.code || product.sku}
                                                                    </div>
                                                                </div>
                                                                <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                                    Stok: {stockQty} {product.unit?.symbol || 'pcs'}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center justify-between pt-1">
                                                                {itemInCart ? (
                                                                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                                                        <Check className="h-3 w-3" />
                                                                        {itemInCart.qty_requested} {product.unit?.symbol || 'pcs'} dipilih
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[11px] text-muted-foreground">
                                                                        Tersedia {stockQty} unit
                                                                    </span>
                                                                )}

                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    disabled={isMaxReached}
                                                                    onClick={() => handleAddProduct(product, 1)}
                                                                    className="h-7 text-xs font-bold gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                    <span>{itemInCart ? 'Tambah Lagi' : 'Pilih'}</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-3 border-t">
                                    <Button
                                        type="submit"
                                        disabled={processing || data.items.length === 0}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>{processing ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    );
}

RequestCreate.layout = {
    breadcrumbs: [
        {
            title: 'Pengajuan Barang',
            href: '/requests',
        },
        {
            title: 'Buat Pengajuan',
            href: '/requests/create',
        },
    ],
};
