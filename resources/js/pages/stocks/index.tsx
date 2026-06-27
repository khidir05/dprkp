import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, HelpCircle } from 'lucide-react';
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
};

export default function StocksIndex({ stocks, warehouses, filters }: Props) {
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
        const url = new URL(window.location.href);
        if (searchVal) {
            url.searchParams.set('search', searchVal);
        } else {
            url.searchParams.delete('search');
        }

        if (whVal && whVal !== 'all') {
            url.searchParams.set('warehouse_id', whVal);
        } else {
            url.searchParams.delete('warehouse_id');
        }

        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
    };

    return (
        <>
            <Head title="Stok Inventaris" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Stok Inventaris</h1>
                        <p className="text-muted-foreground">Lihat level ketersediaan stok barang saat ini di seluruh gudang.</p>
                    </div>

                    <div className="w-full md:w-48">
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
                </div>

                <DataTable
                    headers={['Gudang', 'Barang (SKU / Kode)', 'Kategori', 'Stok Saat Ini', 'Min. Stok', 'Status']}
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
                                    <div className="text-xs text-muted-foreground font-mono">
                                        SKU: {product?.sku} &bull; Kode: {product?.code}
                                    </div>
                                </td>
                                <td className="p-4 text-muted-foreground text-sm">
                                    {product?.category?.name || '-'}
                                </td>
                                <td className="p-4 font-mono text-sm font-semibold">
                                    {stock.qty} {product?.unit?.symbol}
                                </td>
                                <td className="p-4 font-mono text-sm text-muted-foreground">
                                    {product?.minimum_stock ?? 0} {product?.unit?.symbol}
                                </td>
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
