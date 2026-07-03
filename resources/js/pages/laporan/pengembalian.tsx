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
import { RotateCcw, Printer, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Pengembalian', href: '/laporan/pengembalian' },
];

interface Pengembalian {
    kdpengembalian: string;
    nama_pelanggan: string;
    nama_mobil: string;
    plat_mobil: string;
    tglmulai: string;
    tglselesai: string;
    tglpengembalian: string;
    keterlambatan: string;
    denda: number;
}

interface Props {
    pengembalians: Pengembalian[];
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function PengembalianReport({ pengembalians, filters }: Props) {
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
                    '/laporan/pengembalian',
                    { search: value, start_date: startDate, end_date: endDate },
                    { preserveState: true, replace: true },
                );
            }, 300);
        },
        [debounceTimer, startDate, endDate],
    );

    const handleFilter = () => {
        router.get(
            '/laporan/pengembalian',
            { search, start_date: startDate, end_date: endDate },
            { preserveState: true, replace: true },
        );
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const totalDenda = pengembalians.reduce((acc, curr) => acc + (curr.denda || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pengembalian" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <RotateCcw className="h-5 w-5" />
                                    Laporan Pengembalian Unit
                                </CardTitle>
                                <CardDescription>Monitor ketepatan waktu dan denda armada</CardDescription>
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
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Mobil</TableHead>
                                    <TableHead>Tanggal Sewa</TableHead>
                                    <TableHead>Tanggal Kembali</TableHead>
                                    <TableHead className="text-center">Terlambat</TableHead>
                                    <TableHead className="text-right">Denda</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pengembalians.length > 0 ? (
                                    pengembalians.map((p, i) => (
                                        <TableRow key={p.kdpengembalian}>
                                            <TableCell className="text-center font-medium">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{p.kdpengembalian}</TableCell>
                                            <TableCell>{p.nama_pelanggan}</TableCell>
                                            <TableCell>{p.nama_mobil}</TableCell>
                                            <TableCell>
                                                <span className="text-xs">
                                                    {p.tglmulai} s/d {p.tglselesai}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium">{p.tglpengembalian}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={p.denda > 0 ? 'destructive' : 'success'}>{p.keterlambatan}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-destructive">
                                                {formatCurrency(p.denda)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                            Data pengembalian tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={7} className="text-right font-medium uppercase">
                                        Total Seluruh Denda Pengembalian
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-destructive">{formatCurrency(totalDenda)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
