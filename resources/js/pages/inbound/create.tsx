import { useState, useEffect } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Trash2, Box, Package } from 'lucide-react';
import { toast } from 'sonner';
import type { Supplier, Warehouse, Product } from '@/types';

type CategoryType = {
    id: number;
    name: string;
};

type UnitType = {
    id: number;
    name: string;
    symbol: string;
};

type Props = {
    suppliers: Supplier[];
    warehouses: Warehouse[];
    products: Product[];
    categories: CategoryType[];
    units: UnitType[];
    autoTransactionNumber: string;
};

type FormItem = {
    product_id: number;
    qty: number;
    // Helper fields for UI
    sku: string;
    code: string;
    name: string;
    symbol: string;
};

export default function InboundCreate({ suppliers, warehouses, products, categories, units, autoTransactionNumber }: Props) {
    const today = new Date().toISOString().split('T')[0];

    const [productList, setProductList] = useState<Product[]>(products);

    const { data, setData, processing, errors } = useForm({
        supplier_id: '',
        warehouse_id: warehouses.length === 1 ? String(warehouses[0].id) : '',
        transaction_number: autoTransactionNumber,
        reference_document: '',
        transaction_date: today,
        notes: '',
        items: [
            { product_id: 0, qty: 1, sku: '', code: '', name: '', symbol: '' }
        ] as FormItem[],
    });

    // Autocomplete states
    const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
    const [inlineProductRowIdx, setInlineProductRowIdx] = useState<number | null>(null);

    // Modal state for creating new product
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        sku: '',
        code: '',
        category_id: '',
        unit_id: '',
        description: '',
        minimum_stock: '0',
    });
    const [productErrors, setProductErrors] = useState<any>({});
    const [savingProduct, setSavingProduct] = useState(false);

    const openProductModal = () => {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const autoSKU = 'SKU-' + Date.now().toString().slice(-6) + '-' + rand;
        const autoCode = 'PRD-' + Date.now().toString().slice(-6) + '-' + rand;

        setNewProduct({
            name: '',
            sku: autoSKU,
            code: autoCode,
            category_id: '',
            unit_id: '',
            description: '',
            minimum_stock: '0',
        });
        setProductErrors({});
        setIsProductModalOpen(true);
    };

    const handleCreateNewProductInline = (idx: number, name: string) => {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const autoSKU = 'SKU-' + Date.now().toString().slice(-6) + '-' + rand;
        const autoCode = 'PRD-' + Date.now().toString().slice(-6) + '-' + rand;

        setNewProduct({
            name: name,
            sku: autoSKU,
            code: autoCode,
            category_id: '',
            unit_id: '',
            description: '',
            minimum_stock: '0',
        });
        setProductErrors({});
        setInlineProductRowIdx(idx);
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProduct(true);
        setProductErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const response = await fetch('/products', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(newProduct)
            });

            const responseData = await response.json();

            if (response.ok && responseData.success) {
                const createdProduct = responseData.product;
                setProductList(prev => [...prev, createdProduct]);
                
                if (inlineProductRowIdx !== null) {
                    handleSelectProduct(inlineProductRowIdx, createdProduct);
                    setInlineProductRowIdx(null);
                }
                
                toast.success('Produk baru berhasil dibuat!');
                setIsProductModalOpen(false);
            } else if (responseData.errors) {
                setProductErrors(responseData.errors);
                toast.error('Gagal membuat produk. Silakan periksa kembali form.');
            } else {
                toast.error(responseData.message || 'Terjadi kesalahan saat menyimpan produk.');
            }
        } catch (error: any) {
            toast.error('Terjadi kesalahan koneksi saat menyimpan produk.');
        } finally {
            setSavingProduct(false);
        }
    };

    const handleProductSearchChange = (idx: number, query: string) => {
        setData('items', data.items.map((item, i) =>
            i === idx ? { ...item, name: query, product_id: 0, sku: '', code: '', symbol: '' } : item
        ));
    };

    const handleProductKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = data.items[idx].name;
            const suggestions = productList.filter((p) =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.code.toLowerCase().includes(query.toLowerCase()) ||
                p.sku.toLowerCase().includes(query.toLowerCase())
            );

            if (suggestions.length > 0) {
                handleSelectProduct(idx, suggestions[0]);
            } else if (query.trim().length > 0) {
                handleCreateNewProductInline(idx, query);
            }
        }
    };

    const handleSelectProduct = (idx: number, product: Product) => {
        setData('items', data.items.map((item, i) =>
            i === idx ? {
                product_id: product.id,
                name: product.name,
                sku: product.sku,
                code: product.code,
                symbol: product.unit?.symbol || 'pcs',
                qty: item.qty || 1
            } : item
        ));
        setActiveRowIndex(null);
        // Automatically focus the quantity input of the current row
        setTimeout(() => {
            document.getElementById(`qty-input-${idx}`)?.focus();
        }, 50);
    };

    const handleQtyChange = (idx: number, qty: number) => {
        setData('items', data.items.map((item, i) =>
            i === idx ? { ...item, qty } : item
        ));
    };

    const handleAddRow = () => {
        setData('items', [
            ...data.items,
            { product_id: 0, qty: 1, sku: '', code: '', name: '', symbol: '' }
        ]);
    };

    const handleRemoveRow = (idx: number) => {
        if (data.items.length === 1) {
            setData('items', [
                { product_id: 0, qty: 1, sku: '', code: '', name: '', symbol: '' }
            ]);
        } else {
            setData('items', data.items.filter((_, i) => i !== idx));
        }
    };

    const handleQtyKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (idx === data.items.length - 1) {
                handleAddRow();
            } else {
                document.getElementById(`product-input-${idx + 1}`)?.focus();
            }
        }
    };

    // Auto-focus new row's product input
    useEffect(() => {
        const lastIdx = data.items.length - 1;
        if (lastIdx > 0) {
            // Only auto-focus if it was added manually (i.e. length is greater than initial 1)
            document.getElementById(`product-input-${lastIdx}`)?.focus();
        }
    }, [data.items.length]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Filter out empty rows
        const validItems = data.items.filter(item => item.product_id > 0);

        if (validItems.length === 0) {
            toast.error('Tambahkan minimal 1 barang yang valid ke dalam daftar.');
            return;
        }

        if (!data.supplier_id) {
            toast.error('Supplier wajib dipilih.');
            return;
        }

        if (!data.warehouse_id) {
            toast.error('Gudang penerima wajib dipilih.');
            return;
        }

        router.post('/inbound', {
            ...data,
            items: validItems
        });
    };

    return (
        <>
            <Head title="Catat Barang Masuk" />
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <Link href="/inbound">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Catat Barang Masuk</h1>
                        <p className="text-muted-foreground">Input pasokan barang masuk dari supplier ke gudang tertentu dengan sistem tabel spreadsheet.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Top Card: General Information */}
                    <Card>
                        <CardHeader className="bg-muted/30">
                            <CardTitle>Informasi Transaksi</CardTitle>
                            <CardDescription>Isi detail pengiriman dari supplier.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="supplier_id">Supplier Pemasok</Label>
                                <Select
                                    value={data.supplier_id}
                                    onValueChange={(val) => setData('supplier_id', val)}
                                >
                                    <SelectTrigger id="supplier_id">
                                        <SelectValue placeholder="Pilih Supplier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.supplier_id && <p className="text-xs text-red-500">{errors.supplier_id}</p>}
                            </div>

                            {warehouses.length > 1 ? (
                                <div className="grid gap-2">
                                    <Label htmlFor="warehouse_id">Gudang Penerima</Label>
                                    <Select
                                        value={data.warehouse_id}
                                        onValueChange={(val) => setData('warehouse_id', val)}
                                    >
                                        <SelectTrigger id="warehouse_id">
                                            <SelectValue placeholder="Pilih Gudang Target" />
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
                            ) : (
                                <div className="grid gap-2">
                                    <Label>Gudang Penerima</Label>
                                    <div className="text-sm font-semibold bg-slate-50 dark:bg-zinc-800 p-2.5 rounded-lg border text-muted-foreground">
                                        {warehouses[0]?.name} ({warehouses[0]?.code})
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="transaction_number">No. Transaksi</Label>
                                <Input
                                    id="transaction_number"
                                    value={data.transaction_number}
                                    onChange={(e) => setData('transaction_number', e.target.value)}
                                    placeholder="Contoh: INB-20231010-0001"
                                    required
                                />
                                {errors.transaction_number && <p className="text-xs text-red-500">{errors.transaction_number}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="reference_document">No. Surat Jalan / Referensi</Label>
                                <Input
                                    id="reference_document"
                                    value={data.reference_document}
                                    onChange={(e) => setData('reference_document', e.target.value)}
                                    placeholder="Contoh: SJ-998822"
                                />
                                {errors.reference_document && <p className="text-xs text-red-500">{errors.reference_document}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="transaction_date">Tanggal Transaksi</Label>
                                <Input
                                    id="transaction_date"
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    required
                                />
                                {errors.transaction_date && <p className="text-xs text-red-500">{errors.transaction_date}</p>}
                            </div>

                            <div className="grid gap-2 md:col-span-3">
                                <Label htmlFor="notes">Catatan</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Tulis catatan jika ada..."
                                    rows={2}
                                />
                                {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Card: Spreadsheet Table */}
                    <Card>
                        <CardHeader className="bg-muted/30 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Daftar Barang Masuk</CardTitle>
                                <CardDescription>Masukkan nama produk, pilih dari saran, lalu isi jumlah. Tekan **Enter** di kolom jumlah untuk menambah baris baru.</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddRow}
                                className="gap-1.5"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Tambah Baris</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="rounded-md border overflow-visible relative w-full">
                                <table className="w-full caption-bottom text-sm">
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-12 text-center">No.</TableHead>
                                            <TableHead className="w-3/5">Barang / Produk</TableHead>
                                            <TableHead className="w-1/4">Jumlah Masuk</TableHead>
                                            <TableHead className="w-16 text-center"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.items.map((item, idx) => {
                                            const suggestions = productList.filter((p) =>
                                                p.name.toLowerCase().includes(item.name.toLowerCase()) ||
                                                p.code.toLowerCase().includes(item.name.toLowerCase()) ||
                                                p.sku.toLowerCase().includes(item.name.toLowerCase())
                                            );

                                            return (
                                                <TableRow key={idx} className="hover:bg-muted/10">
                                                    <TableCell className="text-center text-muted-foreground font-mono text-xs">
                                                        {idx + 1}
                                                    </TableCell>
                                                    <TableCell className="relative p-2">
                                                        <Input
                                                            id={`product-input-${idx}`}
                                                            type="text"
                                                            placeholder="Ketik nama atau kode barang..."
                                                            value={item.name}
                                                            onChange={(e) => handleProductSearchChange(idx, e.target.value)}
                                                            onFocus={() => setActiveRowIndex(idx)}
                                                            onBlur={() => setTimeout(() => {
                                                                if (activeRowIndex === idx) {
                                                                    setActiveRowIndex(null);
                                                                }
                                                            }, 250)}
                                                            className="w-full h-9 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 font-medium"
                                                            autoComplete="off"
                                                            onKeyDown={(e) => handleProductKeyDown(idx, e)}
                                                        />
                                                        
                                                        {/* Floating Autocomplete List */}
                                                        {activeRowIndex === idx && (
                                                            <div className="absolute left-2 right-2 mt-1 z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none max-h-[220px] overflow-y-auto p-1 animate-in fade-in-0 zoom-in-95">
                                                                {suggestions.slice(0, 10).map((p) => (
                                                                    <div
                                                                        key={p.id}
                                                                        onMouseDown={() => handleSelectProduct(idx, p)}
                                                                        className="flex justify-between items-center px-2.5 py-2 text-sm rounded-sm hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors"
                                                                    >
                                                                        <span className="font-medium">{p.name}</span>
                                                                        <span className="font-mono text-xs opacity-80">{p.code}</span>
                                                                    </div>
                                                                ))}
                                                                
                                                                {/* Option to create a new product inline */}
                                                                {item.name.trim().length > 0 && (
                                                                    <div
                                                                        onMouseDown={() => handleCreateNewProductInline(idx, item.name)}
                                                                        className="flex items-center gap-1.5 px-2.5 py-2.5 text-sm rounded-sm hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-400 font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer border-t mt-1"
                                                                    >
                                                                        <Plus className="h-4 w-4" />
                                                                        <span>Buat Barang Baru: "{item.name}"</span>
                                                                    </div>
                                                                )}
                                                                
                                                                {suggestions.length === 0 && item.name.trim().length === 0 && (
                                                                    <p className="text-xs text-muted-foreground text-center py-4">Mulai mengetik nama barang...</p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                id={`qty-input-${idx}`}
                                                                type="number"
                                                                min={1}
                                                                value={item.qty}
                                                                onChange={(e) => handleQtyChange(idx, parseInt(e.target.value) || 1)}
                                                                onKeyDown={(e) => handleQtyKeyDown(idx, e)}
                                                                className="w-24 h-9 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-center font-mono font-semibold"
                                                            />
                                                            <span className="text-xs text-muted-foreground font-semibold uppercase">{item.symbol || 'pcs'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center p-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleRemoveRow(idx)}
                                                            className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </table>
                            </div>

                            {errors.items && <p className="text-xs text-red-500 mt-2">{errors.items}</p>}

                            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-emerald-600 hover:bg-emerald-700 w-44 font-semibold"
                                >
                                    Simpan Transaksi
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>

            {/* Modal for creating a new product inline */}
            <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Buat Barang Baru</DialogTitle>
                        <DialogDescription>
                            Daftarkan barang baru secara cepat ke database master barang.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveProduct} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="new_sku">SKU</Label>
                                <Input
                                    id="new_sku"
                                    value={newProduct.sku}
                                    onChange={(e) => setNewProduct(prev => ({ ...prev, sku: e.target.value }))}
                                    required
                                />
                                {productErrors.sku && <p className="text-[10px] text-red-500">{productErrors.sku}</p>}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="new_code">Kode Barang</Label>
                                <Input
                                    id="new_code"
                                    value={newProduct.code}
                                    onChange={(e) => setNewProduct(prev => ({ ...prev, code: e.target.value }))}
                                    required
                                />
                                {productErrors.code && <p className="text-[10px] text-red-500">{productErrors.code}</p>}
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="new_name">Nama Barang</Label>
                            <Input
                                id="new_name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Contoh: Kertas HVS A4 80gr"
                                required
                            />
                            {productErrors.name && <p className="text-[10px] text-red-500">{productErrors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="new_category_id">Kategori</Label>
                                <Select
                                    value={newProduct.category_id}
                                    onValueChange={(val) => setNewProduct(prev => ({ ...prev, category_id: val }))}
                                >
                                    <SelectTrigger id="new_category_id">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {productErrors.category_id && <p className="text-[10px] text-red-500">{productErrors.category_id}</p>}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="new_unit_id">Satuan</Label>
                                <Select
                                    value={newProduct.unit_id}
                                    onValueChange={(val) => setNewProduct(prev => ({ ...prev, unit_id: val }))}
                                >
                                    <SelectTrigger id="new_unit_id">
                                        <SelectValue placeholder="Pilih Satuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name} ({u.symbol})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {productErrors.unit_id && <p className="text-[10px] text-red-500">{productErrors.unit_id}</p>}
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="new_minimum_stock">Stok Minimum</Label>
                            <Input
                                id="new_minimum_stock"
                                type="number"
                                min={0}
                                value={newProduct.minimum_stock}
                                onChange={(e) => setNewProduct(prev => ({ ...prev, minimum_stock: e.target.value }))}
                                required
                            />
                            {productErrors.minimum_stock && <p className="text-[10px] text-red-500">{productErrors.minimum_stock}</p>}
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="new_description">Deskripsi (Opsional)</Label>
                            <Textarea
                                id="new_description"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Spesifikasi atau deskripsi barang..."
                                rows={2}
                            />
                            {productErrors.description && <p className="text-[10px] text-red-500">{productErrors.description}</p>}
                        </div>

                        <DialogFooter className="pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)} disabled={savingProduct}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={savingProduct}>
                                {savingProduct ? 'Menyimpan...' : 'Simpan Produk'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

InboundCreate.layout = {
    breadcrumbs: [
        {
            title: 'Barang Masuk',
            href: '/inbound',
        },
        {
            title: 'Catat Baru',
            href: '/inbound/create',
        },
    ],
};
