import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Plus, Pencil, ClipboardCheck, Calendar } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

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
    created_by?: {
        id: number;
        name: string;
    };
    approved_by?: {
        id: number;
        name: string;
    };
};

type Props = {
    opnames: {
        data: StockOpname[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
        start_date?: string;
        end_date?: string;
    };
    role: string;
};

export default function StockOpnameIndex({ opnames, filters, role }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleSearchChange = (val: string) => {
        setSearch(val);
        reloadPage(val, selectedStatus, startDate, endDate);
    };

    const handleStatusFilterChange = (val: string) => {
        setSelectedStatus(val);
        reloadPage(search, val, startDate, endDate);
    };

    const handleStartDateChange = (val: string) => {
        setStartDate(val);
        reloadPage(search, selectedStatus, val, endDate);
    };

    const handleEndDateChange = (val: string) => {
        setEndDate(val);
        reloadPage(search, selectedStatus, startDate, val);
    };

    const reloadPage = (searchVal: string, statusVal: string, startVal: string, endVal: string) => {
        const params: any = {};
        if (searchVal) params.search = searchVal;
        if (statusVal && statusVal !== 'all') params.status = statusVal;
        if (startVal) params.start_date = startVal;
        if (endVal) params.end_date = endVal;

        router.get('/stock-opnames', params, {
            preserveState: true,
            replace: true
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-300">Draft (Pengajuan)</Badge>;
            case 'completed':
                return <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white">Completed (Selesai)</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled (Batal)</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Opname Stok" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Opname Stok (Stock Opname)</h1>
                        <p className="text-muted-foreground">Catat stock opname fisik gudang, hitung selisih, dan sesuaikan kuantitas sistem.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => handleStartDateChange(e.target.value)}
                                    className="h-9 w-36 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 pl-8 text-neutral-800 dark:text-neutral-200"
                                />
                                <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">s/d</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => handleEndDateChange(e.target.value)}
                                    className="h-9 w-36 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 pl-8 text-neutral-800 dark:text-neutral-200"
                                />
                                <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="w-44">
                            <Select value={selectedStatus} onValueChange={handleStatusFilterChange}>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {(role === 'admin_gudang' || role === 'super_admin') && (
                            <Button asChild size="sm" className="h-9 gap-1.5 bg-primary text-primary-foreground">
                                <Link href="/stock-opnames/create">
                                    <Plus className="h-4 w-4" />
                                    <span>Buat Opname Stok</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
                    headers={['No. Opname', 'Tanggal', 'Gudang', 'Dibuat Oleh', 'Status', 'Aksi']}
                    items={opnames.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari no. opname..."
                    paginationLinks={opnames.links}
                    renderRow={(opname, idx) => {
                        return (
                            <tr key={opname.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 font-semibold font-mono text-sm">{opname.opname_number}</td>
                                <td className="p-4 text-sm font-medium">
                                    {new Date(opname.opname_date).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </td>
                                <td className="p-4 text-sm font-medium">
                                    {opname.warehouse?.name || '-'}
                                    <span className="block text-xs text-muted-foreground font-mono">{opname.warehouse?.code}</span>
                                </td>
                                <td className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
                                    {opname.created_by?.name || '-'}
                                </td>
                                <td className="p-4">{getStatusBadge(opname.status)}</td>
                                <td className="p-4 flex items-center gap-2">
                                    <Button asChild variant="outline" size="icon" className="h-8 w-8 text-neutral-600">
                                        <Link href={`/stock-opnames/${opname.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    {opname.status === 'draft' && (role === 'admin_gudang' || role === 'super_admin') && (
                                        <Button asChild variant="outline" size="icon" className="h-8 w-8 text-amber-600 border-amber-200 hover:bg-amber-50">
                                            <Link href={`/stock-opnames/${opname.id}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Opname Stok',
        href: '/stock-opnames',
    },
];

StockOpnameIndex.layout = {
    breadcrumbs,
};
