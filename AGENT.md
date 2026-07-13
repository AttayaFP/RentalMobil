# RentalMobil - Project Context

---

## ATURAN KERJA (WAJIB BACA SEBELUM KERJA)

### 1. Wajib Baca AGENT.md Tanpa Halu
- **Baca file ini dulu** sebelum melakukan apapun. Jangan asumsikan, jangan mengarang, jangan halusinasi.
- Jika ada yang tidak dipahami, baca ulang file ini atau explore codebase langsung.
- Jangan pernah mengklaim sesuatu yang tidak ada di codebase tanpa verifikasi.

### 2. Wajib Standar Industri
- Ikuti best practice Laravel 12, React 19, TypeScript, Tailwind CSS 4.
- Gunakan Inertia.js pattern yang benar (layout attachment via `.layout`, bukan wrap manual di JSX).
- Gunakan shadcn/ui components yang sudah ada, jangan buat custom component sendiri jika shadcn sudah menyediakan.
- Gunakan Lucide React untuk icons.
- Gunakan Tailwind CSS classes, bukan inline style atau Bootstrap.
- Pastikan accessible: gunakan Radix UI primitives (sudah termasuk di shadcn/ui).

### 3. Tidak Boleh Membuat Komentar di Codingan
- **Dilarang keras** menulis komentar `//` atau `/* */` di dalam file source code.
- Kode harus self-documenting: gunakan naming yang jelas, fungsi yang kecil, dan struktur yang mudah dipahami.
- Jika perlu penjelasan, tulis di AGENT.md atau dokumentasi terpisah, bukan di source code.

### 4. Wajib Ikuti Context7
- Sebelum menggunakan library/framework, **wajib verifikasi** pattern dan API terbaru via Context7.
- Jangan mengandalkan pengetahuan lama atau asumsi tentang API suatu library.

### 5. Larangan Tambahan
- **Dilarang** menggunakan `dangerouslySetInnerHTML`.
- **Dilarang** menggunakan Bootstrap classes (`d-flex`, `align-items-center`, `row`, `col-md-*`, dll).
- **Dilarang** menggunakan `window.location.href` untuk navigasi — gunakan Inertia `router.visit()` atau `<Link>`.
- **Dilarang** membuat file baru jika file yang dibutuhkan sudah ada (cek dulu dengan glob/grep).
- **Dilarang** menghapus file tanpa konfirmasi.
- **Dilarang** menggunakan `sweetalert2` — gunakan shadcn/ui `Dialog` untuk konfirmasi dan `sonner` untuk toast.
- **Dilarang** menggunakan file `.jsx` — semua file harus `.tsx`.

---

## Tech Stack
- **Backend**: Laravel 12 (PHP 8.2+), MySQL 8 (database: `rental_mobil`, user: `root`, no password)
- **Frontend**: React 19 + TypeScript via Inertia.js v2
- **CSS**: Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- **Animation**: GSAP 3 + @gsap/react (ScrollTrigger) + Framer Motion
- **Smooth Scroll**: Lenis (sinkronisasi dengan GSAP ticker)
- **Carousel**: Embla Carousel React
- **Particles**: @tsparticles/react + @tsparticles/slim
- **Payment**: Midtrans Snap API (`midtrans/midtrans-php`)
- **Build**: Vite 6
- **Testing**: Pest PHP 3
- **Design**: Lamborghini-inspired dark theme (lihat `design.md`)

## Design System
- **Background**: Absolute Black `#000000`
- **Surface/Card**: Charcoal `#202020`
- **Primary/Accent**: Lamborghini Gold `#FFC000`
- **Text**: Pure White `#FFFFFF`
- **Muted Text**: Ash `#7D7D7D`
- **Border**: White at 10% opacity
- **Radius**: `0px` — sharp, angular
- **Sidebar**: Dark `hsl(0,0%,3.9%)`
- **Charts**: Gold, Cyan, Light Gold, Dark Gold, Ash
- **Custom Colors**: `--color-gold: #FFC000`, `--color-gold-dark: #917300`, `--color-gold-light: #FFCE3E`

## Database Schema

