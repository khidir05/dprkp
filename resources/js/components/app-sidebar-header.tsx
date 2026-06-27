import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import NotificationBell from '@/components/notification-bell';
import { useAppearance } from '@/hooks/use-appearance';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { appearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-4">
                <NotificationBell />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-9 w-9 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 cursor-pointer"
                    title="Toggle Theme"
                >
                    {appearance === 'dark' ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </Button>
            </div>
        </header>
    );
}
