import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, X, Pencil, Calendar, Warehouse, User, FileText } from 'lucide-react';
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
    created_at: string;
    approved_at: string | null;
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
    items: StockOpnameItem[];
};

type Props = {
    opname: StockOpname;
    role: string;
};

export default function StockOpnameShow({ opname, role }: Props) {
    const handleApprove = () => {
        if (confirm('Apakah Anda yakin ingin menyetujui opname stok ini? Stok sistem akan diperbarui secara permanen.')) {
            router.patch(`/stock-opnames/${opname.id}/approve`);
        }
    };

    const handleCancel = () => {
        if (confirm('Apakah Anda yakin ingin membatalkan opname stok ini?')) {
            router.patch(`/stock-opnames/${opname.id}/cancel`);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-300 px-3 py-1 text-xs">Draft (Pengajuan)</Badge>;
            case 'completed':
                return <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white px-3 py-1 text-xs">Completed (Selesai)</Badge>;
            case 'cancelled':
                return <Badge variant="destructive" className="px-3 py-1 text-xs">Cancelled (Batal)</Badge>;
            default:
                return <Badge variant="secondary" className="px-3 py-1 text-xs">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title={`Opname Stok #${opname.opname_number}`} />
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="outline" size="icon" className="h-9 w-9">
                            <Link href="/stock-opnames">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">Detail Opname Stok</h1>
                                {getStatusBadge(opname.status)}
                            </div>
                            <p className="text-muted-foreground font-mono text-sm">No. {opname.opname_number}</p>
                        </div>
                    </div>

                    {opname.status === 'draft' && (
                        <div className="flex items-center gap-2">
                            {(role === 'admin_gudang' || role === 'super_admin') && (
                                <Button asChild variant="outline" size="sm" className="gap-1.5 border-amber-200 text-amber-600 hover:bg-amber-50">
                                    <Link href={`/stock-opnames/${opname.id}/edit`}>
                                        <Pencil className="h-4 w-4" />
                                        <span>Edit Draf</span>
                                    </Link>
                                </Button>
                            )}

                            {(role === 'manager' || role === 'super_admin') && (
                                <>
                                    <Button variant="outline" size="sm" onClick={handleCancel} className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700">
                                        <X className="h-4 w-4" />
                                        <span>Batalkan</span>
                                    </Button>
                                    <Button onClick={handleApprove} size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                                        <Check className="h-4 w-4" />
                                        <span>Setujui (Selesai)</span>
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Informasi Pelaksanaan</CardTitle>
                            <CardDescription>Detail teknis pelaksanaan stock opname fisik gudang.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <Warehouse className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Gudang Audit</div>
                                    <div className="font-semibold text-sm mt-0.5">{opname.warehouse?.name || '-'}</div>
                                    <div className="text-xs font-mono text-muted-foreground">{opname.warehouse?.code}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tanggal Opname</div>
                                    <div className="font-semibold text-sm mt-0.5">
                                        {new Date(opname.opname_date).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Dibuat Oleh</div>
                                    <div className="font-semibold text-sm mt-0.5">{opname.created_by?.name || '-'}</div>
                                    <div className="text-xs text-muted-foreground">
                                        Pada {new Date(opname.created_at).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>

                            {opname.approved_by && (
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                            {opname.status === 'completed' ? 'Disetujui Oleh' : 'Dibatalkan Oleh'}
                                        </div>
                                        <div className="font-semibold text-sm mt-0.5">{opname.approved_by?.name || '-'}</div>
                                        {opname.approved_at && (
                                            <div className="text-xs text-muted-foreground">
                                                Pada {new Date(opname.approved_at).toLocaleString('id-ID')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {opname.notes && (
                                <div className="sm:col-span-2 flex items-start gap-3 pt-2 border-t">
                                    <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Catatan Umum</div>
                                        <div className="text-sm mt-1 text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border">
                                            {opname.notes}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ringkasan Selisih</CardTitle>
                            <CardDescription>Kalkulasi total perbedaan stok fisik & sistem.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(() => {
                                const totalItems = opname.items.length;
                                const differenceCount = opname.items.filter(item => item.qty_difference !== 0).length;
                                const totalSystem = opname.items.reduce((sum, item) => sum + item.qty_system, 0);
                                const totalPhysical = opname.items.reduce((sum, item) => sum + item.qty_physical, 0);
                                const netDifference = totalPhysical - totalSystem;

                                return (
                                    <>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground font-medium">Total Item Diaudit</span>
                                            <span className="text-sm font-semibold">{totalItems} Barang</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground font-medium">Item Dengan Selisih</span>
                                            <span className={`text-sm font-semibold ${differenceCount > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                                                {differenceCount} Barang
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground font-medium">Total Stok Sistem</span>
                                            <span className="text-sm font-semibold font-mono">{totalSystem}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground font-medium">Total Stok Fisik</span>
                                            <span className="text-sm font-semibold font-mono">{totalPhysical}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-sm font-bold">Total Selisih Net</span>
                                            <span className={`text-sm font-bold font-mono ${netDifference < 0 ? "text-red-600" : netDifference > 0 ? "text-blue-600" : "text-emerald-600"}`}>
                                                {netDifference > 0 ? `+${netDifference}` : netDifference}
                                            </span>
                                        </div>
                                    </>
                                );
                            })()}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Barang Audit</CardTitle>
                        <CardDescription>Rincian kuantitas terhitung untuk setiap barang.</CardDescription>
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
                                        <th className="p-4">Keterangan / Alasan Selisih</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {opname.items.map((item) => {
                                        const diff = item.qty_difference;
                                        let diffColor = "text-neutral-600";
                                        let diffText = "0";

                                        if (diff < 0) {
                                            diffColor = "text-red-600 font-bold";
                                            diffText = String(diff);
                                        } else if (diff > 0) {
                                            diffColor = "text-blue-600 font-bold";
                                            diffText = `+${diff}`;
                                        } else {
                                            diffColor = "text-emerald-600 font-medium";
                                        }

                                        return (
                                            <tr key={item.id} className="border-b hover:bg-muted/30">
                                                <td className="p-4">
                                                    <div className="font-semibold">{item.product?.name}</div>
                                                    <div className="text-xs text-muted-foreground font-mono">
                                                        SKU: {item.product?.sku} &bull; Kode: {item.product?.code}
                                                    </div>
                                                </td>
                                                <td className="p-4 font-mono text-center text-neutral-700">
                                                    {item.qty_system} {item.product?.unit?.symbol}
                                                </td>
                                                <td className="p-4 font-mono font-bold text-center text-neutral-900 dark:text-neutral-100">
                                                    {item.qty_physical} {item.product?.unit?.symbol}
                                                </td>
                                                <td className="p-4 font-mono text-center">
                                                    <span className={diffColor}>{diffText}</span>
                                                </td>
                                                <td className="p-4 text-neutral-600 dark:text-neutral-400">
                                                    {item.notes || <span className="text-muted-foreground/60 italic text-xs">Tidak ada keterangan</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
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
];

StockOpnameShow.layout = (page: any) => {
    return {
        breadcrumbs: breadcrumbs(page.props.opname),
    };
};
