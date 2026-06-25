# 1. Tujuan Sistem

Sistem Inventaris & Permintaan Barang digunakan untuk mengelola persediaan barang gudang, proses permintaan barang oleh unit kerja, pencatatan barang masuk dan keluar, monitoring stok minimum, mutasi stok, serta audit aktivitas pengguna.

Sistem ini tidak mencakup proses Purchase Order (PO) karena pengadaan barang dilakukan melalui mekanisme anggaran pemerintah yang telah memiliki sistem tersendiri.

---

# 2. Role Pengguna

## 2.1 Super Admin (SA)

Memiliki akses penuh terhadap seluruh sistem.

### Tanggung Jawab

- Mengelola pengguna dan hak akses
- Mengelola konfigurasi sistem
- Melihat seluruh data transaksi
- Melihat audit log aktivitas pengguna
- Mengakses dashboard dan laporan

---

## 2.2 Manager (MG)

Bertanggung jawab terhadap pengawasan operasional dan persetujuan proses bisnis.

### Tanggung Jawab

- Menyetujui atau menolak permintaan barang
- Menindaklanjuti alert stok minimum
- Menyetujui atau menolak mutasi stok
- Melihat laporan dan dashboard

---

## 2.3 Admin Gudang (GD)

Bertanggung jawab terhadap pengelolaan stok fisik gudang.

### Tanggung Jawab

- Mengelola data barang
- Mencatat barang masuk
- Mengeluarkan barang
- Melakukan mutasi stok
- Menginput supplier saat barang masuk
- Mengelola data kebutuhan restock

---

## 2.4 Pemohon (PM)

Unit kerja atau pengguna yang membutuhkan barang.

### Tanggung Jawab

- Mengajukan permintaan barang
- Melihat status permohonan
- Mengonfirmasi penerimaan barang

---

# 3. Flow Permintaan Barang

## Deskripsi

Pemohon mengajukan kebutuhan barang kepada gudang melalui sistem.

## Alur

1. Pemohon membuat permohonan barang.
2. Pemohon mengisi:
    - Nama barang
    - Jumlah
    - Keterangan kebutuhan
3. Sistem mengirim permohonan ke Manager.
4. Manager melakukan evaluasi.
5. Manager memilih:
    - Setujui
    - Tolak

### Jika Ditolak

1. Status menjadi Ditolak.
2. Alasan penolakan dicatat.
3. Pemohon menerima notifikasi.

### Jika Disetujui

1. Status menjadi Disetujui.
2. Admin Gudang menerima tugas.
3. Admin Gudang menyiapkan barang.
4. Barang diserahkan kepada pemohon.
5. Pemohon melakukan konfirmasi penerimaan.
6. Stok otomatis berkurang.
7. Transaksi selesai.

---

# 4. Flow Barang Masuk (Inbound)

## Deskripsi

Digunakan untuk mencatat barang yang masuk ke gudang.

## Alur

1. Barang diterima oleh gudang.
2. Admin Gudang membuka menu Barang Masuk.
3. Admin Gudang menginput:
    - Supplier
    - Tanggal masuk
    - Dokumen referensi
    - Barang
    - Jumlah
4. Sistem menambah stok.
5. Sistem mencatat riwayat inbound.
6. Manager dapat melihat hasil transaksi melalui laporan.

---

# 5. Flow Barang Keluar (Outbound)

## Deskripsi

Digunakan saat barang diberikan kepada pemohon.

## Alur

1. Permohonan telah disetujui Manager.
2. Admin Gudang menyiapkan barang.
3. Admin Gudang melakukan proses pengeluaran barang.
4. Sistem mengurangi stok.
5. Sistem mencatat riwayat outbound.
6. Pemohon menerima barang.
7. Pemohon melakukan konfirmasi penerimaan.

---

# 6. Flow Monitoring Stok Minimum

## Deskripsi

Sistem melakukan pengecekan stok minimum secara otomatis.

## Alur

1. Sistem melakukan pengecekan stok.
2. Sistem membandingkan:
    - Stok saat ini
    - Batas minimum
3. Jika stok masih aman:
    - Tidak ada tindakan.
