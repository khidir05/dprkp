import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, Tags, Ruler, Truck, Warehouse, Package, 
    Users, Boxes, ArrowDownToLine, ClipboardList, 
    ArrowRightLeft, ShieldAlert, RefreshCw, PackageOpen, 
    Shield, FileText, ClipboardCheck
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { useCurrentUrl } from '@/hooks/use-current-url';

function SidebarNavGroup({ label, items }: { label: string; items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    if (items.length === 0) return null;

    return (
        <SidebarGroup className="px-2 py-1.5">
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase px-3 py-1">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                             asChild
                             isActive={isCurrentUrl(item.href)}
                             tooltip={{ children: item.title }}
                             className="rounded-xl transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="size-4" />}
                                <span className="font-medium text-sm">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRole = auth.user?.role_model?.code;

    const dashboardItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    const transaksiItems: NavItem[] = [
        {
            title: 'Stok Barang',
            href: '/stocks',
            icon: Boxes,
        },
        {
            title: 'Permintaan Barang',
            href: '/requests',
            icon: ClipboardList,
        },
    ];

    // GD, SA, MG can access other transactions
    if (['super_admin', 'manager', 'admin_gudang'].includes(userRole)) {
        transaksiItems.push(
            {
                title: 'Barang Masuk',
                href: '/inbound',
                icon: ArrowDownToLine,
            },
            {
                title: 'Mutasi Stok',
                href: '/mutations',
                icon: ArrowRightLeft,
            },
            {
                title: 'Opname Stok',
                href: '/stock-opnames',
                icon: ClipboardCheck,
            },
            {
                title: 'Restock Barang',
                href: '/restock',
                icon: RefreshCw,
            },
            {
                title: 'Barang Tidak Tersedia',
                href: '/unavailable-items',
                icon: PackageOpen,
            }
        );
    }

    const laporanItems: NavItem[] = [];
    if (['super_admin', 'manager', 'admin_gudang'].includes(userRole)) {
        laporanItems.push(
            {
                title: 'Alert Stok',
                href: '/alerts',
                icon: ShieldAlert,
            },
            {
                title: 'Laporan',
                href: '/reports',
                icon: FileText,
            }
        );
    }

    const masterItems: NavItem[] = [
        {
            title: 'Kategori',
            href: '/categories',
            icon: Tags,
        },
        {
            title: 'Satuan',
            href: '/units',
            icon: Ruler,
        },
        {
            title: 'Supplier',
            href: '/suppliers',
            icon: Truck,
        },
        {
            title: 'Gudang',
            href: '/warehouses',
            icon: Warehouse,
        },
        {
            title: 'Barang',
            href: '/products',
            icon: Package,
        }
    ];

    const adminItems: NavItem[] = [];
    if (userRole === 'super_admin') {
        adminItems.push(
            {
                title: 'Pengguna',
                href: '/users',
                icon: Users,
            },
            {
                title: 'Audit Log',
                href: '/audit-logs',
                icon: Shield,
            }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0 py-2">
                <SidebarNavGroup label="Dashboard" items={dashboardItems} />
                <SidebarNavGroup label="Transaksi" items={transaksiItems} />
                <SidebarNavGroup label="Laporan & Analisis" items={laporanItems} />
                <SidebarNavGroup label="Master Data" items={masterItems} />
                <SidebarNavGroup label="Pengaturan Sistem" items={adminItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
