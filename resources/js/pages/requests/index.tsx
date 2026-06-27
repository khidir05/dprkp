import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Plus, ArrowUpRight } from 'lucide-react';
import type { ItemRequest } from '@/types';

type Props = {
    requests: {
        data: ItemRequest[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
    role: string;
};

export default function RequestsIndex({ requests, filters, role }: Props) {
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
                return <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-300">Menunggu Persetujuan</Badge>;
            case 'approved':
                return <Badge variant="default" className="bg-blue-600 hover:bg-blue-600 text-white">Disetujui</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Ditolak</Badge>;
            case 'completed':
                return <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white">Selesai / Terkirim</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Permintaan Barang" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Permintaan Barang</h1>
                        <p className="text-muted-foreground">Ajukan dan kelola permintaan kebutuhan barang kantor.</p>
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
                                    <SelectItem value="completed">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {(role === 'pemohon' || role === 'super_admin') && (
                            <Button asChild size="sm" className="h-9 gap-1.5">
                                <Link href="/requests/create">
                                    <Plus className="h-4 w-4" />
                                    <span>Buat Permintaan</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
                    headers={['No. Permintaan', 'Tanggal', 'Pemohon', 'Gudang Target', 'Status', 'Aksi']}
                    items={requests.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari no. permintaan..."
                    paginationLinks={requests.links}
                    renderRow={(req, idx) => {
                        const dateFormatted = new Date(req.request_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        });

                        return (
                            <tr key={req.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 font-semibold font-mono text-sm">{req.request_number}</td>
                                <td className="p-4 text-sm font-medium">{dateFormatted}</td>
                                <td className="p-4 text-sm">
                                    <div className="font-semibold">{req.requester?.name}</div>
                                    <div className="text-xs text-muted-foreground">{req.requester?.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-medium">{req.warehouse?.name}</div>
                                    <div className="text-xs text-muted-foreground font-mono">{req.warehouse?.code}</div>
                                </td>
                                <td className="p-4">{getStatusBadge(req.status)}</td>
                                <td className="p-4">
                                    <Button asChild variant="outline" size="icon" className="h-8 w-8 text-neutral-600">
                                        <Link href={`/requests/${req.id}`}>
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

RequestsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Permintaan Barang',
            href: '/requests',
        },
    ],
};
