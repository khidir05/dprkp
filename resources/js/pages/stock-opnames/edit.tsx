import { useForm, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

type StockOpnameItem = {
    id: number;
    product_id: number;
    qty_system: number;
    qty_physical: number;
    qty_difference: number;
    notes: string | null;
    product?: {
        name: string;
        sku: string;
        code: string;
        unit?: {
            name: string;
            symbol: string;
        };
    };
};

type StockOpname = {
    id: number;
    opname_number: string;
    opname_date: string;
    status: 'draft' | 'completed' | 'cancelled';
    notes: string | null;
    warehouse?: {
        id: number;
        name: string;
        code: string;
    };
    items: StockOpnameItem[];
};

type Props = {
    opname: StockOpname;
};

export default function StockOpnameEdit({ opname }: Props) {
    const formattedDate = new Date(opname.opname_date).toISOString().split('T')[0];

    const { data, setData, put, processing, errors } = useForm({
        opname_date: formattedDate,
        notes: opname.notes || '',
        items: opname.items.map(item => ({
            id: item.id,
            product_id: item.product_id,
            name: item.product?.name || '',
            code: item.product?.code || '',
            sku: item.product?.sku || '',
            unit: item.product?.unit?.symbol || '',
            qty_system: item.qty_system,
            qty_physical: item.qty_physical,
            notes: item.notes || ''
        }))
    });

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
        put(`/stock-opnames/${opname.id}`);
    };

    return (
        <>
            <Head title={`Edit Opname Stok #${opname.opname_number}`} />
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="icon" className="h-9 w-9">
                        <Link href={`/stock-opnames/${opname.id}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Draf Opname Stok</h1>
                        <p className="text-muted-foreground font-mono text-sm">No. {opname.opname_number}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Opname</CardTitle>
                            <CardDescription>Gudang: {opname.warehouse?.name} ({opname.warehouse?.code})</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Barang & Kuantitas Fisik</CardTitle>
                            <CardDescription>Sesuaikan stok tercatat di sistem dengan hasil hitung fisik gudang.</CardDescription>
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
                                                            placeholder="Alasan selisih (rusak/hilang/dll)"
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

                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href={`/stock-opnames/${opname.id}`}>Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-1.5 bg-primary text-primary-foreground">
                            <Save className="h-4 w-4" />
                            <span>Simpan Perubahan</span>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

const breadcrumbs = (opname: StockOpname): BreadcrumbItem[] => [
    {
        title: 'Opname Stok',
        href: '/stock-opnames',
    },
    {
        title: `Detail #${opname.opname_number}`,
        href: `/stock-opnames/${opname.id}`,
    },
    {
        title: 'Edit Draf',
        href: `/stock-opnames/${opname.id}/edit`,
    },
];

StockOpnameEdit.layout = (page: any) => {
    return {
        breadcrumbs: breadcrumbs(page.props.opname),
    };
};