```
users (id, email, username, nama_lengkap, jenis_kelamin[L/P], alamat, nohp, foto, role[pelanggan/admin/pimpinan], password)

kategori (kdkategori, nama_kategori)

mobil (kdmobil, nama_mobil, thn_mobil, plat_mobil, warna_mobil, stnk_mobil, harga, kdkategori, foto, status[Tersedia/Disewa/Perawatan])
  FK: kdkategori → kategori

booking_mobil (kdbooking, tglbooking, iduser, kdmobil, harga, payment_type, payment_method, tglmulai, tglselesai, lama_sewa, total_bayar, transaction_id, transaction_time, status)
  FK: iduser → users, kdmobil → mobil
   Status flow: Pending → Sukses/Expired/Batal/Gagal/Notified
   Auto-expire Pending bookings after 15 minutes (configurable via config/booking.php)

kembali_mobil (kdpengembalian, kdbooking, iduser, tglmulai, tglselesai, tglpengembalian, keterlambatan, denda)
  FK: kdbooking → booking_mobil, iduser → users

notifikasis (id, iduser, kdmobil, pesan, is_read)
  FK: iduser → users, kdmobil → mobil
```

## Primary Key Format
- `kdmobil`: MBL-001 (prefix MBL- + 3 digit)
- `kdbooking`: BO001 (prefix BO + 3 digit) — SEMUA booking termasuk reminder menggunakan format ini
- `kdpengembalian`: KMB-001 (prefix KMB- + 3 digit)
- `kdkategori`: manual input
- Semua auto-generate di controller, bukan auto-increment

## Role-Based Access

| Role | Akses |
|------|-------|
| pelanggan | Homepage, booking sendiri, checkout, invoice |
| admin | Dashboard, CRUD kategori/mobil/pelanggan/pengembalian, semua booking, semua laporan |
| pimpinan | Dashboard, laporan (read-only) |

Middleware: `CheckRole` di `app/Http/Middleware/CheckRole.php`, registered as `role`.

## Business Flow

### Booking
1. Pelanggan pilih mobil → `GET /booking/create?kdmobil=xxx`
2. Form submit → `POST /booking` → validasi overlap + lockForUpdate
3. Jika ada reminder (Expired/Notified, payment_type=reminder) untuk user+mobil+tanggal sama → update reminder jadi Pending (reuse kdbooking)
4. Jika tidak ada reminder → buat booking baru dengan kdbooking baru
5. Redirect ke Midtrans Snap checkout
6. Payment success callback → `POST /booking/{id}/success` → status: Sukses, mobil: Disewa
7. Invoice: `GET /booking/{id}/invoice`
8. Pelanggan tekan "Kembali" di checkout → role-aware redirect: pelanggan → `/` (homepage), admin/pimpinan → `/booking`
9. Pelanggan di homepage → dialog notifikasi pending booking muncul (countdown 15 menit dari `created_at`, configurable via `config('booking.pending_lock_minutes')`)
   - "Lanjutkan Pembayaran" → redirect ke `/booking/{kdbooking}/checkout`
   - Timer habis → dialog berubah jadi "Booking Kadaluarsa" → "Buat Booking Baru" → `/booking/create`
   - "Nanti Saja" / "Tutup" → dismiss dialog

### Reminder (Pengingat)
1. Pelanggan aktifkan pengingat → `POST /booking/request-reminder`
2. Booking dibuat dengan status `Expired`, `payment_type = 'reminder'`, kdbooking format BO001
3. Harga, lama_sewa, total_bayar dihitung dari mobil yang dipilih
4. Saat mobil tersedia kembali → notifikasi dikirim ke user yang aktifkan pengingat
5. Saat user klik "Booking Sekarang" → `store()` mendeteksi reminder yang ada → reuse kdbooking yang sama

### Pengembalian
1. Admin buat pengembalian → `POST /pengembalian` (hanya booking berstatus Sukses/Success/Berhasil)
2. Hitung keterlambatan + denda
3. Booking → Selesai, Mobil → Perawatan
4. Jika ada denda + payment_type=transfer → redirect Midtrans checkout denda

### Notification System
Notifikasi disimpan di tabel `notifikasis` dan di-share via `HandleInertiaRequests`.

