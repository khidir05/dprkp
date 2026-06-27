import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    FileText, 
    Warehouse as WarehouseIcon, 
    Calendar, 
    ArrowDownToLine, 
    ArrowUpFromLine, 
    ArrowRightLeft, 
    ClipboardList, 
    Boxes, 
    Search,
    Printer,
    Download
} from 'lucide-react';

type WarehouseType = {
    id: number;
    name: string;
};

type Props = {
    type: 'stock' | 'inbound' | 'outbound' | 'mutation' | 'request';
    start_date: string;
    end_date: string;
    warehouse_id: string;
    warehouses: WarehouseType[];
    reportData: any[];
    role: string;
};

export default function ReportsIndex({ 
    type, 
    start_date, 
    end_date, 
    warehouse_id, 
    warehouses, 
    reportData, 
    role 
}: Props) {
    const [reportType, setReportType] = useState(type);
    const [startDate, setStartDate] = useState(start_date);
    const [endDate, setEndDate] = useState(end_date);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouse_id);
    const [processing, setProcessing] = useState(false);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const data: any = {
            type: reportType,
            warehouse_id: selectedWarehouseId,
        };

        if (reportType !== 'stock') {
            data.start_date = startDate;
            data.end_date = endDate;
        }

        router.get('/reports', data, {
            preserveState: true,
            onFinish: () => setProcessing(false),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-slate-100 text-slate-700">Tinjau</Badge>;
            case 'approved':
                return <Badge variant="default" className="bg-amber-500 hover:bg-amber-500 text-white">Disetujui</Badge>;
            case 'dispatched':
                return <Badge variant="default" className="bg-sky-500 hover:bg-sky-500 text-white">Dikirim</Badge>;
            case 'completed':
                return <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white">Selesai</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Ditolak</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="text-slate-400">Batal</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Calculate dynamic stats summary for the cards
    const getSummaryStats = () => {
        if (type === 'stock') {
            const totalStock = reportData.reduce((sum, item) => sum + (item.qty || 0), 0);
            return {
                title1: "Total Jenis Barang",
                val1: new Set(reportData.map(i => i.product_id)).size,
                title2: "Total Kuantitas Stok",
                val2: `${totalStock} unit`
            };
        } else if (type === 'inbound') {
            const totalItems = reportData.reduce((sum, item) => {
                const itemSum = item.inbound_items?.reduce((s: number, i: any) => s + (i.qty || 0), 0) || 0;
                return sum + itemSum;
            }, 0);
            return {
                title1: "Total Penerimaan Inbound",
                val1: reportData.length,
                title2: "Total Barang Masuk",
                val2: `${totalItems} unit`
            };
        } else if (type === 'outbound') {
            const totalItems = reportData.reduce((sum, item) => {
                const itemSum = item.outbound_items?.reduce((s: number, i: any) => s + (i.qty || 0), 0) || 0;
                return sum + itemSum;
            }, 0);
            return {
                title1: "Total Pengiriman Outbound",
                val1: reportData.length,
                title2: "Total Barang Keluar",
                val2: `${totalItems} unit`
            };
        } else if (type === 'mutation') {
            const totalQty = reportData.reduce((sum, item) => sum + (item.qty || 0), 0);
            return {
                title1: "Total Mutasi Diajukan",
                val1: reportData.length,
                title2: "Total Barang Dimutasi",
                val2: `${totalQty} unit`
            };
        } else {
            return {
                title1: "Total Permintaan Masuk",
                val1: reportData.length,
                title2: "Selesai / Sempurna",
                val2: reportData.filter(r => r.status === 'completed').length
            };
        }
    };

    const stats = getSummaryStats();

    return (
        <>
            <Head title="Laporan Inventaris & Transaksi" />
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <FileText className="h-6 w-6 text-indigo-600" />
                            <span>Laporan Inventaris & Transaksi</span>
                        </h1>
                        <p className="text-muted-foreground">Kueri, filter, dan tampilkan laporan mutasi stok, barang masuk/keluar, dan permohonan inventaris.</p>
                    </div>
                </div>

                {/* Filter Panel */}
                <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden rounded-2xl">
                    <CardContent className="p-6">
                        <form onSubmit={handleFilterSubmit} className="space-y-6">
                            {/* Type switches grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                <Button
                                    type="button"
                                    variant={reportType === 'stock' ? 'default' : 'outline'}
                                    className="h-10 gap-1.5 text-xs font-semibold rounded-xl"
                                    onClick={() => setReportType('stock')}
                                >
                                    <Boxes className="h-4 w-4" />
                                    <span>Laporan Stok</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant={reportType === 'inbound' ? 'default' : 'outline'}
                                    className="h-10 gap-1.5 text-xs font-semibold rounded-xl"
                                    onClick={() => setReportType('inbound')}
                                >
                                    <ArrowDownToLine className="h-4 w-4" />
                                    <span>Barang Masuk</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant={reportType === 'outbound' ? 'default' : 'outline'}
                                    className="h-10 gap-1.5 text-xs font-semibold rounded-xl"
                                    onClick={() => setReportType('outbound')}
                                >
                                    <ArrowUpFromLine className="h-4 w-4" />
                                    <span>Barang Keluar</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant={reportType === 'mutation' ? 'default' : 'outline'}
                                    className="h-10 gap-1.5 text-xs font-semibold rounded-xl"
                                    onClick={() => setReportType('mutation')}
                                >
                                    <ArrowRightLeft className="h-4 w-4" />
                                    <span>Mutasi Stok</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant={reportType === 'request' ? 'default' : 'outline'}
                                    className="h-10 gap-1.5 text-xs font-semibold rounded-xl"
                                    onClick={() => setReportType('request')}
                                >
                                    <ClipboardList className="h-4 w-4" />
                                    <span>Permintaan</span>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                {/* Warehouse selector */}
                                <div className="space-y-2">
                                    <Label htmlFor="warehouse-select" className="text-xs font-bold text-slate-700">Pilih Gudang</Label>
                                    <Select value={String(selectedWarehouseId || 'all')} onValueChange={setSelectedWarehouseId}>
                                        <SelectTrigger id="warehouse-select" className="h-10 rounded-xl">
                                            <SelectValue placeholder="Pilih Gudang" />
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

                                {/* Start Date (Conditional) */}
                                <div className={cn("space-y-2", reportType === 'stock' && "opacity-40 pointer-events-none")}>
                                    <Label htmlFor="start-date" className="text-xs font-bold text-slate-700">Tanggal Mulai</Label>
                                    <div className="relative">
                                        <Input
                                            id="start-date"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="h-10 pl-9 rounded-xl"
                                            disabled={reportType === 'stock'}
                                        />
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                {/* End Date (Conditional) */}
                                <div className={cn("space-y-2", reportType === 'stock' && "opacity-40 pointer-events-none")}>
                                    <Label htmlFor="end-date" className="text-xs font-bold text-slate-700">Tanggal Selesai</Label>
                                    <div className="relative">
                                        <Input
                                            id="end-date"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="h-10 pl-9 rounded-xl"
                                            disabled={reportType === 'stock'}
                                        />
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                {/* Submit button */}
                                <Button type="submit" className="h-10 w-full rounded-xl gap-2 font-bold" disabled={processing}>
                                    <Search className="h-4 w-4" />
                                    <span>{processing ? 'Memuat Laporan...' : 'Tampilkan Laporan'}</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{stats.title1}</div>
                            <div className="text-3xl font-extrabold text-indigo-950 dark:text-indigo-200 mt-2">{stats.val1}</div>
                        </div>
                        <FileText className="h-10 w-10 text-indigo-500/50" />
                    </div>

                    <div className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/30 dark:to-sky-950/20 border border-sky-100/50 dark:border-sky-900/30 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">{stats.title2}</div>
                            <div className="text-3xl font-extrabold text-sky-950 dark:text-sky-200 mt-2">{stats.val2}</div>
                        </div>
                        <Boxes className="h-10 w-10 text-sky-500/50" />
                    </div>
                </div>

                {/* Report Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Rincian Data Laporan</h2>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 gap-1 rounded-lg text-xs" 
                                onClick={() => window.print()}
                            >
                                <Printer className="h-3.5 w-3.5" />
                                <span>Cetak</span>
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50 dark:bg-zinc-800/40 text-slate-600 dark:text-slate-400 font-semibold">
                                    <th className="p-3 text-center w-12">No</th>
                                    
                                    {/* DYNAMIC HEADER ROWS BY REPORT TYPE */}
                                    {type === 'stock' && (
                                        <>
                                            <th className="p-3">Gudang</th>
                                            <th className="p-3">Nama Barang</th>
                                            <th className="p-3">SKU / Kode</th>
                                            <th className="p-3">Kategori</th>
                                            <th className="p-3 text-right">Stok Kuantitas</th>
                                        </>
                                    )}

                                    {type === 'inbound' && (
                                        <>
                                            <th className="p-3">No. Inbound</th>
                                            <th className="p-3">Supplier</th>
                                            <th className="p-3">Gudang</th>
                                            <th className="p-3">Pencatat</th>
                                            <th className="p-3">Detail Barang</th>
                                            <th className="p-3">Tanggal Inbound</th>
                                        </>
                                    )}

                                    {type === 'outbound' && (
                                        <>
                                            <th className="p-3">No. Outbound</th>
                                            <th className="p-3">Penerima</th>
                                            <th className="p-3">Gudang</th>
                                            <th className="p-3">Petugas Dispatch</th>
                                            <th className="p-3">Detail Barang</th>
                                            <th className="p-3">Tanggal Outbound</th>
                                        </>
                                    )}

                                    {type === 'mutation' && (
                                        <>
                                            <th className="p-3">No. Mutasi</th>
                                            <th className="p-3">Nama Barang</th>
                                            <th className="p-3">Asal Gudang</th>
                                            <th className="p-3">Tujuan Gudang</th>
                                            <th className="p-3 text-center">Jumlah</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Tanggal</th>
                                        </>
                                    )}

                                    {type === 'request' && (
                                        <>
                                            <th className="p-3">No. Permintaan</th>
                                            <th className="p-3">Pemohon</th>
                                            <th className="p-3">Gudang</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Rincian Barang Disetujui</th>
                                            <th className="p-3">Tanggal</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {reportData.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="p-8 text-center text-muted-foreground">
                                            Tidak ada data laporan ditemukan untuk kriteria filter saat ini.
                                        </td>
                                    </tr>
                                ) : (
                                    reportData.map((row, idx) => (
                                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <td className="p-3 text-center text-muted-foreground font-mono">{idx + 1}</td>
                                            
                                            {/* DYNAMIC VALUE ROWS BY REPORT TYPE */}
                                            {type === 'stock' && (
                                                <>
                                                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{row.warehouse?.name}</td>
                                                    <td className="p-3 font-semibold">{row.product?.name}</td>
                                                    <td className="p-3 font-mono text-xs text-muted-foreground">
                                                        SKU: {row.product?.sku} &bull; Kode: {row.product?.code}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">{row.product?.category?.name || '-'}</td>
                                                    <td className="p-3 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                                                        {row.qty} {row.product?.unit?.symbol}
                                                    </td>
                                                </>
                                            )}

                                            {type === 'inbound' && (
                                                <>
                                                    <td className="p-3 font-semibold">{row.inbound_number}</td>
                                                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{row.supplier?.name}</td>
                                                    <td className="p-3 text-slate-600 dark:text-slate-400">{row.warehouse?.name}</td>
                                                    <td className="p-3 text-xs text-muted-foreground">{row.created_by?.name || 'Sistem'}</td>
                                                    <td className="p-3 max-w-xs text-xs space-y-1">
                                                        {row.inbound_items?.map((item: any, i: number) => (
                                                            <div key={i} className="font-mono text-slate-700 dark:text-zinc-300">
                                                                &bull; {item.product?.name}: <span className="font-bold">{item.qty} {item.product?.unit?.symbol}</span>
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="p-3 text-xs font-mono text-muted-foreground">
                                                        {new Date(row.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                </>
                                            )}

                                            {type === 'outbound' && (
                                                <>
                                                    <td className="p-3 font-semibold">{row.outbound_number}</td>
                                                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{row.item_request?.requester?.name || 'Pemohon'}</td>
                                                    <td className="p-3 text-slate-600 dark:text-slate-400">{row.warehouse?.name}</td>
                                                    <td className="p-3 text-xs text-muted-foreground">{row.processed_by?.name || 'Sistem'}</td>
                                                    <td className="p-3 max-w-xs text-xs space-y-1">
                                                        {row.outbound_items?.map((item: any, i: number) => (
                                                            <div key={i} className="font-mono text-slate-700 dark:text-zinc-300">
                                                                &bull; {item.product?.name}: <span className="font-bold">{item.qty} {item.product?.unit?.symbol}</span>
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="p-3 text-xs font-mono text-muted-foreground">
                                                        {new Date(row.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                </>
                                            )}

                                            {type === 'mutation' && (
                                                <>
                                                    <td className="p-3 font-semibold">{row.mutation_number}</td>
                                                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{row.product?.name}</td>
                                                    <td className="p-3 text-slate-600 dark:text-slate-400">{row.from_warehouse?.name}</td>
                                                    <td className="p-3 text-slate-600 dark:text-slate-400">{row.to_warehouse?.name}</td>
                                                    <td className="p-3 text-center font-mono font-bold">{row.qty} {row.product?.unit?.symbol}</td>
                                                    <td className="p-3">{getStatusBadge(row.status)}</td>
                                                    <td className="p-3 text-xs font-mono text-muted-foreground">
                                                        {new Date(row.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                </>
                                            )}

                                            {type === 'request' && (
                                                <>
                                                    <td className="p-3 font-semibold">{row.request_number}</td>
                                                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{row.requester?.name || 'Pemohon'}</td>
                                                    <td className="p-3 text-slate-600 dark:text-slate-400">{row.warehouse?.name}</td>
                                                    <td className="p-3">{getStatusBadge(row.status)}</td>
                                                    <td className="p-3 max-w-xs text-xs space-y-1">
                                                        {row.request_items?.map((item: any, sIdx: number) => {
                                                            const qty = item.qty_approved !== null ? item.qty_approved : item.qty_requested;
                                                            return (
                                                                <div key={sIdx} className="font-mono text-slate-700 dark:text-zinc-300">
                                                                    &bull; {item.product?.name}: <span className="font-bold">{qty} {item.product?.unit?.symbol}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </td>
                                                    <td className="p-3 text-xs font-mono text-muted-foreground">
                                                        {new Date(row.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

ReportsIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Laporan', href: '/reports' }]}>
        {page}
    </AppLayout>
);
