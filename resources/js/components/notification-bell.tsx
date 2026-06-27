import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Bell, Check, Trash2, Circle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type NotificationType = {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
    ref_table?: string | null;
    ref_id?: number | null;
};

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/notifications', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unread_count || 0);
            }
        } catch (error) {
            console.error('Gagal mengambil notifikasi:', error);
        }
    };

    // Poll notifications every 60 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent dropdown from closing
        try {
            const response = await fetch(`/notifications/${id}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                }
            });
            if (response.ok) {
                // Update local state directly for fast feedback
                setNotifications(prev => 
                    prev.map(n => n.id === id ? { ...n, is_read: true } : n)
                );
                setUnreadCount(prev => Math.max(prev - 1, 0));
            }
        } catch (error) {
            console.error('Gagal menandai notifikasi dibaca:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch('/notifications/read-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                }
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Gagal menandai semua notifikasi dibaca:', error);
        }
    };

    const deleteNotification = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent dropdown from closing
        try {
            const response = await fetch(`/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                }
            });
            if (response.ok) {
                const deleted = notifications.find(n => n.id === id);
                setNotifications(prev => prev.filter(n => n.id !== id));
                if (deleted && !deleted.is_read) {
                    setUnreadCount(prev => Math.max(prev - 1, 0));
                }
            }
        } catch (error) {
            console.error('Gagal menghapus notifikasi:', error);
        }
    };

    const handleNotificationClick = (notification: NotificationType) => {
        // If unread, mark as read first
        if (!notification.is_read) {
            fetch(`/notifications/${notification.id}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                }
            });
        }
        
        setOpen(false);

        // Redirect based on reference table
        if (notification.ref_table === 'item_requests') {
            router.visit(`/requests/${notification.ref_id}`);
        } else if (notification.ref_table === 'stock_mutations') {
            router.visit(`/mutations/${notification.ref_id}`);
        } else if (notification.ref_table === 'stock_alerts') {
            router.visit('/alerts');
        } else if (notification.ref_table === 'restock_lists') {
            router.visit('/restock');
        } else if (notification.ref_table === 'unavailable_items') {
            router.visit('/unavailable-items');
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative group h-9 w-9 cursor-pointer"
                    onClick={fetchNotifications}
                >
                    <Bell className="!size-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                    {unreadCount > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center rounded-full p-0 text-[9px] font-bold border-2 border-white dark:border-zinc-950 animate-pulse"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 sm:w-96" align="end">
                <div className="flex items-center justify-between p-3 font-semibold text-sm">
                    <span className="text-slate-900 dark:text-slate-100">Notifikasi</span>
                    {unreadCount > 0 && (
                        <button 
                            onClick={markAllAsRead} 
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                        >
                            <Check className="h-3.5 w-3.5" />
                            <span>Tandai dibaca</span>
                        </button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-muted-foreground">
                            Tidak ada notifikasi baru
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className={cn(
                                    "p-3 flex items-start gap-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-zinc-800 transition-colors",
                                    !n.is_read && "bg-slate-50/50 dark:bg-zinc-800/30 font-medium"
                                )}
                                onClick={() => handleNotificationClick(n)}
                            >
                                <div className="mt-1 shrink-0">
                                    {!n.is_read ? (
                                        <Circle className="h-2 w-2 fill-indigo-600 text-indigo-600" />
                                    ) : (
                                        <Circle className="h-2 w-2 text-slate-300 dark:text-zinc-700" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{n.title}</div>
                                    <div className="text-2xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{n.message}</div>
                                    <div className="text-[10px] text-muted-foreground font-mono">
                                        {new Date(n.created_at).toLocaleDateString('id-ID')} &bull; {new Date(n.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 shrink-0">
                                    {!n.is_read && (
                                        <button
                                            onClick={(e) => markAsRead(n.id, e)}
                                            className="text-slate-400 hover:text-indigo-600 p-0.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                            title="Tandai dibaca"
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => deleteNotification(n.id, e)}
                                        className="text-slate-400 hover:text-rose-600 p-0.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                        title="Hapus"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