#### Dua Jenis Notifikasi Admin
1. **Mobil Selesai Perawatan** (`mobil_selesai_rawat`): mobil dalam status Perawatan ≥2 hari
   - Sumber: query langsung ke tabel `mobil` + `kembali_mobil`
   - Aksi: "Ubah ke Tersedia" — hilang setelah admin ubah status mobil
   - Tidak bisa di-mark-as-read atau dihapus
   - Ditampilkan di section "Mobil Selesai Perawatan" pada `nav-user.tsx`

2. **Pemberitahuan** (`notifications`): notifikasi dari tabel `notifikasis`
   - Filter: `pesan NOT LIKE '%perawatan%'` (admin hanya melihat non-perawatan)
   - Aksi: "Booking Sekarang" / "Tutup" (mark as read) / "Hapus" (delete)
   - Ditampilkan di section "Pemberitahuan" pada `nav-user.tsx`

#### Notifikasi Pelanggan
- Filter: `pesan NOT LIKE '%perawatan%'`
- Aksi: "Booking Sekarang" / "Tutup" (mark as read)

#### Trigger Notifikasi
- `BookingMobil::notifyOtherInterestedCustomers()` — saat booking reminder Expired, cek user lain yang punya reminder untuk mobil+tanggal overlap. HANYA memproses booking dengan `payment_type = 'reminder'`
- `BookingMobil::notifyFutureInterestedCustomers()` — saat mobil berubah status ke Tersedia, cek user yang punya reminder untuk mobil tersebut. HANYA memproses booking dengan `payment_type = 'reminder'`
- `Notifikasi::generatePassiveNotifications($userId)` — real-time check saat pelanggan login. HANYA memproses booking dengan `payment_type = 'reminder'` dan `status = 'Expired'`
- `Notifikasi::generateAdminMaintenanceNotifications()` — buat notif untuk semua admin jika mobil perawatan ≥2 hari. Menggunakan `firstOrCreate` untuk mencegah duplikat

#### Route Notifikasi
- `POST /notifikasi/{id}/read` — mark as read
- `DELETE /notifikasi/{id}` — hapus notifikasi

## Laporan (6 jenis)
- `/laporan/pelanggan` — daftar pelanggan
- `/laporan/mobil` — daftar mobil + kategori
- `/laporan/booking` — daftar booking + filter tanggal
- `/laporan/pengembalian` — daftar pengembalian + filter tanggal
- `/laporan/rental` — gabungan booking sukses/selesai + pengembalian
- `/laporan/belum-kembali` — mobil berstatus Disewa (sedang disewa)

### Pola Laporan (WAJIB ikuti)
```tsx
<div className="border-2 border-black">
    <div className="flex items-center gap-4 border-b-2 border-black p-4">
        <img src={logoImg} alt="Logo" className="h-20 w-20 object-contain" />
        <div className="flex-1 text-center">
            <h1 className="text-xl font-bold uppercase">PT. NABIL RENTAL MOBIL PADANG</h1>
            <p className="text-sm text-muted-foreground">Komplek Perumdam/III/4, Tunggul Hitam, Kota Padang</p>
        </div>
        <div className="w-20" />
    </div>
    <div className="border-b-2 border-black bg-muted/30 px-4 py-3">
        <h2 className="text-center text-sm font-bold uppercase">Judul Laporan</h2>
    </div>
    <div className="p-4">
        <div className="no-print mb-4 flex items-center gap-2">
            <Input className="rounded-none" />
            <Button className="rounded-none">Filter</Button>
            <Button onClick={() => window.print()} className="rounded-none">Cetak Laporan</Button>
        </div>
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-b-2 border-black bg-muted/50 hover:bg-muted/50">
                        <TableHead className="border border-black">...</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className="border-b border-black">
                        <TableCell className="border border-black">...</TableCell>
                    </TableRow>
                </TableBody>
                <TableRow className="border-t-2 border-black bg-muted/50 hover:bg-muted/50">
                    <TableCell className="border border-black">Footer</TableCell>
                </TableRow>
            </Table>
        </div>
        <div className="mt-4 border-2 border-black bg-muted/30 p-3 text-center">
            <p className="text-sm font-bold uppercase">Summary</p>
        </div>
    </div>
</div>
```
- Header: logo kiri + judul PT di tengah + spacer kanan
- Sub-header: judul laporan dengan `border-b-2 border-black bg-muted/30`
- Search/Filter: class `no-print` agar hilang saat cetak
- Button/Input/Badge: `rounded-none` — sharp corners
- Table: `border border-black` di setiap cell, `border-b-2 border-black` di header/footer
- Cetak: `window.print()` + print styles di `app.css` (landscape, hide sidebar/nav/no-print)

