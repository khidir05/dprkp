import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Link2, Eye, ShieldAlert } from 'lucide-react';

type RestockItemType = {
    id: number;
    product_id: number;
    source_type: 'StockAlert' | 'UnavailableItem';
    source_id: number;
    status: 'pending' | 'reviewed' | 'processed' | 'closed';
    reviewed_by: number | null;
    reviewed_at: string | null;
    created_at: string;
    product: {
        id: number;
        sku: string;
        code: string;
        name: string;
        minimum_stock: number;
        unit?: {
            symbol: string;
        };
    };
    reviewer?: {
        name: string;
    };
    source?: {
        // StockAlert properties
        current_stock?: number;
        minimum_stock?: number;
        notes?: string;
        
        // UnavailableItem properties
        product_name?: string;
        qty_needed?: number;
        creator?: {
            name: string;
        };
    };
};

type Props = {
    restocks: {
        data: RestockItemType[];
        links: any[];
    };
    filters: {
        status?: string;
    };
    role: string;
};

export default function RestockIndex({ restocks, filters, role }: Props) {
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'active');
    const [processingAction, setProcessingAction] = useState(false);

    const isManager = role === 'manager' || role === 'super_admin';

    const handleStatusFilterChange = (val: string) => {
        setSelectedStatus(val);
        const url = new URL(window.location.href);
        if (val && val !== 'all') {
            url.searchParams.set('status', val);
        } else {
            url.searchParams.delete('status');
        }
        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
    };

    const handleStatusUpdate = (restock: RestockItemType, status: 'reviewed' | 'processed' | 'closed') => {
        let msg = 'Ubah status restock barang?';
        if (status === 'processed') msg = 'Tandai restock barang ini sudah selesai diproses? Tindakan ini akan menutup alert asal secara otomatis.';
        if (status === 'closed') msg = 'Tutup/Batalkan pengajuan restock barang ini?';

        if (confirm(msg)) {
            setProcessingAction(true);
            router.patch(`/restock/${restock.id}/status`, {
                status: status
            }, {
                onFinish: () => setProcessingAction(false)
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="destructive" className="gap-1.5 py-0.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Menunggu Review</span>
                    </Badge>
                );
            case 'reviewed':
                return (
                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-500 gap-1.5 py-0.5 text-white">
                        <Eye className="h-3.5 w-3.5" />
                        <span>Dalam Pengadaan</span>
                    </Badge>
                );
            case 'processed':
                return (
                    <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 gap-1.5 py-0.5">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Restock Selesai</span>
                    </Badge>
                );
            case 'closed':
                return (
                    <Badge variant="secondary" className="gap-1.5 py-0.5">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Dibatalkan</span>
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getSourceLabel = (restock: RestockItemType) => {
        if (restock.source_type === 'StockAlert') {
            return (
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-red-600 font-medium text-xs">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Batas Stok Minimum</span>
                    </div>
                    {restock.source && (
                        <div className="text-xs text-muted-foreground">
                            Stok Saat Ini: {restock.source.current_stock} {restock.product?.unit?.symbol} &bull; Batas: {restock.source.minimum_stock} {restock.product?.unit?.symbol}
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-600 font-medium text-xs">
                        <Link2 className="h-3.5 w-3.5" />
                        <span>Laporan Barang Tidak Tersedia</span>
                    </div>
                    {restock.source && (
                        <div className="text-xs text-muted-foreground">
                            Kebutuhan: {restock.source.qty_needed} pcs &bull; Oleh: {restock.source.creator?.name || 'Sistem'}
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <>
            <Head title="Pengadaan Barang (Restock)" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengadaan & Restock Barang</h1>
                        <p className="text-muted-foreground">Daftar terpadu barang-barang yang membutuhkan restok dari peringatan stok minimum atau laporan barang tidak tersedia.</p>
                    </div>

                    <div className="w-full md:w-56">
                        <Label htmlFor="filter-status" className="sr-only">Filter Status</Label>
                        <Select value={selectedStatus} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Status Restock" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Semua Pengadaan Aktif</SelectItem>
                                <SelectItem value="pending">Menunggu Review</SelectItem>
                                <SelectItem value="reviewed">Dalam Pengadaan</SelectItem>
                                <SelectItem value="processed">Restock Selesai</SelectItem>
                                <SelectItem value="closed">Dibatalkan / Ditutup</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DataTable
                    headers={['Nama Barang (SKU)', 'Sumber Pengajuan', 'Status Pengadaan', 'Direview Oleh', 'Tanggal Pengajuan', 'Aksi']}
                    items={restocks.data}
                    searchPlaceholder="Cari barang restock..."
                    paginationLinks={restocks.links}
                    renderRow={(restock, idx) => {
                        const product = restock.product;
                        return (
                            <tr key={restock.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4">
                                    <div className="font-semibold text-slate-900">{product?.name || '-'}</div>
                                    <div className="text-xs text-muted-foreground font-mono">
                                        SKU: {product?.sku}
                                    </div>
                                </td>
                                <td className="p-4">
                                    {getSourceLabel(restock)}
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(restock.status)}
                                </td>
                                <td className="p-4 text-sm">
                                    {restock.reviewer ? (
                                        <div>
                                            <div className="font-medium text-slate-800">{restock.reviewer.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(restock.reviewed_at!).toLocaleDateString('id-ID')}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Belum direview</span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-muted-foreground font-mono">
                                    {new Date(restock.created_at).toLocaleDateString('id-ID')}
                                </td>
                                <td className="p-4">
                                    {isManager && (restock.status === 'pending' || restock.status === 'reviewed') && (
                                        <div className="flex items-center gap-2">
                                            {restock.status === 'pending' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-amber-600 border-amber-300 hover:bg-amber-50 h-8"
                                                    onClick={() => handleStatusUpdate(restock, 'reviewed')}
                                                    disabled={processingAction}
                                                >
                                                    Mulai Pengadaan
                                                </Button>
                                            )}

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-emerald-600 border-emerald-300 hover:bg-emerald-50 h-8 gap-1"
                                                onClick={() => handleStatusUpdate(restock, 'processed')}
                                                disabled={processingAction}
                                            >
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                <span>Selesai</span>
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-500 hover:text-slate-700 h-8"
                                                onClick={() => handleStatusUpdate(restock, 'closed')}
                                                disabled={processingAction}
                                            >
                                                Batalkan
                                            </Button>
                                        </div>
                                    )}
                                    {(!isManager || restock.status === 'processed' || restock.status === 'closed') && (
                                        <span className="text-xs text-muted-foreground">-</span>
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

RestockIndex.layout = {
    breadcrumbs: [
        {
            title: 'Restock Barang',
            href: '/restock',
        },
    ],
};
