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
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Warehouse } from '@/types';

type AssignableUser = {
    id: number;
    name: string;
    email: string;
    role_model?: {
        nama: string;
    };
};

type Props = {
    warehouses: {
        data: Warehouse[];
        links: any[];
    };
    assignableUsers: AssignableUser[];
    filters: {
        search?: string;
    };
    canManage: boolean;
};

export default function WarehousesIndex({ warehouses, assignableUsers, filters, canManage }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        code: '',
        name: '',
        address: '',
    });

    const assignForm = useForm({
        user_ids: [] as number[],
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
        setEditingWarehouse(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
        setData({
            code: warehouse.code,
            name: warehouse.name,
            address: warehouse.address || '',
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const openAssignDialog = (warehouse: Warehouse) => {
        setSelectedWarehouse(warehouse);
        assignForm.setData({
            user_ids: warehouse.users?.map((u) => u.id) || [],
        });
        setIsAssignDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingWarehouse) {
            put(`/warehouses/${editingWarehouse.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post('/warehouses', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleAssignSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedWarehouse) {
            assignForm.post(`/warehouses/${selectedWarehouse.id}/assign-users`, {
                onSuccess: () => {
                    setIsAssignDialogOpen(false);
                },
            });
        }
    };

    const toggleStatus = (warehouse: Warehouse) => {
        router.patch(`/warehouses/${warehouse.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const handleUserCheckboxChange = (userId: number, checked: boolean) => {
        const currentIds = [...assignForm.data.user_ids];
        if (checked) {
            assignForm.setData('user_ids', [...currentIds, userId]);
        } else {
            assignForm.setData('user_ids', currentIds.filter((id) => id !== userId));
        }
    };

    return (
        <>
            <Head title="Gudang Inventaris" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gudang Inventaris</h1>
                    <p className="text-muted-foreground">Kelola lokasi gudang penyimpanan dan petugas yang bertanggung jawab.</p>
                </div>

                <DataTable
                    headers={['Kode', 'Nama Gudang', 'Alamat', 'Petugas', 'Status', 'Aksi']}
                    items={warehouses.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari gudang..."
                    onAddClick={canManage ? openAddDialog : undefined}
                    addText="Gudang Baru"
                    paginationLinks={warehouses.links}
                    renderRow={(warehouse, idx) => (
                        <tr key={warehouse.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 font-mono text-sm font-semibold">{warehouse.code}</td>
                            <td className="p-4 font-medium">{warehouse.name}</td>
                            <td className="p-4 text-muted-foreground max-w-xs truncate">{warehouse.address || '-'}</td>
                            <td className="p-4">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {warehouse.users && warehouse.users.length > 0 ? (
                                        warehouse.users.map((user) => (
                                            <Badge key={user.id} variant="outline" className="text-xs">
                                                {user.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-xs text-muted-foreground">- Belum ada petugas -</span>
                                    )}
                                </div>
                            </td>
                            <td className="p-4">
                                <Badge variant={warehouse.is_active ? 'default' : 'secondary'}>
                                    {warehouse.is_active ? 'Aktif' : 'Non-aktif'}
                                </Badge>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                        onClick={() => openEditDialog(warehouse)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    {canManage && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                                                onClick={() => openAssignDialog(warehouse)}
                                                title="Assign Petugas"
                                            >
                                                <Users className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className={`h-8 w-8 ${warehouse.is_active ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'} dark:hover:bg-opacity-20`}
                                                onClick={() => toggleStatus(warehouse)}
                                                title={warehouse.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            >
                                                {warehouse.is_active ? (
                                                    <ToggleRight className="h-5 w-5" />
                                                ) : (
                                                    <ToggleLeft className="h-5 w-5" />
                                                )}
                                            </Button>
                                        </>
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
                                <DialogTitle>{editingWarehouse ? 'Edit Gudang' : 'Tambah Gudang Baru'}</DialogTitle>
                                <DialogDescription>
                                    Isi formulir di bawah untuk menyimpan data gudang inventaris.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="code">Kode Gudang</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="Contoh: GDG-A"
                                        required
                                    />
                                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Gudang</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Gudang Utama Atas"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Alamat / Lokasi</Label>
                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Lokasi detail gudang..."
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

                {/* Assign Users Dialog */}
                <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                    <DialogContent className="sm:max-w-[450px]">
                        <form onSubmit={handleAssignSubmit}>
                            <DialogHeader>
                                <DialogTitle>Assign Petugas Gudang</DialogTitle>
                                <DialogDescription>
                                    Pilih petugas yang bertanggung jawab untuk mengelola gudang "{selectedWarehouse?.name}".
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 max-h-[300px] overflow-y-auto space-y-3">
                                {assignableUsers.length > 0 ? (
                                    assignableUsers.map((user) => {
                                        const isChecked = assignForm.data.user_ids.includes(user.id);
                                        return (
                                            <div key={user.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50">
                                                <Checkbox
                                                    id={`user-${user.id}`}
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => handleUserCheckboxChange(user.id, !!checked)}
                                                />
                                                <div className="grid gap-0.5 leading-none">
                                                    <Label htmlFor={`user-${user.id}`} className="font-medium cursor-pointer">
                                                        {user.name}
                                                    </Label>
                                                    <span className="text-xs text-muted-foreground">
                                                        {user.email} &bull; {user.role_model?.nama || 'Petugas'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center">Tidak ada petugas aktif untuk dipilih.</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)} disabled={assignForm.processing}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={assignForm.processing}>
                                    Simpan Perubahan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

WarehousesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Gudang',
            href: '/warehouses',
        },
    ],
};
