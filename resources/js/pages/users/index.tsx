import { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, ToggleLeft, ToggleRight, UserPlus, Link2 } from 'lucide-react';
import type { User, Role, Warehouse } from '@/types';

type ManageableUser = User & {
    code_user?: string | null;
    username?: string | null;
    phone?: string | null;
    role_model?: Role;
    warehouses?: Warehouse[];
};

type Props = {
    users: {
        data: ManageableUser[];
        links: any[];
    };
    roles: Role[];
    filters: {
        search?: string;
        role_id?: string;
    };
};

export default function UsersIndex({ users, roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedRoleId, setSelectedRoleId] = useState(filters.role_id || 'all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        role: '',
        name: '',
        email: '',
        username: '',
        phone: '',
        password: '',
    });

    const handleSearchChange = (val: string) => {
        setSearch(val);
        reloadPage(val, selectedRoleId);
    };

    const handleRoleFilterChange = (val: string) => {
        setSelectedRoleId(val);
        reloadPage(search, val);
    };

    const reloadPage = (searchVal: string, roleVal: string) => {
        const url = new URL(window.location.href);
        if (searchVal) {
            url.searchParams.set('search', searchVal);
        } else {
            url.searchParams.delete('search');
        }

        if (roleVal && roleVal !== 'all') {
            url.searchParams.set('role_id', roleVal);
        } else {
            url.searchParams.delete('role_id');
        }

        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
    };

    const openAddDialog = () => {
        setEditingUser(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        setData({
            role: String(user.role),
            name: user.name,
            email: user.email,
            username: user.username as string,
            phone: (user.phone as string) || '',
            password: '', // Leave blank by default on edit
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const toggleStatus = (user: User) => {
        router.patch(`/users/${user.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Manajemen Pengguna" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
                        <p className="text-muted-foreground">Kelola akun petugas, peranan, dan tautan pendaftaran sistem.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild variant="outline" size="sm" className="h-9 gap-1.5">
                            <Link href="/users/registration-links">
                                <Link2 className="h-4 w-4 text-indigo-500" />
                                <span>Link Registrasi</span>
                            </Link>
                        </Button>

                        <div className="w-44">
                            <Select value={selectedRoleId} onValueChange={handleRoleFilterChange}>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Semua Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Role</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={String(role.id)}>
                                            {role.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DataTable<ManageableUser>
                    headers={['Kode User', 'Nama Petugas', 'Username', 'Email & Telp', 'Role', 'Gudang Akses', 'Status', 'Aksi']}
                    items={users.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari nama, email, username..."
                    onAddClick={openAddDialog}
                    addText="Buat User Langsung"
                    paginationLinks={users.links}
                    renderRow={(user, idx) => (
                        <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 font-mono text-sm font-semibold">{user.code_user || '-'}</td>
                            <td className="p-4 font-medium">{user.name}</td>
                            <td className="p-4 font-mono text-sm">{user.username || '-'}</td>
                            <td className="p-4">
                                <div className="text-sm font-medium">{user.email}</div>
                                <div className="text-xs text-muted-foreground">{user.phone || '-'}</div>
                            </td>
                            <td className="p-4">
                                <Badge variant="outline" className="font-semibold text-xs">
                                    {user.role_model?.nama || '-'}
                                </Badge>
                            </td>
                            <td className="p-4">
                                <div className="flex flex-wrap gap-1 max-w-[180px]">
                                    {user.warehouses && user.warehouses.length > 0 ? (
                                        user.warehouses.map((wh) => (
                                            <Badge key={wh.id} variant="secondary" className="text-[10px] px-1.5 py-0.5 whitespace-nowrap">
                                                {wh.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-xs text-muted-foreground">-</span>
                                    )}
                                </div>
                            </td>
                            <td className="p-4">
                                <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                    {user.is_active ? 'Aktif' : 'Non-aktif'}
                                </Badge>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        onClick={() => openEditDialog(user)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={`h-8 w-8 ${user.is_active ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                                        onClick={() => toggleStatus(user)}
                                        title={user.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                                    >
                                        {user.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}
                />

                {/* Create / Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[480px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingUser ? 'Edit Akun Pengguna' : 'Buat Akun Baru (Langsung)'}</DialogTitle>
                                <DialogDescription>
                                    Isi data petugas secara lengkap. Super Admin dapat membuat akun secara langsung tanpa melalui link pendaftaran.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role / Peranan</Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={(val) => setData('role', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={String(role.id)}>
                                                        {role.nama}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            placeholder="Contoh: budi_gudang"
                                            required
                                        />
                                        {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nama Lengkap"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@dprkp.go.id"
                                            required
                                        />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">No. Telepon</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="Contoh: 08123456789"
                                        />
                                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Password {editingUser && <span className="text-xs text-muted-foreground">(Kosongkan jika tidak diubah)</span>}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        required={!editingUser}
                                    />
                                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
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

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Pengguna',
            href: '/users',
        },
    ],
};
