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
import { AlertCircle, Printer, Search } from 'lucide-react';

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
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Belum Kembali" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                    Laporan Belum Kembali
                                </CardTitle>
                                <CardDescription>Daftar armada yang masih dalam masa sewa</CardDescription>
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
                                    placeholder="Cari kode booking, mobil, atau plat..."
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
                                    <TableHead>Kode Booking</TableHead>
                                    <TableHead>Mobil</TableHead>
                                    <TableHead>Plat</TableHead>
                                    <TableHead>Tanggal Sewa</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.length > 0 ? (
                                    bookings.map((b, i) => (
                                        <TableRow key={b.kdbooking}>
                                            <TableCell className="text-center font-medium">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{b.kdbooking}</TableCell>
                                            <TableCell>{b.nama_mobil}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{b.plat_mobil}</Badge>
                                            </TableCell>
                                            <TableCell>{b.tglmulai}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="warning">BELUM KEMBALI</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            Tidak ada kendaraan yang sedang disewa.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={5} className="text-right font-medium uppercase">
                                        Total Mobil Belum Kembali
                                    </TableCell>
                                    <TableCell className="text-center font-bold">{bookings.length} Unit</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
