import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertTriangle, HelpCircle, Printer, Download } from 'lucide-react';
import type { Stock, Warehouse } from '@/types';

type Props = {
    stocks: {
        data: Stock[];
        links: any[];
    };
    warehouses: Warehouse[];
    filters: {
        search?: string;
        warehouse_id?: string;
    };
    role: string;
};

export default function StocksIndex({ stocks, warehouses, filters, role }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(filters.warehouse_id || 'all');

    const handleSearchChange = (val: string) => {
        setSearch(val);
        reloadPage(val, selectedWarehouseId);
    };

    const handleWarehouseFilterChange = (val: string) => {
        setSelectedWarehouseId(val);
        reloadPage(search, val);
    };

    const reloadPage = (searchVal: string, whVal: string) => {
        const params: any = {};
        if (searchVal) params.search = searchVal;
        if (whVal && whVal !== 'all') params.warehouse_id = whVal;

        router.get('/stocks', params, {
            preserveState: true,
            replace: true
        });
    };

    const isPemohon = role === 'pemohon';

    const exportToExcel = () => {
        let headers: string[] = [];
        let rows: any[][] = [];
        let filename = `stok-inventaris-${new Date().toISOString().slice(0, 10)}`;

        if (isPemohon) {
            headers = ['No', 'Gudang', 'Barang', 'Kategori', 'Stok Saat Ini'];
            rows = stocks.data.map((row, idx) => [
                idx + 1,
                row.warehouse?.name || '-',
                row.product?.name || '-',
                row.product?.category?.name || '-',
                `${row.qty} ${row.product?.unit?.symbol || ''}`
            ]);
        } else {
            headers = ['No', 'Gudang', 'Barang', 'SKU', 'Kode', 'Kategori', 'Stok Saat Ini', 'Min. Stok', 'Status'];
            rows = stocks.data.map((row, idx) => {
                const isLowStock = row.product && row.qty <= row.product.minimum_stock;
                const statusStr = isLowStock ? 'Stok Menipis' : 'Aman';
                return [
                    idx + 1,
                    row.warehouse?.name || '-',
                    row.product?.name || '-',
                    row.product?.sku || '-',
                    row.product?.code || '-',
                    row.product?.category?.name || '-',
                    `${row.qty} ${row.product?.unit?.symbol || ''}`,
                    `${row.product?.minimum_stock ?? 0} ${row.product?.unit?.symbol || ''}`,
                    statusStr
                ];
            });
        }

        // Convert to CSV
        const csvContent = "\uFEFF" + [
            headers.join(','),
            ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <Head title="Stok Inventaris" />
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    aside, nav, header, form, button, .print\\:hidden, [role="button"], .print-hidden-button {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .max-w-7xl, main, .p-6, .space-y-6 {
                        max-width: 100% !important;
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .bg-white, .dark\\:bg-zinc-900 {
                        background: transparent !important;
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                    table {
                        border-collapse: collapse !important;
                        width: 100% !important;
                    }
                    th, td {
                        border: 1px solid #ddd !important;
                        padding: 8px !important;
                    }
                }
            `}} />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Stok Inventaris</h1>
                        <p className="text-muted-foreground">Lihat level ketersediaan stok barang saat ini di seluruh gudang.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 print-hidden-button">
                        {role !== 'admin_gudang' && (
                            <div className="w-44">
                                <Label htmlFor="filter-warehouse" className="sr-only">Filter Gudang</Label>
                                <Select value={selectedWarehouseId} onValueChange={handleWarehouseFilterChange}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Semua Gudang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Gudang</SelectItem>
                                        {warehouses.map((wh) => (
                                            <SelectItem key={wh.id} value={String(wh.id)}>
                                                {wh.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 gap-1.5 rounded-xl text-xs font-semibold border-neutral-200 hover:bg-neutral-50 dark:border-zinc-800" 
                            onClick={() => window.print()}
                        >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Cetak PDF</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 gap-1.5 rounded-xl text-xs font-semibold border-neutral-200 hover:bg-neutral-50 dark:border-zinc-800" 
                            onClick={exportToExcel}
                        >
                            <Download className="h-3.5 w-3.5" />
                            <span>Ekspor Excel</span>
                        </Button>
                    </div>
                </div>

                <DataTable
                    headers={isPemohon
                        ? ['Gudang', 'Barang', 'Kategori', 'Stok Saat Ini']
                        : ['Gudang', 'Barang (SKU / Kode)', 'Kategori', 'Stok Saat Ini', 'Min. Stok', 'Status']
                    }
                    items={stocks.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari barang..."
                    paginationLinks={stocks.links}
                    renderRow={(stock, idx) => {
                        const product = stock.product;
                        const isLowStock = product && stock.qty <= product.minimum_stock;

                        return (
                            <tr key={stock.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4">
                                    <div className="font-semibold">{stock.warehouse?.name}</div>
                                    <div className="text-xs text-muted-foreground font-mono">{stock.warehouse?.code}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium">{product?.name || '-'}</div>
                                    {!isPemohon && (
                                        <div className="text-xs text-muted-foreground font-mono">
                                            SKU: {product?.sku} &bull; Kode: {product?.code}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-muted-foreground text-sm">
                                    {product?.category?.name || '-'}
                                </td>
                                <td className="p-4 font-mono text-sm font-semibold">
                                    {stock.qty} {product?.unit?.symbol}
                                </td>
                                {!isPemohon && (
                                    <td className="p-4 font-mono text-sm text-muted-foreground">
                                        {product?.minimum_stock ?? 0} {product?.unit?.symbol}
                                    </td>
                                )}
                                {!isPemohon && (
                                    <td className="p-4">
                                        {isLowStock ? (
                                            <Badge variant="destructive" className="gap-1.5 py-0.5">
                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                <span>Stok Menipis</span>
                                            </Badge>
                                        ) : (
                                            <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 py-0.5">
                                                Aman
                                            </Badge>
                                        )}
                                    </td>
                                )}
                            </tr>
                        );
                    }}
                />
            </div>
        </>
    );
}

StocksIndex.layout = {
    breadcrumbs: [
        {
            title: 'Stok',
            href: '/stocks',
        },
    ],
};
