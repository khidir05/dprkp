import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Check, X, ShieldAlert, Calendar, Landmark, User, MessageSquare, ArrowRightLeft } from 'lucide-react';
import type { StockMutation } from '@/types';

type Props = {
    mutation: StockMutation & {
        product?: {
            id: number;
            code: string;
            sku: string;
            name: string;
            unit?: { symbol: string };
        };
        fromWarehouse?: { name: string; code: string };
        toWarehouse?: { name: string; code: string };
        createdBy?: { name: string; email: string };
        approvedBy?: { name: string };
    };
    role: string;
};

export default function MutationShow({ mutation, role }: Props) {
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);

    const approveForm = useForm({});
    const rejectForm = useForm({
        rejection_reason: '',
    });

    const submitApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.patch(`/mutations/${mutation.id}/approve`, {
            onSuccess: () => setIsApproveOpen(false),
        });
    };

    const submitReject = (e: React.FormEvent) => {
        e.preventDefault();
        rejectForm.patch(`/mutations/${mutation.id}/reject`, {
            onSuccess: () => setIsRejectOpen(false),
        });
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
            <Head title={`Detail Mutasi Stok - ${mutation.mutation_number}`} />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline" size="icon" className="h-8 w-8">
                            <Link href="/mutations">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Detail Mutasi Stok</h1>
                            <p className="text-muted-foreground font-mono text-sm">Nomor: {mutation.mutation_number}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {mutation.status === 'pending' && (role === 'manager' || role === 'super_admin') && (
                            <>
                                <Button variant="outline" className="text-red-600 hover:text-red-700 border-red-200" onClick={() => setIsRejectOpen(true)}>
                                    <X className="h-4 w-4 mr-1.5" />
                                    <span>Tolak (Batalkan Stok)</span>
                                </Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsApproveOpen(true)}>
                                    <Check className="h-4 w-4 mr-1.5" />
                                    <span>Setujui Mutasi</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left: General Transaction Info Card */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="bg-muted/30">
                                <CardTitle>Rincian Mutasi Barang</CardTitle>
                                <CardDescription>Detail pemindahan stok barang antar-gudang.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6 p-4 rounded-lg border bg-muted/20">
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Barang / Produk</h4>
                                        <p className="mt-1 text-sm font-semibold">{mutation.product?.name}</p>
                                        <p className="text-xs text-muted-foreground font-mono">
                                            SKU: {mutation.product?.sku} &bull; Kode: {mutation.product?.code}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kuantitas</h4>
                                        <p className="mt-1 text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
                                            {mutation.qty} {mutation.product?.unit?.symbol}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 border-t pt-6">
                                    <div>
                                        <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider">Dari Gudang (Asal)</h4>
                                        <p className="mt-1 text-sm font-semibold">{mutation.fromWarehouse?.name}</p>
                                        <span className="text-xs text-muted-foreground font-mono">{mutation.fromWarehouse?.code}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Ke Gudang (Tujuan)</h4>
                                        <p className="mt-1 text-sm font-semibold">{mutation.toWarehouse?.name}</p>
                                        <span className="text-xs text-muted-foreground font-mono">{mutation.toWarehouse?.code}</span>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Catatan Pengaju</h4>
                                    <p className="mt-1.5 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                                        {mutation.reason || 'Tidak ada catatan.'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right details */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="bg-muted/30">
                                <CardTitle>Informasi Pengajuan</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex gap-3 items-start">
                                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Diajukan Oleh</h4>
                                        <p className="mt-1 text-sm font-medium">{mutation.created_by_user?.name || mutation.created_by?.name || '-'}</p>
                                        <p className="text-xs text-muted-foreground">{mutation.created_by_user?.email || mutation.created_by?.email || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start pt-3 border-t">
                                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Tanggal Pengajuan</h4>
                                        <p className="mt-1 text-sm font-medium">
                                            {new Date(mutation.created_at || '').toLocaleDateString('id-ID', {
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
                                        <div className="mt-1">{getStatusBadge(mutation.status)}</div>
                                    </div>
                                </div>

                                {mutation.status !== 'pending' && mutation.approved_by && (
                                    <div className="flex gap-3 items-start pt-3 border-t">
                                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Diverifikasi Oleh</h4>
                                            <p className="mt-1 text-sm font-medium">{mutation.approved_by_user?.name || mutation.approved_by?.name || '-'}</p>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                {new Date(mutation.approved_at || '').toLocaleString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {mutation.status === 'rejected' && (
                                    <div className="flex gap-3 items-start pt-3 border-t text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200">
                                        <ShieldAlert className="h-4 w-4 mt-0.5" />
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase">Alasan Penolakan</h4>
                                            <p className="mt-1 text-sm leading-relaxed">{mutation.rejection_reason}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Manager Approval Confirmation Modal */}
                <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <form onSubmit={submitApprove}>
                            <DialogHeader>
                                <DialogTitle>Setujui Mutasi Barang</DialogTitle>
                                <DialogDescription>
                                    Apakah Anda yakin ingin menyetujui mutasi barang ini? Perubahan stok yang telah dilakukan oleh petugas Gudang akan dianggap sah secara resmi.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsApproveOpen(false)} disabled={approveForm.processing}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={approveForm.processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    Ya, Setujui
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Manager Rejection Modal (Trigger Reversal) */}
                <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <form onSubmit={submitReject}>
                            <DialogHeader>
                                <DialogTitle>Tolak Mutasi (Reversal Stok)</DialogTitle>
                                <DialogDescription>
                                    Berikan alasan penolakan. Tindakan ini akan **mengembalikan (reverse)** jumlah stok barang dari gudang tujuan ke gudang asal secara otomatis.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="rejection_reason">Alasan Penolakan / Reversal</Label>
                                    <Textarea
                                        id="rejection_reason"
                                        value={rejectForm.data.rejection_reason}
                                        onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                        placeholder="Tulis alasan pembatalan mutasi..."
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
                                    Tolak & Kembalikan Stok
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

MutationShow.layout = {
    breadcrumbs: [
        {
            title: 'Mutasi Stok',
            href: '/mutations',
        },
        {
            title: 'Detail',
            href: '',
        },
    ],
};
