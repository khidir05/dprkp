import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Plus, ArrowRightLeft } from 'lucide-react';
import type { StockMutation } from '@/types';

type Props = {
    mutations: {
        data: StockMutation[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
    role: string;
};

export default function MutationsIndex({ mutations, filters, role }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

    const handleSearchChange = (val: string) => {
        setSearch(val);
        reloadPage(val, selectedStatus);
    };

    const handleStatusFilterChange = (val: string) => {
        setSelectedStatus(val);
        reloadPage(search, val);
    };

    const reloadPage = (searchVal: string, statusVal: string) => {
        const url = new URL(window.location.href);
        if (searchVal) {
            url.searchParams.set('search', searchVal);
        } else {
            url.searchParams.delete('search');
        }

        if (statusVal && statusVal !== 'all') {
            url.searchParams.set('status', statusVal);
        } else {
            url.searchParams.delete('status');
        }

        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-300">Menunggu Verifikasi</Badge>;
            case 'approved':
                return <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white">Disetujui</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Ditolak (Reversal)</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Mutasi Stok" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Mutasi Stok</h1>
                        <p className="text-muted-foreground">Kelola transfer mutasi barang antar-gudang secara internal.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-44">
                            <Select value={selectedStatus} onValueChange={handleStatusFilterChange}>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Menunggu</SelectItem>
                                    <SelectItem value="approved">Disetujui</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {(role === 'admin_gudang' || role === 'super_admin') && (
                            <Button asChild size="sm" className="h-9 gap-1.5">
                                <Link href="/mutations/create">
                                    <Plus className="h-4 w-4" />
                                    <span>Ajukan Mutasi</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
                    headers={['No. Mutasi', 'Barang (SKU / Kode)', 'Jumlah', 'Gudang Asal', 'Gudang Tujuan', 'Status', 'Aksi']}
                    items={mutations.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari no. mutasi..."
                    paginationLinks={mutations.links}
                    renderRow={(mut, idx) => {
                        return (
                            <tr key={mut.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 font-semibold font-mono text-sm">{mut.mutation_number}</td>
                                <td className="p-4">
                                    <div className="font-semibold">{mut.product?.name}</div>
                                    <div className="text-xs text-muted-foreground font-mono">
                                        SKU: {mut.product?.sku} &bull; Kode: {mut.product?.code}
                                    </div>
                                </td>
                                <td className="p-4 font-mono font-semibold text-sm text-center">
                                    {mut.qty} {mut.product?.unit?.symbol}
                                </td>
                                <td className="p-4 text-sm font-medium text-red-600 dark:text-red-400">
                                    {mut.from_warehouse?.name || '-'}
                                    <span className="block text-xs text-muted-foreground font-mono">{mut.from_warehouse?.code}</span>
                                </td>
                                <td className="p-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                    {mut.to_warehouse?.name || '-'}
                                    <span className="block text-xs text-muted-foreground font-mono">{mut.to_warehouse?.code}</span>
                                </td>
                                <td className="p-4">{getStatusBadge(mut.status)}</td>
                                <td className="p-4">
                                    <Button asChild variant="outline" size="icon" className="h-8 w-8 text-neutral-600">
                                        <Link href={`/mutations/${mut.id}`}>
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

MutationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Mutasi Stok',
            href: '/mutations',
        },
    ],
};
