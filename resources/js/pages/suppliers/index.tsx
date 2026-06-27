import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit2, SwitchCamera, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Supplier } from '@/types';

type Props = {
    suppliers: {
        data: Supplier[];
        links: any[];
    };
    filters: {
        search?: string;
    };
    canManage: boolean;
};

export default function SuppliersIndex({ suppliers, filters, canManage }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        phone: '',
        address: '',
    });

    const handleSearchChange = (val: string) => {
        setSearch(val);
        const url = new URL(window.location.href);
        if (val) {
            url.searchParams.set('search', val);
        } else {
            url.searchParams.delete('search');
        }
        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
    };

    const openAddDialog = () => {
        setEditingSupplier(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setData({
            name: supplier.name,
            phone: supplier.phone || '',
            address: supplier.address || '',
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSupplier) {
            put(`/suppliers/${editingSupplier.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post('/suppliers', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const toggleStatus = (supplier: Supplier) => {
        router.patch(`/suppliers/${supplier.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Supplier Pemasok" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Supplier Pemasok</h1>
                    <p className="text-muted-foreground">Kelola mitra penyedia/pemasok barang inventaris kantor.</p>
                </div>

                <DataTable
                    headers={['Nama Supplier', 'No. Telepon', 'Alamat', 'Status', 'Aksi']}
                    items={suppliers.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari supplier..."
                    onAddClick={canManage ? openAddDialog : undefined}
                    addText="Supplier Baru"
                    paginationLinks={suppliers.links}
                    renderRow={(supplier, idx) => (
                        <tr key={supplier.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 font-medium">{supplier.name}</td>
                            <td className="p-4 text-muted-foreground">{supplier.phone || '-'}</td>
                            <td className="p-4 text-muted-foreground max-w-xs truncate">{supplier.address || '-'}</td>
                            <td className="p-4">
                                <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                                    {supplier.is_active ? 'Aktif' : 'Non-aktif'}
                                </Badge>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                        onClick={() => openEditDialog(supplier)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    {canManage && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className={`h-8 w-8 ${supplier.is_active ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'} dark:hover:bg-opacity-20`}
                                            onClick={() => toggleStatus(supplier)}
                                            title={supplier.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                        >
                                            {supplier.is_active ? (
                                                <ToggleRight className="h-5 w-5" />
                                            ) : (
                                                <ToggleLeft className="h-5 w-5" />
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )}
                />

                {/* Create/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}</DialogTitle>
                                <DialogDescription>
                                    Isi formulir di bawah untuk menyimpan data supplier.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Supplier</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: PT. Sumber Makmur"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">No. Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Contoh: 08123456789"
                                    />
                                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Alamat</Label>
                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Alamat lengkap supplier..."
                                        rows={3}
                                    />
                                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={processing}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

SuppliersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Supplier',
            href: '/suppliers',
        },
    ],
};
