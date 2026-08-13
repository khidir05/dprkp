import { useEffect } from 'react';
import { Head } from '@inertiajs/react';

type RequestItem = {
    id: number;
    qty_requested: number;
    qty_approved: number | null;
    product?: {
        code: string;
        name: string;
        unit?: { symbol: string };
    };
};

type ItemRequest = {
    id: number;
    request_number: string;
    requester_name: string;
    requester_dept: string;
    nip: string;
    nama_atasan: string;
    jabatan_atasan: string;
    nama_penatausahaan?: string;
    jabatan_penatausahaan?: string;
    nip_penatausahaan?: string;
    nama_pengurus_barang?: string;
    jabatan_pengurus_barang?: string;
    nip_pengurus_barang?: string;
    request_date: string;
    status: string;
    notes: string | null;
    warehouse?: { name: string };
    request_items: RequestItem[];
};

type Props = {
    itemRequest: ItemRequest;
};

export default function GuestRequestPrint({ itemRequest }: Props) {
    useEffect(() => {
        // Wait for rendering to complete, then open print dialog
        const timer = setTimeout(() => {
            window.print();
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const formattedDate = new Date(itemRequest.request_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-white text-black font-serif p-8 max-w-4xl mx-auto print:p-0 print:m-0">
            <Head title={`Cetak SPB - ${itemRequest.request_number}`} />

            {/* Letterhead (KOP SURAT) */}
            <div className="flex items-center border-b-4 border-double border-black pb-2 mb-6">
                <img 
                    src="/print/logo.png" 
                    alt="Logo DKI" 
                    className="h-28 w-auto object-contain mr-4 shrink-0"
                />
                <div className="text-center flex-1 pr-12">
                    <h2 className="text-sm font-bold uppercase leading-tight tracking-wide">
                        PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA
                    </h2>
                    <h1 className="text-base font-extrabold uppercase leading-tight tracking-wide">
                        DINAS PERUMAHAN RAKYAT DAN KAWASAN PERMUKIMAN
                    </h1>
                    <h2 className="text-sm font-bold uppercase leading-tight tracking-wide">
                        UNIT PENGELOLA RUMAH SUSUN II
                    </h2>
                    <p className="text-[11px] leading-normal font-sans">
                        Jalan Akses Rusun Marunda Cluster D Blok D2 Kel. Marunda Kec. Cilincing
                    </p>
                    <p className="text-[11px] leading-normal font-sans">
                        Phone & Fax : (021) 22418292 e-mail : uprsdua@gmail.com
                    </p>
                    <p className="text-[11px] leading-normal font-bold font-sans">
                        J A K A R T A <span className="font-normal ml-8">Kode Pos : 14150</span>
                    </p>
                </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-1 mb-8">
                <h1 className="text-base font-bold underline tracking-wider uppercase">
                    SURAT PERMINTAAN BARANG (SPB)
                </h1>
                <p className="text-xs font-mono font-semibold">
                    No : {itemRequest.request_number}
                </p>
            </div>

            {/* Requester Info Summary */}
            <div className="space-y-4 text-xs mb-6 leading-relaxed">
                <table className="w-full table-fixed border-collapse">
                    <tbody>
                        <tr>
                            <td className="w-[180px] py-1 font-bold">Nama Pemohon</td>
                            <td className="w-[15px] py-1">:</td>
                            <td className="py-1">{itemRequest.requester_name}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-bold">Unit Kerja / Bidang</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{itemRequest.requester_dept}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-bold">Gudang Tujuan</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{itemRequest.warehouse?.name || 'Gudang Dinas'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Items Table */}
            <div className="mb-12">
                <table className="w-full text-xs border border-black border-collapse">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="border border-black p-2 text-center w-12 font-bold">No</th>
                            <th className="border border-black p-2 text-left font-bold">Uraian Nama Barang</th>
                            <th className="border border-black p-2 text-right w-36 font-bold">Jumlah Permintaan</th>
                            <th className="border border-black p-2 text-left w-48 font-bold">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemRequest.request_items.map((item, idx) => (
                            <tr key={item.id} className="align-top">
                                <td className="border border-black p-2 text-center">{idx + 1}</td>
                                <td className="border border-black p-2 font-bold">{item.product?.name}</td>
                                <td className="border border-black p-2 text-right font-mono font-bold">
                                    {item.qty_requested} {item.product?.unit?.symbol || 'pcs'}
                                </td>
                                <td className="border border-black p-2 text-xs italic">
                                    {idx === 0 ? (itemRequest.notes || '-') : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Signature Block (2x2 grid) */}
            <div className="text-xs">
                <div className="grid grid-cols-2 gap-y-16 gap-x-8 text-center items-start">
                    {/* Row 1, Col 1: Supervisor (Atasan) */}
                    <div className="space-y-16">
                        <div>
                            <p className="font-bold">Mengetahui,</p>
                            <p className="font-semibold">{itemRequest.jabatan_atasan}</p>
                        </div>
                        <div>
                            <p className="font-bold underline uppercase">{itemRequest.nama_atasan}</p>
                            <p className="font-mono text-[10px]">NIP. {itemRequest.nip}</p>
                        </div>
                    </div>

                    {/* Row 1, Col 2: Penatausahaan */}
                    <div className="space-y-16">
                        <div>
                            <p className="font-bold">Menyetujui,</p>
                            <p className="font-semibold">{itemRequest.jabatan_penatausahaan || 'Kasubag Tata Usaha'}</p>
                        </div>
                        <div>
                            <p className="font-bold underline uppercase">{itemRequest.nama_penatausahaan || '........................................'}</p>
                            <p className="font-mono text-[10px]">NIP. {itemRequest.nip_penatausahaan || '........................................'}</p>
                        </div>
                    </div>

                    {/* Row 2, Col 1: Pemohon */}
                    <div className="space-y-16">
                        <div>
                            <p>Jakarta, {formattedDate}</p>
                            <p className="font-bold mt-1">Yang Meminta (Pemohon)</p>
                        </div>
                        <div>
                            <p className="font-bold underline uppercase">{itemRequest.requester_name}</p>
                        </div>
                    </div>

                    {/* Row 2, Col 2: Pengurus Barang */}
                    <div className="space-y-16">
                        <div>
                            <p className="invisible">Jakarta, {formattedDate}</p>
                            <p className="font-bold mt-1">Yang Menyerahkan (Pengurus Barang)</p>
                        </div>
                        <div>
                            <p className="font-bold underline uppercase">{itemRequest.nama_pengurus_barang || '........................................'}</p>
                            <p className="font-mono text-[10px]">NIP. {itemRequest.nip_pengurus_barang || '........................................'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styling Helper */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body {
                        background-color: white !important;
                        color: black !important;
                    }
                    header, footer, nav, button, .no-print {
                        display: none !important;
                    }
                }
            `}} />
        </div>
    );
}