4. Jika stok berada di bawah batas minimum:
    - Sistem membuat alert.
    - Manager menerima notifikasi.

---

# 7. Flow Tindak Lanjut Alert Stok Minimum

## Deskripsi

Manager menentukan tindakan terhadap barang yang mencapai batas minimum.

## Alur

Setelah menerima alert:

### Pilihan 1 - Tahan

1. Manager memilih Tahan.
2. Alasan dicatat.
3. Status barang menjadi Ditahan.
4. Alert dinonaktifkan.

### Pilihan 2 - Restock

1. Manager memilih Restock.
2. Barang masuk ke Daftar Restock.
3. Menjadi dasar pengajuan pengadaan barang.

---

# 8. Flow Barang Tidak Tersedia

## Deskripsi

Digunakan ketika terdapat kebutuhan barang yang tidak tersedia di gudang.

## Alur

1. Admin Gudang membuka menu Barang Tidak Tersedia.
2. Admin Gudang menginput:
    - Nama barang
    - Kebutuhan
    - Keterangan
3. Sistem menyimpan data.
4. Barang masuk ke Daftar Restock.
5. Manager dapat melihat kebutuhan tersebut sebagai dasar pengadaan.

---

# 9. Flow Daftar Restock

## Sumber Data Restock

Daftar Restock berasal dari:

### A. Barang Stok Minimum

Barang yang stoknya berada di bawah batas minimum.

### B. Barang Tidak Tersedia

Barang yang dibutuhkan namun belum tersedia di gudang.

## Tujuan

Sebagai dasar penyusunan kebutuhan pengadaan barang.

---

# 10. Flow Mutasi Stok

## Deskripsi

Mutasi dilakukan oleh Admin Gudang namun tetap memerlukan persetujuan Manager.

## Alur

1. Admin Gudang membuat transaksi mutasi.
2. Sistem langsung memperbarui stok.
3. Status transaksi menjadi Pending Approval.
4. Manager menerima notifikasi.

### Jika Disetujui

1. Status berubah menjadi Approved.
2. Mutasi dianggap final.
3. Data masuk laporan resmi.

### Jika Ditolak

1. Status berubah menjadi Rejected.
2. Sistem membuat pembalikan transaksi (reversal).
3. Stok kembali seperti sebelum mutasi.
4. Catatan penolakan disimpan.

---

# 11. Flow Audit Aktivitas Pengguna

## Tujuan

Mencatat seluruh aktivitas pengguna dalam sistem.

## Aktivitas yang Dicatat

- Login
- Logout
- Tambah data
- Ubah data
- Hapus data
- Approve transaksi
- Reject transaksi
- Export laporan

## Informasi yang Disimpan

- User
- Role
- Aktivitas
- Modul
- Waktu
- IP Address
- Browser
- Device

---

# 12. Flow Monitoring Sesi Pengguna

## Tujuan

Mengetahui kapan pengguna mengakses sistem dan berapa lama pengguna aktif.

## Data yang Disimpan

- Login Time
- Logout Time
- Session Duration
- IP Address
- Browser
- Device

## Contoh

Manager Login:

08:00

Manager Logout:

11:15

Durasi:

3 Jam 15 Menit

Data ini dapat dilihat oleh Super Admin sebagai bagian dari audit sistem. (_ini hanyalah contoh semata_)

---

# 13. Dashboard Sistem

## Dashboard Super Admin

Menampilkan:

- Total Barang
- Total Stok
- Total User
- Barang Stok Minimum
- Permintaan Aktif
- Mutasi Pending
- Grafik Aktivitas

---

## Dashboard Manager

Menampilkan:

- Alert Stok Minimum
- Permintaan Menunggu Persetujuan
- Mutasi Menunggu Persetujuan
- Daftar Restock
- Ringkasan Stok

---

## Dashboard Admin Gudang

Menampilkan:

- Barang Masuk Hari Ini
- Barang Keluar Hari Ini
- Stok Minimum
- Mutasi Pending
- Permintaan Barang Aktif

---

## Dashboard Pemohon

Menampilkan:

- Status Permohonan
- Riwayat Permohonan
- Notifikasi Persetujuan
- Notifikasi Penolakan

