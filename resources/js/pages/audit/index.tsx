import { useState } from 'react';
import { Head } from '@inertiajs/react';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Eye, Clock, Terminal } from 'lucide-react';

type AuditLogType = {
    id: number;
    user_id: number;
    module: string;
    action: string;
    description: string | null;
    ip_address: string | null;
    created_at: string;
    user?: {
        name: string;
        email: string;
        code_user: string;
    };
};

type Props = {
    logs: {
        data: AuditLogType[];
        links: any[];
    };
    modules: string[];
    filters: {
        search?: string;
        module?: string;
    };
};

export default function AuditLogsIndex({ logs, modules, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedModule, setSelectedModule] = useState(filters.module || 'all');

    const handleSearchChange = (val: string) => {
        setSearch(val);
        reloadPage(val, selectedModule);
    };

    const handleModuleFilterChange = (val: string) => {
        setSelectedModule(val);
        reloadPage(search, val);
    };

    const reloadPage = (searchVal: string, moduleVal: string) => {
        const url = new URL(window.location.href);
        if (searchVal) {
            url.searchParams.set('search', searchVal);
        } else {
            url.searchParams.delete('search');
        }

        if (moduleVal && moduleVal !== 'all') {
            url.searchParams.set('module', moduleVal);
        } else {
            url.searchParams.delete('module');
        }

        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
    };

    const getModuleBadge = (module: string) => {
        switch (module) {
            case 'User Management':
                return <Badge className="bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 hover:bg-sky-100 py-0.5 font-medium">{module}</Badge>;
            case 'Master Data':
                return <Badge className="bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-300 hover:bg-violet-100 py-0.5 font-medium">{module}</Badge>;
            case 'Permintaan Barang':
                return <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-100 py-0.5 font-medium">{module}</Badge>;
            case 'Barang Masuk':
                return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 py-0.5 font-medium">{module}</Badge>;
            case 'Barang Keluar':
                return <Badge className="bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950 dark:text-pink-300 hover:bg-pink-100 py-0.5 font-medium">{module}</Badge>;
            case 'Mutasi Stok':
                return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-100 py-0.5 font-medium">{module}</Badge>;
            default:
                return <Badge variant="secondary" className="py-0.5 font-medium">{module}</Badge>;
        }
    };

    const getActionBadge = (action: string) => {
        if (action.includes('create') || action.includes('store') || action.includes('generate')) {
            return <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white font-mono text-[10px] uppercase py-0 px-1.5">Create</Badge>;
        } else if (action.includes('update') || action.includes('edit') || action.includes('toggle') || action.includes('status_change')) {
            return <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-mono text-[10px] uppercase py-0 px-1.5">Update</Badge>;
        } else if (action.includes('delete') || action.includes('destroy') || action.includes('cancel')) {
            return <Badge className="bg-rose-500 hover:bg-rose-500 text-white font-mono text-[10px] uppercase py-0 px-1.5">Delete</Badge>;
        } else {
            return <Badge variant="outline" className="font-mono text-[10px] uppercase py-0 px-1.5">{action}</Badge>;
        }
    };

    return (
        <>
            <Head title="Audit Log Aktivitas" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Shield className="h-6 w-6 text-indigo-600" />
                            <span>Audit Log Aktivitas</span>
                        </h1>
                        <p className="text-muted-foreground">Monitor dan lacak seluruh tindakan dan perubahan data yang dilakukan oleh pengguna sistem.</p>
                    </div>

                    <div className="w-full md:w-56">
                        <Label htmlFor="filter-module" className="sr-only">Filter Modul</Label>
                        <Select value={selectedModule} onValueChange={handleModuleFilterChange}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Semua Modul" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Modul</SelectItem>
                                {modules.map((mod) => (
                                    <SelectItem key={mod} value={mod}>
                                        {mod}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DataTable
                    headers={['Pengguna', 'Modul', 'Tindakan', 'Keterangan Aktivitas', 'Alamat IP', 'Waktu']}
                    items={logs.data}
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Cari aktivitas atau nama..."
                    paginationLinks={logs.links}
                    renderRow={(log, idx) => {
                        return (
                            <tr key={log.id} className="border-b transition-colors hover:bg-muted/50 text-sm">
                                <td className="p-4">
                                    <div className="font-semibold text-slate-900">{log.user?.name || 'Sistem'}</div>
                                    <div className="text-xs text-muted-foreground font-mono">
                                        {log.user?.code_user || '-'}
                                    </div>
                                </td>
                                <td className="p-4">
                                    {getModuleBadge(log.module)}
                                </td>
                                <td className="p-4">
                                    {getActionBadge(log.action)}
                                </td>
                                <td className="p-4 text-slate-700 font-medium">
                                    {log.description}
                                </td>
                                <td className="p-4 font-mono text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Terminal className="h-3 w-3" />
                                    <span>{log.ip_address || '-'}</span>
                                </td>
                                <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>
                                            {new Date(log.created_at).toLocaleDateString('id-ID')} &bull; {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    }}
                />
            </div>
        </>
    );
}

AuditLogsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Audit Log',
            href: '/audit-logs',
        },
    ],
};
