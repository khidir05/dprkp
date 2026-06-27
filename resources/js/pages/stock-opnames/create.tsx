import { useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

type Warehouse = {
    id: number;
    name: string;
    code: string;
};

type ProductItem = {
    id: number;
    name: string;
    code: string;
    sku: string;
    unit: string;
    qty_system: number;
};

type Props = {
    warehouses: Warehouse[];
    selectedWarehouseId: number | null;
    products: ProductItem[];
};

export default function StockOpnameCreate({ warehouses, selectedWarehouseId, products }: Props) {
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        warehouse_id: selectedWarehouseId ? String(selectedWarehouseId) : '',
        opname_date: today,
        notes: '',
        items: [] as Array<{
            product_id: number;
            name: string;
            code: string;
            sku: string;
            unit: string;
            qty_system: number;
            qty_physical: number;
            notes: string;
        }>
    });

    // Populate items when products prop updates
    useEffect(() => {
        if (products.length > 0) {
            setData('items', products.map(p => ({
                product_id: p.id,
                name: p.name,
                code: p.code,
                sku: p.sku,
                unit: p.unit,
                qty_system: p.qty_system,
                qty_physical: p.qty_system, // default to system qty
                notes: ''
            })));
        } else {
            setData('items', []);
        }
    }, [products]);

    const handleWarehouseChange = (val: string) => {
        setData('warehouse_id', val);
        router.get('/stock-opnames/create', { warehouse_id: val }, {
            preserveState: false,
            preserveScroll: true
        });
    };

    const handleQtyPhysicalChange = (index: number, val: string) => {
        const parsedVal = val === '' ? 0 : parseInt(val, 10);
        if (isNaN(parsedVal)) return;

        const newItems = [...data.items];
        newItems[index].qty_physical = Math.max(0, parsedVal);
        setData('items', newItems);
    };

    const handleItemNotesChange = (index: number, val: string) => {
        const newItems = [...data.items];
        newItems[index].notes = val;
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock-opnames');
    };

    return (
        <>
            <Head title="Buat Opname Stok" />
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="icon" className="h-9 w-9">
                        <Link href="/stock-opnames">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Buat Opname Stok Baru</h1>
                        <p className="text-muted-foreground">Isi data fisik untuk menghitung selisih kuantitas barang.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Opname</CardTitle>
                            <CardDescription>Pilih gudang dan tanggal pelaksanaan opname.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="warehouse_id">Gudang</Label>
                                <Select 
                                    value={data.warehouse_id} 
                                    onValueChange={handleWarehouseChange}
                                >
                                    <SelectTrigger id="warehouse_id" className="h-10">
                                        <SelectValue placeholder="Pilih Gudang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map(wh => (
                                            <SelectItem key={wh.id} value={String(wh.id)}>
                                                {wh.name} ({wh.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.warehouse_id && <p className="text-sm text-red-600 font-medium">{errors.warehouse_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="opname_date">Tanggal Opname</Label>
                                <Input
                                    id="opname_date"
                                    type="date"
                                    value={data.opname_date}
                                    onChange={e => setData('opname_date', e.target.value)}
                                    className="h-10"
                                    required
                                />
                                {errors.opname_date && <p className="text-sm text-red-600 font-medium">{errors.opname_date}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="notes">Keterangan Tambahan (Opsional)</Label>
                                <Textarea
                                    id="notes"
                                    rows={3}
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Catatan umum mengenai stock opname ini..."
                                />
                                {errors.notes && <p className="text-sm text-red-600 font-medium">{errors.notes}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {data.warehouse_id && data.items.length === 0 && (
                        <Card className="border-amber-200 bg-amber-50/50">
                            <CardContent className="flex items-center gap-3 p-6 text-amber-800">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <div className="text-sm font-medium">
                                    Tidak ada barang aktif terdaftar di sistem. Daftarkan barang terlebih dahulu di Master Data.
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {data.items.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Barang & Kuantitas Fisik</CardTitle>
                                <CardDescription>Bandingkan stok tercatat di sistem dengan jumlah riil di gudang.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse text-left">
                                        <thead>
                                            <tr className="border-b bg-muted/40 font-medium text-neutral-600">
                                                <th className="p-4 w-1/3">Barang (SKU / Kode)</th>
                                                <th className="p-4 text-center">Stok Sistem</th>
                                                <th className="p-4 text-center">Stok Fisik</th>
                                                <th className="p-4 text-center">Selisih</th>
                                                <th className="p-4">Alasan Selisih / Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.items.map((item, index) => {
                                                const diff = item.qty_physical - item.qty_system;
                                                let diffColor = "text-neutral-600";
                                                let diffText = "0";

                                                if (diff < 0) {
                                                    diffColor = "text-red-600 font-bold";
                                                    diffText = String(diff);
                                                } else if (diff > 0) {
                                                    diffColor = "text-blue-600 font-bold";
                                                    diffText = `+${diff}`;
                                                }

                                                return (
                                                    <tr key={item.product_id} className="border-b hover:bg-muted/30">
                                                        <td className="p-4">
                                                            <div className="font-semibold">{item.name}</div>
                                                            <div className="text-xs text-muted-foreground font-mono">
                                                                SKU: {item.sku} &bull; Kode: {item.code}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-mono font-medium text-center text-neutral-700">
                                                            {item.qty_system} {item.unit}
                                                        </td>
                                                        <td className="p-4 w-32">
                                                            <div className="flex items-center gap-1.5 justify-center">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    value={item.qty_physical}
                                                                    onChange={e => handleQtyPhysicalChange(index, e.target.value)}
                                                                    className="h-8 w-20 text-center font-mono font-bold"
                                                                    required
                                                                />
                                                                <span className="text-xs text-muted-foreground font-medium">{item.unit}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-mono text-center">
                                                            <span className={diffColor}>{diffText}</span>
                                                        </td>
                                                        <td className="p-4">
                                                            <Input
                                                                type="text"
                                                                value={item.notes}
                                                                onChange={e => handleItemNotesChange(index, e.target.value)}
                                                                placeholder="Alasan selisih (misal: rusak/hilang)"
                                                                className="h-8 text-sm"
                                                                disabled={diff === 0}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {data.items.length > 0 && (
                        <div className="flex justify-end gap-3">
                            <Button asChild variant="outline">
                                <Link href="/stock-opnames">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="gap-1.5 bg-primary text-primary-foreground">
                                <Save className="h-4 w-4" />
                                <span>Simpan Draf Opname</span>
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Opname Stok',
        href: '/stock-opnames',
    },
    {
        title: 'Buat Opname',
        href: '/stock-opnames/create',
    },
];

StockOpnameCreate.layout = {
    breadcrumbs,
};
