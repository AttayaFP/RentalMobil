import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, Search } from 'lucide-react';
import logoImg from '@/assets/images/logo.jpg';

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
}

interface Props {
    rentals: Rental[];
    mobil_perawatan: number;
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function RentalReport({ rentals, mobil_perawatan, filters }: Props) {
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
        );
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const totalPendapatan = rentals.reduce((acc, curr) => acc + (curr.total_seluruh || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Rental" />

            <div className="flex flex-col gap-0 p-4">
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
                        <h2 className="text-center text-sm font-bold uppercase">
                            Laporan Pendapatan - Rekapitulasi Pendatapan Sewa & Denda
                        </h2>
                    </div>

                    <div className="p-4">
                        <div className="no-print mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kode, pelanggan, atau mobil..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9 rounded-none"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs">Dari Tanggal</Label>
                                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40 rounded-none" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs">Sampai Tanggal</Label>
                                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40 rounded-none" />
                                </div>
                                <Button onClick={handleFilter} className="rounded-none">Filter</Button>
                            </div>
                            <Button onClick={() => window.print()} className="rounded-none">
                                <Printer className="mr-2 h-4 w-4" />
                                Cetak Laporan
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b-2 border-black bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-12 text-center border border-black">No</TableHead>
                                        <TableHead className="border border-black">Kode</TableHead>
                                        <TableHead className="border border-black">Nama Pelanggan</TableHead>
                                        <TableHead className="border border-black">Nama Mobil</TableHead>
                                        <TableHead className="border border-black">No. Plat</TableHead>
                                        <TableHead className="border border-black">Tanggal Mulai</TableHead>
                                        <TableHead className="border border-black">Tanggal Selesai</TableHead>
                                        <TableHead className="border border-black">Tanggal Kembali</TableHead>
                                        <TableHead className="text-center border border-black">Telat</TableHead>
                                        <TableHead className="text-right border border-black">Sewa</TableHead>
                                        <TableHead className="text-right border border-black">Denda</TableHead>
                                        <TableHead className="text-right border border-black">Total</TableHead>
                                        <TableHead className="text-center border border-black">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rentals.length > 0 ? (
                                        rentals.map((r, i) => (
                                            <TableRow key={r.koderental} className="border-b border-black">
                                                <TableCell className="text-center font-medium border border-black">{i + 1}</TableCell>
                                                <TableCell className="font-medium border border-black">{r.koderental}</TableCell>
                                                <TableCell className="border border-black">{r.nama_pelanggan}</TableCell>
                                                <TableCell className="border border-black">{r.nama_mobil}</TableCell>
                                                <TableCell className="border border-black">{r.plat_mobil}</TableCell>
                                                <TableCell className="border border-black">{r.tglmulai}</TableCell>
                                                <TableCell className="border border-black">{r.tglselesai}</TableCell>
                                                <TableCell className="border border-black">{r.tglpengembalian}</TableCell>
                                                <TableCell className="text-center border border-black">{r.keterlambatan}</TableCell>
                                                <TableCell className="text-right border border-black">
                                                    {new Intl.NumberFormat('id-ID').format(r.totalsewa)}
                                                </TableCell>
                                                <TableCell className={`text-right border border-black ${r.denda > 0 ? 'text-destructive' : ''}`}>
                                                    {new Intl.NumberFormat('id-ID').format(r.denda)}
                                                </TableCell>
                                                <TableCell className="text-right font-bold border border-black">
                                                    {new Intl.NumberFormat('id-ID').format(r.total_seluruh)}
                                                </TableCell>
                                                <TableCell className="text-center border border-black">
                                                    <Badge
                                                        variant={r.status === 'Selesai' ? 'success' : 'default'}
                                                        className="rounded-none"
                                                    >
                                                        {r.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={13} className="h-24 text-center text-muted-foreground border border-black">
                                                Data rental tidak ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableRow className="border-t-2 border-black bg-muted/50 hover:bg-muted/50">
                                    <TableCell colSpan={11} className="text-right font-bold uppercase border border-black">
                                        Total Pendapatan
                                    </TableCell>
                                    <TableCell className="text-right font-bold border border-black">
                                        {formatCurrency(totalPendapatan)}
                                    </TableCell>
                                    <TableCell className="border border-black" />
                                </TableRow>
                            </Table>
                        </div>

                        <div className="mt-4">
                            <div className="border-2 border-black bg-muted/30 px-3 py-2 text-center">
                                <p className="text-xs font-bold uppercase">Rangkuman Status Mobil & Total Pendapatan</p>
                            </div>
                            <div className="grid grid-cols-4 gap-0">
                                <div className="border-2 border-t-0 border-black bg-muted/30 p-3 text-center">
                                    <p className="text-xs font-bold uppercase text-muted-foreground">Total Pendapatan Keseluruhan</p>
                                    <p className="mt-1 text-lg font-bold">{formatCurrency(totalPendapatan)}</p>
                                </div>
                                <div className="border-2 border-t-0 border-black bg-muted/30 p-3 text-center">
                                    <p className="text-xs font-bold uppercase text-muted-foreground">Total Mobil Disewa</p>
                                    <Badge variant="warning" className="mt-1 text-sm rounded-none">
                                        {rentals.filter((r) => r.status !== 'Selesai').length} Unit
                                    </Badge>
                                </div>
                                <div className="border-2 border-t-0 border-black bg-muted/30 p-3 text-center">
                                    <p className="text-xs font-bold uppercase text-muted-foreground">Total Mobil Sudah Dikembalikan</p>
                                    <Badge variant="success" className="mt-1 text-sm rounded-none">
                                        {rentals.filter((r) => r.status === 'Selesai').length} Unit
                                    </Badge>
                                </div>
                                <div className="border-2 border-t-0 border-black bg-muted/30 p-3 text-center">
                                    <p className="text-xs font-bold uppercase text-muted-foreground">Total Mobil Dalam Perawatan</p>
                                    <Badge variant="destructive" className="mt-1 text-sm rounded-none">
                                        {mobil_perawatan} Unit
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