### Detail Per Laporan

#### Laporan Pelanggan
- Fields: No, Kode Pelanggan, Nama Lengkap, Jenis Kelamin, Username, Email, No HP, Alamat
- Footer: "Jumlah Pelanggan" + "Jumlah Seluruh Data Pelanggan"
- Backend: `User::where('role', 'pelanggan')`

#### Laporan Mobil
- Fields: No, Kode, Nama Mobil, Tahun, Plat, Warna, STNK, Harga/Hari, Kategori, Status
- Footer: "Jumlah Mobil" + "Jumlah Seluruh Data Mobil"
- Backend: `Mobil::with('kategori')`

#### Laporan Booking
- Fields: No, Kode, Nama Pelanggan, Nama Mobil, Plat, Lama Sewa, Tgl Mulai, Tgl Selesai, Metode Pembayaran, Total Bayar, Status
- Filter: search + date range (`tglmulai`)
- Footer: "Total Seluruh Pendapatan Booking" (dari tabel) + summary boxes (Jumlah Data + Total Pembayaran, hanya status Sukses/Selesai)
- Backend: `BookingMobil::with(['user', 'mobil'])`

#### Laporan Pengembalian
- Fields: No, Kode, Nama Pelanggan, Nama Mobil, No Plat, Tgl Mulai, Tgl Selesai, Tgl Kembali, Telat, Denda
- Filter: search + date range (`tglpengembalian`)
- Footer: "Total Denda" (dari tabel)
- Summary boxes: "Mobil Sudah Kembali" (count) / "Mobil Terlambat >1 Hari" (count denda > 0) / "Total Denda Keseluruhan" (sum denda)
- Backend: `KembaliMobil::with(['user', 'booking.mobil'])`

#### Laporan Rental
- Fields: No, Kode, Nama Pelanggan, Nama Mobil, No. Plat, Tgl Mulai, Tgl Selesai, Tgl Kembali, Telat, Sewa, Denda, Total, Status
- Filter: search + date range (`tglmulai`)
- Footer: "Total Pendapatan" (dari tabel)
- Summary title: "Rangkuman Status Mobil & Total Pendapatan"
- Summary boxes: "Total Pendapatan" / "Mobil Disewa" / "Mobil Dikembalikan" / "Total Mobil Dalam Perawatan"
- Backend: `BookingMobil::whereIn('status', ['Sukses','Success','Berhasil','Selesai'])` + `Mobil::where('status','Perawatan')->count()`
- Status: jika ada pengembalian → "Selesai", jika tidak → "Sukses"

#### Laporan Belum Kembali
- Fields: No, Kode Booking, Mobil, Plat, Tgl Mulai, Status (badge "BELUM KEMBALI")
- Filter: search + date range (`tglmulai`)
- Footer: "Total Mobil Belum Kembali" + summary
- Backend: `BookingMobil::whereHas('mobil', fn($q) => $q->where('status','Disewa'))->where('status','Sukses')`

## Routes Structure
- `routes/web.php` — main routes
- `routes/auth.php` — auth routes
- `routes/settings.php` — settings routes
- `routes/console.php` — artisan commands

## Key Controllers
- `BookingController.php` — booking CRUD + Midtrans checkout + auto-expire + reminder reuse
- `MobilController.php` — mobil CRUD + status management + setTersedia
- `PengembalianController.php` — pengembalian CRUD + denda checkout (hanya booking Sukses)
- `DashboardController.php` — stats (booking_aktif=Sukses only, total_pendapatan=Sukses+Selesai) + charts + recent bookings + mobil selesai rawat
- `LaporanController.php` — 6 laporan endpoints
- `PelangganController.php` — user/pelanggan CRUD
- `KategoriController.php` — kategori CRUD