# DOKUMEN FLOW SISTEM INVENTARIS & PERMINTAAN BARANG

## 1. Tujuan Sistem

Sistem Inventaris & Permintaan Barang digunakan untuk mengelola persediaan barang gudang, proses permintaan barang oleh unit kerja, pencatatan barang masuk dan keluar, monitoring stok minimum, mutasi stok, serta audit aktivitas pengguna.

Sistem ini tidak mencakup proses Purchase Order (PO) karena pengadaan barang dilakukan melalui mekanisme anggaran pemerintah yang telah memiliki sistem tersendiri.

---

# 2. Role Pengguna

## 2.1 Super Admin (SA)

Memiliki akses penuh terhadap seluruh sistem.

### Tanggung Jawab

- Mengelola pengguna dan hak akses
- Mengelola konfigurasi sistem
- Melihat seluruh data transaksi
- Melihat audit log aktivitas pengguna
- Mengakses dashboard dan laporan

---

## 2.2 Manager (MG)

Bertanggung jawab terhadap pengawasan operasional dan persetujuan proses bisnis.

### Tanggung Jawab

- Menyetujui atau menolak permintaan barang
- Menindaklanjuti alert stok minimum
- Menyetujui atau menolak mutasi stok
- Melihat laporan dan dashboard

---

## 2.3 Admin Gudang (GD)

Bertanggung jawab terhadap pengelolaan stok fisik gudang.

### Tanggung Jawab

- Mengelola data barang
- Mencatat barang masuk
- Mengeluarkan barang
- Melakukan mutasi stok
- Menginput supplier saat barang masuk
- Mengelola data kebutuhan restock

---

## 2.4 Pemohon (PM)

Unit kerja atau pengguna yang membutuhkan barang.

### Tanggung Jawab

- Mengajukan permintaan barang
- Melihat status permohonan
- Mengonfirmasi penerimaan barang

---

# 3. Flow Permintaan Barang

## Deskripsi

Pemohon mengajukan kebutuhan barang kepada gudang melalui sistem.

## Alur

1. Pemohon membuat permohonan barang.
2. Pemohon mengisi:
    - Nama barang
    - Jumlah
    - Keterangan kebutuhan
3. Sistem mengirim permohonan ke Manager.
4. Manager melakukan evaluasi.
5. Manager memilih:
    - Setujui
    - Tolak

### Jika Ditolak

1. Status menjadi Ditolak.
2. Alasan penolakan dicatat.
3. Pemohon menerima notifikasi.

### Jika Disetujui

1. Status menjadi Disetujui.
2. Admin Gudang menerima tugas.
3. Admin Gudang menyiapkan barang.
4. Barang diserahkan kepada pemohon.
5. Pemohon melakukan konfirmasi penerimaan.
6. Stok otomatis berkurang.
7. Transaksi selesai.

---

# 4. Flow Barang Masuk (Inbound)

## Deskripsi

Digunakan untuk mencatat barang yang masuk ke gudang.

## Alur

1. Barang diterima oleh gudang.
2. Admin Gudang membuka menu Barang Masuk.
3. Admin Gudang menginput:
    - Supplier
    - Tanggal masuk
    - Dokumen referensi
    - Barang
    - Jumlah
4. Sistem menambah stok.
5. Sistem mencatat riwayat inbound.
6. Manager dapat melihat hasil transaksi melalui laporan.

---

# 5. Flow Barang Keluar (Outbound)

## Deskripsi

Digunakan saat barang diberikan kepada pemohon.

## Alur

1. Permohonan telah disetujui Manager.
2. Admin Gudang menyiapkan barang.
3. Admin Gudang melakukan proses pengeluaran barang.
4. Sistem mengurangi stok.
5. Sistem mencatat riwayat outbound.
6. Pemohon menerima barang.
7. Pemohon melakukan konfirmasi penerimaan.

---

# 6. Flow Monitoring Stok Minimum

## Deskripsi

Sistem melakukan pengecekan stok minimum secara otomatis.

## Alur

1. Sistem melakukan pengecekan stok.
2. Sistem membandingkan:
    - Stok saat ini
    - Batas minimum
3. Jika stok masih aman:
    - Tidak ada tindakan.
