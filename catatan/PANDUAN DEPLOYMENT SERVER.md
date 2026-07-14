# Panduan Deployment Aplikasi DPRKP DKI Jakarta

Dokumen ini berisi panduan lengkap langkah demi langkah untuk melakukan deployment aplikasi Sistem Inventaris & Permintaan Barang DPRKP DKI Jakarta di server produksi (Linux/Ubuntu).

---

## Prasyarat Server (Prerequisites)

Sebelum memulai, pastikan server Anda telah terpasang software pendukung berikut:
1. **PHP 8.2 atau lebih tinggi** (Disarankan PHP 8.3/8.4) beserta ekstensi wajib:
   * `php-cli`, `php-common`, `php-curl`, `php-mbstring`, `php-gd`, `php-xml`, `php-zip`, `php-bcmath`, `php-pgsql`, `php-pdo-pgsql`
2. **Composer** (Dependency manager untuk PHP)
3. **Node.js** (v18.x atau lebih baru) & **NPM**
4. **PostgreSQL Database Server** (v12 atau lebih baru)
5. **Web Server Nginx** (Disarankan untuk menangani routing Laravel & aset Vite)
6. **Git** (Untuk mengambil source code)

---

## Langkah-Langkah Deployment

### Langkah 1: Kloning / Salin Kode Sumber
Masuk ke server melalui SSH, lalu kloning repository git Anda ke direktori web server (misal: `/var/www/dprkp`):
```bash
cd /var/www
git clone <url-repository-anda> dprkp
cd dprkp
```

### Langkah 2: Install Dependensi PHP (Backend)
Jalankan instalasi Composer dengan mengabaikan dependensi development guna menghemat space dan meningkatkan performa:
```bash
composer install --no-dev --optimize-autoloader
```

### Langkah 3: Konfigurasi File Environment (`.env`)
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` menggunakan teks editor (misal: `nano`) untuk memperbarui konfigurasi:
```bash
nano .env
```
Sesuaikan baris-baris penting berikut untuk lingkungan produksi:
```ini
APP_NAME="DPRKP DKI Jakarta"
APP_ENV=production
APP_DEBUG=false
APP_KEY=
APP_URL=https://inventaris.dprkp.jakarta.go.id # Masukkan domain atau IP server produksi Anda

# Konfigurasi Database PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=dprkp
DB_USERNAME=postgres # Username database server
DB_PASSWORD=password_db_anda # Password database server

# Konfigurasi Session & Cache
CACHE_STORE=database
SESSION_DRIVER=database
SESSION_LIFETIME=120
```
*Simpan perubahan dengan menekan `Ctrl + O`, lalu `Enter`, dan keluar dengan `Ctrl + X`.*

### Langkah 4: Generate Application Key
Buat kunci pengaman aplikasi Laravel yang unik untuk enkripsi session:
```bash
php artisan key:generate
```

### Langkah 5: Migrasi Database & Seeding Awal
Jalankan proses migrasi tabel database dan masukkan data master default (Roles, Kategori, Satuan, User Bawaan, Supplier):
```bash
# Migrasi seluruh struktur tabel ke PostgreSQL
php artisan migrate --force

# Seed data master awal (Lakukan ini hanya saat instalasi pertama kali)
php artisan db:seed --force
```

### Langkah 6: Install Dependensi JS & Build Aset Frontend
Jalankan instalasi npm dan kompilasi modul React TypeScript menggunakan Vite:
```bash
# Install seluruh package Javascript/React
npm install

# Kompilasi aset untuk production (Vite)
npm run build
```

### Langkah 7: Pengaturan Hak Akses File (Permissions)
Web server (biasanya berjalan di bawah pengguna `www-data`) membutuhkan hak akses tulis ke direktori `storage` dan `bootstrap/cache`:
```bash
# Ubah kepemilikan folder ke grup web server
chown -R www-data:www-data /var/www/dprkp
chmod -R 775 /var/www/dprkp/storage
chmod -R 775 /var/www/dprkp/bootstrap/cache
```

### Langkah 8: Membuat Symlink Storage
Hubungkan folder penyimpanan file internal ke folder publik agar dokumen/gambar produk dapat diakses oleh browser:
```bash
php artisan storage:link
```

### Langkah 9: Optimasi Cache Laravel (Penting untuk Production)
Cache seluruh konfigurasi, rute, dan tampilan agar performa aplikasi menjadi jauh lebih cepat di server:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
> [!IMPORTANT]
> Setiap kali Anda mengubah isi file `.env` atau file routing `routes/web.php` di server produksi, Anda **wajib** menjalankan ulang perintah `php artisan config:cache` atau `php artisan route:cache` agar perubahan tersebut dapat terbaca oleh sistem.

---

## Konfigurasi Web Server (Nginx)

Buat file konfigurasi virtual host Nginx baru di `/etc/nginx/sites-available/dprkp`:
```bash
sudo nano /etc/nginx/sites-available/dprkp
```
Gunakan template konfigurasi Nginx berikut (sesuaikan domain dan versi PHP-FPM):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name inventaris.dprkp.jakarta.go.id; # Ganti dengan domain atau IP Anda
    root /var/www/dprkp/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock; # Sesuaikan dengan versi PHP server Anda
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
Aktifkan konfigurasi Nginx tersebut dan muat ulang service Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/dprkp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Perawatan Lanjutan (Production Maintenance)

### 1. Menyalakan Tugas Terjadwal (Cron Job Scheduler)
Aplikasi membutuhkan cronjob untuk menjalankan peringatan otomatis / alert stok minimum. Tambahkan baris scheduler berikut pada crontab server:
```bash
sudo crontab -e
```
Tambahkan baris berikut di baris paling bawah:
```text
* * * * * cd /var/www/dprkp && php artisan schedule:run >> /dev/null 2>&1
```

### 2. Mode Pemeliharaan (Maintenance Mode)
Jika Anda ingin melakukan update aplikasi di masa mendatang dan ingin menonaktifkan aplikasi sementara bagi pengguna umum:
```bash
# Mengaktifkan mode pemeliharaan
php artisan down --secret="kunciaksesrahasia"

# Menonaktifkan mode pemeliharaan (kembali online)
php artisan up
```
