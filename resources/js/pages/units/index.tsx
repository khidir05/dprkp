import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit2, Trash2 } from 'lucide-react';
import type { Unit } from '@/types';

type Props = {
    units: {
        data: Unit[];
        links: any[];
    };
    filters: {
        search?: string;
    };
    canManage: boolean;
};

export default function UnitsIndex({ units, filters, canManage }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        symbol: '',
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
        setEditingUnit(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (unit: Unit) => {
        setEditingUnit(unit);
        setData({
            name: unit.name,
            symbol: unit.symbol,
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUnit) {
            put(`/units/${editingUnit.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post('/units', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (deletingUnit) {
            destroy(`/units/${deletingUnit.id}`, {
                onSuccess: () => {
                    setDeletingUnit(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Satuan Barang" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Satuan Barang</h1>
                    <p className="text-muted-foreground">Kelola satuan atau unit pengukuran barang inventaris.</p>
                </div>

                <DataTable
                    headers={['Nama Satuan', 'Simbol', 'Aksi']}
                    items={units.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari satuan..."
                    onAddClick={canManage ? openAddDialog : undefined}
                    addText="Satuan Baru"
                    paginationLinks={units.links}
                    renderRow={(unit, idx) => (
                        <tr key={unit.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 font-medium">{unit.name}</td>
                            <td className="p-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                    {unit.symbol}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                        onClick={() => openEditDialog(unit)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    {canManage && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                            onClick={() => setDeletingUnit(unit)}
                                        >
                                            <Trash2 className="h-4 w-4" />
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
                                <DialogTitle>{editingUnit ? 'Edit Satuan' : 'Tambah Satuan Baru'}</DialogTitle>
                                <DialogDescription>
                                    Isi formulir di bawah untuk menyimpan data satuan barang.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Satuan</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Kilogram, Buah"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="symbol">Simbol</Label>
                                    <Input
                                        id="symbol"
                                        value={data.symbol}
                                        onChange={(e) => setData('symbol', e.target.value)}
                                        placeholder="Contoh: kg, pcs, box"
                                        required
                                    />
                                    {errors.symbol && <p className="text-sm text-red-500">{errors.symbol}</p>}
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

                {/* Delete Confirmation */}
                <ConfirmDialog
                    isOpen={deletingUnit !== null}
                    onClose={() => setDeletingUnit(null)}
                    onConfirm={handleDelete}
                    title="Hapus Satuan?"
                    description={`Apakah Anda yakin ingin menghapus satuan "${deletingUnit?.name}"?`}
                    confirmText="Hapus"
                    cancelText="Batal"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}

UnitsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Satuan',
            href: '/units',
        },
    ],
};
