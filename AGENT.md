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
- **Animation**: GSAP 3 + @gsap/react (ScrollTrigger)
- **Payment**: Midtrans Snap API (`midtrans/midtrans-php`)
- **Build**: Vite 6
- **Testing**: Pest PHP 3
- **Design**: Gold accent theme (lihat `design.md`)

## Design System
- **Background**: White `hsl(0,0%,100%)`
- **Surface/Card**: White `hsl(0,0%,100%)`
- **Primary/Accent**: Gold `hsl(45,100%,50%)` (#FFC000)
- **Text**: Near Black `hsl(0,0%,3.9%)`
- **Muted Text**: `hsl(0,0%,45.1%)`
- **Border**: `hsl(0,0%,92.8%)`
- **Radius**: `0px` — sharp, angular
- **Sidebar**: Dark `hsl(0,0%,3.9%)`
- **Charts**: Gold, Cyan, Light Gold, Dark Gold, Ash

## Database Schema

```
users (id, email, username, nama_lengkap, jenis_kelamin[L/P], alamat, nohp, foto, role[pelanggan/admin/pimpinan], password)

kategori (kdkategori, nama_kategori)

mobil (kdmobil, nama_mobil, thn_mobil, plat_mobil, warna_mobil, stnk_mobil, harga, kdkategori, foto, status[Tersedia/Disewa/Perawatan])
  FK: kdkategori → kategori

booking_mobil (kdbooking, tglbooking, iduser, kdmobil, harga, payment_type, payment_method, tglmulai, tglselesai, lama_sewa, total_bayar, transaction_id, transaction_time, status)
  FK: iduser → users, kdmobil → mobil
  Status flow: Pending → Sukses/Expired/Batal/Gagal
  Auto-expire Pending bookings after 1 minute

kembali_mobil (kdpengembalian, kdbooking, iduser, tglmulai, tglselesai, tglpengembalian, keterlambatan, denda)
  FK: kdbooking → booking_mobil, iduser → users

notifikasis (id, iduser, kdmobil, pesan, is_read)
  FK: iduser → users, kdmobil → mobil
```

## Primary Key Format
- `kdmobil`: MBL-001 (prefix MBL- + 3 digit)
- `kdbooking`: BO001 (prefix BO + 3 digit)
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
3. Booking created (status: Pending) → redirect ke Midtrans Snap checkout
4. Payment success callback → `POST /booking/{id}/success` → status: Sukses, mobil: Disewa
5. Invoice: `GET /booking/{id}/invoice`

### Pengembalian
1. Admin buat pengembalian → `POST /pengembalian`
2. Hitung keterlambatan + denda
3. Booking → Selesai, Mobil → Perawatan
4. Jika ada denda + payment_type=transfer → redirect Midtrans checkout denda

### Notification System
Notifikasi disimpan di tabel `notifikasis` dan di-share via `HandleInertiaRequests`. Filter berdasarkan role:
- **Pelanggan**: hanya notifikasi booking (pesan TANPA kata "perawatan")
- **Admin**: hanya notifikasi perawatan (pesan DENGAN kata "perawatan")
- **Pimpinan**: tidak ada notifikasi

Trigger notifikasi pelanggan:
- `BookingMobil::notifyOtherInterestedCustomers()` — saat booking dibatalkan/gagal/expired, cek pelanggan lain yang booking mobil sama di tanggal overlap
- `BookingMobil::notifyFutureInterestedCustomers()` — saat mobil berubah status ke Tersedia
- `Notifikasi::generatePassiveNotifications($userId)` — real-time check saat pelanggan login

Trigger notifikasi admin:
- `Notifikasi::generateAdminMaintenanceNotifications()` — buat notif untuk semua admin jika mobil perawatan ≥2 hari

Tampilan notifikasi:
- **Admin**: Sheet panel dari sidebar user menu (`nav-user.tsx`)
- **Pelanggan**: Sheet panel dari guest layout (`guest-layout.tsx`, bell icon di header)
- Aksi: "Ubah ke Tersedia" (admin) / "Booking Sekarang" (pelanggan) / "Tutup" (mark as read)

## Laporan (6 jenis)
- `/laporan/pelanggan` — daftar pelanggan
- `/laporan/mobil` — daftar mobil + kategori
- `/laporan/booking` — daftar booking + filter tanggal
- `/laporan/pengembalian` — daftar pengembalian + filter tanggal
- `/laporan/rental` — gabungan booking + pengembalian + total
- `/laporan/belum-kembali` — booking belum ada pengembalian

## Routes Structure
- `routes/web.php` — main routes
- `routes/auth.php` — auth routes
- `routes/settings.php` — settings routes
- `routes/console.php` — artisan commands

## Key Controllers
- `BookingController.php` — booking CRUD + Midtrans checkout + auto-expire
- `MobilController.php` — mobil CRUD + status management + setTersedia
- `PengembalianController.php` — pengembalian CRUD + denda checkout
- `DashboardController.php` — stats + charts + recent bookings + mobil selesai rawat
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

Guest (GuestLayout):
  welcome, about, services, pricing, cars, blog, contact, auth/login, auth/register
```

## HandleInertiaRequests Shared Data
File: `app/Http/Middleware/HandleInertiaRequests.php`

Shared props:
- `auth.user` — authenticated user
- `auth.notifications` — unread notifikasis (filtered by role: admin=perawatan only, pelanggan=booking only)
- `auth.mobil_selesai_rawat` — mobil perawatan ≥2 days (admin only, for Sheet panel)
- `flash.success` / `flash.error` — session flash messages (displayed via sonner toast in app-sidebar-layout)
- `name` — app name
- `quote` — random inspiring quote

## Midtrans Config
File: `config/midtrans.php`
- Snap API (bukan Core API)
- Token generated di backend → dikirim ke frontend via Inertia props
- Frontend call `snap.pay(token)` dengan callback
- TIDAK ADA webhook handler — payment confirmed via client-side callback only

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

### Halaman dengan Animasi
- `welcome.tsx` — hero timeline + scroll reveal + card stagger
- `about.tsx` — scroll reveal + values stagger + CTA reveal
- `services.tsx` — header reveal + cards stagger
- `pricing.tsx` — header reveal + table stagger
- `cars.tsx` — header reveal + cards stagger
- `contact.tsx` — info cards stagger + form reveal
- `dashboard.tsx` — stat cards stagger + count up + chart reveal

### Hero Background Image
File: `resources/js/assets/images/logo.jpg`
Digunakan di `welcome.tsx` sebagai background-image hero section (tanpa overlay).

## Development Commands
```bash
composer dev          # Run server + queue + vite concurrently
php artisan serve     # Backend only
npm run dev           # Vite dev server only
npm run build         # Production build
php artisan migrate   # Run migrations
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
