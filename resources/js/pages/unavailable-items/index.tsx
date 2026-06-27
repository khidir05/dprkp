import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, Plus, CheckCircle, XCircle, Trash2, Link2 } from 'lucide-react';

type UnavailableItemType = {
    id: number;
    product_name: string;
    qty_needed: number;
    notes: string | null;
    status: 'open' | 'processed' | 'closed';
    created_by: number;
    created_at: string;
    creator?: {
        name: string;
    };
};

type ProductType = {
    id: number;
    name: string;
    code: string;
    sku: string;
};

type Props = {
    items: {
        data: UnavailableItemType[];
        links: any[];
    };
    products: ProductType[];
    filters: {
        status?: string;
    };
    role: string;
};

export default function UnavailableItemsIndex({ items, products, filters, role }: Props) {
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'open');
    
    // Create form dialog
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const { data: createData, setData: setCreateData, post: postCreate, processing: createProcessing, reset: resetCreate } = useForm({
        product_name: '',
        qty_needed: 1,
        notes: '',
    });

    // Match dialog
    const [matchDialogOpen, setMatchDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<UnavailableItemType | null>(null);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [processingAction, setProcessingAction] = useState(false);

    const isManager = role === 'manager' || role === 'super_admin';
    const isAdminGudang = role === 'admin_gudang' || role === 'super_admin';

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

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postCreate('/unavailable-items', {
            onSuccess: () => {
                setCreateDialogOpen(false);
                resetCreate();
            }
        });
    };

    const openMatchDialog = (item: UnavailableItemType) => {
        setSelectedItem(item);
        setSelectedProductId('');
        setMatchDialogOpen(true);
    };

    const submitMatch = () => {
        if (!selectedItem || !selectedProductId) return;
        setProcessingAction(true);
        router.post(`/unavailable-items/${selectedItem.id}/process`, {
            product_id: selectedProductId
        }, {
            onSuccess: () => {
                setMatchDialogOpen(false);
                setSelectedItem(null);
                setSelectedProductId('');
            },
            onFinish: () => setProcessingAction(false)
        });
    };

    const handleCloseReport = (item: UnavailableItemType) => {
        if (confirm('Apakah Anda yakin ingin menutup laporan barang tidak tersedia ini?')) {
            setProcessingAction(true);
            router.post(`/unavailable-items/${item.id}/close`, {}, {
                onFinish: () => setProcessingAction(false)
            });
        }
    };

    const handleDeleteReport = (item: UnavailableItemType) => {
        if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
            router.delete(`/unavailable-items/${item.id}`);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return (
                    <Badge variant="destructive" className="gap-1.5 py-0.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Belum Diproses</span>
                    </Badge>
                );
            case 'processed':
                return (
                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-500 gap-1.5 py-0.5 text-white">
                        <Link2 className="h-3.5 w-3.5" />
                        <span>Restock Terhubung</span>
                    </Badge>
                );
            case 'closed':
                return (
                    <Badge variant="secondary" className="gap-1.5 py-0.5">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Selesai / Ditutup</span>
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Barang Tidak Tersedia" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kebutuhan Barang Tidak Tersedia</h1>
                        <p className="text-muted-foreground">Catat dan laporkan barang yang diminta pemohon tetapi belum tersedia atau tidak terdaftar.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="w-full md:w-48">
                            <Label htmlFor="filter-status" className="sr-only">Filter Status</Label>
                            <Select value={selectedStatus} onValueChange={handleStatusFilterChange}>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Status Laporan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="open">Belum Diproses</SelectItem>
                                    <SelectItem value="processed">Diproses (Restock)</SelectItem>
                                    <SelectItem value="closed">Ditutup</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {isAdminGudang && (
                            <Button className="h-9 gap-1.5" onClick={() => setCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4" />
                                <span>Laporkan Barang</span>
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
                    headers={['Nama Barang', 'Kebutuhan Jumlah', 'Catatan / Alasan', 'Status', 'Dilaporkan Oleh', 'Aksi']}
                    items={items.data}
                    searchPlaceholder="Cari barang tidak tersedia..."
                    paginationLinks={items.links}
                    renderRow={(item, idx) => {
                        return (
                            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 font-semibold text-slate-900">
                                    {item.product_name}
                                </td>
                                <td className="p-4 font-mono font-medium text-sm">
                                    {item.qty_needed} pcs
                                </td>
                                <td className="p-4 text-sm text-muted-foreground max-w-xs truncate" title={item.notes || ''}>
                                    {item.notes || '-'}
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(item.status)}
                                </td>
                                <td className="p-4 text-xs text-muted-foreground">
                                    <div>{item.creator?.name || 'Sistem'}</div>
                                    <div>{new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {isManager && item.status === 'open' && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-amber-600 border-amber-300 hover:bg-amber-50 h-8 gap-1"
                                                    onClick={() => openMatchDialog(item)}
                                                    disabled={processingAction}
                                                >
                                                    <Link2 className="h-3.5 w-3.5" />
                                                    <span>Hubungkan Barang</span>
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 text-rose-600 border-rose-300 hover:bg-rose-50"
                                                    onClick={() => handleCloseReport(item)}
                                                    disabled={processingAction}
                                                >
                                                    Tutup Laporan
                                                </Button>
                                            </>
                                        )}

                                        {item.status === 'open' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                                onClick={() => handleDeleteReport(item)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Hapus</span>
                                            </Button>
                                        )}

                                        {item.status !== 'open' && (
                                            <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    }}
                />
            </div>

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Laporkan Kebutuhan Barang Tidak Tersedia</DialogTitle>
                        <DialogDescription>
                            Isi nama barang, kuantitas kebutuhan, dan catatan tambahan agar Manager dapat mencocokkan produk dan menyetujui pengadaan/restok.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="product_name">Nama Barang</Label>
                            <Input
                                id="product_name"
                                placeholder="Contoh: Kursi Kantor Ergonomis, Tinta Printer HP 803"
                                value={createData.product_name}
                                onChange={(e) => setCreateData('product_name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="qty_needed">Jumlah Kebutuhan</Label>
                            <Input
                                id="qty_needed"
                                type="number"
                                min={1}
                                value={createData.qty_needed}
                                onChange={(e) => setCreateData('qty_needed', parseInt(e.target.value) || 1)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Catatan Tambahan</Label>
                            <Textarea
                                id="notes"
                                placeholder="Contoh: Barang diminta oleh Bidang Tata Ruang, tidak ada stok sama sekali di semua gudang."
                                value={createData.notes}
                                onChange={(e) => setCreateData('notes', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={createProcessing}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={createProcessing}>
                                {createProcessing ? 'Menyimpan...' : 'Laporkan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Match Dialog */}
            <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hubungkan Laporan ke Master Barang</DialogTitle>
                        <DialogDescription>
                            Pilih produk dari master barang yang cocok untuk laporan <strong>"{selectedItem?.product_name}"</strong>. Hal ini akan memicu entri restok resmi untuk barang yang dipilih.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="product-select">Pilih Produk Cocok</Label>
                            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih barang dari master..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((prod) => (
                                        <SelectItem key={prod.id} value={String(prod.id)}>
                                            {prod.name} ({prod.sku} / {prod.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMatchDialogOpen(false)} disabled={processingAction}>
                            Batal
                        </Button>
                        <Button onClick={submitMatch} disabled={!selectedProductId || processingAction}>
                            {processingAction ? 'Menyimpan...' : 'Proses & Restock'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

UnavailableItemsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Barang Tidak Tersedia',
            href: '/unavailable-items',
        },
    ],
};
