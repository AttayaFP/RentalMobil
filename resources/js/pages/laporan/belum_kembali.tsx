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
    { title: 'Laporan Belum Kembali', href: '/laporan/belum-kembali' },
];

interface Booking {
    kdbooking: string;
    nama_mobil: string;
    plat_mobil: string;
    tglmulai: string;
    status: string;
}

interface Props {
    bookings: Booking[];
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function BelumKembaliReport({ bookings, filters }: Props) {
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
                    '/laporan/belum-kembali',
                    { search: value, start_date: startDate, end_date: endDate },
                    { preserveState: true, replace: true },
                );
            }, 300);
        },
        [debounceTimer, startDate, endDate],
    );

    const handleFilter = () => {
        router.get(
            '/laporan/belum-kembali',
            { search, start_date: startDate, end_date: endDate },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Belum Kembali" />

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
                            Laporan Mobil Belum Kembali
                        </h2>
                    </div>

                    <div className="p-4">
                        <div className="no-print mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kode booking, mobil, atau plat..."
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
                                        <TableHead className="border border-black">Nama Mobil</TableHead>
                                        <TableHead className="border border-black">Plat Nomor</TableHead>
                                        <TableHead className="border border-black">Tanggal Mulai</TableHead>
                                        <TableHead className="text-center border border-black">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.length > 0 ? (
                                        bookings.map((b, i) => (
                                            <TableRow key={b.kdbooking} className="border-b border-black">
                                                <TableCell className="text-center font-medium border border-black">{i + 1}</TableCell>
                                                <TableCell className="font-medium border border-black">{b.kdbooking}</TableCell>
                                                <TableCell className="border border-black">{b.nama_mobil}</TableCell>
                                                <TableCell className="border border-black">{b.plat_mobil}</TableCell>
                                                <TableCell className="border border-black">{b.tglmulai}</TableCell>
                                                <TableCell className="text-center border border-black">
                                                    <Badge variant="warning" className="rounded-none">BELUM KEMBALI</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground border border-black">
                                                Tidak ada mobil yang sedang disewa.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableRow className="border-t-2 border-black bg-muted/50 hover:bg-muted/50">
                                    <TableCell colSpan={5} className="text-right font-bold uppercase border border-black">
                                        Total Mobil Yang Belum Kembali
                                    </TableCell>
                                    <TableCell className="text-center font-bold border border-black">
                                        {bookings.length} Unit
                                    </TableCell>
                                </TableRow>
                            </Table>
                        </div>

                        <div className="mt-4 border-2 border-black bg-muted/30 p-3 text-center">
                            <p className="text-sm font-bold uppercase">
                                Total Mobil Belum Kembali: {bookings.length} Unit
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
