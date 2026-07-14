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
    bast_number: string;
    unit_id?: string;
    category_id?: string;
    brand?: string;
    packaging?: string;
    brand_packaging?: string;
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
            {
                product_id: 0,
                qty: 1,
                sku: '',
                code: '',
                name: '',
                symbol: '',
                bast_number: '',
                unit_id: '',
                category_id: '',
                brand: '',
                packaging: '',
                brand_packaging: ''
            }
        ] as FormItem[],
    });

    // Autocomplete states
    const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);

    const handleProductSearchChange = (idx: number, query: string) => {
        setData('items', data.items.map((item, i) =>
            i === idx ? {
                ...item,
                name: query,
                product_id: 0,
                sku: '',
                code: '',
                symbol: '',
                unit_id: '',
                category_id: '',
                brand: '',
                packaging: '',
                brand_packaging: ''
            } : item
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
                focusCell(idx, 'unit_id');
            }
        }
    };

    const handleSelectProduct = (idx: number, product: Product) => {
        const brandAndPkg = [product.brand, product.packaging].filter(Boolean).join(' / ');
        setData('items', data.items.map((item, i) =>
            i === idx ? {
                product_id: product.id,
                name: product.name,
                sku: product.sku,
                code: product.code,
                symbol: product.unit?.symbol || 'pcs',
                qty: item.qty || 1,
                bast_number: item.bast_number,
                unit_id: String(product.unit_id),
                category_id: String(product.category_id),
                brand: product.brand || '',
                packaging: product.packaging || '',
                brand_packaging: brandAndPkg || '-'
            } : item
        ));
        setActiveRowIndex(null);
        focusCell(idx, 'bast_number');
    };

    const handleQtyChange = (idx: number, qty: number) => {
        setData('items', data.items.map((item, i) =>
            i === idx ? { ...item, qty } : item
        ));
    };

    const handleAddRow = () => {
        setData('items', [
            ...data.items,
            {
                product_id: 0,
                qty: 1,
                sku: '',
                code: '',
                name: '',
                symbol: '',
                bast_number: '',
                unit_id: '',
                category_id: '',
                brand: '',
                packaging: '',
                brand_packaging: ''
            }
        ]);
    };

    const handleRemoveRow = (idx: number) => {
        if (data.items.length === 1) {
            setData('items', [
                {
                    product_id: 0,
                    qty: 1,
                    sku: '',
                    code: '',
                    name: '',
                    symbol: '',
                    bast_number: '',
                    unit_id: '',
                    category_id: '',
                    brand: '',
                    packaging: '',
                    brand_packaging: ''
                }
            ]);
        } else {
            setData('items', data.items.filter((_, i) => i !== idx));
        }
    };

    const handleBastNumberChange = (idx: number, bast_number: string) => {
        setData('items', data.items.map((item, i) =>
            i === idx ? { ...item, bast_number } : item
        ));
    };

    const handleItemFieldChange = (idx: number, field: string, value: string) => {
        setData('items', data.items.map((item, i) =>
            i === idx ? { ...item, [field]: value } : item
        ));
    };

    const getFocusableFields = (item: FormItem) => {
        if (item.product_id === 0) {
            return ['name', 'unit_id', 'bast_number', 'category_id', 'brand', 'packaging', 'qty'];
        } else {
            return ['name', 'bast_number', 'qty'];
        }
    };

    const focusCell = (rowIdx: number, field: string) => {
        let elementId = '';
        if (field === 'name') elementId = `product-input-${rowIdx}`;
        else if (field === 'unit_id') elementId = `unit-select-${rowIdx}`;
        else if (field === 'bast_number') elementId = `bast-input-${rowIdx}`;
        else if (field === 'category_id') elementId = `category-select-${rowIdx}`;
        else if (field === 'brand') elementId = `brand-input-${rowIdx}`;
        else if (field === 'packaging') elementId = `packaging-input-${rowIdx}`;
        else if (field === 'qty') elementId = `qty-input-${rowIdx}`;

        setTimeout(() => {
            const el = document.getElementById(elementId);
            if (el) el.focus();
        }, 50);
    };

    const handleGridKeyDown = (idx: number, field: string, e: React.KeyboardEvent<HTMLElement>) => {
        // Ctrl + V: Focus product input to paste barcode
        if (e.ctrlKey && e.key.toLowerCase() === 'v') {
            if (field !== 'name') {
                e.preventDefault();
                focusCell(idx, 'name');
            }
            return;
        }

        // Ins: Baris baru
        if (e.key === 'Insert') {
            e.preventDefault();
            handleAddRow();
            return;
        }

        // Del: Hapus baris
        if (e.key === 'Delete') {
            e.preventDefault();
            handleRemoveRow(idx);
            return;
        }

        // Esc: Close suggestions
        if (e.key === 'Escape') {
            setActiveRowIndex(null);
            return;
        }

        const fields = getFocusableFields(data.items[idx]);
        const fieldIdx = fields.indexOf(field);

        // Tab or Enter: Next cell
        if (e.key === 'Tab' || e.key === 'Enter') {
            const suggestions = productList.filter((p) =>
                p.name.toLowerCase().includes(data.items[idx].name.toLowerCase()) ||
                p.code.toLowerCase().includes(data.items[idx].name.toLowerCase()) ||
                p.sku.toLowerCase().includes(data.items[idx].name.toLowerCase())
            );

            // For product search, if suggestions are open and they press Enter, don't trigger cell navigation
            if (field === 'name' && activeRowIndex === idx && suggestions.length > 0 && e.key === 'Enter') {
                return; // Let handleProductKeyDown handle selection
            }

            e.preventDefault();
            if (e.shiftKey) {
                // Move backward
                if (fieldIdx > 0) {
                    focusCell(idx, fields[fieldIdx - 1]);
                } else if (idx > 0) {
                    const prevFields = getFocusableFields(data.items[idx - 1]);
                    focusCell(idx - 1, prevFields[prevFields.length - 1]);
                }
            } else {
                // Move forward
                if (fieldIdx < fields.length - 1) {
                    focusCell(idx, fields[fieldIdx + 1]);
                } else {
                    if (idx === data.items.length - 1) {
                        handleAddRow();
                    } else {
                        focusCell(idx + 1, 'name');
                    }
                }
            }
            return;
        }

        // Arrow keys navigation
        if (e.key === 'ArrowUp' && idx > 0) {
            e.preventDefault();
            const prevFields = getFocusableFields(data.items[idx - 1]);
            if (prevFields.includes(field)) {
                focusCell(idx - 1, field);
            } else {
                focusCell(idx - 1, 'name');
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (idx === data.items.length - 1) {
                handleAddRow();
            } else {
                const nextFields = getFocusableFields(data.items[idx + 1]);
                if (nextFields.includes(field)) {
                    focusCell(idx + 1, field);
                } else {
                    focusCell(idx + 1, 'name');
                }
            }
            return;
        }

        // Arrow left / right
        const isSelect = e.currentTarget.tagName.toLowerCase() === 'select';
        const inputEl = e.currentTarget as HTMLInputElement;

        if (e.key === 'ArrowLeft') {
            if (isSelect || inputEl.selectionStart === 0) {
                e.preventDefault();
                if (fieldIdx > 0) {
                    focusCell(idx, fields[fieldIdx - 1]);
                } else if (idx > 0) {
                    const prevFields = getFocusableFields(data.items[idx - 1]);
                    focusCell(idx - 1, prevFields[prevFields.length - 1]);
                }
            }
            return;
        }
        if (e.key === 'ArrowRight') {
            if (isSelect || inputEl.selectionStart === inputEl.value.length) {
                e.preventDefault();
                if (fieldIdx < fields.length - 1) {
                    focusCell(idx, fields[fieldIdx + 1]);
                } else if (idx < data.items.length - 1) {
                    focusCell(idx + 1, 'name');
                }
            }
            return;
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
        const validItems = data.items.filter(item => item.name.trim().length > 0);

        if (validItems.length === 0) {
            toast.error('Tambahkan minimal 1 barang yang valid ke dalam daftar.');
            return;
        }

        // Validate that if product_id is 0, they selected category and unit
        for (let i = 0; i < validItems.length; i++) {
            const item = validItems[i];
            if (item.product_id === 0) {
                if (!item.unit_id) {
                    toast.error(`Baris #${i + 1}: Satuan wajib dipilih untuk barang baru.`);
                    return;
                }
                if (!item.category_id) {
                    toast.error(`Baris #${i + 1}: Kategori wajib dipilih untuk barang baru.`);
                    return;
                }
            }
        }

        if (!data.supplier_id) {
            toast.error('Supplier wajib dipilih.');
            return;
        }

        if (!data.warehouse_id) {
            toast.error('Gudang penerima wajib dipilih.');
            return;
        }

        // Parse brand_packaging (split by '/') for new products
        const processedItems = validItems.map(item => {
            if (item.product_id === 0 && item.brand_packaging) {
                const parts = item.brand_packaging.split('/').map(p => p.trim());
                return {
                    ...item,
                    brand: parts[0] || '',
                    packaging: parts[1] || ''
                };
            }
            return item;
        });

        router.post('/inbound', {
            ...data,
            items: processedItems
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
                            {/* Keyboard Shortcuts Legend Bar */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3 px-4 mb-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400">
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-zinc-950 font-mono shadow-sm font-semibold">Tab</kbd>
                                    <span>/</span>
                                    <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-zinc-950 font-mono shadow-sm font-semibold">Enter</kbd>
                                    <span className="text-muted-foreground ml-1">Selanjutnya</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-zinc-950 font-mono shadow-sm font-semibold">Shift</kbd>
                                    <span>+</span>
                                    <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-zinc-950 font-mono shadow-sm font-semibold">Tab</kbd>
                                    <span className="text-muted-foreground ml-1">Sebelumnya</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-zinc-950 font-mono shadow-sm font-semibold">Esc</kbd>
                                    <span className="text-muted-foreground ml-1">Seleksi sel</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold font-mono text-sm">← → ↑ ↓</span>
                                    <span className="text-muted-foreground ml-1">Navigasi</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-zinc-950 font-mono shadow-sm font-semibold">Ins</kbd>
                                    <span className="text-muted-foreground ml-1">Baris baru</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-zinc-950 font-mono shadow-sm font-semibold">Del</kbd>
                                    <span className="text-muted-foreground ml-1">Hapus baris</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-zinc-950 font-mono shadow-sm font-semibold">Ctrl</kbd>
                                    <span>+</span>
                                    <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-zinc-950 font-mono shadow-sm font-semibold">V</kbd>
                                    <span className="text-muted-foreground ml-1">Tempel barcode</span>
                                </div>
                                <div className="text-slate-400 dark:text-zinc-500 italic">
                                    Ketuk karakter untuk edit sel
                                </div>
                            </div>

                            <div className="rounded-md border overflow-visible relative w-full">
                                <table className="w-full caption-bottom text-sm">
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-12 text-center">No.</TableHead>
                                            <TableHead className="w-1/3">Barang / Produk</TableHead>
                                            <TableHead className="w-20 text-center">Satuan</TableHead>
                                            <TableHead className="w-44">No. BAST</TableHead>
                                            <TableHead className="w-32">Kategori</TableHead>
                                            <TableHead className="w-40">Merk / Kemasan</TableHead>
                                            <TableHead className="w-28 text-center">Jumlah Masuk</TableHead>
                                            <TableHead className="w-12 text-center"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.items.map((item, idx) => {
                                            const suggestions = productList.filter((p) =>
                                                p.name.toLowerCase().includes(item.name.toLowerCase()) ||
                                                p.code.toLowerCase().includes(item.name.toLowerCase()) ||
                                                p.sku.toLowerCase().includes(item.name.toLowerCase())
                                            );

                                            const selectedProduct = productList.find(p => p.id === item.product_id);
                                            const categoryName = selectedProduct?.category?.name || '-';
                                            const brandAndPkg = selectedProduct
                                                ? [selectedProduct.brand, selectedProduct.packaging].filter(Boolean).join(' / ') || '-'
                                                : '-';

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
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium">{p.name}</span>
                                                                            {(p.brand || p.packaging) && (
                                                                                <span className="text-[10px] opacity-75">
                                                                                    {p.brand && <span>Merk: {p.brand}</span>}
                                                                                    {p.brand && p.packaging && <span className="mx-1">&bull;</span>}
                                                                                    {p.packaging && <span>Kemasan: {p.packaging}</span>}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <span className="font-mono text-xs opacity-80">{p.code}</span>
                                                                    </div>
                                                                ))}
                                                                
                                                                {/* Option to create a new product inline */}
                                                                {item.name.trim().length > 0 && suggestions.length === 0 && (
                                                                    <div className="flex items-center gap-1.5 px-2.5 py-2.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10 font-semibold border-t mt-1">
                                                                        <span>✨ Barang baru terdeteksi. Tekan Tab/Enter untuk mengisi detail barang.</span>
                                                                    </div>
                                                                )}
                                                                
                                                                {suggestions.length === 0 && item.name.trim().length === 0 && (
                                                                    <p className="text-xs text-muted-foreground text-center py-4">Mulai mengetik nama barang...</p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="p-2 text-center">
                                                        {item.product_id > 0 ? (
                                                            <span className="font-semibold text-muted-foreground uppercase">{item.symbol || 'pcs'}</span>
                                                        ) : (
                                                            <select
                                                                id={`unit-select-${idx}`}
                                                                value={item.unit_id || ''}
                                                                onChange={(e) => {
                                                                    const u = units.find(unit => String(unit.id) === e.target.value);
                                                                    setData('items', data.items.map((it, i) =>
                                                                        i === idx ? { ...it, unit_id: e.target.value, symbol: u?.symbol || '' } : it
                                                                    ));
                                                                }}
                                                                onKeyDown={(e) => handleGridKeyDown(idx, 'unit_id', e as any)}
                                                                className="w-24 h-9 px-2 rounded-md border bg-background font-medium text-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                                            >
                                                                <option value="">Satuan</option>
                                                                {units.map((u) => (
                                                                    <option key={u.id} value={String(u.id)}>{u.symbol}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        <Input
                                                            id={`bast-input-${idx}`}
                                                            type="text"
                                                            placeholder="No. BAST..."
                                                            value={item.bast_number}
                                                            onChange={(e) => handleBastNumberChange(idx, e.target.value)}
                                                            onKeyDown={(e) => handleGridKeyDown(idx, 'bast_number', e)}
                                                            className="w-full h-9 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 font-medium"
                                                            autoComplete="off"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        {item.product_id > 0 ? (
                                                            <span className="text-muted-foreground text-sm">{categoryName}</span>
                                                        ) : (
                                                            <select
                                                                id={`category-select-${idx}`}
                                                                value={item.category_id || ''}
                                                                onChange={(e) => handleItemFieldChange(idx, 'category_id', e.target.value)}
                                                                onKeyDown={(e) => handleGridKeyDown(idx, 'category_id', e as any)}
                                                                className="w-32 h-9 px-2 rounded-md border bg-background font-medium text-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                                            >
                                                                <option value="">Kategori</option>
                                                                {categories.map((c) => (
                                                                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        {item.product_id > 0 ? (
                                                            <span className="text-muted-foreground text-xs font-mono">{brandAndPkg}</span>
                                                        ) : (
                                                            <Input
                                                                id={`brand-packaging-input-${idx}`}
                                                                type="text"
                                                                placeholder="Merk / Kemasan..."
                                                                value={item.brand_packaging || ''}
                                                                onChange={(e) => handleItemFieldChange(idx, 'brand_packaging', e.target.value)}
                                                                onKeyDown={(e) => handleGridKeyDown(idx, 'brand_packaging', e)}
                                                                className="w-full h-9 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-xs font-mono"
                                                                autoComplete="off"
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Input
                                                                id={`qty-input-${idx}`}
                                                                type="number"
                                                                min={1}
                                                                value={item.qty}
                                                                onChange={(e) => handleQtyChange(idx, parseInt(e.target.value) || 1)}
                                                                onKeyDown={(e) => handleGridKeyDown(idx, 'qty', e)}
                                                                className="w-24 h-9 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-center font-mono font-semibold"
                                                            />
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
