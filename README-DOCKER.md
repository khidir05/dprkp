# Panduan Docker Deployment — DPRKP DKI Jakarta

Dokumen ini menjelaskan konfigurasi Docker, alokasi port agar **tidak bentrok (collision-free)** dengan container yang sedang berjalan di Portainer server, serta langkah-langkah deployment.

---

## 1. Analisis & Alokasi Port (Berdasarkan Screenshot Portainer)

Berikut adalah pemetaan port container yang saat ini aktif di server Anda:

| Service / Stack | Image | Port Host : Container | Keterangan |
| :--- | :--- | :--- | :--- |
| `proboard` | `proboard-web` | `3000:3000` | Web Service |
| `proboard` | `postgres:15-alpine` | `5432:5432` | Database PostgreSQL |
| `ku-garut` | `postgres:15-alpine` | `5433:5432` | Database PostgreSQL |
| `kurikulum`| `postgres:16-alpine` | `5435:5432` | Database PostgreSQL |
| `ku-garut` | `ku-garut-web` | `8000:80` | Web Service |
| `kurikulum`| `kurikulum-app` | `8005:80` | Web Service |
| `jenkins`  | `jenkins/jenkins` | `8090:8080`, `50000:50000` | CI/CD |
| `portainer`| `portainer-ce` | `9000:9000`, `9443:9443` | Portainer Dashboard |

### Port yang Dialokasikan untuk Project `dprkp`:

| Service | Port Host : Container | Alasan Pemilihan |
| :--- | :--- | :--- |
| **`dprkp-web`** | **`8006:80`** | Melanjutkan deretan port web (`8000` ku-garut, `8005` kurikulum) dan **bebas dari bentrok**. |
| **`dprkp-db`** | **`5436:5432`** | Melanjutkan port PostgreSQL (`5432` proboard, `5433` ku-garut, `5435` kurikulum) dan **bebas dari bentrok**. |

> [!NOTE]
> Di dalam jaringan internal Docker (`dprkp-network`), aplikasi berkomunikasi ke database via `dprkp-db:5432`. Port host `5436` hanya digunakan jika Anda ingin mengakses database dari luar (misal: DBeaver, TablePlus, atau pgAdmin dari laptop).

---

## 2. Struktur File Docker yang Disediakan

```text
├── Dockerfile                  # Multi-stage build (Node Vite + Composer + PHP 8.3 & Nginx)
├── docker-compose.yml          # Konfigurasi stack dprkp-web & dprkp-db
├── .dockerignore               # Optimasi build context
├── .env.docker.example         # Template konfigurasi environment untuk Docker
└── docker/
    ├── nginx/
    │   └── default.conf        # Nginx vhost (FastCGI, routing Laravel, cache aset Vite)
    ├── php/
    │   └── custom.ini          # Optimasi PHP (opcache, upload limit 64M, memory 256M)
    ├── supervisor/
    │   └── supervisord.conf    # Supervisor daemon untuk menjalankan Nginx & PHP-FPM
    └── entrypoint.sh           # Auto-check DB, symlink storage, migrasi otomatis, dan caching
```

---

## 3. Cara Menjalankan Menggunakan Portainer

Jika ingin mendeploy via antarmuka Portainer:

1. Buka dashboard Portainer Anda (`https://<ip-server>:9443` atau `http://<ip-server>:9000`).
2. Masuk ke menu **Stacks** > Klik **+ Add stack**.
3. Beri nama stack: `dprkp`.
4. Pilih metode deployment:
   - **Repository** (jika kode di Git): Masukkan URL Git repository, branch, dan path `docker-compose.yml`.
   - **Web Editor** (jika build manual): Salin isi file `docker-compose.yml` ke editor.
5. Pada bagian **Environment variables**, tambahkan variabel sesuai isi `.env.docker.example` (atau sesuaikan `APP_KEY`, password DB, dll).
6. Klik **Deploy the stack**.

---

## 4. Cara Menjalankan Menggunakan Terminal / SSH Server

Jika ingin menjalankan langsung dari terminal server:

1. Masuk ke direktori project:
   ```bash
   cd /path/ke/dprkp
   ```

2. Buat file `.env` (atau salin dari template docker):
   ```bash
   cp .env.docker.example .env
   ```

3. Jalankan container di background:
   ```bash
   docker compose up -d --build
   ```

4. Cek status container:
   ```bash
   docker compose ps
   ```

5. Akses aplikasi di browser:
   ```text
   http://<ip-server-atau-domain>:8006
   ```

---

## 5. Perintah Operasional Tambahan

- **Melihat log container web secara realtime:**
  ```bash
  docker compose logs -f dprkp-web
  ```

- **Menjalankan Seeder Data Awal (Pertama kali deploy):**
  ```bash
  docker compose exec dprkp-web php artisan db:seed --force
  ```

- **Masuk ke terminal di dalam container web:**
  ```bash
  docker compose exec dprkp-web bash
  ```

- **Menghentikan stack:**
  ```bash
  docker compose down
  ```
