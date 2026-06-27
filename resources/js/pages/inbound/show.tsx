import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Calendar, FileText, Landmark, User, MessageSquare } from 'lucide-react';
import type { InboundTransaction, InboundItem } from '@/types';

type Props = {
    transaction: InboundTransaction & {
        inbound_items?: (InboundItem & {
            product?: {
                id: number;
                code: string;
                sku: string;
                name: string;
                category?: {
                    name: string;
                };
                unit?: {
                    symbol: string;
                };
            };
        })[];
    };
};

export default function InboundShow({ transaction }: Props) {
    const dateFormatted = new Date(transaction.transaction_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const totalQty = transaction.inbound_items?.reduce((sum, item) => sum + item.qty, 0) || 0;

    return (
        <>
            <Head title={`Detail Barang Masuk - ${transaction.transaction_number}`} />
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <Link href="/inbound">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Detail Barang Masuk</h1>
                        <p className="text-muted-foreground font-mono text-sm">Nomor: {transaction.transaction_number}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left: General Transaction Info Card */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="bg-muted/30">
                                <CardTitle>Detail Pengiriman</CardTitle>
                                <CardDescription>Informasi metadata barang masuk.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5">
                                <div className="flex gap-3 items-start">
                                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Tanggal Transaksi</h4>
                                        <p className="mt-1 text-sm font-medium">{dateFormatted}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <Landmark className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Supplier Pemasok</h4>
                                        <p className="mt-1 text-sm font-medium">{transaction.supplier?.name || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <Landmark className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Gudang Target</h4>
                                        <p className="mt-1 text-sm font-medium">{transaction.warehouse?.name}</p>
                                        <span className="text-xs text-muted-foreground font-mono">{transaction.warehouse?.code}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">No. Surat Jalan / Referensi</h4>
                                        <p className="mt-1 text-sm font-mono font-medium">{transaction.reference_document || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Dicatat Oleh</h4>
                                        <p className="mt-1 text-sm font-medium">{transaction.created_by_user?.name || transaction.created_by?.name || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start pt-3 border-t">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Catatan</h4>
                                        <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                                            {transaction.notes || 'Tidak ada catatan.'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Items list table */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="bg-muted/30 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Daftar Barang Diterima</CardTitle>
                                    <CardDescription>Rincian kuantitas barang yang dimasukkan.</CardDescription>
                                </div>
                                <Badge variant="outline" className="font-mono text-sm">
                                    Total: {totalQty} Barang
                                </Badge>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="rounded-md border overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Kode / SKU</TableHead>
                                                <TableHead>Nama Barang</TableHead>
                                                <TableHead>Kategori</TableHead>
                                                <TableHead className="text-right">Jumlah</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transaction.inbound_items?.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-mono text-xs">
                                                        <div>{item.product?.code}</div>
                                                        <div className="text-muted-foreground">{item.product?.sku}</div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.product?.name}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {item.product?.category?.name || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                        {item.qty} {item.product?.unit?.symbol}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

InboundShow.layout = {
    breadcrumbs: [
        {
            title: 'Barang Masuk',
            href: '/inbound',
        },
        {
            title: 'Detail Transaksi',
            href: '',
        },
    ],
};