4. Jika stok berada di bawah batas minimum:
    - Sistem membuat alert.
    - Manager menerima notifikasi.

---

# 7. Flow Tindak Lanjut Alert Stok Minimum

## Deskripsi

Manager menentukan tindakan terhadap barang yang mencapai batas minimum.

## Alur

Setelah menerima alert:

### Pilihan 1 - Tahan

1. Manager memilih Tahan.
2. Alasan dicatat.
3. Status barang menjadi Ditahan.
4. Alert dinonaktifkan.

### Pilihan 2 - Restock

1. Manager memilih Restock.
2. Barang masuk ke Daftar Restock.
3. Menjadi dasar pengajuan pengadaan barang.

---

# 8. Flow Barang Tidak Tersedia

## Deskripsi

Digunakan ketika terdapat kebutuhan barang yang tidak tersedia di gudang.

## Alur

1. Admin Gudang membuka menu Barang Tidak Tersedia.
2. Admin Gudang menginput:
    - Nama barang
    - Kebutuhan
    - Keterangan
3. Sistem menyimpan data.
4. Barang masuk ke Daftar Restock.
5. Manager dapat melihat kebutuhan tersebut sebagai dasar pengadaan.

---

# 9. Flow Daftar Restock

## Sumber Data Restock

Daftar Restock berasal dari:

### A. Barang Stok Minimum

Barang yang stoknya berada di bawah batas minimum.

### B. Barang Tidak Tersedia

Barang yang dibutuhkan namun belum tersedia di gudang.

## Tujuan

Sebagai dasar penyusunan kebutuhan pengadaan barang.

---

# 10. Flow Mutasi Stok

## Deskripsi

Mutasi dilakukan oleh Admin Gudang namun tetap memerlukan persetujuan Manager.

## Alur

1. Admin Gudang membuat transaksi mutasi.
2. Sistem langsung memperbarui stok.
3. Status transaksi menjadi Pending Approval.
4. Manager menerima notifikasi.

### Jika Disetujui

1. Status berubah menjadi Approved.
2. Mutasi dianggap final.
3. Data masuk laporan resmi.

### Jika Ditolak

1. Status berubah menjadi Rejected.
2. Sistem membuat pembalikan transaksi (reversal).
3. Stok kembali seperti sebelum mutasi.
4. Catatan penolakan disimpan.

---

# 11. Flow Audit Aktivitas Pengguna

## Tujuan

Mencatat seluruh aktivitas pengguna dalam sistem.

## Aktivitas yang Dicatat

- Login
- Logout
- Tambah data
- Ubah data
- Hapus data
- Approve transaksi
- Reject transaksi
- Export laporan

## Informasi yang Disimpan

- User
- Role
- Aktivitas
- Modul
- Waktu
- IP Address
- Browser
- Device

---

# 12. Flow Monitoring Sesi Pengguna

## Tujuan

Mengetahui kapan pengguna mengakses sistem dan berapa lama pengguna aktif.

## Data yang Disimpan

- Login Time
- Logout Time
- Session Duration
- IP Address
- Browser
- Device

## Contoh

Manager Login:

08:00

Manager Logout:

11:15

Durasi:

3 Jam 15 Menit

Data ini dapat dilihat oleh Super Admin sebagai bagian dari audit sistem.

---

# 13. Dashboard Sistem

## Dashboard Super Admin

Menampilkan:

- Total Barang
- Total Stok
- Total User
- Barang Stok Minimum
- Permintaan Aktif
- Mutasi Pending
- Grafik Aktivitas

---

## Dashboard Manager

Menampilkan:

- Alert Stok Minimum
- Permintaan Menunggu Persetujuan
- Mutasi Menunggu Persetujuan
- Daftar Restock
- Ringkasan Stok

---

## Dashboard Admin Gudang

Menampilkan:

- Barang Masuk Hari Ini
- Barang Keluar Hari Ini
- Stok Minimum
- Mutasi Pending
- Permintaan Barang Aktif

---

## Dashboard Pemohon

Menampilkan:

- Status Permohonan
- Riwayat Permohonan
- Notifikasi Persetujuan
- Notifikasi Penolakan

