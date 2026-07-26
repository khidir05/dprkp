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
import { ArrowLeft, Plus, Trash2, Box, Package } from 'lucide-react';
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
};

export default function RequestCreate({ warehouses, products }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        warehouse_id: '',
        notes: '',
        items: [] as FormItem[],
    });

    // Temp state for item selection
    const [selectedProductId, setSelectedProductId] = useState('');
    const [itemQty, setItemQty] = useState(1);

    const getProductStock = (product: Product, warehouseId: string) => {
        if (!warehouseId) return 0;
        const stock = product.stocks?.find((s: any) => String(s.warehouse_id) === String(warehouseId));
        return stock ? stock.qty : 0;
    };

    const filteredProducts = products.filter((p) => {
        if (!data.warehouse_id) return false;
        const stockQty = getProductStock(p, data.warehouse_id);
        return stockQty > 0;
    });

    const handleAddItem = () => {
        if (!selectedProductId) {
            toast.error('Pilih barang terlebih dahulu.');
            return;
        }
        if (itemQty < 1) {
            toast.error('Jumlah barang minimal 1.');
            return;
        }

        const product = products.find((p) => p.id === parseInt(selectedProductId));
        if (!product) return;

        const stockQty = getProductStock(product, data.warehouse_id);
        if (itemQty > stockQty) {
            toast.error(`Kuantitas yang diminta (${itemQty}) melebihi stok yang tersedia (${stockQty}).`);
            return;
        }

        // Check if already in list
        const exists = data.items.find((item) => item.product_id === product.id);
        if (exists) {
            const newQty = exists.qty_requested + itemQty;
            if (newQty > stockQty) {
                toast.error(`Kuantitas total yang diajukan (${newQty}) melebihi stok yang tersedia (${stockQty}).`);
                return;
            }
            setData('items', data.items.map((item) =>
                item.product_id === product.id
                    ? { ...item, qty_requested: newQty }
                    : item
            ));
            toast.success(`Jumlah pengajuan "${product.name}" berhasil diupdate.`);
        } else {
            const newItem: FormItem = {
                product_id: product.id,
                qty_requested: itemQty,
                sku: product.sku,
                code: product.code,
                name: product.name,
                symbol: product.unit?.symbol || 'pcs',
            };
            setData('items', [...data.items, newItem]);
            toast.success(`Barang "${product.name}" ditambahkan ke pengajuan.`);
        }

        // Reset temp item states
        setSelectedProductId('');
        setItemQty(1);
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
                                                     setSelectedProductId('');
                                                     toast.info('Daftar barang pengajuan telah dikosongkan.');
                                                 }
                                             } else {
                                                 setData('warehouse_id', val);
                                                 setSelectedProductId('');
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
                                <CardTitle>Daftar Pengajuan Barang</CardTitle>
                                <CardDescription>Daftar item barang yang sedang diajukan.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {data.items.length > 0 ? (
                                    <div className="rounded-md border overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead>Nama Barang</TableHead>
                                                    <TableHead className="text-right">Jumlah Diajukan</TableHead>
                                                    <TableHead className="w-[80px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.items.map((item, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium">{item.name}</TableCell>
                                                        <TableCell className="text-right font-mono font-semibold">
                                                            {item.qty_requested} {item.symbol}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                onClick={() => handleRemoveItem(idx)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                        <Box className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
                                        <p className="text-sm font-medium text-muted-foreground">Belum ada barang dimasukkan.</p>
                                        <p className="text-xs text-muted-foreground max-w-[250px] mx-auto mt-1">
                                            Pilih barang di panel kanan dan tentukan jumlah yang diajukan.
                                        </p>
                                    </div>
                                )}
                                {errors.items && <p className="text-xs text-red-500 mt-2">{errors.items}</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column: Add Item form panel */}
                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-indigo-500" />
                                    <span>Pilih Barang</span>
                                </CardTitle>
                                <CardDescription>Cari dan tentukan kuantitas barang yang diminta.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="product_select">Barang / Produk</Label>
                                    <Select
                                        value={selectedProductId}
                                        onValueChange={setSelectedProductId}
                                        disabled={!data.warehouse_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={data.warehouse_id ? "Pilih Produk" : "Pilih Gudang Sasaran terlebih dahulu"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredProducts.map((p) => {
                                                const stockQty = getProductStock(p, data.warehouse_id);
                                                return (
                                                    <SelectItem key={p.id} value={String(p.id)}>
                                                        {p.name} - Kategori: {p.category?.name || 'Umum'} (Stok: {stockQty} {p.unit?.symbol || 'pcs'})
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="qty_input">Jumlah Diminta</Label>
                                    <Input
                                        id="qty_input"
                                        type="number"
                                        min={1}
                                        value={itemQty}
                                        onChange={(e) => setItemQty(parseInt(e.target.value) || 1)}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="w-full gap-1.5"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah Barang</span>
                                </Button>

                                <div className="pt-4 border-t mt-6 flex justify-end gap-3">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Kirim Pengajuan
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
