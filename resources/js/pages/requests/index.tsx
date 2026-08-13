import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Plus, ArrowUpRight, Printer, Download, Calendar } from 'lucide-react';
import type { ItemRequest } from '@/types';

type Props = {
    requests: {
        data: ItemRequest[];
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

export default function RequestsIndex({ requests, filters, role }: Props) {
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

        router.get('/requests', params, {
            preserveState: true,
            replace: true
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-300">Menunggu Persetujuan</Badge>;
            case 'approved':
                return <Badge variant="default" className="bg-blue-600 hover:bg-blue-600 text-white">Diproses</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Ditolak</Badge>;
            case 'delivered':
                return <Badge variant="default" className="bg-indigo-600 hover:bg-indigo-600 text-white">Sampai</Badge>;
            case 'completed':
                return <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white">Selesai</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const exportToExcel = () => {
        const headers = ['No', 'No. Pengajuan', 'Pemohon', 'Gudang Target', 'Detail Barang', 'Status', 'Tanggal'];
        const rows = requests.data.map((row, idx) => {
            const itemsStr = row.request_items?.map((i: any) => `${i.product?.name || ''} (${i.qty_requested} ${i.product?.unit?.symbol || ''})`).join('; ') || '-';
            
            // Map status label
            let statusLabel = row.status;
            if (row.status === 'pending') statusLabel = 'Menunggu Persetujuan';
            else if (row.status === 'approved') statusLabel = 'Diproses';
            else if (row.status === 'rejected') statusLabel = 'Ditolak';
            else if (row.status === 'delivered') statusLabel = 'Sampai';
            else if (row.status === 'completed') statusLabel = 'Selesai';

            return [
                idx + 1,
                row.request_number,
                row.requester?.name || row.requester_name || '-',
                row.warehouse?.name || '-',
                itemsStr,
                statusLabel,
                new Date(row.created_at).toLocaleDateString('id-ID')
            ];
        });

        const filename = `pengajuan-barang-${new Date().toISOString().slice(0, 10)}`;

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
            <Head title="Pengajuan Barang" />
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
                        <h1 className="text-2xl font-bold tracking-tight">Pengajuan Barang</h1>
                        <p className="text-muted-foreground">Ajukan dan kelola pengajuan kebutuhan barang kantor.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 print-hidden-button">
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
                                    <SelectItem value="pending">Menunggu</SelectItem>
                                    <SelectItem value="approved">Diproses</SelectItem>
                                    <SelectItem value="delivered">Sampai</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                    <SelectItem value="completed">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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

                        <Button asChild size="sm" className="h-9 gap-1.5">
                            <a href="/pengajuan" target="_blank" rel="noopener noreferrer">
                                <Plus className="h-4 w-4" />
                                <span>Buat Pengajuan</span>
                            </a>
                        </Button>
                    </div>
                </div>

                <DataTable
                    headers={['No. Pengajuan', 'Tanggal', 'Pemohon', 'Gudang Target', 'Status', 'Aksi']}
                    items={requests.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari no. pengajuan..."
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
                                    <div className="font-semibold">{req.requester?.name || req.requester_name || 'Guest'}</div>
                                    <div className="text-xs text-muted-foreground">{req.requester?.email || req.requester_dept || '-'}</div>
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
            title: 'Pengajuan Barang',
            href: '/requests',
        },
    ],
};