---

## Layout System

### Admin Layout (shadcn/ui AppLayout)
```
resources/js/layouts/app-layout.tsx
  └─ layouts/app/app-sidebar-layout.tsx
       ├─ components/app-shell.tsx (SidebarProvider)
       ├─ components/app-sidebar.tsx (shadcn Sidebar, role-based menu)
       │    ├─ components/nav-main.tsx (Collapsible menu with lucide icons)
       │    └─ components/nav-user.tsx (user dropdown + notification Sheet)
       └─ components/app-sidebar-header.tsx (Breadcrumbs)
```

### Guest Layout (pelanggan + public pages)
```
resources/js/layouts/guest-layout.tsx
  ├─ Navbar (sticky, responsive, mobile Sheet menu)
  ├─ Bell icon + notification Sheet (pelanggan only)
  └─ Footer
```

### Auth Layout
```
resources/js/layouts/auth-layout.tsx
  └─ layouts/auth/auth-split-layout.tsx
```

### Booking Layout (role-based: pelanggan tanpa sidebar, admin/pimpinan pakai AppLayout)
```
resources/js/layouts/booking-layout.tsx
  ├─ pelanggan → MinimalBookingLayout (tanpa sidebar/navbar, content centered max-w-6xl)
  └─ admin/pimpinan → AppLayout (sidebar + breadcrumbs)
```
Digunakan di: `booking/create`, `booking/checkout`, `booking/invoice`

### Pola Layout Attachment (Inertia.js)
```tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Page() {
    return <div>...</div>;
}

Page.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
```

## Pages Mapping
```
Admin (AppLayout):
  dashboard, mobil/*, pelanggan/*, kategori/*, booking/index, booking/edit, pengembalian/*, laporan/*, settings/*

Pelanggan Booking (BookingLayout — tanpa sidebar):
  booking/create, booking/checkout, booking/invoice

Guest (GuestLayout — Lamborghini dark theme):
  welcome, about, services, pricing, cars, blog, contact

Auth (standalone — tanpa navbar/sidebar, dark background):
  auth/login, auth/register
```

## HandleInertiaRequests Shared Data
File: `app/Http/Middleware/HandleInertiaRequests.php`
Pattern: `return [...parent::share($request), 'key' => value];`

Shared props:
- `auth.user` — authenticated user
- `auth.notifications` — unread notifikasis (filtered by role: admin=non-perawatan only, pelanggan=non-perawatan)
- `auth.mobil_selesai_rawat` — mobil perawatan ≥2 days (admin only, query dari tabel mobil)
- `auth.pending_booking` — booking pending pelanggan (`{ kdbooking, nama_mobil, total_bayar, created_at }`) — `null` jika tidak ada. Auto-expire 1 menit. Digunakan di `welcome.tsx` untuk dialog notifikasi
- `flash.success` / `flash.error` — session flash messages (displayed via sonner toast in app-sidebar-layout)
- `name` — app name
- `quote` — random inspiring quote

## Midtrans Config
File: `config/midtrans.php`
- Snap API (bukan Core API)
- Token generated di backend → dikirim ke frontend via Inertia props
- Frontend call `snap.pay(token)` dengan callback
- Payment confirmed via client-side callback only (`onSuccess` → `POST /booking/{id}/success`)
- `PaymentController.php` ada `notificationHandler()` tapi TIDAK di-route (dormant)

## shadcn/ui Components Installed
Semua di `resources/js/components/ui/`:
- `table.tsx`, `pagination.tsx`, `sonner.tsx`, `spinner.tsx`
- `sidebar.tsx`, `dropdown-menu.tsx`, `dialog.tsx`, `sheet.tsx`
- `button.tsx`, `card.tsx`, `input.tsx`, `select.tsx`, `textarea.tsx`
- `avatar.tsx`, `badge.tsx`, `separator.tsx`, `label.tsx`
- `navigation-menu.tsx`, `collapsible.tsx`, `tooltip.tsx`
- `alert.tsx`, `checkbox.tsx`, `skeleton.tsx`, `breadcrumb.tsx`
- `chart.tsx` (Recharts wrapper)

## GSAP Animation System
Package: `gsap` + `@gsap/react`
File: `resources/js/hooks/use-animation.ts`

