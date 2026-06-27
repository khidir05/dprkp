import { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Check, X, ShieldAlert, Package, Calendar, Landmark, User, MessageSquare, AlertTriangle, Truck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ItemRequest, RequestItem } from '@/types';

type Props = {
    itemRequest: ItemRequest & {
        requester?: { id: number; name: string; email: string };
        approved_by_user?: { id: number; name: string };
        warehouse?: { id: number; code: string; name: string };
        request_items: (RequestItem & {
            available_stock?: number;
            product?: {
                id: number;
                code: string;
                sku: string;
                name: string;
                unit?: { symbol: string };
            };
        })[];
        outbound_transaction?: {
            id: number;
            transaction_number: string;
            transaction_date: string;
            notes: string | null;
            processed_by_user?: { name: string };
            processed_by?: { name: string };
        };
        goods_receipt?: {
            id: number;
            received_at: string;
            notes: string | null;
            received_by_user?: { name: string };
            received_by?: { name: string };
        };
    };
    role: string;
};

export default function RequestShow({ itemRequest, role }: Props) {
    const isRequester = itemRequest.requester_id === useForm().data.id; // Helper check (actual check on server)

    // Forms
    const approveForm = useForm({
        items: itemRequest.request_items.map((item) => ({
            id: item.id,
            qty_approved: item.qty_requested, // Default to requested qty
        })),
    });

    const rejectForm = useForm({
        rejection_reason: '',
    });

    const outboundForm = useForm({
        notes: '',
    });

    const receiveForm = useForm({
        notes: '',
    });

    const cancelForm = useForm();

    // Dialog control states
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [isOutboundOpen, setIsOutboundOpen] = useState(false);
    const [isReceiveOpen, setIsReceiveOpen] = useState(false);

    // Helpers
    const handleApproveQtyChange = (itemId: number, val: number) => {
        approveForm.setData('items', approveForm.data.items.map((item) =>
            item.id === itemId ? { ...item, qty_approved: val } : item
        ));
    };

    const submitApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.patch(`/requests/${itemRequest.id}/approve`, {
            onSuccess: () => {
                setIsApproveOpen(false);
            },
        });
    };

    const submitReject = (e: React.FormEvent) => {
        e.preventDefault();
        rejectForm.patch(`/requests/${itemRequest.id}/reject`, {
            onSuccess: () => {
                setIsRejectOpen(false);
            },
        });
    };

    const submitOutbound = (e: React.FormEvent) => {
        e.preventDefault();
        outboundForm.post(`/requests/${itemRequest.id}/outbound`, {
            onSuccess: () => {
                setIsOutboundOpen(false);
            },
        });
    };

    const submitReceive = (e: React.FormEvent) => {
        e.preventDefault();
        receiveForm.post(`/requests/${itemRequest.id}/receive`, {
            onSuccess: () => {
                setIsReceiveOpen(false);
            },
        });
    };

    const submitCancel = () => {
        if (confirm('Apakah Anda yakin ingin membatalkan permintaan ini?')) {
            cancelForm.delete(`/requests/${itemRequest.id}/cancel`);
        }
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
            <Head title={`Detail Permintaan - ${itemRequest.request_number}`} />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline" size="icon" className="h-8 w-8">
                            <Link href="/requests">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Detail Permintaan Barang</h1>
                            <p className="text-muted-foreground font-mono text-sm">Nomor: {itemRequest.request_number}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Cancel request button for Pemohon */}
                        {itemRequest.status === 'pending' && (role === 'pemohon' || role === 'super_admin') && (
                            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={submitCancel} disabled={cancelForm.processing}>
                                Batalkan Pengajuan
                            </Button>
                        )}

                        {/* Approve/Reject buttons for Manager */}
                        {itemRequest.status === 'pending' && (role === 'manager' || role === 'super_admin') && (
                            <>
                                <Button variant="outline" className="text-red-600 hover:text-red-700 border-red-200" onClick={() => setIsRejectOpen(true)}>
                                    <X className="h-4 w-4 mr-1.5" />
                                    <span>Tolak</span>
                                </Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsApproveOpen(true)}>
                                    <Check className="h-4 w-4 mr-1.5" />
                                    <span>Setujui Permintaan</span>
                                </Button>
                            </>
                        )}

                        {/* Dispatch Outbound button for Admin Gudang */}
                        {itemRequest.status === 'approved' && (role === 'admin_gudang' || role === 'super_admin') && (
                            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-1.5" onClick={() => setIsOutboundOpen(true)}>
                                <Truck className="h-4 w-4" />
                                <span>Kirim Barang / Proses Outbound</span>
                            </Button>
                        )}

                        {/* Confirm receipt button for Pemohon */}
                        {itemRequest.status === 'completed' && !itemRequest.goods_receipt && (role === 'pemohon' || role === 'super_admin') && (
                            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-1.5" onClick={() => setIsReceiveOpen(true)}>
                                <CheckCircle className="h-4 w-4" />
                                <span>Konfirmasi Penerimaan</span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left details */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="bg-muted/30">
                                <CardTitle>Daftar Barang Permintaan</CardTitle>
                                <CardDescription>Daftar barang dan jumlah yang disetujui untuk dikeluarkan.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="rounded-md border overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>SKU / Kode</TableHead>
                                                <TableHead>Nama Barang</TableHead>
                                                {(role === 'manager' || role === 'admin_gudang' || role === 'super_admin') && (
                                                    <TableHead className="text-right">Stok Gudang</TableHead>
                                                )}
                                                <TableHead className="text-right">Diajukan</TableHead>
                                                {itemRequest.status !== 'pending' && (
                                                    <TableHead className="text-right">Disetujui</TableHead>
                                                )}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {itemRequest.request_items.map((item) => {
                                                const product = item.product;
                                                const isStockLow = (item.available_stock ?? 0) < (item.qty_approved ?? item.qty_requested);

                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-mono text-xs">
                                                            <div>{product?.code}</div>
                                                            <div className="text-muted-foreground">{product?.sku}</div>
                                                        </TableCell>
                                                        <TableCell className="font-medium">{product?.name}</TableCell>
                                                        {(role === 'manager' || role === 'admin_gudang' || role === 'super_admin') && (
                                                            <TableCell className="text-right font-mono">
                                                                <span className={isStockLow ? 'text-red-500 font-semibold' : 'text-muted-foreground'}>
                                                                    {item.available_stock} {product?.unit?.symbol}
                                                                </span>
                                                            </TableCell>
                                                        )}
                                                        <TableCell className="text-right font-mono">
                                                            {item.qty_requested} {product?.unit?.symbol}
                                                        </TableCell>
                                                        {itemRequest.status !== 'pending' && (
                                                            <TableCell className="text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                                {item.qty_approved} {product?.unit?.symbol}
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Outbound Transaction Info */}
                        {itemRequest.outbound_transaction && (
                            <Card>
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5 text-indigo-500" />
                                        <span>Informasi Pengiriman (Outbound)</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">No. Transaksi Outbound</h4>
                                        <p className="mt-1 font-mono text-sm font-semibold">{itemRequest.outbound_transaction.transaction_number}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Tanggal Kirim</h4>
                                        <p className="mt-1 text-sm font-medium">
                                            {new Date(itemRequest.outbound_transaction.transaction_date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Diproses Oleh</h4>
                                        <p className="mt-1 text-sm font-medium">
                                            {itemRequest.outbound_transaction.processed_by_user?.name || itemRequest.outbound_transaction.processed_by?.name || '-'}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Catatan Petugas Gudang</h4>
                                        <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                                            {itemRequest.outbound_transaction.notes || 'Tidak ada catatan.'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Goods Receipt Confirmation */}
                        {itemRequest.goods_receipt && (
                            <Card>
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                                        <span>Konfirmasi Penerimaan Barang</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Tanggal Penerimaan</h4>
                                        <p className="mt-1 text-sm font-medium">
                                            {new Date(itemRequest.goods_receipt.received_at).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Diterima Oleh</h4>
                                        <p className="mt-1 text-sm font-medium">
                                            {itemRequest.goods_receipt.received_by_user?.name || itemRequest.goods_receipt.received_by?.name || '-'}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Catatan Penerima</h4>
                                        <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                                            {itemRequest.goods_receipt.notes || 'Tidak ada catatan.'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right details */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="bg-muted/30">
                                <CardTitle>Informasi Pengajuan</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex gap-3 items-start">
                                    <Landmark className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Gudang Penyimpanan</h4>
                                        <p className="mt-1 text-sm font-semibold">{itemRequest.warehouse?.name}</p>
                                        <span className="text-xs text-muted-foreground font-mono">{itemRequest.warehouse?.code}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start pt-3 border-t">
                                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Pemohon</h4>
                                        <p className="mt-1 text-sm font-medium">{itemRequest.requester?.name}</p>
                                        <p className="text-xs text-muted-foreground">{itemRequest.requester?.email}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start pt-3 border-t">
                                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Tanggal Pengajuan</h4>
                                        <p className="mt-1 text-sm font-medium">
                                            {new Date(itemRequest.request_date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start pt-3 border-t">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Status</h4>
                                        <div className="mt-1">{getStatusBadge(itemRequest.status)}</div>
                                    </div>
                                </div>

                                {itemRequest.status === 'rejected' && (
                                    <div className="flex gap-3 items-start pt-3 border-t text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200">
                                        <ShieldAlert className="h-4 w-4 mt-0.5" />
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase">Alasan Penolakan</h4>
                                            <p className="mt-1 text-sm leading-relaxed">{itemRequest.rejection_reason}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 items-start pt-3 border-t">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Keperluan Pemohon</h4>
                                        <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                            {itemRequest.notes || 'Tidak ada keterangan.'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Manager Approval Modal */}
                <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={submitApprove}>
                            <DialogHeader>
                                <DialogTitle>Persetujuan Permintaan</DialogTitle>
                                <DialogDescription>
                                    Sesuaikan jumlah barang yang disetujui untuk dikirim oleh Gudang.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                {itemRequest.request_items.map((item, idx) => (
                                    <div key={item.id} className="grid grid-cols-3 items-center gap-4 p-2 rounded border bg-card">
                                        <div className="col-span-2">
                                            <Label className="font-semibold">{item.product?.name}</Label>
                                            <p className="text-xs text-muted-foreground">Diminta: {item.qty_requested} &bull; Tersedia: {item.available_stock}</p>
                                        </div>
                                        <div>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={item.qty_requested}
                                                value={approveForm.data.items[idx]?.qty_approved ?? 0}
                                                onChange={(e) => handleApproveQtyChange(item.id, parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsApproveOpen(false)} disabled={approveForm.processing}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={approveForm.processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    Setujui
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Manager Rejection Modal */}
                <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <form onSubmit={submitReject}>
                            <DialogHeader>
                                <DialogTitle>Tolak Permintaan</DialogTitle>
                                <DialogDescription>
                                    Berikan alasan penolakan permintaan barang ini agar dapat diketahui pemohon.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="rejection_reason">Alasan Penolakan</Label>
                                    <Textarea
                                        id="rejection_reason"
                                        value={rejectForm.data.rejection_reason}
                                        onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                        placeholder="Tulis alasan..."
                                        rows={3}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsRejectOpen(false)} disabled={rejectForm.processing}>
                                    Batal
                                </Button>
                                <Button type="submit" variant="destructive" disabled={rejectForm.processing}>
                                    Tolak
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dispatch / Outbound Modal */}
                <Dialog open={isOutboundOpen} onOpenChange={setIsOutboundOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <form onSubmit={submitOutbound}>
                            <DialogHeader>
                                <DialogTitle>Kirim Barang / Proses Outbound</DialogTitle>
                                <DialogDescription>
                                    Konfirmasi pengiriman barang dari gudang. Tindakan ini akan langsung mendecement stok di gudang target.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="outbound_notes">Catatan Pengiriman</Label>
                                    <Textarea
                                        id="outbound_notes"
                                        value={outboundForm.data.notes}
                                        onChange={(e) => outboundForm.setData('notes', e.target.value)}
                                        placeholder="Catatan pengiriman barang..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsOutboundOpen(false)} disabled={outboundForm.processing}>
                                    Batal
                                </Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={outboundForm.processing}>
                                    Kirim Barang
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Confirm Receipt Modal */}
                <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <form onSubmit={submitReceive}>
                            <DialogHeader>
                                <DialogTitle>Konfirmasi Penerimaan Barang</DialogTitle>
                                <DialogDescription>
                                    Apakah barang sudah diterima dengan lengkap dan sesuai? Konfirmasi di bawah ini.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="receive_notes">Catatan Penerima</Label>
                                    <Textarea
                                        id="receive_notes"
                                        value={receiveForm.data.notes}
                                        onChange={(e) => receiveForm.setData('notes', e.target.value)}
                                        placeholder="Kondisi barang saat diterima..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsReceiveOpen(false)} disabled={receiveForm.processing}>
                                    Batal
                                </Button>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={receiveForm.processing}>
                                    Konfirmasi Terima
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

RequestShow.layout = {
    breadcrumbs: [
        {
            title: 'Permintaan Barang',
            href: '/requests',
        },
        {
            title: 'Detail',
            href: '',
        },
    ],
};
