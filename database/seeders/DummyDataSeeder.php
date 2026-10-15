<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ItemRequest;
use App\Models\Product;
use App\Models\RequestItem;
use App\Models\Role;
use App\Models\Stock;
use App\Models\Unit;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command?->info('Menyiapkan data master & referensi...');

        // Ambil data referensi
        $categories = Category::all()->keyBy('name');
        $units = Unit::all()->keyBy('symbol');
        $warehouse = Warehouse::where('code', 'GDG-001')->first() ?? Warehouse::first();

        if (!$warehouse) {
            $warehouse = Warehouse::create([
                'code' => 'GDG-001',
                'name' => 'Gudang Utama',
                'address' => 'Jl. Jati Baru No. 1, Jakarta Pusat',
                'is_active' => true,
            ]);
        }

        $pemohonRole = Role::where('code', 'pemohon')->first();
        $managerRole = Role::where('code', 'manager')->first();

        $pemohonUser = User::where('email', 'pemohon@dprkp.go.id')->first()
            ?? User::where('role', $pemohonRole?->id)->first()
            ?? User::first();

        $managerUser = User::where('email', 'manager@dprkp.go.id')->first()
            ?? User::where('role', $managerRole?->id)->first();

        // =====================================================================
        // 1. DATA DUMMY: 10 PRODUK INVENTARIS + STOK GUDANG
        // =====================================================================
        $this->command?->info('Membuat 10 data dummy produk & stok...');

        $dummyProducts = [
            [
                'name' => 'Kertas HVS A4 80gr',
                'brand' => 'PaperOne',
                'packaging' => 'Rim',
                'sku' => 'PRD-ATK-001',
                'code' => 'BRG-001',
                'category_name' => 'Alat Tulis Kantor',
                'unit_symbol' => 'rim',
                'description' => 'Kertas fotokopi dan cetak dokumen ukuran A4 80 gram kualitas premium.',
                'minimum_stock' => 20,
                'stock_qty' => 150,
            ],
            [
                'name' => 'Kertas HVS F4 75gr',
                'brand' => 'Sinar Dunia',
                'packaging' => 'Box (5 Rim)',
                'sku' => 'PRD-ATK-002',
                'code' => 'BRG-002',
                'category_name' => 'Alat Tulis Kantor',
                'unit_symbol' => 'box',
                'description' => 'Kertas folio F4 75 gram kemasan kardus untuk kebutuhan administrasi umum.',
                'minimum_stock' => 10,
                'stock_qty' => 60,
            ],
            [
                'name' => 'Pulpen Gel 0.5mm Hitam',
                'brand' => 'Pilot G2',
                'packaging' => 'Lusin / Box',
                'sku' => 'PRD-ATK-003',
                'code' => 'BRG-003',
                'category_name' => 'Alat Tulis Kantor',
                'unit_symbol' => 'box',
                'description' => 'Pena tinta gel warna hitam isi 12 pcs per kotak, nyaman untuk disposisi.',
                'minimum_stock' => 15,
                'stock_qty' => 80,
            ],
            [
                'name' => 'Map Snelhefter Plastik Biru',
                'brand' => 'Bantex',
                'packaging' => 'Pack (10 Pcs)',
                'sku' => 'PRD-ATK-004',
                'code' => 'BRG-004',
                'category_name' => 'Alat Tulis Kantor',
                'unit_symbol' => 'pack',
                'description' => 'Map arsip plastik snelhefter warna biru dinas untuk pengarsipan surat.',
                'minimum_stock' => 10,
                'stock_qty' => 50,
            ],
            [
                'name' => 'Toner Cartridge LaserJet 85A',
                'brand' => 'HP Original',
                'packaging' => 'Unit Kotak',
                'sku' => 'PRD-ELK-001',
                'code' => 'BRG-005',
                'category_name' => 'Elektronik & IT',
                'unit_symbol' => 'pcs',
                'description' => 'Toner printer laser monokrom hitam untuk operasional printer dinas.',
                'minimum_stock' => 5,
                'stock_qty' => 25,
            ],
            [
                'name' => 'Tinta Botol 003 Black',
                'brand' => 'Epson',
                'packaging' => 'Botol 65ml',
                'sku' => 'PRD-ELK-002',
                'code' => 'BRG-006',
                'category_name' => 'Elektronik & IT',
                'unit_symbol' => 'pcs',
                'description' => 'Tinta isi ulang printer Epson L-Series warna hitam 65ml.',
                'minimum_stock' => 8,
                'stock_qty' => 45,
            ],
            [
                'name' => 'Flashdisk USB 3.0 32GB',
                'brand' => 'SanDisk Ultra',
                'packaging' => 'Blister Pack',
                'sku' => 'PRD-ELK-003',
                'code' => 'BRG-007',
                'category_name' => 'Elektronik & IT',
                'unit_symbol' => 'pcs',
                'description' => 'Media penyimpanan portabel USB 3.0 kecepatan tinggi untuk backup data kegiatan.',
                'minimum_stock' => 10,
                'stock_qty' => 40,
            ],
            [
                'name' => 'Hand Sanitizer Gel 500ml',
                'brand' => 'Antis Pump',
                'packaging' => 'Botol Pump',
                'sku' => 'PRD-KBS-001',
                'code' => 'BRG-008',
                'category_name' => 'Kebersihan & Sanitasi',
                'unit_symbol' => 'pcs',
                'description' => 'Pembersih tangan antiseptik 500ml dengan dispenser pump untuk ruang rapat.',
                'minimum_stock' => 10,
                'stock_qty' => 70,
            ],
            [
                'name' => 'Cairan Pembersih Lantai 4 Liter',
                'brand' => 'Wipol Karbol',
                'packaging' => 'Jerigen 4L',
                'sku' => 'PRD-KBS-002',
                'code' => 'BRG-009',
                'category_name' => 'Kebersihan & Sanitasi',
                'unit_symbol' => 'pcs',
                'description' => 'Cairan karbol desinfektan aroma pinus untuk sanitasi gedung kantor.',
                'minimum_stock' => 5,
                'stock_qty' => 30,
            ],
            [
                'name' => 'Baterai Alkaline AA 4s',
                'brand' => 'ABC Alkaline',
                'packaging' => 'Pack (4 Pcs)',
                'sku' => 'PRD-PRK-001',
                'code' => 'BRG-010',
                'category_name' => 'Peralatan & Perkakas',
                'unit_symbol' => 'pack',
                'description' => 'Baterai ukuran AA 1.5V untuk mouse, pointer proyektor, dan jam dinding kantor.',
                'minimum_stock' => 15,
                'stock_qty' => 90,
            ],
        ];

        $createdProducts = [];

        foreach ($dummyProducts as $item) {
            $cat = $categories[$item['category_name']] ?? Category::first();
            $unit = $units[$item['unit_symbol']] ?? Unit::first();

            $product = Product::firstOrCreate(
                ['sku' => $item['sku']],
                [
                    'code' => $item['code'],
                    'name' => $item['name'],
                    'brand' => $item['brand'],
                    'packaging' => $item['packaging'],
                    'category_id' => $cat->id,
                    'unit_id' => $unit->id,
                    'description' => $item['description'],
                    'minimum_stock' => $item['minimum_stock'],
                    'is_active' => true,
                    'is_hold' => false,
                ]
            );

            // Buat atau update stok di Gudang Utama
            Stock::firstOrCreate(
                [
                    'warehouse_id' => $warehouse->id,
                    'product_id' => $product->id,
                ],
                [
                    'qty' => $item['stock_qty'],
                ]
            );

            $createdProducts[] = $product;
        }

        // =====================================================================
        // 2. DATA DUMMY: 10 PENGAJUAN / PERMINTAAN BARANG (ITEM REQUESTS)
        // =====================================================================
        $this->command?->info('Membuat 10 data dummy permohonan barang...');

        $divisions = [
            'Bidang Perumahan Rakyat',
            'Bidang Kawasan Permukiman',
            'Sekretariat Dinas DPRKP',
            'Seksi Pengawasan & Pengendalian',
            'Seksi Perencanaan Teknis',
            'Subbag Umum & Kepegawaian',
            'Subbag Keuangan & Aset',
            'UPRS Rusunawa I',
            'UPRS Rusunawa II',
            'Pusat Data & Informasi Perumahan',
        ];

        $statuses = [
            'pending',
            'approved',
            'approved',
            'completed',
            'completed',
            'pending',
            'approved',
            'rejected',
            'completed',
            'pending',
        ];

        for ($i = 1; $i <= 10; $i++) {
            $reqNum = sprintf('REQ/DPRKP/2026/10/%04d', $i);
            $status = $statuses[$i - 1];
            $division = $divisions[$i - 1];
            $date = Carbon::now()->subDays(15 - $i);

            $isApproved = in_array($status, ['approved', 'completed']);
            $isRejected = $status === 'rejected';

            $itemRequest = ItemRequest::firstOrCreate(
                ['request_number' => $reqNum],
                [
                    'requester_id' => $pemohonUser?->id ?? 1,
                    'requester_name' => 'Staf ' . $division,
                    'requester_dept' => $division,
                    'nip' => '19880115201101' . sprintf('%04d', $i),
                    'nama_atasan' => 'Drs. H. Bambang Sudiro, M.Si',
                    'jabatan_atasan' => 'Kepala ' . $division,
                    'nama_penatausahaan' => 'Nurul Hidayati, S.E.',
                    'jabatan_penatausahaan' => 'Pengurus Barang Pembantu',
                    'nip_penatausahaan' => '199203102015022003',
                    'nama_pengurus_barang' => 'Ahmad Fauzi, S.Kom',
                    'jabatan_pengurus_barang' => 'Pengurus Barang Pengguna',
                    'nip_pengurus_barang' => '198705202010011002',
                    'request_date' => $date->format('Y-m-d'),
                    'status' => $status,
                    'notes' => 'Kebutuhan operasional dan penyusunan laporan triwulan ' . $division . '.',
                    'warehouse_id' => $warehouse->id,
                    'approved_by' => $isApproved ? ($managerUser?->id ?? 1) : null,
                    'approved_at' => $isApproved ? $date->copy()->addHours(4) : null,
                    'rejection_reason' => $isRejected ? 'Alokasi stok triwulan untuk divisi ini sudah melebihi batas kuota.' : null,
                ]
            );

            // Tambahkan 2-3 item per permohonan
            $selectedProducts = array_slice($createdProducts, ($i - 1) % 8, 2);
            foreach ($selectedProducts as $idx => $prod) {
                $requestedQty = ($idx + 1) * 3;
                RequestItem::firstOrCreate(
                    [
                        'request_id' => $itemRequest->id,
                        'product_id' => $prod->id,
                    ],
                    [
                        'qty_requested' => $requestedQty,
                        'qty_approved' => $isApproved ? $requestedQty : null,
                    ]
                );
            }
        }

        $this->command?->info('Berhasil membuat 10 data produk beserta stok dan 10 data pengajuan barang!');
    }
}
