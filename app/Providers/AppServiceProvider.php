<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        \Illuminate\Database\Eloquent\Relations\Relation::morphMap([
            'StockAlert' => \App\Models\StockAlert::class,
            'UnavailableItem' => \App\Models\UnavailableItem::class,
        ]);

        // Helper function for notifications
        $notify = function($userId, $title, $message, $type = 'info', $refTable = null, $refId = null) {
            \App\Models\Notification::create([
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'is_read' => false,
                'ref_table' => $refTable,
                'ref_id' => $refId,
                'created_at' => now(),
            ]);
        };

        $notifyManagers = function($title, $message, $type = 'info', $refTable = null, $refId = null) use ($notify) {
            $managers = \App\Models\User::whereHas('roleModel', function($q) {
                $q->whereIn('code', ['manager', 'super_admin']);
            })->get();
            foreach ($managers as $m) {
                $notify($m->id, $title, $message, $type, $refTable, $refId);
            }
        };

        // Register Eloquent event hooks for Audit Logs & Notifications
        \App\Models\ItemRequest::created(function ($item) use ($notifyManagers) {
            \App\Services\AuditService::log('Permintaan Barang', 'create', "Mengajukan permohonan barang baru #{$item->request_number}");
            $notifyManagers(
                "Permintaan Baru Diajukan",
                "Ada permohonan barang baru #{$item->request_number} menunggu persetujuan Anda.",
                'request',
                'item_requests',
                $item->id
            );
        });
        \App\Models\ItemRequest::updated(function ($item) use ($notify) {
            if ($item->wasChanged('status')) {
                \App\Services\AuditService::log('Permintaan Barang', 'status_change', "Mengubah status permohonan #{$item->request_number} menjadi {$item->status}");
                
                if ($item->status === 'approved') {
                    $notify(
                        $item->created_by,
                        "Permintaan Disetujui",
                        "Permintaan barang #{$item->request_number} telah disetujui. Silakan tunggu pengambilan barang.",
                        'info',
                        'item_requests',
                        $item->id
                    );
                    
                    $admins = $item->warehouse?->users ?? [];
                    foreach ($admins as $admin) {
                        if ($admin->roleModel->code === 'admin_gudang') {
                            $notify(
                                $admin->id,
                                "Permintaan Barang Siap Dispatch",
                                "Permintaan #{$item->request_number} disetujui. Silakan siapkan barang untuk dikirim.",
                                'info',
                                'item_requests',
                                $item->id
                            );
                        }
                    }
                } elseif ($item->status === 'rejected') {
                    $reason = $item->rejection_reason ? " Alasan: " . $item->rejection_reason : "";
                    $notify(
                        $item->created_by,
                        "Permintaan Ditolak",
                        "Permintaan barang #{$item->request_number} ditolak oleh Manager.{$reason}",
                        'warning',
                        'item_requests',
                        $item->id
                    );
                }
            }
        });

        \App\Models\InboundTransaction::created(function ($item) {
            $whName = $item->warehouse?->name ?? 'Gudang';
            \App\Services\AuditService::log('Barang Masuk', 'create', "Mencatat barang masuk #{$item->inbound_number} di {$whName}");
        });

        \App\Models\OutboundTransaction::created(function ($item) use ($notify) {
            $reqNum = $item->itemRequest?->request_number ?? '';
            $desc = "Mengirim keluar barang #{$item->outbound_number}";
            if ($reqNum) {
                $desc .= " untuk permohonan #{$reqNum}";
            }
            \App\Services\AuditService::log('Barang Keluar', 'create', $desc);
            
            if ($item->itemRequest) {
                $notify(
                    $item->itemRequest->requester_id,
                    "Barang Siap Diambil / Dikirim",
                    "Barang untuk permohonan #{$reqNum} telah didepatch dari gudang. Silakan konfirmasi penerimaan jika barang sudah sampai.",
                    'info',
                    'item_requests',
                    $item->item_request_id
                );
            }
        });

        \App\Models\GoodsReceipt::created(function ($item) use ($notify) {
            $reqNum = $item->itemRequest?->request_number ?? '';
            \App\Services\AuditService::log('Konfirmasi Penerimaan', 'create', "Mengonfirmasi penerimaan barang untuk permohonan #{$reqNum}");
            
            if ($item->itemRequest && $item->itemRequest->warehouse) {
                $admins = $item->itemRequest->warehouse->users;
                foreach ($admins as $admin) {
                    if ($admin->roleModel->code === 'admin_gudang') {
                        $notify(
                            $admin->id,
                            "Barang Diterima Pemohon",
                            "Pemohon telah mengonfirmasi penerimaan barang untuk permohonan #{$reqNum}.",
                            'success',
                            'item_requests',
                            $item->item_request_id
                        );
                    }
                }
            }
        });

        \App\Models\StockMutation::created(function ($item) use ($notifyManagers) {
            $fromName = $item->fromWarehouse?->name ?? 'Gudang Asal';
            $toName = $item->toWarehouse?->name ?? 'Gudang Tujuan';
            \App\Services\AuditService::log('Mutasi Stok', 'create', "Mengajukan mutasi barang #{$item->mutation_number} dari {$fromName} ke {$toName}");
            
            $notifyManagers(
                "Mutasi Baru Diajukan",
                "Mutasi barang #{$item->mutation_number} diajukan dari {$fromName} ke {$toName} menunggu persetujuan.",
                'mutation',
                'stock_mutations',
                $item->id
            );
        });
        \App\Models\StockMutation::updated(function ($item) use ($notify) {
            if ($item->wasChanged('status')) {
                \App\Services\AuditService::log('Mutasi Stok', 'status_change', "Mengubah status mutasi #{$item->mutation_number} menjadi {$item->status}");
                
                if ($item->status === 'approved') {
                    $notify(
                        $item->created_by,
                        "Mutasi Barang Disetujui",
                        "Mutasi #{$item->mutation_number} telah disetujui secara resmi.",
                        'success',
                        'stock_mutations',
                        $item->id
                    );
                } elseif ($item->status === 'rejected') {
                    $reason = $item->rejection_reason ? " Alasan: " . $item->rejection_reason : "";
                    $notify(
                        $item->created_by,
                        "Mutasi Barang Ditolak",
                        "Mutasi #{$item->mutation_number} ditolak oleh Manager.{$reason}",
                        'warning',
                        'stock_mutations',
                        $item->id
                    );
                }
            }
        });

        \App\Models\User::created(function ($item) {
            $roleName = $item->roleModel?->nama ?? 'User';
            \App\Services\AuditService::log('User Management', 'create', "Mendaftarkan user baru {$item->name} ({$roleName})");
        });
        \App\Models\User::updated(function ($item) {
            if ($item->wasChanged('is_active')) {
                $status = $item->is_active ? 'aktif' : 'non-aktif';
                \App\Services\AuditService::log('User Management', 'toggle_active', "Mengubah status aktif user {$item->name} menjadi {$status}");
            } else {
                \App\Services\AuditService::log('User Management', 'update', "Memperbarui data user {$item->name}");
            }
        });

        \App\Models\RegistrationLink::created(function ($item) {
            $roleName = $item->roleModel?->nama ?? 'Peranan';
            \App\Services\AuditService::log('User Management', 'generate_link', "Membuat link registrasi baru untuk peranan {$roleName}");
        });
        \App\Models\RegistrationLink::deleted(function ($item) {
            $roleName = $item->roleModel?->nama ?? 'Peranan';
            \App\Services\AuditService::log('User Management', 'delete_link', "Menghapus link registrasi peranan {$roleName}");
        });

        \App\Models\Product::created(function ($item) {
            \App\Services\AuditService::log('Master Data', 'create_product', "Menambahkan barang baru: {$item->name}");
        });
        \App\Models\Product::updated(function ($item) {
            if ($item->wasChanged('is_active')) {
                $status = $item->is_active ? 'aktif' : 'non-aktif';
                \App\Services\AuditService::log('Master Data', 'toggle_active_product', "Mengubah status aktif barang {$item->name} menjadi {$status}");
            } elseif ($item->wasChanged('is_hold')) {
                $status = $item->is_hold ? 'hold (ditangguhkan)' : 'aktif';
                \App\Services\AuditService::log('Master Data', 'toggle_hold_product', "Mengubah status hold barang {$item->name} menjadi {$status}");
            } else {
                \App\Services\AuditService::log('Master Data', 'update_product', "Memperbarui data barang {$item->name}");
            }
        });

        \App\Models\Warehouse::created(function ($item) {
            \App\Services\AuditService::log('Master Data', 'create_warehouse', "Menambahkan gudang baru: {$item->name}");
        });
        \App\Models\Warehouse::updated(function ($item) {
            \App\Services\AuditService::log('Master Data', 'update_warehouse', "Memperbarui data gudang {$item->name}");
        });

        \App\Models\Supplier::created(function ($item) {
            \App\Services\AuditService::log('Master Data', 'create_supplier', "Menambahkan supplier baru: {$item->name}");
        });
        \App\Models\Supplier::updated(function ($item) {
            \App\Services\AuditService::log('Master Data', 'update_supplier', "Memperbarui data supplier {$item->name}");
        });

        // Stock Opname Event Hooks
        \App\Models\StockOpname::created(function ($item) use ($notifyManagers) {
            \App\Services\AuditService::log('Stock Opname', 'create', "Mengajukan stock opname baru #{$item->opname_number}");
            $notifyManagers(
                "Stock Opname Diajukan",
                "Stock opname baru #{$item->opname_number} menunggu persetujuan Anda.",
                'opname',
                'stock_opnames',
                $item->id
            );
        });
        \App\Models\StockOpname::updated(function ($item) use ($notify) {
            if ($item->wasChanged('status')) {
                \App\Services\AuditService::log('Stock Opname', 'status_change', "Mengubah status stock opname #{$item->opname_number} menjadi {$item->status}");
                
                if ($item->status === 'completed') {
                    $notify(
                        $item->created_by,
                        "Stock Opname Disetujui",
                        "Stock opname #{$item->opname_number} telah disetujui dan diselesaikan.",
                        'success',
                        'stock_opnames',
                        $item->id
                    );
                } elseif ($item->status === 'cancelled') {
                    $notify(
                        $item->created_by,
                        "Stock Opname Dibatalkan",
                        "Stock opname #{$item->opname_number} telah dibatalkan oleh Manager/Super Admin.",
                        'warning',
                        'stock_opnames',
                        $item->id
                    );
                }
            }
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
