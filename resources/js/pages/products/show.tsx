import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Box, Archive, HelpCircle } from 'lucide-react';
import type { Product, Stock } from '@/types';

type Props = {
    product: Product & {
        total_stock?: number;
        stocks?: (Stock & {
            warehouse?: {
                id: number;
                code: string;
                name: string;
            };
        })[];
    };
    canManage: boolean;
};

export default function ProductShow({ product, canManage }: Props) {
    return (
        <>
            <Head title={`Detail Barang - ${product.name}`} />
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <Link href="/products">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
                        <p className="text-muted-foreground font-mono text-sm">SKU: {product.sku} &bull; Kode: {product.code}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column: Details */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="bg-muted/30">
                                <CardTitle>Spesifikasi Barang</CardTitle>
                                <CardDescription>Informasi detail mengenai identitas barang.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 grid grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama Barang</h4>
                                    <p className="mt-1 text-sm font-medium">{product.name}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategori</h4>
                                    <p className="mt-1 text-sm font-medium">{product.category?.name || '-'}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Satuan</h4>
                                    <p className="mt-1 text-sm font-medium">
                                        <Badge variant="secondary" className="font-normal">
                                            {product.unit?.name} ({product.unit?.symbol})
                                        </Badge>
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stok Minimum</h4>
                                    <p className="mt-1 text-sm font-medium font-mono">{product.minimum_stock}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status Keaktifan</h4>
                                    <div className="mt-1 flex gap-1.5">
                                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                            {product.is_active ? 'Aktif' : 'Non-aktif'}
                                        </Badge>
                                        {product.is_hold && (
                                            <Badge variant="destructive">Ditangguhkan</Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Stok Tersedia</h4>
                                    <p className="mt-1 text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                        {product.total_stock ?? 0} {product.unit?.symbol}
                                    </p>
                                </div>
                                <div className="col-span-2 pt-2 border-t">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deskripsi / Spesifikasi Tambahan</h4>
                                    <p className="mt-1.5 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                        {product.description || 'Tidak ada deskripsi spesifik.'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Stock per Warehouse */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2">
                                    <Archive className="h-5 w-5 text-indigo-500" />
                                    <span>Sebaran Stok Gudang</span>
                                </CardTitle>
                                <CardDescription>Jumlah stok di masing-masing gudang.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {product.stocks && product.stocks.length > 0 ? (
                                    <div className="space-y-4">
                                        {product.stocks.map((stock) => (
                                            <div key={stock.id} className="flex justify-between items-center p-3 rounded-lg border bg-card shadow-sm">
                                                <div>
                                                    <span className="font-semibold text-sm">{stock.warehouse?.name}</span>
                                                    <div className="text-xs text-muted-foreground font-mono">{stock.warehouse?.code}</div>
                                                </div>
                                                <Badge variant="outline" className="font-mono text-sm px-2.5 py-1">
                                                    {stock.qty} {product.unit?.symbol}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                        <Box className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                                        <p className="text-sm font-medium text-muted-foreground">Belum ada stok tercatat.</p>
                                        <p className="text-xs text-muted-foreground max-w-[200px] mx-auto mt-1">
                                            Lakukan transaksi barang masuk (Inbound) untuk mengisi stok.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

ProductShow.layout = {
    breadcrumbs: [
        {
            title: 'Daftar Barang',
            href: '/products',
        },
        {
            title: 'Detail',
            href: '', // dynamic
        },
    ],
};
