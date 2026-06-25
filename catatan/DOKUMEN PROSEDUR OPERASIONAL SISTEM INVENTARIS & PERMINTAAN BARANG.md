## 1. Tujuan

Dokumen ini menjelaskan prosedur penggunaan Sistem Inventaris & Permintaan Barang oleh setiap pengguna sesuai dengan hak akses dan tanggung jawabnya.

---

# 2. Prosedur Login Sistem

## Aktor

- Super Admin
- Manager
- Admin Gudang
- Pemohon

## Langkah

1. Pengguna membuka halaman login.
2. Pengguna memasukkan:
    - Username / Email / No Telp
    - Password
3. Sistem melakukan validasi akun.
4. Jika valid:
    - Pengguna masuk ke Dashboard.
    - Sistem mencatat waktu login.
5. Jika tidak valid:
    - Sistem menampilkan pesan gagal login.

## Output

- Session aktif.
- Audit login tercatat.

---

# 3. Prosedur Permintaan Barang

## Aktor

Pemohon

## Langkah

1. Pemohon membuka menu Permintaan Barang.
2. Klik tombol Buat Permohonan.
3. Isi data:
    - Nama Barang
    - Jumlah
    - Keterangan Kebutuhan
4. Klik Kirim.
5. Sistem membuat nomor permohonan.
6. Status menjadi Menunggu Persetujuan Manager.

## Output

- Permohonan tersimpan.
- Notifikasi terkirim ke Manager.

---

# 4. Prosedur Persetujuan Permintaan Barang

## Aktor

Manager

## Langkah

1. Buka menu Persetujuan Permintaan.
2. Pilih permohonan.
3. Tinjau:
    - Nama barang
    - Jumlah
    - Kebutuhan
4. Pilih tindakan:
    - Setujui
    - Tolak

### Jika Disetujui

1. Status menjadi Disetujui.
2. Sistem mengirim notifikasi ke Admin Gudang.

### Jika Ditolak

1. Isi alasan penolakan.
2. Status menjadi Ditolak.
3. Sistem mengirim notifikasi ke Pemohon.

## Output

- Status permohonan diperbarui.

---

# 5. Prosedur Penyiapan dan Pengeluaran Barang

## Aktor

Admin Gudang

## Langkah

1. Buka menu Permintaan Disetujui.
2. Pilih permintaan.
3. Siapkan barang sesuai jumlah.
4. Klik Proses Pengeluaran.
5. Sistem mengurangi stok.
6. Sistem membuat transaksi outbound.

## Output

- Barang siap diserahkan.
- Riwayat outbound tercatat.

---

# 6. Prosedur Konfirmasi Penerimaan Barang

## Aktor

Pemohon

## Langkah

1. Terima barang dari Admin Gudang.
2. Buka menu Riwayat Permintaan.
3. Pilih transaksi.
4. Klik Konfirmasi Penerimaan.
5. Tambahkan catatan apabila diperlukan.

## Output

- Status transaksi selesai.
- Bukti penerimaan tercatat.

---

# 7. Prosedur Pencatatan Barang Masuk (Inbound)

## Aktor

Admin Gudang

## Langkah

1. Buka menu Barang Masuk.
2. Klik Tambah Barang Masuk.
3. Isi data:
    - Supplier
    - Tanggal Masuk
    - Dokumen Referensi
    - Barang
    - Jumlah
4. Klik Simpan.
5. Sistem menambah stok otomatis.
6. Sistem mencatat transaksi inbound.

## Output

- Stok bertambah.
- Riwayat inbound tercatat.

---

# 8. Prosedur Pengelolaan Supplier

## Aktor

Admin Gudang

## Langkah

1. Buka menu Supplier.
2. Klik Tambah Supplier.
3. Isi data:
    - Nama Supplier
    - Kontak
    - Alamat
4. Simpan data.

## Output

- Data supplier tersedia untuk transaksi inbound.

---

# 9. Prosedur Monitoring Stok

## Aktor

- Super Admin
- Manager
- Admin Gudang
- Pemohon

## Langkah

