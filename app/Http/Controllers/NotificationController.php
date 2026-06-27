<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class NotificationController extends Controller
{
    /**
     * Get recent notifications and unread count.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $notifications = Notification::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->take(15)
            ->get();
            
        $unreadCount = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();
            
        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function read(Request $request, Notification $notification): RedirectResponse|JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->back()->with('success', 'Notifikasi ditandai telah dibaca.');
    }

    /**
     * Mark all notifications as read.
     */
    public function readAll(Request $request): RedirectResponse|JsonResponse
    {
        $user = $request->user();

        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->back()->with('success', 'Semua notifikasi ditandai telah dibaca.');
    }

    /**
     * Delete a notification.
     */
    public function destroy(Request $request, Notification $notification): RedirectResponse|JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->delete();

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->back()->with('success', 'Notifikasi berhasil dihapus.');
    }
}
