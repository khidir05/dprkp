import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Boxes, Package, Plus, Trash2, ClipboardList, CheckCircle, Copy, Check, ArrowLeft, ArrowRight, User, Building2, Send } from 'lucide-react';
import { toast, Toaster } from 'sonner';

type Warehouse = {
    id: number;
    name: string;
    code: string;
};

type Product = {
    id: number;
    name: string;
    sku: string;
    code: string;
    category?: { name: string };
    unit?: { symbol: string };
    stocks?: { warehouse_id: number; qty: number }[];
};

type Props = {
    warehouses: Warehouse[];
    products: Product[];
};

type FormItem = {
    product_id: number;
    qty_requested: number;
    sku: string;
    code: string;
    name: string;
    symbol: string;
};

export default function GuestRequestCreate({ warehouses, products }: Props) {
    const { flash } = usePage().props as any;

    const [step, setStep] = useState(1);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [itemQty, setItemQty] = useState(1);
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        requester_name: '',
        requester_dept: '',
        nip: '',
        nama_atasan: '',
        jabatan_atasan: '',
        nama_penatausahaan: '',
        jabatan_penatausahaan: '',
        nip_penatausahaan: '',
        nama_pengurus_barang: '',
        jabatan_pengurus_barang: '',
        nip_pengurus_barang: '',
        warehouse_id: '',
        notes: '',
        items: [] as FormItem[],
    });

    const getWarehouseName = (id: string) => {
        const wh = warehouses.find((w) => String(w.id) === id);
        return wh ? `${wh.name} (${wh.code})` : '-';
    };

    // Helper to get stock qty for a product in a warehouse
    const getProductStock = (product: Product, whId: string) => {
        if (!whId) return 0;
        const stock = product.stocks?.find((s) => String(s.warehouse_id) === String(whId));
        return stock ? stock.qty : 0;
    };

    // Filter products that have stock > 0 in the selected warehouse
    const filteredProducts = products.filter((p) => {
        const stockQty = getProductStock(p, data.warehouse_id);
        return stockQty > 0;
    });

    const handleNextStep = () => {
        if (!data.requester_name.trim()) {
            toast.error('Silakan isi Nama Lengkap Pemohon.');
            return;
        }
        if (!data.requester_dept.trim()) {
            toast.error('Silakan pilih Divisi Pemohon.');
            return;
        }
        if (!data.nama_atasan.trim()) {
            toast.error('Silakan isi Nama Atasan.');
            return;
        }
        if (!data.jabatan_atasan.trim()) {
            toast.error('Silakan pilih Jabatan Atasan.');
            return;
        }
        if (!data.nip.trim()) {
            toast.error('Silakan isi NIP Atasan.');
            return;
        }
        if (!data.nama_penatausahaan.trim()) {
            toast.error('Silakan isi Nama Penatausaha.');
            return;
        }
        if (!data.jabatan_penatausahaan.trim()) {
            toast.error('Silakan isi Jabatan Penatausaha.');
            return;
        }
        if (!data.nip_penatausahaan.trim()) {
            toast.error('Silakan isi NIP Penatausaha.');
            return;
        }
        if (!data.nama_pengurus_barang.trim()) {
            toast.error('Silakan isi Nama Pengurus Barang.');
            return;
        }
        if (!data.jabatan_pengurus_barang.trim()) {
            toast.error('Silakan isi Jabatan Pengurus Barang.');
            return;
        }
        if (!data.nip_pengurus_barang.trim()) {
            toast.error('Silakan isi NIP Pengurus Barang.');
            return;
        }
        if (!data.warehouse_id) {
            toast.error('Silakan pilih Gudang Sumber terlebih dahulu.');
            return;
        }
        setStep(2);
    };

    const handleAddItem = () => {
        if (!selectedProductId) {
            toast.error('Silakan pilih barang terlebih dahulu.');
            return;
        }

        const product = products.find((p) => String(p.id) === selectedProductId);
        if (!product) return;

        const stockQty = getProductStock(product, data.warehouse_id);
        if (itemQty > stockQty) {
            toast.error(`Kuantitas melebihi stok yang tersedia (${stockQty} ${product.unit?.symbol || 'pcs'}).`);
            return;
        }

        const exists = data.items.find((item) => item.product_id === product.id);
        if (exists) {
            const newQty = exists.qty_requested + itemQty;
            if (newQty > stockQty) {
                toast.error(`Kuantitas total yang diajukan (${newQty}) melebihi stok yang tersedia (${stockQty}).`);
                return;
            }
            setData('items', data.items.map((item) =>
                item.product_id === product.id
                    ? { ...item, qty_requested: newQty }
                    : item
            ));
            toast.success(`Jumlah pengajuan "${product.name}" berhasil diupdate.`);
        } else {
            const newItem: FormItem = {
                product_id: product.id,
                qty_requested: itemQty,
                sku: product.sku,
                code: product.code,
                name: product.name,
                symbol: product.unit?.symbol || 'pcs',
            };
            setData('items', [...data.items, newItem]);
            toast.success(`Barang "${product.name}" ditambahkan ke daftar.`);
        }

        setSelectedProductId('');
        setItemQty(1);
    };

    const handleRemoveItem = (idx: number) => {
        setData('items', data.items.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.items.length === 0) {
            toast.error('Tambahkan minimal 1 barang ke dalam daftar pengajuan.');
            return;
        }

        post('/pengajuan', {
            onSuccess: () => {
                reset();
                setStep(1);
            },
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Nomor pengajuan berhasil disalin.');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Pengajuan Barang Dinas" />
            <Toaster position="top-right" richColors />

            <div className="max-w-4xl w-full mx-auto space-y-8 flex-1">
                {/* Header Area */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center items-center gap-3 mb-2">
                        <img src="/dki.png" alt="DKI Logo" className="h-16 w-auto object-contain" />
                        <img src="/siperus.png" alt="SIPERUS Logo" className="h-16 w-auto object-contain" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Portal Pengajuan Barang Inventaris
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 max-w-md mx-auto text-sm">
                        Ajukan kebutuhan barang operasional dinas secara instan tanpa perlu masuk log akun.
                    </p>
                </div>

                {/* Stepper Progress Bar */}
                {!flash?.success && (
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-between">
                            {/* Step 1 Indicator */}
                            <div className="flex flex-col items-center space-y-1">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                    step > 1 
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100 dark:shadow-none' 
                                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                                }`}>
                                    {step > 1 ? <Check className="h-5 w-5" /> : 1}
                                </div>
                                <span className={`text-xs font-semibold ${step === 1 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}>
                                    Identitas
                                </span>
                            </div>

                            {/* Connecting Line */}
                            <div className="flex-1 h-0.5 mx-4 bg-slate-200 dark:bg-zinc-800 relative">
                                <div className="absolute inset-y-0 left-0 bg-indigo-600 transition-all duration-500" style={{ width: step === 1 ? '0%' : '100%' }}></div>
                            </div>

                            {/* Step 2 Indicator */}
                            <div className="flex flex-col items-center space-y-1">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                    step === 2 
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none' 
                                        : 'bg-slate-200 text-slate-400 dark:bg-zinc-800'
                                }`}>
                                    2
                                </div>
                                <span className={`text-xs font-semibold ${step === 2 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
                                    Pilih Barang
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {flash?.success ? (
                    <Card className="border border-emerald-100 dark:border-emerald-950/30 bg-emerald-50/50 dark:bg-emerald-950/10 shadow-lg rounded-2xl overflow-hidden max-w-xl mx-auto py-8">
                        <CardContent className="text-center space-y-6">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600">
                                <CheckCircle className="h-10 w-10" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">Pengajuan Berhasil Dikirim!</h2>
                                <p className="text-sm text-slate-500 dark:text-zinc-400">
                                    Pengajuan Anda telah diterima dan akan segera ditinjau oleh pihak Manager.
                                </p>
                            </div>

                            {flash.request_number && (
                                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto shadow-sm">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nomor Pengajuan</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                                            {flash.request_number}
                                        </span>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-slate-400 hover:text-slate-600"
                                            onClick={() => copyToClipboard(flash.request_number)}
                                        >
                                            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3">
                                {flash.request_number && (
                                    <Button
                                        asChild
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-extrabold shadow-md w-full sm:w-auto cursor-pointer"
                                    >
                                        <a href={`/pengajuan/${flash.request_number}/print`}>
                                            Cetak Surat Pengambilan
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    onClick={() => {
                                        window.location.reload();
                                    }}
                                    variant="outline"
                                    className="rounded-xl px-6 font-bold w-full sm:w-auto border-slate-200 dark:border-zinc-800 cursor-pointer"
                                >
                                    Buat Pengajuan Baru
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        {step === 1 ? (
                            /* STEP 1: Identitas & Gudang */
                            <Card className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 py-5 px-6">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        <span>Langkah 1: Identitas Pengaju</span>
                                    </CardTitle>
                                    <CardDescription>Lengkapi data nama, asal instansi/unit kerja, dan pilih gudang.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="requester_name" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Nama Lengkap Pemohon</Label>
                                        <Input
                                            id="requester_name"
                                            value={data.requester_name}
                                            onChange={(e) => setData('requester_name', e.target.value)}
                                            placeholder="Tulis nama lengkap Anda..."
                                            className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                        />
                                        {errors.requester_name && <p className="text-xs text-red-500 font-medium">{errors.requester_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="requester_dept" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Divisi Pemohon</Label>
                                        <Select
                                            value={data.requester_dept}
                                            onValueChange={(val) => setData('requester_dept', val)}
                                        >
                                            <SelectTrigger id="requester_dept" className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus:ring-indigo-500">
                                                <SelectValue placeholder="Pilih Divisi Pemohon" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800">
                                                <SelectItem value="Divisi Mekanikal Elektrikal">Divisi Mekanikal Elektrikal</SelectItem>
                                                <SelectItem value="Divisi Kebersihan">Divisi Kebersihan</SelectItem>
                                                <SelectItem value="Divisi Keamanan">Divisi Keamanan</SelectItem>
                                                <SelectItem value="Divisi Admin">Divisi Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.requester_dept && <p className="text-xs text-red-500 font-medium">{errors.requester_dept}</p>}
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 space-y-4">
                                        <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">Identitas Atasan Langsung</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="nama_atasan" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Nama Atasan</Label>
                                                <Input
                                                    id="nama_atasan"
                                                    value={data.nama_atasan}
                                                    onChange={(e) => setData('nama_atasan', e.target.value)}
                                                    placeholder="Nama lengkap atasan..."
                                                    className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                                />
                                                {errors.nama_atasan && <p className="text-xs text-red-500 font-medium">{errors.nama_atasan}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="jabatan_atasan" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Jabatan Atasan</Label>
                                                <Select
                                                    value={data.jabatan_atasan}
                                                    onValueChange={(val) => setData('jabatan_atasan', val)}
                                                >
                                                    <SelectTrigger id="jabatan_atasan" className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus:ring-indigo-500">
                                                        <SelectValue placeholder="Pilih Jabatan Atasan" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800">
                                                        <SelectItem value="Kepala satuan sarana dan prasarana">Kepala satuan sarana dan prasarana</SelectItem>
                                                        <SelectItem value="Kepala satuan pelayanan">Kepala satuan pelayanan</SelectItem>
                                                        <SelectItem value="Kepala satuan penertiban">Kepala satuan penertiban</SelectItem>
                                                        <SelectItem value="Pejabat Penatausahaan Pengguna Barang">Pejabat Penatausahaan Pengguna Barang</SelectItem>
                                                        <SelectItem value="Pengurus Barang">Pengurus Barang</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.jabatan_atasan && <p className="text-xs text-red-500 font-medium">{errors.jabatan_atasan}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="nip" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">NIP Atasan</Label>
                                                <Input
                                                    id="nip"
                                                    value={data.nip}
                                                    onChange={(e) => setData('nip', e.target.value)}
                                                    placeholder="NIP atasan..."
                                                    className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                                />
                                                {errors.nip && <p className="text-xs text-red-500 font-medium">{errors.nip}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 space-y-4">
                                        <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">Identitas Kepala Sub Bagian Tata Usaha</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="nama_penatausahaan" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Nama Kepala Sub Bagian Tata Usaha</Label>
                                                <Input
                                                    id="nama_penatausahaan"
                                                    value={data.nama_penatausahaan}
                                                    onChange={(e) => setData('nama_penatausahaan', e.target.value)}
                                                    placeholder="Nama lengkap penatausaha..."
                                                    className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                                />
                                                {errors.nama_penatausahaan && <p className="text-xs text-red-500 font-medium">{errors.nama_penatausahaan}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="jabatan_penatausahaan" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Jabatan Kepala Sub Bagian Tata Usaha</Label>
                                                <Select
                                                    value={data.jabatan_penatausahaan}
                                                    onValueChange={(val) => setData('jabatan_penatausahaan', val)}
                                                >
                                                    <SelectTrigger id="jabatan_penatausahaan" className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus:ring-indigo-500">
                                                        <SelectValue placeholder="Pilih Jabatan Penatausaha" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800">
                                                        <SelectItem value="Kepala satuan sarana dan prasarana">Kepala satuan sarana dan prasarana</SelectItem>
                                                        <SelectItem value="Kepala satuan pelayanan">Kepala satuan pelayanan</SelectItem>
                                                        <SelectItem value="Kepala satuan penertiban">Kepala satuan penertiban</SelectItem>
                                                        <SelectItem value="Pejabat Penatausahaan Pengguna Barang">Pejabat Penatausahaan Pengguna Barang</SelectItem>
                                                        <SelectItem value="Pengurus Barang">Pengurus Barang</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.jabatan_penatausahaan && <p className="text-xs text-red-500 font-medium">{errors.jabatan_penatausahaan}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="nip_penatausahaan" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">NIP Kepala Sub Bagian Tata Usaha</Label>
                                                <Input
                                                    id="nip_penatausahaan"
                                                    value={data.nip_penatausahaan}
                                                    onChange={(e) => setData('nip_penatausahaan', e.target.value)}
                                                    placeholder="NIP penatausaha..."
                                                    className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                                />
                                                {errors.nip_penatausahaan && <p className="text-xs text-red-500 font-medium">{errors.nip_penatausahaan}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 space-y-4">
                                        <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">Identitas Pengurus Barang</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="nama_pengurus_barang" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Nama Pengurus Barang</Label>
                                                <Input
                                                    id="nama_pengurus_barang"
                                                    value={data.nama_pengurus_barang}
                                                    onChange={(e) => setData('nama_pengurus_barang', e.target.value)}
                                                    placeholder="Nama lengkap pengurus barang..."
                                                    className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                                />
                                                {errors.nama_pengurus_barang && <p className="text-xs text-red-500 font-medium">{errors.nama_pengurus_barang}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="jabatan_pengurus_barang" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Jabatan Pengurus Barang</Label>
                                                <Select
                                                    value={data.jabatan_pengurus_barang}
                                                    onValueChange={(val) => setData('jabatan_pengurus_barang', val)}
                                                >
                                                    <SelectTrigger id="jabatan_pengurus_barang" className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus:ring-indigo-500">
                                                        <SelectValue placeholder="Pilih Jabatan Pengurus Barang" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800">
                                                        <SelectItem value="Kepala satuan sarana dan prasarana">Kepala satuan sarana dan prasarana</SelectItem>
                                                        <SelectItem value="Kepala satuan pelayanan">Kepala satuan pelayanan</SelectItem>
                                                        <SelectItem value="Kepala satuan penertiban">Kepala satuan penertiban</SelectItem>
                                                        <SelectItem value="Pejabat Penatausahaan Pengguna Barang">Pejabat Penatausahaan Pengguna Barang</SelectItem>
                                                        <SelectItem value="Pengurus Barang">Pengurus Barang</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.jabatan_pengurus_barang && <p className="text-xs text-red-500 font-medium">{errors.jabatan_pengurus_barang}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="nip_pengurus_barang" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">NIP Pengurus Barang</Label>
                                                <Input
                                                    id="nip_pengurus_barang"
                                                    value={data.nip_pengurus_barang}
                                                    onChange={(e) => setData('nip_pengurus_barang', e.target.value)}
                                                    placeholder="NIP pengurus barang..."
                                                    className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                                />
                                                {errors.nip_pengurus_barang && <p className="text-xs text-red-500 font-medium">{errors.nip_pengurus_barang}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="warehouse_id" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Gudang Penyimpanan Sasaran</Label>
                                        <Select
                                            value={data.warehouse_id}
                                            onValueChange={(val) => {
                                                if (data.items.length > 0) {
                                                    if (confirm('Mengubah gudang akan mengosongkan keranjang barang pilihan Anda. Apakah Anda yakin?')) {
                                                        setData({
                                                            ...data,
                                                            warehouse_id: val,
                                                            items: []
                                                        });
                                                        setSelectedProductId('');
                                                        toast.info('Daftar barang pengajuan telah dikosongkan.');
                                                    }
                                                } else {
                                                    setData('warehouse_id', val);
                                                    setSelectedProductId('');
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus:ring-indigo-500">
                                                <SelectValue placeholder="Pilih Gudang Tempat Mengambil Barang" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800">
                                                {warehouses.map((w) => (
                                                    <SelectItem key={w.id} value={String(w.id)}>
                                                        {w.name} ({w.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.warehouse_id && <p className="text-xs text-red-500 font-medium">{errors.warehouse_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Keterangan Keperluan</Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Tulis alasan pengajuan barang atau keperluan dinas secara singkat..."
                                            rows={3}
                                            className="rounded-xl border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                        />
                                        {errors.notes && <p className="text-xs text-red-500 font-medium">{errors.notes}</p>}
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <Button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-md transition-all duration-250 cursor-pointer"
                                        >
                                            <span>Pilih Barang</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            /* STEP 2: Pemilihan Barang */
                            <div className="space-y-6">
                                <Card className="bg-slate-100/50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-2xl shadow-sm">
                                    <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                                        <div className="space-y-0.5">
                                            <span className="text-slate-400 font-medium uppercase tracking-wider">Nama & Divisi Pemohon:</span>
                                            <p className="font-bold text-slate-800 dark:text-zinc-200 text-sm">{data.requester_name}</p>
                                            <p className="text-xs text-slate-500">{data.requester_dept}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-slate-400 font-medium uppercase tracking-wider">Gudang Sumber:</span>
                                            <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{getWarehouseName(data.warehouse_id)}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-slate-400 font-medium uppercase tracking-wider">Atasan Langsung:</span>
                                            <p className="font-bold text-slate-800 dark:text-zinc-200 text-sm">{data.nama_atasan}</p>
                                            <p className="text-xs text-slate-500">{data.jabatan_atasan} &bull; NIP: {data.nip}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-slate-400 font-medium uppercase tracking-wider">Penatausaha:</span>
                                            <p className="font-bold text-slate-800 dark:text-zinc-200 text-sm">{data.nama_penatausahaan}</p>
                                            <p className="text-xs text-slate-500">{data.jabatan_penatausahaan} &bull; NIP: {data.nip_penatausahaan}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-slate-400 font-medium uppercase tracking-wider">Pengurus Barang:</span>
                                            <p className="font-bold text-slate-800 dark:text-zinc-200 text-sm">{data.nama_pengurus_barang}</p>
                                            <p className="text-xs text-slate-500">{data.jabatan_pengurus_barang} &bull; NIP: {data.nip_pengurus_barang}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Selector and Cart Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Card className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-lg rounded-2xl overflow-hidden">
                                        <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 py-5 px-6">
                                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                <span>Langkah 2: Pilih Barang & Kuantitas</span>
                                            </CardTitle>
                                            <CardDescription>Cari nama barang yang Anda butuhkan dan masukkan jumlahnya.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                                <div className="sm:col-span-2 space-y-2">
                                                    <Label htmlFor="product_select" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs">Pilih Produk</Label>
                                                    <Select
                                                        value={selectedProductId}
                                                        onValueChange={setSelectedProductId}
                                                    >
                                                        <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus:ring-indigo-500">
                                                            <SelectValue placeholder="Cari / Pilih Nama Barang" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800 max-h-72">
                                                            {filteredProducts.map((p) => {
                                                                const stockQty = getProductStock(p, data.warehouse_id);
                                                                return (
                                                                    <SelectItem key={p.id} value={String(p.id)}>
                                                                        {p.name} (Tersedia: {stockQty} {p.unit?.symbol || 'pcs'})
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="qty_input" className="text-slate-700 dark:text-zinc-300 font-semibold text-xs">Kuantitas</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="qty_input"
                                                            type="number"
                                                            min={1}
                                                            value={itemQty}
                                                            onChange={(e) => setItemQty(parseInt(e.target.value) || 1)}
                                                            disabled={!selectedProductId}
                                                            className="rounded-xl h-11 border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-500 font-mono text-center font-bold"
                                                        />
                                                        <Button
                                                            type="button"
                                                            onClick={handleAddItem}
                                                            disabled={!selectedProductId}
                                                            className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4"
                                                            title="Tambah ke Keranjang"
                                                        >
                                                            <Plus className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Table Cart */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider">Daftar Pilihan Anda</Label>
                                                {data.items.length > 0 ? (
                                                    <div className="rounded-xl border overflow-hidden border-slate-200 dark:border-zinc-800 shadow-sm">
                                                        <Table>
                                                            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
                                                                <TableRow>
                                                                    <TableHead>Nama Barang</TableHead>
                                                                    <TableHead className="text-right w-[140px]">Jumlah Pengajuan</TableHead>
                                                                    <TableHead className="w-[60px]"></TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {data.items.map((item, idx) => (
                                                                    <TableRow key={idx} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800/80">
                                                                        <TableCell className="font-semibold text-slate-800 dark:text-zinc-200">{item.name}</TableCell>
                                                                        <TableCell className="text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                                            {item.qty_requested} {item.symbol}
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg"
                                                                                onClick={() => handleRemoveItem(idx)}
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl space-y-2">
                                                        <Boxes className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-700" />
                                                        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Keranjang masih kosong</p>
                                                        <p className="text-xs text-slate-400 max-w-[280px] mx-auto">
                                                            Pilih nama produk di atas, tentukan jumlah yang diperlukan, lalu tekan tombol tambah (+).
                                                        </p>
                                                    </div>
                                                )}
                                                {errors.items && <p className="text-xs text-red-500 mt-2 font-medium">{errors.items}</p>}
                                            </div>

                                            {/* Action Buttons Step 2 */}
                                            <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex justify-between gap-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setStep(1)}
                                                    className="h-11 px-5 rounded-xl border-slate-200 dark:border-zinc-800 hover:bg-slate-100/50 gap-2 font-bold cursor-pointer"
                                                >
                                                    <ArrowLeft className="h-4 w-4" />
                                                    <span>Kembali</span>
                                                </Button>

                                                <Button
                                                    type="submit"
                                                    disabled={processing || data.items.length === 0}
                                                    className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold gap-2 shadow-md cursor-pointer"
                                                >
                                                    <Send className="h-4 w-4" />
                                                    <span>{processing ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-400 dark:text-zinc-600 pt-8 mt-12 border-t border-slate-100 dark:border-zinc-900/50">
                &copy; {new Date().getFullYear()} Dinas Pekerjaan Rakyat dan Kawasan Permukiman. Hak Cipta Dilindungi.
            </div>
        </div>
    );
}
