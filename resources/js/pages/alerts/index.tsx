import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, ShieldAlert, Play, Pause, Power, CheckCircle, RefreshCw, XCircle } from 'lucide-react';

type AlertType = {
    id: number;
    product_id: number;
    current_stock: number;
    minimum_stock: number;
    status: 'open' | 'restock' | 'hold' | 'closed';
    handled_by: number | null;
    handled_at: string | null;
    notes: string | null;
    created_at: string;
    product: {
        id: number;
        sku: string;
        code: string;
        name: string;
        is_hold: boolean;
        unit?: {
            symbol: string;
        };
    };
    handler?: {
        name: string;
    };
};

type Props = {
    alerts: {
        data: AlertType[];
        links: any[];
    };
    filters: {
        status?: string;
    };
    role: string;
};

export default function AlertsIndex({ alerts, filters, role }: Props) {
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'active');
    
    // Modal states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'hold' | 'restock' | 'close' | null>(null);
    const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

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

    const openActionDialog = (alert: AlertType, action: 'hold' | 'restock' | 'close') => {
        setSelectedAlert(alert);
        setDialogAction(action);
        setNotes('');
        setDialogOpen(true);
    };

    const handleDirectAction = (alert: AlertType, action: 'release') => {
        setProcessing(true);
        router.post(`/alerts/${alert.id}/${action}`, {}, {
            onFinish: () => setProcessing(false)
        });
    };

    const submitAction = () => {
        if (!selectedAlert || !dialogAction) return;

        setProcessing(true);
        router.post(`/alerts/${selectedAlert.id}/${dialogAction}`, {
            notes: notes
        }, {
            onSuccess: () => {
                setDialogOpen(false);
                setSelectedAlert(null);
                setDialogAction(null);
                setNotes('');
            },
            onFinish: () => setProcessing(false)
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return (
                    <Badge variant="destructive" className="gap-1.5 py-0.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Mendekati Minimum</span>
                    </Badge>
                );
            case 'restock':
                return (
                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-500 gap-1.5 py-0.5 text-white">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                        <span>Pengajuan Restock</span>
                    </Badge>
                );
            case 'hold':
                return (
                    <Badge variant="outline" className="border-red-500 text-red-500 gap-1.5 py-0.5">
                        <Pause className="h-3.5 w-3.5" />
                        <span>Hold (Ditangguhkan)</span>
                    </Badge>
                );
            case 'closed':
                return (
                    <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 gap-1.5 py-0.5">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Selesai / Tutup</span>
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Alert Stok Minimum" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Alert Stok Minimum</h1>
                        <p className="text-muted-foreground">Peringatan otomatis saat stok barang di gudang berada pada atau di bawah batas minimum.</p>
                    </div>

                    <div className="w-full md:w-56">
                        <Label htmlFor="filter-status" className="sr-only">Filter Status</Label>
                        <Select value={selectedStatus} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Status Alert" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Alert</SelectItem>
                                <SelectItem value="active">Semua Alert Aktif</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="restock">Restock</SelectItem>
                                <SelectItem value="hold">Hold</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DataTable
                    headers={['Barang (SKU / Kode)', 'Stok Saat Ini', 'Min. Batas Stok', 'Status Alert', 'Keterangan / Penanggung Jawab', 'Aksi']}
                    items={alerts.data}
                    searchPlaceholder="Cari alert..."
                    paginationLinks={alerts.links}
                    renderRow={(alert, idx) => {
                        const product = alert.product;
                        return (
                            <tr key={alert.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4">
                                    <div className="font-semibold">{product?.name || '-'}</div>
                                    <div className="text-xs text-muted-foreground font-mono">
                                        SKU: {product?.sku} &bull; Kode: {product?.code}
                                    </div>
                                </td>
                                <td className="p-4 font-mono text-sm font-semibold text-red-600">
                                    {alert.current_stock} {product?.unit?.symbol}
                                </td>
                                <td className="p-4 font-mono text-sm text-muted-foreground">
                                    {alert.minimum_stock} {product?.unit?.symbol}
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(alert.status)}
                                </td>
                                <td className="p-4 text-sm max-w-xs">
                                    {alert.notes && (
                                        <div className="text-muted-foreground italic mb-1">"{alert.notes}"</div>
                                    )}
                                    {alert.handler && (
                                        <div className="text-xs font-medium text-slate-500">
                                            Oleh: {alert.handler.name} ({new Date(alert.handled_at!).toLocaleDateString('id-ID')})
                                        </div>
                                    )}
                                    {!alert.handler && (
                                        <div className="text-xs text-slate-400">Belum ditangani</div>
                                    )}
                                </td>
                                <td className="p-4">
                                    {isManager && alert.status !== 'closed' && (
                                        <div className="flex flex-wrap gap-2">
                                            {alert.status === 'open' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-amber-600 border-amber-300 hover:bg-amber-50 h-8 gap-1"
                                                        onClick={() => openActionDialog(alert, 'restock')}
                                                        disabled={processing}
                                                    >
                                                        <RefreshCw className="h-3.5 w-3.5" />
                                                        <span>Restock</span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-rose-600 border-rose-300 hover:bg-rose-50 h-8 gap-1"
                                                        onClick={() => openActionDialog(alert, 'hold')}
                                                        disabled={processing}
                                                    >
                                                        <Pause className="h-3.5 w-3.5" />
                                                        <span>Hold</span>
                                                    </Button>
                                                </>
                                            )}

                                            {alert.status === 'hold' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-emerald-600 border-emerald-300 hover:bg-emerald-55 h-8 gap-1"
                                                        onClick={() => handleDirectAction(alert, 'release')}
                                                        disabled={processing}
                                                    >
                                                        <Play className="h-3.5 w-3.5" />
                                                        <span>Lepas Hold</span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-amber-600 border-amber-300 hover:bg-amber-50 h-8 gap-1"
                                                        onClick={() => openActionDialog(alert, 'restock')}
                                                        disabled={processing}
                                                    >
                                                        <RefreshCw className="h-3.5 w-3.5" />
                                                        <span>Restock</span>
                                                    </Button>
                                                </>
                                            )}

                                            {alert.status !== 'closed' && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 gap-1 text-slate-700"
                                                    onClick={() => openActionDialog(alert, 'close')}
                                                    disabled={processing}
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    <span>Tutup</span>
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                    {(!isManager || alert.status === 'closed') && (
                                        <span className="text-xs text-muted-foreground">-</span>
                                    )}
                                </td>
                            </tr>
                        );
                    }}
                />
            </div>

            {/* Action Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {dialogAction === 'hold' && 'Tangguhkan Barang (Hold)'}
                            {dialogAction === 'restock' && 'Ajukan Restok Barang'}
                            {dialogAction === 'close' && 'Tutup Alert Stok'}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogAction === 'hold' && 'Tangguhkan pemesanan/permintaan barang ini dari pemohon sementara stok menipis.'}
                            {dialogAction === 'restock' && 'Buat item pengadaan (Restok) untuk barang ini agar diproses oleh Manager.'}
                            {dialogAction === 'close' && 'Menutup alert ini secara manual. Status barang akan dikembalikan seperti biasa.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="action-notes">Catatan Tindakan</Label>
                            <Textarea
                                id="action-notes"
                                placeholder="Masukkan catatan, alasan, atau intruksi tambahan..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processing}>
                            Batal
                        </Button>
                        <Button
                            variant={dialogAction === 'hold' ? 'destructive' : 'default'}
                            onClick={submitAction}
                            disabled={processing}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

AlertsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Stok Alerts',
            href: '/alerts',
        },
    ],
};
