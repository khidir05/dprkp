import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit2, Trash2 } from 'lucide-react';
import type { Category } from '@/types';

type Props = {
    categories: {
        data: Category[];
        links: any[];
    };
    filters: {
        search?: string;
    };
    canManage: boolean;
};

export default function CategoriesIndex({ categories, filters, canManage }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
    });

    // Handle search query
    const handleSearchChange = (val: string) => {
        setSearch(val);
        // Throttle/debounce reload or just simple reload
        const url = new URL(window.location.href);
        if (val) {
            url.searchParams.set('search', val);
        } else {
            url.searchParams.delete('search');
        }
        url.searchParams.delete('page'); // Reset to first page
        window.location.href = url.pathname + url.search;
    };

    const openAddDialog = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            description: category.description || '',
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post('/categories', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (deletingCategory) {
            destroy(`/categories/${deletingCategory.id}`, {
                onSuccess: () => {
                    setDeletingCategory(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Kategori Barang" />
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kategori Barang</h1>
                        <p className="text-muted-foreground">Kelola kategori inventaris barang milik kantor.</p>
                    </div>
                </div>

                <DataTable
                    headers={['Nama Kategori', 'Deskripsi', 'Aksi']}
                    items={categories.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari kategori..."
                    onAddClick={canManage ? openAddDialog : undefined}
                    addText="Kategori Baru"
                    paginationLinks={categories.links}
                    renderRow={(category, idx) => (
                        <tr key={category.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 font-medium">{category.name}</td>
                            <td className="p-4 text-muted-foreground max-w-md truncate">
                                {category.description || '-'}
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                        onClick={() => openEditDialog(category)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    {canManage && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                            onClick={() => setDeletingCategory(category)}
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
                                <DialogTitle>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
                                <DialogDescription>
                                    Isi formulir di bawah untuk menyimpan data kategori barang.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Kategori</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Alat Tulis Kantor"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Keterangan kategori barang..."
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
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
                    isOpen={deletingCategory !== null}
                    onClose={() => setDeletingCategory(null)}
                    onConfirm={handleDelete}
                    title="Hapus Kategori?"
                    description={`Apakah Anda yakin ingin menghapus kategori "${deletingCategory?.name}"?`}
                    confirmText="Hapus"
                    cancelText="Batal"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Kategori',
            href: '/categories',
        },
    ],
};
