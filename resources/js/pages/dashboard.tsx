import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    Warehouse, 
    Package, 
    ArrowDownToLine, 
    ArrowUpRight, 
    ClipboardList, 
    ShieldAlert, 
    RefreshCw, 
    Truck, 
    Boxes, 
    HelpCircle, 
    CheckCircle, 
    Plus, 
    ChevronRight,
    ArrowRightLeft,
    Calendar,
    Activity
} from 'lucide-react';

type Props = {
    stats: any;
    role: 'super_admin' | 'manager' | 'admin_gudang' | 'pemohon';
};

export default function Dashboard({ stats, role }: Props) {
    const renderSuperAdmin = () => {
        return (
            <div className="space-y-8">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <Users className="h-28 w-28" />
                        </div>
                        <Users className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-indigo-100">Total Pengguna</div>
                        <div className="text-3xl font-bold mt-1">{stats.users_count}</div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-sky-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <Warehouse className="h-28 w-28" />
                        </div>
                        <Warehouse className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-sky-100">Total Gudang</div>
                        <div className="text-3xl font-bold mt-1">{stats.warehouses_count}</div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-violet-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <Package className="h-28 w-28" />
                        </div>
                        <Package className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-violet-100">Total Barang</div>
                        <div className="text-3xl font-bold mt-1">{stats.products_count}</div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <ArrowDownToLine className="h-28 w-28" />
                        </div>
                        <ArrowDownToLine className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-emerald-100">Barang Masuk</div>
                        <div className="text-3xl font-bold mt-1">{stats.inbounds_count}</div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <Boxes className="h-28 w-28" />
                        </div>
                        <Boxes className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-pink-100">Barang Keluar</div>
                        <div className="text-3xl font-bold mt-1">{stats.outbounds_count}</div>
                    </div>
                </div>

                {/* Dashboard grid lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Requests */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Permintaan Barang Terbaru</h2>
                                <p className="text-xs text-muted-foreground">5 transaksi permohonan barang teraktual masuk.</p>
                            </div>
                            <Link href="/requests" className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-0.5">
                                <span>Semua Permintaan</span>
                                <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {stats.recent_requests.length === 0 ? (
                                <div className="text-center py-6 text-sm text-muted-foreground">Tidak ada permintaan.</div>
                            ) : (
                                stats.recent_requests.map((req: any) => (
                                    <div key={req.id} className="py-3 flex justify-between items-center text-sm gap-4">
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200">{req.request_number}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                <span>Oleh: {req.created_by_user?.name || req.created_by?.name || 'User'}</span>
                                                <span>&bull;</span>
                                                <span>{req.warehouse?.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {getStatusBadge(req.status)}
                                            <Link href={`/requests/${req.id}`} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Inbounds */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Barang Masuk Terbaru</h2>
                                <p className="text-xs text-muted-foreground">5 transaksi inbound gudang teraktual.</p>
                            </div>
                            <Link href="/inbound" className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-0.5">
                                <span>Semua Barang Masuk</span>
                                <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {stats.recent_inbounds.length === 0 ? (
                                <div className="text-center py-6 text-sm text-muted-foreground">Belum ada barang masuk.</div>
                            ) : (
                                stats.recent_inbounds.map((inb: any) => (
                                    <div key={inb.id} className="py-3 flex justify-between items-center text-sm gap-4">
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200">{inb.inbound_number}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                <span>Supplier: {inb.supplier?.name}</span>
                                                <span>&bull;</span>
                                                <span>{inb.warehouse?.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono text-xs text-muted-foreground">
                                                {new Date(inb.created_at).toLocaleDateString('id-ID')}
                                            </div>
                                            <Link href={`/inbound/${inb.id}`} className="text-indigo-600 text-xs hover:underline block mt-0.5">
                                                Detail
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderManager = () => {
        return (
            <div className="space-y-8">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-rose-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <ClipboardList className="h-24 w-24" />
                        </div>
                        <ClipboardList className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-rose-100">Pending Permintaan</div>
                        <div className="text-3xl font-bold mt-1">{stats.pending_requests_count}</div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <ArrowRightLeft className="h-24 w-24" />
                        </div>
                        <ArrowRightLeft className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-indigo-100">Pending Mutasi</div>
                        <div className="text-3xl font-bold mt-1">{stats.pending_mutations_count}</div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <ShieldAlert className="h-24 w-24" />
                        </div>
                        <ShieldAlert className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-amber-100">Alert Stok Aktif</div>
                        <div className="text-3xl font-bold mt-1">{stats.active_alerts_count}</div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-violet-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <RefreshCw className="h-24 w-24" />
                        </div>
                        <RefreshCw className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-violet-100">Dalam Pengadaan</div>
                        <div className="text-3xl font-bold mt-1">{stats.pending_restocks_count}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pending Approvals */}
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Permintaan Menunggu Persetujuan</h2>
                                <p className="text-xs text-muted-foreground">Segera tinjau permohonan barang yang diajukan pemohon.</p>
                            </div>
                            <Link href="/requests?status=pending" className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-0.5">
                                <span>Lihat Semua</span>
                                <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {stats.recent_pending_requests.length === 0 ? (
                                <div className="text-center py-8 text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
                                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                                    <span>Semua pengajuan permohonan barang telah ditinjau!</span>
                                </div>
                            ) : (
                                stats.recent_pending_requests.map((req: any) => (
                                    <div key={req.id} className="py-3.5 flex justify-between items-center text-sm gap-4">
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200">{req.request_number}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                <span>Oleh: {req.createdBy?.name || 'Pemohon'}</span>
                                                <span>&bull;</span>
                                                <span>Gudang: {req.warehouse?.name}</span>
                                            </div>
                                        </div>
                                        <Link href={`/requests/${req.id}`} className="inline-flex items-center justify-center bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors">
                                            Tinjau
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* CSS bar chart of Monthly Request Trend */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Tren Permintaan</h2>
                        <p className="text-xs text-muted-foreground mb-6">Jumlah pengajuan permohonan barang 6 bulan terakhir.</p>
                        
                        <div className="flex-1 flex items-end justify-between h-48 gap-3 px-2 pt-6">
                            {stats.monthly_request_trends.length === 0 ? (
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Belum ada tren data.</div>
                            ) : (
                                stats.monthly_request_trends.map((item: any, idx: number) => {
                                    // Calculate height percentage relative to max count (simplistic normalization)
                                    const maxVal = Math.max(...stats.monthly_request_trends.map((t: any) => t.count), 5);
                                    const heightPct = Math.max((item.count / maxVal) * 100, 8);
                                    
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center group relative">
                                            {/* Tooltip on hover */}
                                            <div className="absolute -top-7 scale-0 group-hover:scale-100 bg-slate-900 text-white text-2xs px-2 py-0.5 rounded font-mono transition-transform duration-200 z-10 whitespace-nowrap">
                                                {item.count} reqs
                                            </div>
                                            <div 
                                                className="w-full bg-gradient-to-t from-indigo-500 to-sky-400 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-sm"
                                                style={{ height: `${heightPct}%` }}
                                            />
                                            <span className="text-[10px] text-muted-foreground font-mono mt-2 select-none">
                                                {new Date(item.month + '-01').toLocaleDateString('id-ID', { month: 'short' })}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAdminGudang = () => {
        return (
            <div className="space-y-8">
                {/* Header Information on Assigned Warehouses */}
                <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Warehouse className="h-5 w-5 text-indigo-600" />
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Gudang yang Anda Kelola:
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end max-w-md">
                        {stats.assigned_warehouses.length === 0 ? (
                            <span className="text-xs text-muted-foreground">Belum ditugaskan ke gudang mana pun</span>
                        ) : (
                            stats.assigned_warehouses.map((wh: any) => (
                                <Badge key={wh.id} variant="secondary" className="bg-white border text-slate-700 font-medium">
                                    {wh.name}
                                </Badge>
                            ))
                        )}
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-sky-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <ArrowDownToLine className="h-24 w-24" />
                        </div>
                        <ArrowDownToLine className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-sky-100">Inbound (Masuk)</div>
                        <div className="text-3xl font-bold mt-1">{stats.inbounds_count}</div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <Boxes className="h-24 w-24" />
                        </div>
                        <Boxes className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-indigo-100">Outbound (Keluar)</div>
                        <div className="text-3xl font-bold mt-1">{stats.outbounds_count}</div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <Truck className="h-24 w-24" />
                        </div>
                        <Truck className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-amber-100">Belum Dikirim (Dispatch)</div>
                        <div className="text-3xl font-bold mt-1">{stats.pending_dispatches_count}</div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-rose-500/20 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <ShieldAlert className="h-24 w-24" />
                        </div>
                        <ShieldAlert className="h-8 w-8 mb-4 bg-white/20 p-1.5 rounded-lg" />
                        <div className="text-sm font-medium text-rose-100">Stok Menipis</div>
                        <div className="text-3xl font-bold mt-1">{stats.low_stock_count}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Inbounds */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Barang Masuk Terbaru</h2>
                                <p className="text-xs text-muted-foreground">Penerimaan inbound terbaru di gudang kelolaan.</p>
                            </div>
                            <Link href="/inbound" className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-0.5">
                                <span>Lihat Semua</span>
                                <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {stats.recent_inbounds.length === 0 ? (
                                <div className="text-center py-6 text-sm text-muted-foreground">Belum ada barang masuk.</div>
                            ) : (
                                stats.recent_inbounds.map((inb: any) => (
                                    <div key={inb.id} className="py-3 flex justify-between items-center text-sm gap-4">
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200">{inb.inbound_number}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                <span>Supplier: {inb.supplier?.name}</span>
                                                <span>&bull;</span>
                                                <span>{inb.warehouse?.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono text-xs text-slate-400">
                                                {new Date(inb.created_at).toLocaleDateString('id-ID')}
                                            </div>
                                            <Link href={`/inbound/${inb.id}`} className="text-indigo-600 text-xs hover:underline block mt-0.5">
                                                Detail
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Dispatches */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pengiriman Outbound Terbaru</h2>
                                <p className="text-xs text-muted-foreground">Pengiriman keluar terbaru dari gudang kelolaan.</p>
                            </div>
                            <Link href="/requests" className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-0.5">
                                <span>Lihat Permintaan</span>
                                <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {stats.recent_dispatches.length === 0 ? (
                                <div className="text-center py-6 text-sm text-muted-foreground">Belum ada pengiriman keluar.</div>
                            ) : (
                                stats.recent_dispatches.map((outb: any) => (
                                    <div key={outb.id} className="py-3 flex justify-between items-center text-sm gap-4">
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200">{outb.outbound_number}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                <span>Penerima: {outb.recipient?.name}</span>
                                                <span>&bull;</span>
                                                <span>{outb.warehouse?.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono text-xs text-slate-400">
                                                {new Date(outb.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPemohon = () => {
        return (
            <div className="space-y-8">
                {/* Quick actions panel */}
                <div className="bg-gradient-to-r from-indigo-500 to-sky-500 p-6 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold">Butuh Barang Inventaris Kantor?</h2>
                        <p className="text-xs text-indigo-100 mt-1">Buat pengajuan permohonan barang baru secara mudah dan pantau daur hidupnya.</p>
                    </div>
                    <Link href="/requests/create" className="inline-flex items-center justify-center bg-white text-indigo-600 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors shadow shadow-indigo-900/10 gap-1.5 shrink-0 self-start sm:self-auto">
                        <Plus className="h-4 w-4" />
                        <span>Buat Pengajuan Baru</span>
                    </Link>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <ClipboardList className="h-10 w-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950 p-2 rounded-xl" />
                        <div>
                            <div className="text-xs text-muted-foreground font-medium">Total Pengajuan Saya</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-0.5">{stats.total_requests}</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <HelpCircle className="h-10 w-10 text-amber-500 bg-amber-50 dark:bg-amber-950 p-2 rounded-xl" />
                        <div>
                            <div className="text-xs text-muted-foreground font-medium">Menunggu Persetujuan</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-0.5">{stats.pending_requests}</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <Truck className="h-10 w-10 text-sky-500 bg-sky-50 dark:bg-sky-950 p-2 rounded-xl" />
                        <div>
                            <div className="text-xs text-muted-foreground font-medium">Pengajuan Disetujui</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-0.5">{stats.approved_requests}</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <CheckCircle className="h-10 w-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950 p-2 rounded-xl" />
                        <div>
                            <div className="text-xs text-muted-foreground font-medium">Pengajuan Selesai</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-0.5">{stats.completed_requests}</div>
                        </div>
                    </div>
                </div>

                {/* Recent My Requests */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Riwayat Pengajuan Saya</h2>
                            <p className="text-xs text-muted-foreground">5 pengajuan permohonan barang teraktual Anda.</p>
                        </div>
                        <Link href="/requests" className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-0.5">
                            <span>Lihat Semua</span>
                            <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {stats.recent_requests.length === 0 ? (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                Anda belum pernah membuat pengajuan permohonan barang.
                            </div>
                        ) : (
                            stats.recent_requests.map((req: any) => (
                                <div key={req.id} className="py-3.5 flex justify-between items-center text-sm gap-4">
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200">{req.request_number}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                            <span>Tanggal: {new Date(req.created_at).toLocaleDateString('id-ID')}</span>
                                            <span>&bull;</span>
                                            <span>Gudang: {req.warehouse?.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(req.status)}
                                        <Link href={`/requests/${req.id}`} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-slate-100 text-slate-700 border hover:bg-slate-100">Tinjau</Badge>;
            case 'approved':
                return <Badge variant="default" className="bg-amber-500 hover:bg-amber-500 text-white">Disetujui</Badge>;
            case 'dispatched':
                return <Badge variant="default" className="bg-sky-500 hover:bg-sky-500 text-white">Dalam Pengiriman</Badge>;
            case 'completed':
                return <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white">Selesai</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Ditolak</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="border-slate-300 text-slate-400">Dibatalkan</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6 space-y-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6 dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                            Selamat Datang Kembali
                        </h1>
                        <p className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-sm">
                            <Activity className="h-4 w-4 text-indigo-500" />
                            Sistem Management Inventaris DPRKP &bull; Mode: {role.replace('_', ' ').toUpperCase()}
                        </p>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono bg-slate-50 dark:bg-zinc-800/40 border dark:border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2 self-start sm:self-auto">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Render Role-Based Dashboards */}
                {role === 'super_admin' && renderSuperAdmin()}
                {role === 'manager' && renderManager()}
                {role === 'admin_gudang' && renderAdminGudang()}
                {role === 'pemohon' && renderPemohon()}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