# DOKUMEN FLOW SISTEM INVENTARIS & PERMINTAAN BARANG

## 1. Tujuan Sistem

Sistem Inventaris & Permintaan Barang digunakan untuk mengelola persediaan barang gudang, proses permintaan barang oleh unit kerja, pencatatan barang masuk dan keluar, monitoring stok minimum, mutasi stok, serta audit aktivitas pengguna.

Sistem ini tidak mencakup proses Purchase Order (PO) karena pengadaan barang dilakukan melalui mekanisme anggaran pemerintah yang telah memiliki sistem tersendiri.

---

# 2. Role Pengguna

## 2.1 Super Admin (SA)

Memiliki akses penuh terhadap seluruh sistem.

### Tanggung Jawab

- Mengelola pengguna dan hak akses
- Mengelola konfigurasi sistem
- Melihat seluruh data transaksi
- Melihat audit log aktivitas pengguna
- Mengakses dashboard dan laporan

---

## 2.2 Manager (MG)

Bertanggung jawab terhadap pengawasan operasional dan persetujuan proses bisnis.

### Tanggung Jawab

- Menyetujui atau menolak permintaan barang
- Menindaklanjuti alert stok minimum
- Menyetujui atau menolak mutasi stok
- Melihat laporan dan dashboard

---

## 2.3 Admin Gudang (GD)

Bertanggung jawab terhadap pengelolaan stok fisik gudang.

### Tanggung Jawab

- Mengelola data barang
- Mencatat barang masuk
- Mengeluarkan barang
- Melakukan mutasi stok
- Menginput supplier saat barang masuk
- Mengelola data kebutuhan restock

---

## 2.4 Pemohon (PM)

Unit kerja atau pengguna yang membutuhkan barang.

### Tanggung Jawab

- Mengajukan permintaan barang
- Melihat status permohonan
- Mengonfirmasi penerimaan barang

---

# 3. Flow Permintaan Barang

## Deskripsi

Pemohon mengajukan kebutuhan barang kepada gudang melalui sistem.

## Alur

1. Pemohon membuat permohonan barang.
2. Pemohon mengisi:
    - Nama barang
    - Jumlah
    - Keterangan kebutuhan
3. Sistem mengirim permohonan ke Manager.
4. Manager melakukan evaluasi.
5. Manager memilih:
    - Setujui
    - Tolak

### Jika Ditolak

1. Status menjadi Ditolak.
2. Alasan penolakan dicatat.
3. Pemohon menerima notifikasi.

### Jika Disetujui

1. Status menjadi Disetujui.
2. Admin Gudang menerima tugas.
3. Admin Gudang menyiapkan barang.
4. Barang diserahkan kepada pemohon.
5. Pemohon melakukan konfirmasi penerimaan.
6. Stok otomatis berkurang.
7. Transaksi selesai.

---

# 4. Flow Barang Masuk (Inbound)

## Deskripsi

Digunakan untuk mencatat barang yang masuk ke gudang.

## Alur

1. Barang diterima oleh gudang.
2. Admin Gudang membuka menu Barang Masuk.
3. Admin Gudang menginput:
    - Supplier
    - Tanggal masuk
    - Dokumen referensi
    - Barang
    - Jumlah
4. Sistem menambah stok.
5. Sistem mencatat riwayat inbound.
6. Manager dapat melihat hasil transaksi melalui laporan.

---

# 5. Flow Barang Keluar (Outbound)

## Deskripsi

Digunakan saat barang diberikan kepada pemohon.

## Alur

1. Permohonan telah disetujui Manager.
2. Admin Gudang menyiapkan barang.
3. Admin Gudang melakukan proses pengeluaran barang.
4. Sistem mengurangi stok.
5. Sistem mencatat riwayat outbound.
6. Pemohon menerima barang.
7. Pemohon melakukan konfirmasi penerimaan.

---

# 6. Flow Monitoring Stok Minimum

## Deskripsi

Sistem melakukan pengecekan stok minimum secara otomatis.

## Alur

1. Sistem melakukan pengecekan stok.
2. Sistem membandingkan:
    - Stok saat ini
    - Batas minimum
3. Jika stok masih aman:
    - Tidak ada tindakan.