### Hooks
| Hook | Fungsi | CSS Class Target |
|------|--------|-----------------|
| `useHeroAnimation()` | Timeline entrance (title → sub → CTA → badges) | `.hero-title`, `.hero-sub`, `.hero-cta`, `.hero-badge` |
| `useScrollReveal()` | Fade+slide up saat scroll masuk viewport | `.reveal` |
| `useStaggerReveal()` | Staggered fade+slide untuk multiple items | `.stagger-item` |
| `useCountUp(endValue)` | Angka counter animasi dari 0 → value | ref-based |
| `useParallax(speed)` | Background parallax saat scroll | ref-based |
| `useTextSplit()` | Animasi per-huruf dengan 3D rotation | ref-based |
| `useMagneticButton(strength)` | Button menarik cursor saat hover | ref-based |
| `useMarquee(speed)` | Text berjalan otomatis (infinite loop) | `.marquee-inner` |
| `useScaleReveal()` | Scale + fade on scroll | ref-based |

### Pola Penggunaan
```tsx
import { useScrollReveal, useStaggerReveal } from '@/hooks/use-animation';

export default function Page() {
    const sectionRef = useScrollReveal();
    const gridRef = useStaggerReveal();

    return (
        <section ref={sectionRef}>
            <h2 className="reveal">Judul</h2>
            <div ref={gridRef}>
                <Card className="stagger-item">...</Card>
                <Card className="stagger-item">...</Card>
            </div>
        </section>
    );
}
```

## Lenis Smooth Scroll
Package: `lenis`
Setup: `app.tsx` — terintegrasi dengan GSAP ticker untuk sinkronisasi ScrollTrigger

```tsx
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const lenis = new Lenis({ autoRaf: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

## Framer Motion
Package: `framer-motion` (sudah terinstall, digunakan di welcome.tsx dan dashboard.tsx)
Pattern: `motion.div` dengan `initial`, `animate`, `whileInView`, `whileHover`, `variants`

## Embla Carousel
Package: `embla-carousel-react`
File: `resources/js/components/carousel.tsx`
Digunakan di: welcome.tsx (mobile car cards)

## Gold Particles
Package: `@tsparticles/react` + `@tsparticles/slim`
File: `resources/js/components/gold-particles.tsx`
Digunakan di: welcome.tsx (hero section)

## Halaman dengan Animasi
- `welcome.tsx` — hero timeline + parallax + particles + text split + marquee + stagger + scale reveal + pending booking dialog
- `about.tsx` — scroll reveal + values stagger + CTA reveal
- `services.tsx` — header reveal + cards stagger
- `pricing.tsx` — header reveal + table stagger
- `cars.tsx` — header reveal + cards stagger
- `blog.tsx` — header reveal + cards stagger
- `contact.tsx` — info cards stagger + form reveal
- `dashboard.tsx` — stat cards stagger + count up + chart reveal + Framer Motion

### Hero Background Image
File: `resources/js/assets/images/logo.jpg`
Digunakan di `welcome.tsx` sebagai background-image hero section dengan parallax + gradient overlay.

## Print Styles (app.css)
```css
@page { size: landscape; margin: 10mm; }
.no-print → display: none
sidebar, header, nav, aside → hidden
table → font-size 10px, width 100%
th/td → padding 4px 6px
```
Digunakan di semua halaman laporan.

## Development Commands
```bash
composer dev          # Run server + queue + vite concurrently
php artisan serve     # Backend only
npm run dev           # Vite dev server only
npm run build         # Production build
php artisan migrate   # Run migrations
```

## Dashboard Stats Definition
File: `app/Http/Controllers/DashboardController.php`

| Stat | Query | Arti |
|------|-------|------|
| `booking_aktif` | `whereIn('status', ['Sukses', 'Success', 'Berhasil'])` | Booking yang mobilnya sedang disewa |
| `total_pendapatan` | `whereIn('status', ['Sukses', 'Success', 'Berhasil', 'Selesai'])` → `sum('total_bayar')` | Semua pendapatan dari booking berbayar |
| `monthly_revenue` | `whereIn('status', ['Sukses', 'Success', 'Berhasil', 'Selesai'])` per bulan | Pendapatan 6 bulan terakhir |
| `mobil_tersedia` | `Mobil::where('status', 'Tersedia')` | Mobil siap sewa |
| `mobil_disewa` | `Mobil::where('status', 'Disewa')` | Mobil sedang dipakai |
| `mobil_perawatan` | `Mobil::where('status', 'Perawatan')` | Mobil dalam servis |

## TypeScript Global Declarations
File: `resources/js/types/vite-env.d.ts`
- `route()` function from Ziggy declared globally
- Vite client types referenced

## Framer Motion Variants Pattern
Ease values harus pakai `as const` agar TypeScript tidak error:
```tsx
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};
```

---

## Pola Acuan (WAJIB ikuti)

### Backend: Index with Search + Pagination
```php
public function index(Request $request)
{
    $search = $request->input('search');

    $data = Model::query()
        ->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('field', 'like', "%{$search}%");
            });
        })
        ->latest()
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('page/index', [
        'data' => $data,
        'filters' => ['search' => $search],
    ]);
}
```

### Frontend: Index Page
```tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Data', href: '/data' },
];