1. Buka menu Stok Barang.
2. Cari barang yang diinginkan.
3. Sistem menampilkan:
    - Nama Barang
    - Stok Saat Ini
    - Stok Minimum
    - Status Barang

## Output

- Informasi stok tampil secara real-time.

---

# 10. Prosedur Penanganan Alert Stok Minimum

## Aktor

Manager

## Langkah

1. Buka menu Alert Stok Minimum.
2. Tinjau barang yang memiliki stok kritis.
3. Pilih tindakan:
    - Restock
    - Tahan

### Jika Restock

1. Klik Restock.
2. Barang masuk ke Daftar Restock.

### Jika Tahan

1. Klik Tahan.
2. Isi alasan.
3. Status barang menjadi Ditahan.

## Output

- Keputusan restock terdokumentasi.

---

# 11. Prosedur Input Barang Tidak Tersedia

## Aktor

Admin Gudang

## Langkah

1. Buka menu Barang Tidak Tersedia.
2. Klik Tambah Data.
3. Isi:
    - Nama Barang
    - Keterangan
    - Jumlah Kebutuhan
4. Simpan data.
5. Sistem memasukkan data ke Daftar Restock.

## Output

- Kebutuhan barang tercatat.

---

# 12. Prosedur Pengelolaan Daftar Restock

## Aktor

Manager

## Langkah

1. Buka menu Daftar Restock.
2. Sistem menampilkan:
    - Barang stok minimum
    - Barang tidak tersedia
3. Tinjau kebutuhan.
4. Gunakan data sebagai dasar pengadaan.

## Output

- Daftar kebutuhan pengadaan tersedia.

---

# 13. Prosedur Mutasi Stok

## Aktor

Admin Gudang

## Langkah

1. Buka menu Mutasi Stok.
2. Klik Tambah Mutasi.
3. Isi:
    - Barang
    - Jumlah
    - Jenis Mutasi
    - Alasan
4. Simpan transaksi.
5. Sistem langsung memperbarui stok.
6. Status mutasi menjadi Pending Approval.

## Output

- Mutasi tercatat.
- Menunggu persetujuan Manager.

---

# 14. Prosedur Persetujuan Mutasi Stok

## Aktor

Manager

## Langkah

1. Buka menu Mutasi Pending.
2. Tinjau transaksi.
3. Pilih:
    - Approve
    - Reject

### Jika Approve

1. Status menjadi Approved.

### Jika Reject

1. Isi alasan penolakan.
2. Sistem membuat reversal transaksi.
3. Stok dikembalikan otomatis.
4. Status menjadi Rejected.

## Output

- Mutasi tervalidasi.

---

# 15. Prosedur Audit Aktivitas Pengguna

## Aktor

Super Admin

## Langkah

1. Buka menu Audit Log.
2. Tentukan filter:
    - User
    - Role
    - Tanggal
3. Klik Cari.
4. Sistem menampilkan aktivitas pengguna.

## Output

- Riwayat aktivitas dapat ditelusuri.

---

# 16. Prosedur Monitoring Sesi Pengguna

## Aktor

Super Admin

## Langkah

1. Buka menu Monitoring User.
2. Pilih pengguna.
3. Sistem menampilkan:
    - Login Time
    - Logout Time
    - Durasi Session
    - Browser
    - IP Address
4. Analisis aktivitas pengguna apabila diperlukan.

## Output

- Aktivitas akses pengguna terdokumentasi.

---

# 17. Prosedur Logout

## Aktor

Seluruh Pengguna

## Langkah

1. Klik menu Profil.
2. Klik Logout.
3. Sistem mengakhiri session.
4. Sistem mencatat waktu logout.
5. Sistem menghitung durasi penggunaan.

## Output

- Session ditutup.
- Audit logout tercatat.

---

# 18. Penutup

Seluruh transaksi yang dilakukan pada sistem akan menghasilkan jejak audit (audit trail) yang dapat dipantau oleh Super Admin untuk memastikan akuntabilitas, transparansi, dan keamanan pengelolaan inventaris.