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
import { TrendingUp, Printer, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Rental', href: '/laporan/rental' },
];

interface Rental {
    koderental: string;
    kdbooking: string;
    nama_pelanggan: string;
    nama_mobil: string;
    plat_mobil: string;
    tglmulai: string;
    tglselesai: string;
    tglpengembalian: string;
    keterlambatan: string;
    denda: number;
    totalsewa: number;
    total_seluruh: number;
    status: string;
    status_mobil: string;
}

interface Props {
    rentals: Rental[];
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function RentalReport({ rentals, filters }: Props) {
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
                    '/laporan/rental',
                    { search: value, start_date: startDate, end_date: endDate },
                    { preserveState: true, replace: true },
                );
            }, 300);
        },
        [debounceTimer, startDate, endDate],
    );

    const handleFilter = () => {
        router.get(
            '/laporan/rental',
            { search, start_date: startDate, end_date: endDate },
            { preserveState: true, replace: true },
        );
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const grandTotal = rentals.reduce((acc, curr) => acc + curr.total_seluruh, 0);
    const mobilDisewaCount = rentals.filter((r) => (r.status_mobil || '').toLowerCase() === 'disewa').length;
    const mobilKembaliCount = rentals.filter((r) => (r.status_mobil || '').toLowerCase() === 'tersedia').length;
    const mobilPerawatanCount = rentals.filter((r) => (r.status_mobil || '').toLowerCase() === 'perawatan').length;

    const getStatusMobilVariant = (status: string) => {
        const s = (status || '').toLowerCase();
        if (s === 'tersedia') return 'success';
        if (s === 'disewa') return 'warning';
        return 'destructive';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Rental" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Laporan Pendapatan (Omzet)
                                </CardTitle>
                                <CardDescription>Rekapitulasi finansial dari penyewaan mobil</CardDescription>
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
                                    placeholder="Cari kode, pelanggan, atau mobil..."
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
                                    <TableHead>Booking</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Mobil</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Kembali</TableHead>
                                    <TableHead className="text-center">Terlambat</TableHead>
                                    <TableHead className="text-right">Denda</TableHead>
                                    <TableHead className="text-right">Sewa</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rentals.length > 0 ? (
                                    rentals.map((r, i) => (
                                        <TableRow key={r.koderental}>
                                            <TableCell className="text-center font-medium">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{r.koderental}</TableCell>
                                            <TableCell>{r.kdbooking}</TableCell>
                                            <TableCell>{r.nama_pelanggan}</TableCell>
                                            <TableCell>{r.nama_mobil}</TableCell>
                                            <TableCell>
                                                <span className="text-xs">
                                                    {r.tglmulai} s/d {r.tglselesai}
                                                </span>
                                            </TableCell>
                                            <TableCell>{r.tglpengembalian || '-'}</TableCell>
                                            <TableCell className="text-center">{r.keterlambatan || '0'}</TableCell>
                                            <TableCell className="text-right text-destructive">
                                                {new Intl.NumberFormat('id-ID').format(r.denda)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {new Intl.NumberFormat('id-ID').format(r.totalsewa)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                {new Intl.NumberFormat('id-ID').format(r.total_seluruh)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={getStatusMobilVariant(r.status_mobil)}>
                                                    {r.status_mobil || 'Tersedia'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                                            Data rental tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={10} className="text-right font-medium uppercase">
                                        Grand Total Pendapatan
                                    </TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(grandTotal)}</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableFooter>
                        </Table>

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div className="rounded-lg border bg-muted/50 p-4 text-center">
                                <p className="text-xs font-medium uppercase text-muted-foreground">Total Pendapatan</p>
                                <p className="mt-1 text-lg font-bold text-primary">{formatCurrency(grandTotal)}</p>
                            </div>
                            <div className="rounded-lg border bg-muted/50 p-4 text-center">
                                <p className="text-xs font-medium uppercase text-muted-foreground">Mobil Disewa</p>
                                <Badge variant="warning" className="mt-1 text-sm">
                                    {mobilDisewaCount} Unit
                                </Badge>
                            </div>
                            <div className="rounded-lg border bg-muted/50 p-4 text-center">
                                <p className="text-xs font-medium uppercase text-muted-foreground">Mobil Dikembalikan</p>
                                <Badge variant="success" className="mt-1 text-sm">
                                    {mobilKembaliCount} Unit
                                </Badge>
                            </div>
                            <div className="rounded-lg border bg-muted/50 p-4 text-center">
                                <p className="text-xs font-medium uppercase text-muted-foreground">Dalam Perawatan</p>
                                <Badge variant="destructive" className="mt-1 text-sm">
                                    {mobilPerawatanCount} Unit
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
