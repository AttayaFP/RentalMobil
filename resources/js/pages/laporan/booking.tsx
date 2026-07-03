import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarRange, Printer, Search } from 'lucide-react';

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
                router.get(
                    '/laporan/booking',
                    { search: value, start_date: startDate, end_date: endDate },
                    { preserveState: true, replace: true },
                );
            }, 300);
        },
        [debounceTimer, startDate, endDate],
    );

    const handleFilter = () => {
        router.get(
            '/laporan/booking',
            { search, start_date: startDate, end_date: endDate },
            { preserveState: true, replace: true },
        );
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const grandTotal = bookings.reduce((acc, curr) => acc + (curr.total_bayar || 0), 0);

    const getDuration = (start: string, end: string) => {
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} hari` : '-';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Booking" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarRange className="h-5 w-5" />
                                    Laporan Pesanan (Booking)
                                </CardTitle>
                                <CardDescription>Monitor dan cetak riwayat pesanan pelanggan</CardDescription>
                            </div>
                            <Button onClick={() => window.print()}>
                                <Printer className="h-4 w-4" />
                                Cetak Laporan
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kode booking, pelanggan, mobil..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs">Dari Tanggal</Label>
                                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs">Sampai Tanggal</Label>
                                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
                                </div>
                                <Button onClick={handleFilter}>Filter</Button>
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12 text-center">No</TableHead>
                                    <TableHead>Kode</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Mobil</TableHead>
                                    <TableHead className="text-center">Durasi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.length > 0 ? (
                                    bookings.map((b, i) => (
                                        <TableRow key={b.kdbooking}>
                                            <TableCell className="text-center font-medium">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{b.kdbooking}</TableCell>
                                            <TableCell>{b.nama_pelanggan}</TableCell>
                                            <TableCell>{b.nama_mobil}</TableCell>
                                            <TableCell className="text-center">{getDuration(b.tglmulai, b.tglselesai)}</TableCell>
                                            <TableCell>
                                                <span className="text-xs">
                                                    {b.tglmulai} s/d {b.tglselesai}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={b.status === 'Paid' ? 'success' : 'warning'}>{b.status}</Badge>
                                            </TableCell>
                                            <TableCell>{b.payment_type || '-'}</TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(b.total_bayar)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                                            Data booking tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={8} className="text-right font-medium uppercase">
                                        Total Seluruh Pendapatan Booking
                                    </TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(grandTotal)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
