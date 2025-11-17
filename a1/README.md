# DPRKP Inventaris Frontend

Frontend React + TypeScript untuk sistem manajemen inventaris DPRKP DKI Jakarta.

## 🎯 Fitur Utama

- ✅ **Role-based Authentication**: Admin, Kepala Gudang, dan Retriever dengan hak akses berbeda
- ✅ **Dashboard Interaktif**: Statistik dan monitoring untuk setiap role
- ✅ **Responsive Design**: Desktop, tablet, dan mobile friendly
- ✅ **Modern UI**: Menggunakan Tailwind CSS dan shadcn/ui components
- ✅ **Real-time Notifications**: Toast notifications untuk feedback user
- ✅ **Modular Architecture**: Struktur kode yang terorganisir dan mudah dikembangkan

## 🛠️ Stack Teknologi

- ⚛️ **React 18** + **TypeScript** + **Vite**
- 🌐 **React Router v6** - Routing dan navigasi
- 🔁 **TanStack Query (React Query)** - Data fetching & caching
- 📦 **Axios** - HTTP client
- 💾 **Zustand** - State management
- 🎨 **Tailwind CSS** + **shadcn/ui** - Styling & UI components
- 🎯 **Lucide React** - Icon library
- 💬 **React Hot Toast** - Toast notifications
- 📅 **Day.js** - Date manipulation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ dan npm/yarn/pnpm
- Backend Laravel sudah berjalan di `http://localhost:8000`

### Instalasi

```bash
# Clone repository
git clone <repository-url>
cd dprkp-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Sesuaikan VITE_API_BASE_URL di .env dengan backend URL Anda
# Default: http://localhost:8000/api

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:8080`

## ⚙️ Konfigurasi Environment

Buat file `.env` di root project:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=DPRKP Inventaris
```

## 👥 Role & Akses

### 1. **Admin**
- Dashboard dengan statistik lengkap
- Manajemen pengguna (Admin, Kepala Gudang, Retriever)
- Master data (Kategori, Rusun, Gudang)
- Manajemen inventory (Barang, Mutasi, Penerimaan)
- Laporan dan analytics

### 2. **Kepala Gudang**
- Dashboard gudang yang dikelola
- Kelola gudang dan stok barang
- Proses permintaan dari Retriever
- Tambah/edit barang
- Buat mutasi barang
- Generate pengajuan (docx/pdf)
- Log transaksi

### 3. **Retriever**
- Dashboard permintaan
- Buat permintaan barang baru
- Lihat gudang di rusun yang ditugaskan
- Monitor status permintaan

## 📁 Struktur Folder

```
src/
├── api/                    # API client & endpoints
│   ├── client.ts          # Axios instance & interceptors
│   ├── auth.ts            # Authentication API
│   └── ...                # API modules lainnya
│
├── app/
│   └── store.ts           # Zustand global state
│
├── components/
│   ├── layout/            # Layout components
│   │   ├── AppShell.tsx   # Main layout wrapper
│   │   ├── Sidebar.tsx    # Role-based sidebar
│   │   └── Topbar.tsx     # Top navigation bar
│   └── ui/                # shadcn/ui components
│
├── features/              # Feature-based modules
│   ├── auth/             # Authentication
│   ├── dashboard/        # Dashboards per role
│   └── profile/          # User profile
│
├── hooks/                # Custom React hooks
│   ├── useDebounce.ts
│   └── useRole.ts
│
├── routes/               # Routing configuration
│   ├── AppRoutes.tsx     # Main routes
│   └── ProtectedRoute.tsx # Route guards
│
├── pages/                # Static pages
│   ├── NotFound.tsx
│   └── Forbidden.tsx
│
├── utils/                # Utility functions
│   └── format.ts         # Formatting helpers
│
├── index.css             # Global styles & design system
├── App.tsx               # Root component
└── main.tsx              # Entry point
```

## 🎨 Design System

Aplikasi menggunakan design system berbasis HSL dengan warna utama **Teal/Cyan**:

- **Primary**: Teal untuk aksi utama dan brand
- **Secondary**: Light teal untuk surface sekunder
- **Success**: Green untuk status berhasil
- **Warning**: Orange untuk peringatan
- **Destructive**: Red untuk aksi berbahaya

Semua warna didefinisikan di `src/index.css` dan dapat dikustomisasi dengan mudah.

## 🔐 Autentikasi

Flow autentikasi:
1. User login via `/login` dengan email & password
2. Backend mengembalikan `access_token` dan data `user`
3. Token disimpan di localStorage dan Zustand store
4. Setiap request API otomatis menyertakan Bearer token
5. Jika token expired (401), user otomatis logout

## 🛣️ Routing

- `/login` - Halaman login
- `/admin/*` - Routes untuk Admin
- `/kepala/*` - Routes untuk Kepala Gudang
- `/retriever/*` - Routes untuk Retriever
- `/forbidden` - Akses ditolak
- `*` - 404 Not Found

Protected routes menggunakan `ProtectedRoute` component yang memvalidasi role user.

## 📱 Responsive Design

- **Desktop (lg+)**: Sidebar tetap terlihat
- **Tablet (md)**: Sidebar collapsible
- **Mobile (sm)**: Sidebar sebagai drawer dengan overlay

## 🧪 Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```

## 📦 Build & Deploy

```bash
# Build untuk production
npm run build

# Hasil build ada di folder dist/
# Upload folder dist/ ke hosting (Netlify, Vercel, dll)
```

### Environment Variables untuk Production

Pastikan set environment variables berikut di hosting:
- `VITE_API_BASE_URL` - URL backend API production

## 🔧 Customization

### Menambah Role Baru
1. Update type di `src/hooks/useRole.ts`
2. Tambah menu items di `src/components/layout/Sidebar.tsx`
3. Buat dashboard di `src/features/dashboard/`
4. Tambah routes di `src/routes/AppRoutes.tsx`

### Menambah Fitur Baru
1. Buat folder di `src/features/[nama-fitur]/`
2. Buat API client di `src/api/[nama-fitur].ts`
3. Buat components & hooks yang dibutuhkan
4. Tambah routing jika perlu

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Copyright © 2025 DPRKP DKI Jakarta

## 📞 Support

Untuk pertanyaan atau dukungan, hubungi tim DPRKP DKI Jakarta.

---

**Built with ❤️ for DPRKP DKI Jakarta**