4. Jika stok berada di bawah batas minimum:
    - Sistem membuat alert.
    - Manager menerima notifikasi.

---

# 7. Flow Tindak Lanjut Alert Stok Minimum

## Deskripsi

Manager menentukan tindakan terhadap barang yang mencapai batas minimum.

## Alur

Setelah menerima alert:

### Pilihan 1 - Tahan

1. Manager memilih Tahan.
2. Alasan dicatat.
3. Status barang menjadi Ditahan.
4. Alert dinonaktifkan.

### Pilihan 2 - Restock

1. Manager memilih Restock.
2. Barang masuk ke Daftar Restock.
3. Menjadi dasar pengajuan pengadaan barang.

---

# 8. Flow Barang Tidak Tersedia

## Deskripsi

Digunakan ketika terdapat kebutuhan barang yang tidak tersedia di gudang.

## Alur

1. Admin Gudang membuka menu Barang Tidak Tersedia.
2. Admin Gudang menginput:
    - Nama barang
    - Kebutuhan
    - Keterangan
3. Sistem menyimpan data.
4. Barang masuk ke Daftar Restock.
5. Manager dapat melihat kebutuhan tersebut sebagai dasar pengadaan.

---

# 9. Flow Daftar Restock

## Sumber Data Restock

Daftar Restock berasal dari:

### A. Barang Stok Minimum

Barang yang stoknya berada di bawah batas minimum.

### B. Barang Tidak Tersedia

Barang yang dibutuhkan namun belum tersedia di gudang.

## Tujuan

Sebagai dasar penyusunan kebutuhan pengadaan barang.

---

# 10. Flow Mutasi Stok

## Deskripsi

Mutasi dilakukan oleh Admin Gudang namun tetap memerlukan persetujuan Manager.

## Alur

1. Admin Gudang membuat transaksi mutasi.
2. Sistem langsung memperbarui stok.
3. Status transaksi menjadi Pending Approval.
4. Manager menerima notifikasi.

### Jika Disetujui

1. Status berubah menjadi Approved.
2. Mutasi dianggap final.
3. Data masuk laporan resmi.

### Jika Ditolak

1. Status berubah menjadi Rejected.
2. Sistem membuat pembalikan transaksi (reversal).
3. Stok kembali seperti sebelum mutasi.
4. Catatan penolakan disimpan.

---

# 11. Flow Audit Aktivitas Pengguna

## Tujuan

Mencatat seluruh aktivitas pengguna dalam sistem.

## Aktivitas yang Dicatat

- Login
- Logout
- Tambah data
- Ubah data
- Hapus data
- Approve transaksi
- Reject transaksi
- Export laporan

## Informasi yang Disimpan

- User
- Role
- Aktivitas
- Modul
- Waktu
- IP Address
- Browser
- Device

---

# 12. Flow Monitoring Sesi Pengguna

## Tujuan

Mengetahui kapan pengguna mengakses sistem dan berapa lama pengguna aktif.

## Data yang Disimpan

- Login Time
- Logout Time
- Session Duration
- IP Address
- Browser
- Device

## Contoh

Manager Login:

08:00

Manager Logout:

11:15

Durasi:

3 Jam 15 Menit

Data ini dapat dilihat oleh Super Admin sebagai bagian dari audit sistem.

---

# 13. Dashboard Sistem

## Dashboard Super Admin

Menampilkan:

- Total Barang
- Total Stok
- Total User
- Barang Stok Minimum
- Permintaan Aktif
- Mutasi Pending
- Grafik Aktivitas

---

## Dashboard Manager

Menampilkan:

- Alert Stok Minimum
- Permintaan Menunggu Persetujuan
- Mutasi Menunggu Persetujuan
- Daftar Restock
- Ringkasan Stok

---

## Dashboard Admin Gudang

Menampilkan:

- Barang Masuk Hari Ini
- Barang Keluar Hari Ini
- Stok Minimum
- Mutasi Pending
- Permintaan Barang Aktif

---

## Dashboard Pemohon

Menampilkan:

- Status Permohonan
- Riwayat Permohonan
- Notifikasi Persetujuan
- Notifikasi Penolakan