export default function Index({ data, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get('/data', { search }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/data/${deleteTarget.id}`, {
            onSuccess: () => { toast.success('Berhasil dihapus'); setDeleteTarget(null); },
            onError: () => { toast.error('Gagal menghapus'); setDeleteTarget(null); },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Data</h1>
                    <Button asChild><Link href="/data/create"><Plus className="mr-2 h-4 w-4" />Tambah</Link></Button>
                </div>
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader><TableRow><TableHead>No</TableHead><TableHead>Nama</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {data.data.length > 0 ? data.data.map((item, i) => (
                                <TableRow key={item.id}>
                                    <TableCell>{(data.current_page - 1) * data.per_page + i + 1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild><Link href={`/data/${item.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                                        <Button variant="destructive" size="sm" onClick={() => setDeleteTarget({ id: item.id, name: item.name })}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {data.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Menampilkan {(data.current_page - 1) * data.per_page + 1}-{Math.min(data.current_page * data.per_page, data.total)} dari {data.total}</div>
                        <div className="flex gap-1">
                            {data.links.map((link, i) => (
                                <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}>
                                    {link.label === '&laquo; Previous' ? <ChevronLeft className="h-4 w-4" /> : link.label === 'Next &raquo;' ? <ChevronRight className="h-4 w-4" /> : link.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Konfirmasi Hapus</DialogTitle><DialogDescription>Hapus "{deleteTarget?.name}"?</DialogDescription></DialogHeader>
                    <DialogFooter><Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button><Button variant="destructive" onClick={handleDelete}>Hapus</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
```

### Frontend: Create/Edit Page
```tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({ name: '' });
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setShowConfirm(true); };
    const handleConfirm = () => {
        post('/data', {
            onSuccess: () => toast.success('Berhasil'),
            onError: () => toast.error('Gagal'),
            onFinish: () => setShowConfirm(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Data" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Tambah Data</h1>
                <div className="max-w-2xl rounded-lg border p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <Button type="submit" disabled={processing}>Simpan</Button>
                    </form>
                </div>
            </div>
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Konfirmasi</DialogTitle><DialogDescription>Simpan data?</DialogDescription></DialogHeader>
                    <DialogFooter><Button variant="outline" onClick={() => setShowConfirm(false)}>Batal</Button><Button onClick={handleConfirm} disabled={processing}>Simpan</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
```

### Toast (sonner)
```tsx
import { toast } from 'sonner';
toast.success('Berhasil');
toast.error('Gagal');
```

### Frontend: Booking Page (pelanggan tanpa sidebar)
```tsx
import BookingLayout from '@/layouts/booking-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Booking', href: '/booking' },
];

export default function BookingPage() {
    return (
        <BookingLayout breadcrumbs={breadcrumbs} title="Judul Halaman">
            <div>
                content
            </div>
        </BookingLayout>
    );
}
```
`BookingLayout` otomatis mendeteksi role: pelanggan → minimal layout, admin/pimpinan → AppLayout.

### Charts (Recharts via shadcn)
```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from 'recharts';
```
