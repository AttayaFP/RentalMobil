import logoImg from '@/assets/images/logo.jpg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Printer, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Booking', href: '/laporan/booking' },
];

interface Booking {
    kdbooking: string;
    nama_pelanggan: string;
    nama_mobil: string;
    plat_mobil: string;
    waktu_order: string;
    tglmulai: string;
    tglselesai: string;
    status: string;
    payment_type: string;
    total_bayar: number;
}

interface Props {
    bookings: Booking[];
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function BookingReport({ bookings, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const debounceTimer = useMemo(() => ({ current: null as ReturnType<typeof setTimeout> | null }), []);

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                router.get('/laporan/booking', { search: value, start_date: startDate, end_date: endDate }, { preserveState: true, replace: true });
            }, 300);
        },
        [debounceTimer, startDate, endDate],
    );

    const handleFilter = () => {
        router.get('/laporan/booking', { search, start_date: startDate, end_date: endDate });
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const getDuration = (start: string, end: string) => {
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} hari` : '-';
    };
    const suksesCount = useMemo(() => {
        return bookings.filter((b) => ['sukses', 'selesai', 'success', 'berhasil'].includes(b.status.toLowerCase())).length;
    }, [bookings]);

    const expiredCount = useMemo(() => {
        return bookings.filter((b) => b.status.toLowerCase() === 'expired').length;
    }, [bookings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Booking" />

            <div className="flex flex-col gap-0 p-4">
                <div className="border-2 border-black">
                    <div className="flex items-center gap-4 border-b-2 border-black p-4">
                        <img src={logoImg} alt="Logo" className="h-20 w-20 object-contain" />
                        <div className="flex-1 text-center">
                            <h1 className="text-xl font-bold uppercase">PT. NABIL RENTAL MOBIL PADANG</h1>
                            <p className="text-muted-foreground text-sm">Komplek Perumdam/III/4, Tunggul Hitam, Kota Padang</p>
                        </div>
                        <div className="w-20" />
                    </div>

                    <div className="bg-muted/30 border-b-2 border-black px-4 py-3">
                        <h2 className="text-center text-sm font-bold uppercase">Laporan Booking - Riwayat Booking & Reservasi Mobil</h2>
                    </div>

                    <div className="p-4">
                        <div className="no-print mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="relative max-w-sm flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Cari kode booking, pelanggan, mobil..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="rounded-none pl-9"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs">Dari Tanggal</Label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-40 rounded-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs">Sampai Tanggal</Label>
                                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40 rounded-none" />
                                </div>
                                <Button onClick={handleFilter} className="rounded-none">
                                    Filter
                                </Button>
                            </div>
                            <Button onClick={() => window.print()} className="rounded-none">
                                <Printer className="mr-2 h-4 w-4" />
                                Cetak Laporan
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2 border-black">
                                        <TableHead className="w-12 border border-black text-center">No</TableHead>
                                        <TableHead className="border border-black">Kode</TableHead>
                                        <TableHead className="border border-black">Nama Pelanggan</TableHead>
                                        <TableHead className="border border-black">Nama Mobil</TableHead>
                                        <TableHead className="border border-black">Plat</TableHead>
                                        <TableHead className="border border-black text-center">Lama Sewa</TableHead>
                                        <TableHead className="border border-black">Tanggal Mulai</TableHead>
                                        <TableHead className="border border-black">Tanggal Selesai</TableHead>
                                        <TableHead className="border border-black">Metode Pembayaran</TableHead>
                                        <TableHead className="border border-black text-right">Total Harga</TableHead>
                                        <TableHead className="border border-black text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.length > 0 ? (
                                        bookings.map((b, i) => (
                                            <TableRow key={b.kdbooking} className="border-b border-black">
                                                <TableCell className="border border-black text-center font-medium">{i + 1}</TableCell>
                                                <TableCell className="border border-black font-medium">{b.kdbooking}</TableCell>
                                                <TableCell className="border border-black">{b.nama_pelanggan}</TableCell>
                                                <TableCell className="border border-black">{b.nama_mobil}</TableCell>
                                                <TableCell className="border border-black">{b.plat_mobil}</TableCell>
                                                <TableCell className="border border-black text-center">
                                                    {getDuration(b.tglmulai, b.tglselesai)}
                                                </TableCell>
                                                <TableCell className="border border-black">{b.tglmulai}</TableCell>
                                                <TableCell className="border border-black">{b.tglselesai}</TableCell>
                                                <TableCell className="border border-black">{b.payment_type || '-'}</TableCell>
                                                <TableCell className="border border-black text-right font-medium">
                                                    {formatCurrency(b.total_bayar)}
                                                </TableCell>
                                                <TableCell className="border border-black text-center">
                                                    <Badge
                                                        variant={
                                                            ['sukses', 'selesai', 'success', 'berhasil'].includes(b.status.toLowerCase())
                                                                ? 'success'
                                                                : b.status.toLowerCase() === 'pending'
                                                                  ? 'warning'
                                                                  : 'destructive'
                                                        }
                                                        className="rounded-none"
                                                    >
                                                        {b.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={11} className="text-muted-foreground h-24 border border-black text-center">
                                                Data booking tidak ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="bg-muted/30 border-2 border-black p-3">
                                <p className="text-muted-foreground text-xs font-bold uppercase">Jumlah Seluruh Data Booking</p>
                                <p className="mt-1 text-lg font-bold">{bookings.length}</p>
                            </div>
                            <div className="bg-muted/30 border-2 border-black p-3">
                                <p className="text-muted-foreground text-xs font-bold uppercase">Jumlah Booking Sukses</p>
                                <p className="mt-1 text-lg font-bold text-emerald-600">{suksesCount}</p>
                            </div>
                            <div className="bg-muted/30 border-2 border-black p-3">
                                <p className="text-muted-foreground text-xs font-bold uppercase">Jumlah Booking Expired</p>
                                <p className="text-destructive mt-1 text-lg font-bold">{expiredCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
