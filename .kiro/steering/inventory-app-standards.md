---
inclusion: auto
---

# Standar Pengembangan Aplikasi Inventaris HSI

## Struktur Aplikasi

Aplikasi Sistem Manajemen Inventaris HSI Boarding School menggunakan template Next.js Minimal UI dengan struktur berikut:

### Folder Organization
- `src/_mock/` - Mock data (termasuk `_inventory.js` untuk data inventaris)
- `src/app/` - App Router pages
- `src/sections/` - Page-specific components (dashboard, inventory, reports)
- `src/routes/` - Route definitions dan paths
- `src/layouts/` - Layout components dan navigation config

### Key Files
- `src/routes/paths.js` - Centralized route definitions
- `src/layouts/nav-config-dashboard.jsx` - Navigation menu configuration
- `src/global-config.js` - Global application configuration
- `src/_mock/_inventory.js` - Mock data untuk inventaris dan laporan

## Fitur Utama

### 1. Dashboard
- Menampilkan ringkasan inventaris (total barang, barang rusak, dll)
- Preview tabel dengan 5 data terbaru
- Tombol "Lihat Semua" untuk akses tabel lengkap

### 2. Manajemen Inventaris
- **List View:** Daftar semua barang dengan aksi (lihat, edit, hapus)
- **Table View:** Tabel dengan search dan pagination
- **Create View:** Form untuk menambah barang baru

### 3. Manajemen Laporan
- **List View:** Daftar laporan dengan aksi (unduh, edit, hapus)
- **Create View:** Form untuk membuat laporan baru

## Lokasi Barang (Fixed List)
```javascript
[
  'Kantor Kepala Sekolah',
  'Kantor Guru',
  'Masjid Utama',
  'Masjid Lama',
  'Asrama An Nawawi',
  'Asrama Ibnu Hajar',
  'Asrama Abu Hatim',
  'Asrama Adz Dzahabi',
  'Asrama Imam Bukhori',
  'Kantor HSIB',
]
```

## Status Barang
- `baik` - Barang dalam kondisi baik
- `rusak` - Barang dalam kondisi rusak

## Pola Implementasi

### Membuat Halaman Baru
1. Buat file di `src/app/dashboard/[feature]/page.jsx`
2. Buat view component di `src/sections/[feature]/[name]-view.jsx`
3. Update `src/routes/paths.js` dengan route baru
4. Update `src/layouts/nav-config-dashboard.jsx` jika perlu menu baru

### Menambah Mock Data
1. Tambahkan data di `src/_mock/_inventory.js`
2. Export dari `src/_mock/index.js`
3. Import di component yang membutuhkan

### Form Validation
Gunakan React Hook Form + Zod:
```javascript
const schema = zod.object({
  name: zod.string().min(1, { message: 'Wajib diisi!' }),
});

const methods = useForm({
  resolver: zodResolver(schema),
  defaultValues: {},
});
```

## Komponen yang Sering Digunakan

- `Container` - Wrapper dengan max-width
- `Card` + `CardContent` - Card container
- `Table` + `TableHead` + `TableBody` - Tabel data
- `Button` - Tombol aksi
- `Dialog` - Modal confirmation
- `Chip` - Status badge
- `TextField` - Input field
- `Select` - Dropdown
- `Pagination` - Pagination control
- `Iconify` - Icon component

## Styling Guidelines

- Gunakan MUI sx prop untuk styling
- Gunakan spacing scale: 1, 2, 3, 4, dst (8px per unit)
- Warna status: `success` (baik), `error` (rusak)
- Responsive: xs, sm, md, lg, xl

## Authentication

- Metode: JWT
- Token disimpan di sessionStorage
- AuthGuard melindungi dashboard routes
- GuestGuard melindungi auth routes
- Default credentials: `demo@minimals.cc` / `@2Minimal`

## Integrasi Backend (Future)

Ketika siap untuk production:
1. Ganti mock data dengan API calls
2. Gunakan axios dengan endpoints di `src/lib/axios.js`
3. Implementasikan error handling dan loading states
4. Tambahkan file upload untuk gambar barang
5. Implementasikan export PDF untuk laporan

## Development Commands

```bash
yarn dev          # Start development server
yarn build        # Build untuk production
yarn lint         # Run ESLint
yarn lint:fix     # Fix linting issues
yarn fm:fix       # Format code dengan Prettier
```
