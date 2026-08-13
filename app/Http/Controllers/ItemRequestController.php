<?php

namespace App\Http\Controllers;

use App\Models\ItemRequest;
use App\Models\RequestItem;
use App\Models\Warehouse;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class ItemRequestController extends Controller
{
    /**
     * Display a listing of requests.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $query = ItemRequest::query()->with(['requester', 'warehouse', 'approvedBy']);

        // Role-based filtering
        if ($user->roleModel->code === 'pemohon') {
            // Pemohon only sees their own requests
            $query->where('requester_id', $user->id);
        } elseif ($user->roleModel->code === 'admin_gudang') {
            // Admin Gudang only sees requests for their assigned warehouses
            $assignedWarehouseIds = $user->warehouses()->pluck('warehouses.id');
            $query->whereIn('warehouse_id', $assignedWarehouseIds)
                  ->whereIn('status', ['approved', 'delivered', 'completed']); // Gudang sees approved, delivered, and completed requests
        }

        // Search & Status filters
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('request_number', 'like', '%' . $search . '%')
                  ->orWhere('notes', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }

        $requests = $query->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('requests/index', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status', 'start_date', 'end_date']),
            'role' => $user->roleModel->code,
        ]);
    }

    /**
     * Show the form for creating a new request.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'pemohon' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya pemohon yang dapat membuat pengajuan barang.');
        }

        $warehouses = Warehouse::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']);
        $products = Product::with(['category', 'unit', 'stocks'])
            ->where('is_active', true)
            ->where('is_hold', false)
            ->orderBy('name')
            ->get();

        return Inertia::render('requests/create', [
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created request.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user->roleModel->code !== 'pemohon' && $user->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya pemohon yang dapat membuat pengajuan barang.');
        }

        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty_requested' => 'required|integer|min:1',
        ], [
            'items.required' => 'Minimal harus ada 1 barang yang diajukan.',
            'items.*.qty_requested.min' => 'Jumlah barang minimal 1.',
        ]);

        DB::transaction(function() use ($validated, $user) {
            // Auto generate request number
            $count = ItemRequest::whereDate('created_at', today())->count() + 1;
            $requestNumber = 'REQ-' . date('Ymd') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $itemRequest = ItemRequest::create([
                'request_number' => $requestNumber,
                'requester_id' => $user->id,
                'request_date' => now()->toDateString(),
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
                'warehouse_id' => $validated['warehouse_id'],
            ]);

            foreach ($validated['items'] as $item) {
                RequestItem::create([
                    'request_id' => $itemRequest->id,
                    'product_id' => $item['product_id'],
                    'qty_requested' => $item['qty_requested'],
                    'qty_approved' => null, // filled upon manager approval
                ]);
            }
        });

        return redirect()->route('requests.index')
            ->with('success', 'Pengajuan barang berhasil diajukan dan sedang menunggu persetujuan Manager.');
    }

    /**
     * Display details of a request.
     */
    public function show(Request $request, ItemRequest $itemRequest): Response
    {
        $user = $request->user();
        if ($user->roleModel->code === 'admin_gudang') {
            $isAssigned = $user->warehouses()->where('warehouses.id', $itemRequest->warehouse_id)->exists();
            if (!$isAssigned) {
                abort(403, 'Anda tidak memiliki hak akses untuk melihat permohonan barang untuk gudang ini.');
            }
        }

        $itemRequest->load([
            'requester', 
            'warehouse', 
            'approvedBy', 
            'requestItems.product.unit',
            'outboundTransaction.processedBy',
            'goodsReceipt.receivedBy'
        ]);

        // Load stocks count in this warehouse for each requested product (helps Manager & Gudang check stock levels)
        foreach ($itemRequest->requestItems as $item) {
            $stock = \App\Models\Stock::where('warehouse_id', $itemRequest->warehouse_id)
                ->where('product_id', $item->product_id)
                ->first();
            $item->available_stock = $stock ? $stock->qty : 0;
        }

        return Inertia::render('requests/show', [
            'itemRequest' => $itemRequest,
            'role' => $user->roleModel->code,
        ]);
    }

    /**
     * Approve the request (Manager only).
     */
    public function approve(Request $request, ItemRequest $itemRequest): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat menyetujui pengajuan barang.');
        }

        if ($itemRequest->status !== 'pending') {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Pengajuan ini sudah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:request_items,id',
            'items.*.qty_approved' => 'required|integer|min:0',
        ]);

        DB::transaction(function() use ($validated, $itemRequest, $request) {
            foreach ($validated['items'] as $itemData) {
                $item = RequestItem::find($itemData['id']);
                $item->update([
                    'qty_approved' => $itemData['qty_approved'],
                ]);
            }

            $itemRequest->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);
        });

        return redirect()->route('requests.show', $itemRequest->id)
            ->with('success', 'Pengajuan barang disetujui dan siap diproses oleh Admin Gudang.');
    }

    /**
     * Reject the request (Manager only).
     */
    public function reject(Request $request, ItemRequest $itemRequest): RedirectResponse
    {
        if ($request->user()->roleModel->code !== 'manager' && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Hanya Manager yang dapat menolak pengajuan barang.');
        }

        if ($itemRequest->status !== 'pending') {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Pengajuan ini sudah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ], [
            'rejection_reason.required' => 'Alasan penolakan wajib diisi.',
        ]);

        $itemRequest->update([
            'status' => 'rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return redirect()->route('requests.show', $itemRequest->id)
            ->with('success', 'Pengajuan barang telah ditolak.');
    }

    /**
     * Cancel the request (Pemohon only).
     */
    public function cancel(Request $request, ItemRequest $itemRequest): RedirectResponse
    {
        if ($request->user()->id !== $itemRequest->requester_id && $request->user()->roleModel->code !== 'super_admin') {
            abort(403, 'Anda tidak memiliki hak untuk membatalkan pengajuan ini.');
        }

        if ($itemRequest->status !== 'pending') {
            return redirect()->route('requests.show', $itemRequest->id)
                ->with('error', 'Hanya pengajuan berstatus Pending yang dapat dibatalkan.');
        }

        $itemRequest->delete(); // Or update to a 'cancelled' status if available, but since migration enum is just pending/approved/rejected/completed, delete is appropriate or we can just delete it as planned.

        return redirect()->route('requests.index')
            ->with('success', 'Pengajuan barang berhasil dibatalkan/dihapus.');
    }

    /**
     * Show the public guest form for creating a new request/pengajuan (no login required).
     */
    public function guestCreate(): Response
    {
        $warehouses = Warehouse::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']);
        $products = Product::with(['category', 'unit', 'stocks'])
            ->where('is_active', true)
            ->where('is_hold', false)
            ->orderBy('name')
            ->get();

        return Inertia::render('requests/guest-create', [
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    public function guestPrint(string $requestNumber)
    {
        $itemRequest = ItemRequest::with(['requestItems.product.unit', 'warehouse'])
            ->where('request_number', $requestNumber)
            ->firstOrFail();

        $itemsData = [];
        foreach ($itemRequest->requestItems as $item) {
            $itemsData[] = [
                'name' => $item->product->name ?? '-',
                'qty' => $item->qty_requested,
                'unit' => $item->product->unit->symbol ?? 'pcs'
            ];
        }

        // Set locale to Indonesian for month names
        \Carbon\Carbon::setLocale('id');
        $formattedDate = \Carbon\Carbon::parse($itemRequest->request_date)->translatedFormat('d F Y');
        $tanggal = \Carbon\Carbon::parse($itemRequest->request_date)->format('d');
        $bulan = \Carbon\Carbon::parse($itemRequest->request_date)->translatedFormat('F');
        $tahun = \Carbon\Carbon::parse($itemRequest->request_date)->format('Y');

        // Translate year into words
        $convertYearToWords = function($year) {
            $ones = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan"];
            $tens = ["", "Sepuluh", "Dua Puluh", "Tiga Puluh", "Empat Puluh", "Lima Puluh", "Enam Puluh", "Tujuh Puluh", "Delapan Puluh", "Sembilan Puluh"];
            
            $yearStr = (string)$year;
            if (strlen($yearStr) === 4) {
                $thousand = "Dua Ribu";
                $tenVal = intval($yearStr[2]);
                $oneVal = intval($yearStr[3]);
                
                $suffix = "";
                if ($tenVal === 1 && $oneVal > 0) {
                    if ($oneVal === 1) {
                        $suffix = "Sebelas";
                    } else {
                        $suffix = $ones[$oneVal] . " Belas";
                    }
                } else {
                    $suffix = trim($tens[$tenVal] . " " . $ones[$oneVal]);
                }
                
                return trim($thousand . " " . $suffix);
            }
            return "Dua Ribu Dua Puluh Enam";
        };
        $tahunWords = $convertYearToWords(intval($tahun));

        // Format day names/date words for BAST: "Senin tanggal Tiga Belas bulan Juli tahun Dua Ribu Dua Puluh Enam"
        $dayName = \Carbon\Carbon::parse($itemRequest->request_date)->translatedFormat('l');
        
        $numberToWords = function($num) {
            $ones = ["Nol", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", 
                     "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas", "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas"];
            $tens = ["", "", "Dua Puluh", "Tiga Puluh"];
            
            if ($num < 20) {
                return $ones[$num];
            }
            if ($num < 32) {
                $tenVal = intval($num / 10);
                $oneVal = $num % 10;
                return trim($tens[$tenVal] . " " . ($oneVal > 0 ? $ones[$oneVal] : ""));
            }
            return (string)$num;
        };
        $tanggalWords = $numberToWords(intval($tanggal));

        $jsonData = [
            'request_number' => $itemRequest->request_number,
            'requester_name' => $itemRequest->requester_name,
            'requester_dept' => $itemRequest->requester_dept,
            'nama_atasan' => $itemRequest->nama_atasan,
            'jabatan_atasan' => $itemRequest->jabatan_atasan,
            'nip' => $itemRequest->nip,
            'nama_penatausahaan' => $itemRequest->nama_penatausahaan ?? '',
            'jabatan_penatausahaan' => $itemRequest->jabatan_penatausahaan ?? '',
            'nip_penatausahaan' => $itemRequest->nip_penatausahaan ?? '',
            'nama_pengurus_barang' => $itemRequest->nama_pengurus_barang ?? '',
            'jabatan_pengurus_barang' => $itemRequest->jabatan_pengurus_barang ?? '',
            'nip_pengurus_barang' => $itemRequest->nip_pengurus_barang ?? '',
            'notes' => $itemRequest->notes ?? '',
            'date_formatted' => $formattedDate,
            'tanggal' => $tanggal,
            'bulan' => $bulan,
            'tahun' => $tahun,
            'day_name' => $dayName,
            'tanggal_words' => $tanggalWords,
            'tahun_words' => $tahunWords,
            'items' => $jsonData['items'] ?? $itemsData
        ];

        $templatePath = public_path('print/Surat Pengambilan Barang.docx');
        if (!file_exists($templatePath)) {
            abort(404, 'Template file not found.');
        }

        $tempFile = tempnam(sys_get_temp_dir(), 'docx');
        $compiledSuccessfully = false;

        // Try compiling using native PHP ZipArchive first (ideal for standard shared hosting without Python/exec limits)
        if (class_exists('ZipArchive')) {
            try {
                $zip = new \ZipArchive();
                if ($zip->open($tempFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === TRUE) {
                    $templateZip = new \ZipArchive();
                    if ($templateZip->open($templatePath) === TRUE) {
                        for ($i = 0; $i < $templateZip->numFiles; $i++) {
                            $filename = $templateZip->getNameIndex($i);
                            $fileContent = $templateZip->getFromIndex($i);
                            
                            if ($filename === 'word/document.xml') {
                                $xmlContent = $fileContent;
                                
                                // 1. Clean split placeholders
                                $xmlContent = preg_replace_callback('/\{([^{}]+)\}/', function($matches) {
                                    $cleanInner = preg_replace('/<[^>]+>/', '', $matches[1]);
                                    return "{" . $cleanInner . "}";
                                }, $xmlContent);
                                
                                // Hardcoded replacements
                                $xmlContent = str_replace('dari Liman', "dari " . $jsonData['requester_name'], $xmlContent);
                                $xmlContent = str_replace('Irawan Saputra', $jsonData['nama_penatausahaan'] ?: '........................................', $xmlContent);
                                $xmlContent = str_replace('Kepala Sub Bagian Tata Usaha Unit Pengelola Rumah Susun II', $jsonData['jabatan_penatausahaan'] ?: '........................................', $xmlContent);
                                $xmlContent = str_replace('Pengurus Barang Pembantu', $jsonData['jabatan_pengurus_barang'] ?: 'Pengurus Barang Pembantu', $xmlContent);
                                
                                // 2. Duplicate rows
                                $rowRegex = '/<w:tr(?:(?!<\/w:tr>).)*?\{nama_barang\}(?:(?!<\/w:tr>).)*?<\/w:tr>/s';
                                preg_match_all($rowRegex, $xmlContent, $rowsMatches);
                                $rows = $rowsMatches[0] ?? [];
                                
                                if (count($rows) >= 6) {
                                    $makeRows = function($templateRow, $items) use ($jsonData) {
                                        $newRows = [];
                                        foreach ($items as $idx => $it) {
                                            $rowXml = $templateRow;
                                            $rowXml = str_replace('{nama_barang}', $it['name'], $rowXml);
                                            $rowXml = str_replace('{qty}', $it['qty'] . ' ' . $it['unit'], $rowXml);
                                            $rowXml = str_replace('{keterangan}', ($idx === 0 ? ($jsonData['notes'] ?? '') : ''), $rowXml);
                                            $rowXml = preg_replace('/<w:t>([0-9]+)<\/w:t>/', '<w:t>' . ($idx + 1) . '</w:t>', $rowXml, 1);
                                            $newRows[] = $rowXml;
                                        }
                                        return implode('', $newRows);
                                    };
                                    
                                    // Replace Table 1
                                    $table1Pattern = '/' . preg_quote($rows[0], '/') . '(?:(?!<w:tr).)*?' . preg_quote($rows[1], '/') . '/s';
                                    $xmlContent = preg_replace($table1Pattern, $makeRows($rows[0], $jsonData['items']), $xmlContent, 1);
                                    
                                    // Re-fetch remaining
                                    preg_match_all($rowRegex, $xmlContent, $rowsMatchesUpd);
                                    $rowsUpd = $rowsMatchesUpd[0] ?? [];
                                    
                                    if (count($rowsUpd) >= 4) {
                                        // Replace Table 2
                                        $table2Pattern = '/' . preg_quote($rowsUpd[0], '/') . '(?:(?!<w:tr).)*?' . preg_quote($rowsUpd[1], '/') . '/s';
                                        $xmlContent = preg_replace($table2Pattern, $makeRows($rowsUpd[0], $jsonData['items']), $xmlContent, 1);
                                        
                                        // Re-fetch remaining
                                        preg_match_all($rowRegex, $xmlContent, $rowsMatchesUpd2);
                                        $rowsUpd2 = $rowsMatchesUpd2[0] ?? [];
                                        
                                        if (count($rowsUpd2) >= 2) {
                                            // Replace Table 3
                                            $table3Pattern = '/' . preg_quote($rowsUpd2[0], '/') . '(?:(?!<w:tr).)*?' . preg_quote($rowsUpd2[1], '/') . '/s';
                                            $xmlContent = preg_replace($table3Pattern, $makeRows($rowsUpd2[0], $jsonData['items']), $xmlContent, 1);
                                        }
                                    }
                                }
                                
                                // 3. Replace general placeholders
                                $replacements = [
                                    '{nama_pemohon}' => $jsonData['requester_name'],
                                    '{bidang_pemohon}' => $jsonData['requester_dept'],
                                    '{nama_manajer}' => $jsonData['nama_atasan'],
                                    '{nip_manajer}' => $jsonData['nip'],
                                    '{divisi_manajer}' => $jsonData['jabatan_atasan'],
                                    '{nama_atasan}' => $jsonData['nama_penatausahaan'] ?: '........................................',
                                    '{nip_atasan}' => $jsonData['nip_penatausahaan'] ?: '........................................',
                                    '{jabatan_atasan}' => $jsonData['jabatan_penatausahaan'] ?: '........................................',
                                    '{nama_admin}' => $jsonData['nama_pengurus_barang'] ?: '........................................',
                                    '{nip_admin}' => $jsonData['nip_pengurus_barang'] ?: '........................................',
                                    '{jabatan_admin}' => $jsonData['jabatan_pengurus_barang'] ?: '........................................',
                                    '{tanggal, bulan, tahun}' => $jsonData['date_formatted'],
                                    '{tanggal}' => $jsonData['tanggal'],
                                    '{bulan}' => $jsonData['bulan'],
                                    '{tahun}' => $jsonData['tahun'],
                                    'Senin' => $jsonData['day_name'],
                                    'Tiga Belas' => $jsonData['tanggal_words'],
                                    'Juli' => $jsonData['bulan'],
                                    'Dua Ribu Dua Puluh Enam' => $jsonData['tahun_words'],
                                ];
                                
                                foreach ($replacements as $k => $v) {
                                    $xmlContent = str_replace($k, $v, $xmlContent);
                                }
                                
                                $zip->addFromString($filename, $xmlContent);
                            } else {
                                $zip->addFromString($filename, $fileContent);
                            }
                        }
                        $templateZip->close();
                        $compiledSuccessfully = true;
                    }
                    $zip->close();
                }
            } catch (\Exception $e) {
                \Log::error("PHP ZipArchive DOCX compile failed: " . $e->getMessage());
            }
        }

        // If ZipArchive wasn't successful or failed, fallback to python command execution
        if (!$compiledSuccessfully) {
            $jsonTempFile = tempnam(sys_get_temp_dir(), 'json');
            file_put_contents($jsonTempFile, json_encode($jsonData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
            
            $pythonScript = app_path('Services/docx_compiler.py');
            $pythonExecutable = DIRECTORY_SEPARATOR === '\\' ? 'python' : 'python3';
            $command = $pythonExecutable . " " . escapeshellarg($pythonScript) . " " . escapeshellarg($jsonTempFile) . " " . escapeshellarg($templatePath) . " " . escapeshellarg($tempFile) . " 2>&1";
            
            exec($command, $output, $returnVar);
            @unlink($jsonTempFile);
            
            if ($returnVar !== 0) {
                if (file_exists($tempFile)) {
                    @unlink($tempFile);
                }
                return abort(500, 'Unable to generate docx using python fallback. Output: ' . implode("\n", $output));
            }
        }

        if (file_exists($tempFile)) {
            $downloadName = 'Surat_Pengambilan_Barang_' . $itemRequest->request_number . '.docx';
            return response()->download($tempFile, $downloadName)->deleteFileAfterSend(true);
        }

        return abort(500, 'Document file compilation was not created.');
    }

    /**
     * Store a newly created request/pengajuan from the public guest form.
     */
    public function guestStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'requester_name' => 'required|string|max:255',
            'requester_dept' => 'required|string|max:255',
            'nip' => 'required|string|max:50',
            'nama_atasan' => 'required|string|max:255',
            'jabatan_atasan' => 'required|string|max:255',
            'nama_penatausahaan' => 'required|string|max:255',
            'jabatan_penatausahaan' => 'required|string|max:255',
            'nip_penatausahaan' => 'required|string|max:50',
            'nama_pengurus_barang' => 'required|string|max:255',
            'jabatan_pengurus_barang' => 'required|string|max:255',
            'nip_pengurus_barang' => 'required|string|max:50',
            'warehouse_id' => 'required|exists:warehouses,id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty_requested' => 'required|integer|min:1',
        ], [
            'items.required' => 'Minimal harus ada 1 barang yang diajukan.',
            'items.*.qty_requested.min' => 'Jumlah barang minimal 1.',
        ]);

        $requestNumber = '';
        DB::transaction(function() use ($validated, &$requestNumber) {
            // Auto generate request number
            $count = ItemRequest::whereDate('created_at', today())->count() + 1;
            $requestNumber = 'REQ-' . date('Ymd') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $itemRequest = ItemRequest::create([
                'request_number' => $requestNumber,
                'requester_id' => null, // Guest has no user ID
                'requester_name' => $validated['requester_name'],
                'requester_dept' => $validated['requester_dept'],
                'nip' => $validated['nip'],
                'nama_atasan' => $validated['nama_atasan'],
                'jabatan_atasan' => $validated['jabatan_atasan'],
                'nama_penatausahaan' => $validated['nama_penatausahaan'],
                'jabatan_penatausahaan' => $validated['jabatan_penatausahaan'],
                'nip_penatausahaan' => $validated['nip_penatausahaan'],
                'nama_pengurus_barang' => $validated['nama_pengurus_barang'],
                'jabatan_pengurus_barang' => $validated['jabatan_pengurus_barang'],
                'nip_pengurus_barang' => $validated['nip_pengurus_barang'],
                'request_date' => now()->toDateString(),
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
                'warehouse_id' => $validated['warehouse_id'],
            ]);

            foreach ($validated['items'] as $item) {
                RequestItem::create([
                    'request_id' => $itemRequest->id,
                    'product_id' => $item['product_id'],
                    'qty_requested' => $item['qty_requested'],
                    'qty_approved' => null,
                ]);
            }
        });

        return redirect()->route('requests.guest-create')
            ->with([
                'success' => 'Pengajuan barang berhasil dikirim!',
                'request_number' => $requestNumber
            ]);
    }
}
