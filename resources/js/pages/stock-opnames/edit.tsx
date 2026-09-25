import { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, AlertCircle, Search, Plus, Trash2, CheckCircle2, ListPlus } from 'lucide-react';
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

type ProductItem = {
    id: number;
    name: string;
    code: string;
    sku: string;
    unit: string;
    qty_system: number;
};

type Props = {
    opname: StockOpname;
    products?: ProductItem[];
};

export default function StockOpnameEdit({ opname, products = [] }: Props) {
    const formattedDate = opname?.opname_date
        ? new Date(opname.opname_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    const [productSearch, setProductSearch] = useState('');

    const { data, setData, put, processing, errors } = useForm({
        opname_date: formattedDate,
        notes: opname?.notes || '',
        items: (opname?.items || []).map(item => ({
            id: item.id as number | undefined,
            product_id: item.product_id,
            name: item.product?.name || '',
            code: item.product?.code || '',
            sku: item.product?.sku || '',
            unit: item.product?.unit?.symbol || item.product?.unit?.name || '',
            qty_system: item.qty_system,
            qty_physical: item.qty_physical,
            notes: item.notes || '',
        })),
    });

    const handleAddProduct = (product: ProductItem) => {
        if (data.items.some(item => item.product_id === product.id)) return;

        setData('items', [
            ...data.items,
            {
                product_id: product.id,
                name: product.name,
                code: product.code,
                sku: product.sku,
                unit: product.unit,
                qty_system: product.qty_system,
                qty_physical: product.qty_system,
                notes: '',
            },
        ]);
    };

    const handleAddAllProducts = () => {
        const existingIds = new Set(data.items.map(item => item.product_id));
        const newItems = products
            .filter(p => !existingIds.has(p.id))
            .map(p => ({
                product_id: p.id,
                name: p.name,
                code: p.code,
                sku: p.sku,
                unit: p.unit,
                qty_system: p.qty_system,
                qty_physical: p.qty_system,
                notes: '',
            }));

        setData('items', [...data.items, ...newItems]);
    };

    const handleRemoveProduct = (index: number) => {
        const newItems = data.items.filter((_, idx) => idx !== index);
        setData('items', newItems);
    };

    const handleClearAllItems = () => {
        setData('items', []);
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
        put(`/stock-opnames/${opname.id}`);
    };

    // Filter available products based on search query
    const filteredProducts = products.filter(p => {
        if (!productSearch.trim()) return true;
        const q = productSearch.toLowerCase();
        return (
            p.name.toLowerCase().includes(q) ||
            p.code.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
    });

    const selectedProductIds = new Set(data.items.map(i => i.product_id));

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
                            <CardDescription>Gudang: <span className="font-semibold text-foreground">{opname.warehouse?.name} ({opname.warehouse?.code})</span></CardDescription>
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

                    {/* Product Search & Picker Section */}
                    {products.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-lg">Cari & Tambah Barang</CardTitle>
                                        <CardDescription>Cari dan tambahkan barang lain yang ingin dimasukkan ke draf opname ini.</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddAllProducts}
                                            disabled={data.items.length >= products.length}
                                            className="gap-1.5 text-xs h-8"
                                        >
                                            <ListPlus className="h-3.5 w-3.5" />
                                            <span>Tambah Semua Barang ({products.length})</span>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Ketik nama barang, kode, atau SKU..."
                                        value={productSearch}
                                        onChange={e => setProductSearch(e.target.value)}
                                        className="pl-9 h-10"
                                    />
                                </div>

                                <div className="border rounded-lg max-h-60 overflow-y-auto divide-y">
                                    {filteredProducts.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            Tidak ada barang yang cocok dengan kata kunci &quot;{productSearch}&quot;
                                        </div>
                                    ) : (
                                        filteredProducts.map(product => {
                                            const isSelected = selectedProductIds.has(product.id);
                                            return (
                                                <div
                                                    key={product.id}
                                                    className={`flex items-center justify-between p-3 transition-colors ${
                                                        isSelected ? 'bg-muted/40 opacity-75' : 'hover:bg-muted/50'
                                                    }`}
                                                >
                                                    <div className="space-y-0.5">
                                                        <div className="font-medium text-sm text-foreground">{product.name}</div>
                                                        <div className="text-xs text-muted-foreground font-mono">
                                                            SKU: {product.sku} &bull; Kode: {product.code} &bull; Stok Sistem: <span className="font-semibold text-foreground">{product.qty_system} {product.unit}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {isSelected ? (
                                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                Sudah Masuk List
                                                            </span>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() => handleAddProduct(product)}
                                                                className="h-8 gap-1 text-xs"
                                                            >
                                                                <Plus className="h-3.5 w-3.5" />
                                                                Tambah
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Selected Items Table */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Daftar Barang yang Di-opname ({data.items.length})</CardTitle>
                                    <CardDescription>Sesuaikan stok tercatat di sistem dengan hasil hitung fisik gudang.</CardDescription>
                                </div>
                                {data.items.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearAllItems}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8"
                                    >
                                        Kosongkan List
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {data.items.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground border-t space-y-2">
                                    <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/60" />
                                    <p className="text-sm font-medium">Belum ada barang di dalam draf opname ini.</p>
                                    <p className="text-xs text-muted-foreground">Gunakan pencarian di atas untuk memasukkan barang.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto border-t">
                                    <table className="w-full text-sm border-collapse text-left">
                                        <thead>
                                            <tr className="border-b bg-muted/40 font-medium text-neutral-600">
                                                <th className="p-3 w-12 text-center">No</th>
                                                <th className="p-3 w-1/3">Barang (SKU / Kode)</th>
                                                <th className="p-3 text-center">Stok Sistem</th>
                                                <th className="p-3 text-center">Stok Fisik</th>
                                                <th className="p-3 text-center">Selisih</th>
                                                <th className="p-3">Alasan Selisih / Keterangan</th>
                                                <th className="p-3 w-16 text-center">Aksi</th>
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
                                                        <td className="p-3 text-center text-muted-foreground text-xs">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="font-semibold text-sm">{item.name}</div>
                                                            <div className="text-xs text-muted-foreground font-mono">
                                                                SKU: {item.sku} &bull; Kode: {item.code}
                                                            </div>
                                                        </td>
                                                        <td className="p-3 font-mono font-medium text-center text-neutral-700">
                                                            {item.qty_system} {item.unit}
                                                        </td>
                                                        <td className="p-3 w-32">
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
                                                        <td className="p-3 font-mono text-center">
                                                            <span className={diffColor}>{diffText}</span>
                                                        </td>
                                                        <td className="p-3">
                                                            <Input
                                                                type="text"
                                                                value={item.notes}
                                                                onChange={e => handleItemNotesChange(index, e.target.value)}
                                                                placeholder="Alasan selisih (rusak/hilang/dll)"
                                                                className="h-8 text-sm"
                                                            />
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleRemoveProduct(index)}
                                                                className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                                title="Hapus dari daftar opname"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {errors.items && (
                        <p className="text-sm text-red-600 font-medium">{errors.items}</p>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href={`/stock-opnames/${opname.id}`}>Batal</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || data.items.length === 0}
                            className="gap-1.5 bg-primary text-primary-foreground"
                        >
                            <Save className="h-4 w-4" />
                            <span>Simpan Perubahan</span>
                        </Button>
                    </div>
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
        title: 'Edit Draf',
        href: '',
    },
];

StockOpnameEdit.layout = {
    breadcrumbs,
};
