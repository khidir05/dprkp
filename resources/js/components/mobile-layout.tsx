import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Boxes, 
    ClipboardList, 
    FileText, 
    Menu, 
    Sun, 
    Moon 
} from 'lucide-react';
import { useSidebar, SidebarInset } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notification-bell';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User, Role } from '@/types';
import type { ReactNode } from 'react';

interface CustomPageProps {
    auth: {
        user: User & {
            role_model?: Role;
        };
    };
    [key: string]: unknown;
}

interface MobileLayoutProps {
    children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
    const { auth } = usePage<CustomPageProps>().props;
    const { toggleSidebar } = useSidebar();
    const { appearance, updateAppearance } = useAppearance();
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const getInitials = useInitials();

    const userRole: string = auth.user?.role_model?.code || '';

    const toggleTheme = (): void => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    const hasReportsAccess: boolean = ['super_admin', 'manager', 'admin_gudang'].includes(userRole);

    return (
        <SidebarInset className="flex flex-col min-h-screen bg-background">
            {/* Sticky Mobile Header */}
            <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-sidebar-border/50 bg-background/95 px-4 backdrop-blur">
                <div className="flex items-center gap-2">
                    <img src="/dprkp.png" alt="DPRKP Logo" className="h-6 w-auto object-contain" />
                    <span className="font-bold text-sm tracking-tight text-foreground">DPRKP Inventaris</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                        title="Toggle Theme"
                    >
                        {appearance === 'dark' ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </Button>

                    {/* Notification Bell */}
                    <NotificationBell />

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer p-0">
                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                    <AvatarImage src={auth.user?.avatar} alt={auth.user?.name} />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white text-xs font-semibold">
                                        {getInitials(auth.user?.name || '')}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 w-full pb-24 pt-4 px-4 overflow-y-auto">
                {children}
            </div>

            {/* Bottom Nav Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-sidebar-border/50 h-16 flex items-center justify-around pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
                {/* Home/Dashboard */}
                <Link 
                    href="/dashboard" 
                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
                        isCurrentOrParentUrl('/dashboard') 
                            ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <LayoutGrid className="size-5" />
                    <span className="text-[10px] mt-0.5">Beranda</span>
                </Link>

                {/* Stok Barang */}
                <Link 
                    href="/stocks" 
                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
                        isCurrentOrParentUrl('/stocks') 
                            ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Boxes className="size-5" />
                    <span className="text-[10px] mt-0.5">Stok</span>
                </Link>

                {/* Permintaan Barang */}
                <Link 
                    href="/requests" 
                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
                        isCurrentOrParentUrl('/requests') 
                            ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <ClipboardList className="size-5" />
                    <span className="text-[10px] mt-0.5">Request</span>
                </Link>

                {/* Laporan (Conditional) */}
                {hasReportsAccess && (
                    <Link 
                        href="/reports" 
                        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
                            isCurrentOrParentUrl('/reports') 
                                ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <FileText className="size-5" />
                        <span className="text-[10px] mt-0.5">Laporan</span>
                    </Link>
                )}

                {/* Menu (Sidebar Toggle) */}
                <button 
                    onClick={toggleSidebar}
                    className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
                >
                    <Menu className="size-5" />
                    <span className="text-[10px] mt-0.5">Menu</span>
                </button>
            </nav>
        </SidebarInset>
    );
}
