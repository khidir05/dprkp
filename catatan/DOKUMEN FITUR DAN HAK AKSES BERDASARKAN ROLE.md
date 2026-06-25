## Sistem Inventaris & Permintaan Barang

# 1. SUPER ADMIN (SA)

## Deskripsi

Super Admin merupakan pemilik sistem yang memiliki akses penuh terhadap seluruh data, konfigurasi, aktivitas pengguna, dan laporan.

---

## Dashboard

### Hak Akses

- Melihat dashboard keseluruhan sistem
- Melihat statistik stok
- Melihat statistik transaksi
- Melihat aktivitas pengguna
- Melihat alert stok minimum
- Melihat mutasi pending approval

---

## Manajemen Pengguna

### Hak Akses

- Tambah pengguna
- Ubah pengguna
- Hapus pengguna
- Aktifkan pengguna
- Nonaktifkan pengguna
- Reset password pengguna
- Kelola role pengguna

---

## Monitoring Stok

### Hak Akses

- Melihat seluruh stok barang
- Melihat stok minimum
- Melihat barang ditahan
- Melihat barang tidak tersedia

---

## Monitoring Transaksi

### Hak Akses

- Melihat seluruh transaksi inbound
- Melihat seluruh transaksi outbound
- Melihat seluruh mutasi stok
- Melihat seluruh permintaan barang

---

## Audit Sistem

### Hak Akses

- Melihat audit log
- Melihat histori login
- Melihat histori logout
- Melihat durasi penggunaan sistem
- Melihat aktivitas setiap pengguna

---

## Laporan

### Hak Akses

- Melihat seluruh laporan
- Export Excel
- Export PDF

---

## Konfigurasi Sistem

### Hak Akses

- Ubah konfigurasi sistem
- Kelola parameter stok minimum
- Kelola pengaturan aplikasi

---

# 2. MANAGER (MG)

## Deskripsi

Manager bertanggung jawab terhadap persetujuan transaksi dan pengawasan operasional inventaris.

---

## Dashboard

### Hak Akses

- Melihat dashboard operasional
- Melihat stok minimum
- Melihat daftar restock
- Melihat permintaan pending
- Melihat mutasi pending

---

## Persetujuan Permintaan Barang

### Hak Akses

- Melihat permintaan barang
- Menyetujui permintaan
- Menolak permintaan
- Memberikan catatan persetujuan
- Memberikan alasan penolakan

---

## Monitoring Stok

### Hak Akses

- Melihat seluruh stok
- Melihat stok minimum
- Melihat barang ditahan
- Melihat barang tidak tersedia

---

## Alert Stok Minimum

### Hak Akses

- Melihat alert stok minimum
- Menandai barang untuk restock
- Menahan barang
- Memberikan alasan penahanan

---

## Daftar Restock

### Hak Akses

- Melihat daftar restock
- Melihat barang stok minimum
- Melihat barang tidak tersedia
- Menindaklanjuti kebutuhan restock

---

## Persetujuan Mutasi

### Hak Akses

- Melihat mutasi pending
- Approve mutasi
- Reject mutasi
- Memberikan alasan penolakan

---

## Laporan

### Hak Akses

- Melihat laporan stok
- Melihat laporan inbound
- Melihat laporan outbound
- Melihat laporan mutasi
- Melihat laporan permintaan barang
- Export Excel
- Export PDF

---

# 3. ADMIN GUDANG (GD)

## Deskripsi

Admin Gudang bertanggung jawab atas operasional stok dan transaksi inventaris.

---

## Dashboard

### Hak Akses

- Melihat dashboard gudang
- Melihat transaksi harian
- Melihat stok minimum
- Melihat mutasi pending

---

## Master Barang

### Hak Akses

- Tambah barang
- Ubah barang
- Nonaktifkan barang
- Lihat detail barang

---

## Stok Barang

### Hak Akses

- Melihat stok barang
- Melihat stok minimum
- Melihat histori stok

