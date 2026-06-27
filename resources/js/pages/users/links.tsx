import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/data-table';
import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Copy, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { Role } from '@/types';

type RegistrationLinkType = {
    id: number;
    token: string;
    role_id: number;
    is_used: boolean;
    expires_at: string;
    created_at: string;
    role?: Role;
};

type Props = {
    links: {
        data: RegistrationLinkType[];
        links: any[];
    };
    roles: Role[];
    appUrl: string;
};

export default function RegistrationLinksIndex({ links, roles, appUrl }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deletingLink, setDeletingLink] = useState<RegistrationLinkType | null>(null);

    const { data, setData, post, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        role_id: '',
        expires_days: 7,
    });

    const openAddDialog = () => {
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users/registration-links', {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (deletingLink) {
            destroy(`/users/registration-links/${deletingLink.id}`, {
                onSuccess: () => {
                    setDeletingLink(null);
                },
            });
        }
    };

    const copyLinkToClipboard = (token: string) => {
        // Build the register url
        const cleanAppUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
        const registerUrl = `${cleanAppUrl}/register?token=${token}`;

        navigator.clipboard.writeText(registerUrl)
            .then(() => {
                toast.success('Link registrasi berhasil disalin ke clipboard!');
            })
            .catch(() => {
                toast.error('Gagal menyalin link.');
            });
    };

    const getLinkStatus = (link: RegistrationLinkType) => {
        if (link.is_used) {
            return {
                label: 'Sudah Digunakan',
                variant: 'secondary' as const,
                icon: CheckCircle2,
            };
        }

        const isExpired = new Date(link.expires_at) < new Date();
        if (isExpired) {
            return {
                label: 'Kedaluwarsa',
                variant: 'destructive' as const,
                icon: Clock,
            };
        }

        return {
            label: 'Aktif / Belum Digunakan',
            variant: 'default' as const,
            icon: Clock,
        };
    };

    return (
        <>
            <Head title="Link Registrasi Petugas" />
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <Link href="/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Link Registrasi Petugas</h1>
                        <p className="text-muted-foreground">Buat token registrasi aman berkala untuk pendaftaran mandiri petugas sesuai peranannya.</p>
                    </div>
                </div>

                <DataTable
                    headers={['Role Pendaftar', 'Token Registrasi', 'Masa Berlaku', 'Status', 'Aksi']}
                    items={links.data}
                    onAddClick={openAddDialog}
                    addText="Buat Link Baru"
                    paginationLinks={links.links}
                    renderRow={(link, idx) => {
                        const status = getLinkStatus(link);
                        const StatusIcon = status.icon;
                        const dateFormatted = new Date(link.expires_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                        return (
                            <tr key={link.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 font-semibold">{link.role?.nama || '-'}</td>
                                <td className="p-4 font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                                    {link.token}
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">{dateFormatted}</td>
                                <td className="p-4">
                                    <Badge variant={status.variant} className="gap-1">
                                        <StatusIcon className="h-3 w-3" />
                                        <span>{status.label}</span>
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {!link.is_used && new Date(link.expires_at) >= new Date() && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                onClick={() => copyLinkToClipboard(link.token)}
                                                title="Salin Link Pendaftaran"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => setDeletingLink(link)}
                                            title="Hapus Link"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    }}
                />

                {/* Create Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>Buat Link Registrasi Baru</DialogTitle>
                                <DialogDescription>
                                    Tentukan peranan akun yang akan dibuat dan masa aktif link registrasi ini.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="role_id">Role Sasaran</Label>
                                    <Select
                                        value={data.role_id}
                                        onValueChange={(val) => setData('role_id', val)}
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
                                    {errors.role_id && <p className="text-xs text-red-500">{errors.role_id}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="expires_days">Masa Aktif Link (Hari)</Label>
                                    <Select
                                        value={String(data.expires_days)}
                                        onValueChange={(val) => setData('expires_days', parseInt(val) || 7)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Durasi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 Hari</SelectItem>
                                            <SelectItem value="3">3 Hari</SelectItem>
                                            <SelectItem value="7">7 Hari (Default)</SelectItem>
                                            <SelectItem value="14">14 Hari</SelectItem>
                                            <SelectItem value="30">30 Hari</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.expires_days && <p className="text-xs text-red-500">{errors.expires_days}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={processing}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Generate Token
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Revoke/Delete Confirmation */}
                <ConfirmDialog
                    isOpen={deletingLink !== null}
                    onClose={() => setDeletingLink(null)}
                    onConfirm={handleDelete}
                    title="Hapus Link Registrasi?"
                    description="Link pendaftaran pendaftar akan dinonaktifkan permanen dan tidak dapat digunakan lagi."
                    confirmText="Hapus"
                    cancelText="Batal"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}

RegistrationLinksIndex.layout = {
    breadcrumbs: [
        {
            title: 'Pengguna',
            href: '/users',
        },
        {
            title: 'Link Registrasi',
            href: '/users/registration-links',
        },
    ],
};
