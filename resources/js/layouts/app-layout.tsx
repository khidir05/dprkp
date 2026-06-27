import { useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

interface CustomLayoutPageProps {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { flash } = usePage<CustomLayoutPageProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Live background polling to sync data dynamically across all active users
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                router.reload();
            }
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
