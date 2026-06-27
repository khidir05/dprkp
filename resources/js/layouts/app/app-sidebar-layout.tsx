import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileLayout } from '@/components/mobile-layout';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const isMobile = useIsMobile();

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            {isMobile ? (
                <MobileLayout>{children}</MobileLayout>
            ) : (
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </AppContent>
            )}
        </AppShell>
    );
}
