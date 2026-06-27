import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Warehouse, Product } from '@/types';

type Props = {
    fromWarehouses: Warehouse[];
    toWarehouses: Warehouse[];
    products: Product[];
};

export default function MutationCreate({ fromWarehouses, toWarehouses, products }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        from_warehouse_id: '',
        to_warehouse_id: '',
        product_id: '',
        qty: 1,
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.from_warehouse_id === data.to_warehouse_id) {
            toast.error('Gudang asal dan tujuan tidak boleh sama.');
            return;
        }

        post('/mutations');
    };

    return (
        <>
            <Head title="Ajukan Mutasi Barang" />
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <Link href="/mutations">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Ajukan Mutasi Barang</h1>
                        <p className="text-muted-foreground">Buat pengajuan pemindahan barang dari satu gudang ke gudang lainnya secara internal.</p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowRightLeft className="h-5 w-5 text-indigo-500" />
                                    <span>Formulir Mutasi Stok</span>
                                </CardTitle>
                                <CardDescription>Isi detail gudang asal, tujuan, dan kuantitas barang yang akan dimutasi.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="from_warehouse_id">Gudang Asal</Label>
                                        <Select
                                            value={data.from_warehouse_id}
                                            onValueChange={(val) => setData('from_warehouse_id', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Asal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {fromWarehouses.map((w) => (
                                                    <SelectItem key={w.id} value={String(w.id)}>
                                                        {w.name} ({w.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.from_warehouse_id && <p className="text-xs text-red-500">{errors.from_warehouse_id}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="to_warehouse_id">Gudang Tujuan</Label>
                                        <Select
                                            value={data.to_warehouse_id}
                                            onValueChange={(val) => setData('to_warehouse_id', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Tujuan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {toWarehouses.map((w) => (
                                                    <SelectItem key={w.id} value={String(w.id)}>
                                                        {w.name} ({w.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.to_warehouse_id && <p className="text-xs text-red-500">{errors.to_warehouse_id}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2 col-span-2">
                                        <Label htmlFor="product_id">Barang / Produk</Label>
                                        <Select
                                            value={data.product_id}
                                            onValueChange={(val) => setData('product_id', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Barang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((p) => (
                                                    <SelectItem key={p.id} value={String(p.id)}>
                                                        {p.name} ({p.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.product_id && <p className="text-xs text-red-500">{errors.product_id}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="qty">Jumlah Mutasi</Label>
                                        <Input
                                            id="qty"
                                            type="number"
                                            min={1}
                                            value={data.qty}
                                            onChange={(e) => setData('qty', parseInt(e.target.value) || 1)}
                                            required
                                        />
                                        {errors.qty && <p className="text-xs text-red-500">{errors.qty}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="reason">Alasan Mutasi / Keperluan</Label>
                                    <Textarea
                                        id="reason"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        placeholder="Tulis alasan memindahkan barang..."
                                        rows={3}
                                    />
                                    {errors.reason && <p className="text-xs text-red-500">{errors.reason}</p>}
                                </div>

                                <div className="pt-4 border-t flex justify-end gap-3">
                                    <Button asChild variant="outline" disabled={processing}>
                                        <Link href="/mutations">Batal</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">
                                        Kirim Pengajuan Mutasi
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    );
}

MutationCreate.layout = {
    breadcrumbs: [
        {
            title: 'Mutasi Stok',
            href: '/mutations',
        },
        {
            title: 'Ajukan Mutasi',
            href: '/mutations/create',
        },
    ],
};
