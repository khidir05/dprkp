import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Plus } from 'lucide-react';
import type { InboundTransaction, Warehouse } from '@/types';

type Props = {
    transactions: {
        data: (InboundTransaction & { inbound_items_count: number })[];
        links: any[];
    };
    warehouses: Warehouse[];
    filters: {
        search?: string;
        warehouse_id?: string;
    };
    canCreate: boolean;
};

export default function InboundIndex({ transactions, warehouses, filters, canCreate }: Props) {
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
            <Head title="Barang Masuk (Inbound)" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Transaksi Barang Masuk</h1>
                        <p className="text-muted-foreground">Catat dan pantau pasokan barang masuk dari pemasok ke gudang inventaris.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-44">
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

                        {canCreate && (
                            <Button asChild size="sm" className="h-9 gap-1.5">
                                <Link href="/inbound/create">
                                    <Plus className="h-4 w-4" />
                                    <span>Barang Masuk Baru</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
                    headers={['No. Transaksi', 'Tanggal', 'Supplier Pemasok', 'Gudang Target', 'Total Item', 'Pencatat', 'Aksi']}
                    items={transactions.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari no. transaksi / ref..."
                    paginationLinks={transactions.links}
                    renderRow={(tx, idx) => {
                        const dateFormatted = new Date(tx.transaction_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        });

                        return (
                            <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4">
                                    <div className="font-semibold font-mono">{tx.transaction_number}</div>
                                    {tx.reference_document && (
                                        <div className="text-xs text-muted-foreground">Ref: {tx.reference_document}</div>
                                    )}
                                </td>
                                <td className="p-4 text-sm font-medium">{dateFormatted}</td>
                                <td className="p-4 text-sm">{tx.supplier?.name || '-'}</td>
                                <td className="p-4">
                                    <div className="font-medium text-sm">{tx.warehouse?.name}</div>
                                    <div className="text-xs text-muted-foreground font-mono">{tx.warehouse?.code}</div>
                                </td>
                                <td className="p-4 text-center">
                                    <Badge variant="secondary" className="font-mono">
                                        {tx.inbound_items_count} Jenis
                                    </Badge>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">{tx.created_by_user?.name || tx.created_by?.name || '-'}</td>
                                <td className="p-4">
                                    <Button asChild variant="outline" size="icon" className="h-8 w-8 text-neutral-600">
                                        <Link href={`/inbound/${tx.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </td>
                            </tr>
                        );
                    }}
                />
            </div>
        </>
    );
}

InboundIndex.layout = {
    breadcrumbs: [
        {
            title: 'Barang Masuk',
            href: '/inbound',
        },
    ],
};