---

## Barang Masuk (Inbound)

### Hak Akses

- Tambah transaksi inbound
- Ubah transaksi inbound sebelum finalisasi
- Melihat histori inbound

### Data yang Diinput

- Supplier
- Barang
- Jumlah
- Dokumen Referensi
- Keterangan

---

## Supplier

### Hak Akses

- Tambah supplier
- Ubah supplier
- Lihat supplier
- Nonaktifkan supplier

---

## Barang Keluar (Outbound)

### Hak Akses

- Memproses barang keluar
- Mengurangi stok
- Melihat histori outbound

---

## Permintaan Barang

### Hak Akses

- Melihat permintaan yang disetujui
- Menyiapkan barang
- Menyerahkan barang

---

## Mutasi Stok

### Hak Akses

- Membuat mutasi stok
- Melihat status mutasi
- Melihat mutasi ditolak
- Melihat mutasi disetujui

---

## Barang Tidak Tersedia

### Hak Akses

- Menambah data barang tidak tersedia
- Mengubah data sebelum diproses
- Melihat histori kebutuhan barang

---

# 4. PEMOHON (PM)

## Deskripsi

Pemohon merupakan unit kerja yang mengajukan kebutuhan barang kepada gudang.

---

## Dashboard

### Hak Akses

- Melihat status permohonan
- Melihat notifikasi
- Melihat riwayat permohonan

---

## Stok Barang

### Hak Akses

- Melihat stok barang
- Mencari barang

---

## Permintaan Barang

### Hak Akses

- Membuat permintaan barang
- Mengubah permintaan sebelum diproses
- Membatalkan permintaan sebelum diproses
- Melihat status permintaan

---

## Riwayat Permintaan

### Hak Akses

- Melihat seluruh riwayat pribadi
- Melihat detail permintaan

---

## Konfirmasi Penerimaan

### Hak Akses

- Konfirmasi penerimaan barang
- Menambahkan catatan penerimaan

---

# 5. RINGKASAN HAK AKSES

| Modul | SA | MG | GD | PM |
| --- | --- | --- | --- | --- |
| Dashboard | ✔ | ✔ | ✔ | ✔ |
| User Management | ✔ | ✖ | ✖ | ✖ |
| Master Barang | ✔ | View | ✔ | View |
| Supplier | View | ✖ | ✔ | ✖ |
| Monitoring Stok | ✔ | ✔ | ✔ | ✔ |
| Barang Masuk | View | View | ✔ | ✖ |
| Barang Keluar | View | View | ✔ | ✖ |
| Permintaan Barang | View | Approve | Proses | Create |
| Mutasi Stok | View | Approve | Create | ✖ |
| Alert Stok Minimum | View | ✔ | View | ✖ |
| Daftar Restock | View | ✔ | View | ✖ |
| Audit Log | ✔ | ✖ | ✖ | ✖ |
| Monitoring User | ✔ | ✖ | ✖ | ✖ |
| Laporan | ✔ | ✔ | View | ✖ |
| Konfigurasi Sistem | ✔ | ✖ | ✖ | ✖ |

---

# 6. Matriks Approval

| Proses | Pembuat | Approver |
| --- | --- | --- |
| Permintaan Barang | Pemohon | Manager |
| Mutasi Stok | Admin Gudang | Manager |
| Restock Monitoring | Sistem | Manager |
| Barang Masuk | Admin Gudang | Tidak Perlu Approval |
| Barang Keluar | Admin Gudang | Berdasarkan Permintaan Disetujui |

---

# 7. Matriks Audit

Seluruh aktivitas berikut wajib tercatat pada audit log:

- Login
- Logout
- Tambah Data
- Edit Data
- Hapus Data
- Approve
- Reject
- Export Laporan
- Mutasi Stok
- Barang Masuk
- Barang Keluar
- Permintaan Barang
- Konfirmasi Penerimaan

Data audit dapat diakses oleh Super Admin sebagai pengawas sistem.