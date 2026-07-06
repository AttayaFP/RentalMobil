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
        );
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const parseTelat = (keterlambatan: string) => {
        const num = parseInt(keterlambatan);
        return isNaN(num) ? 0 : num;
    };

    const mobilSudahKembali = pengembalians.length;
    const mobilTerlambat = pengembalians.filter((p) => parseTelat(p.keterlambatan) > 0).length;
    const totalDenda = pengembalians.reduce((acc, curr) => acc + (curr.denda || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pengembalian" />

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
                            Laporan Pengembalian - Detil Pengembalian & Status Denda
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
                                        <TableHead className="border border-black">No Plat</TableHead>
                                        <TableHead className="border border-black">Tanggal Mulai</TableHead>
                                        <TableHead className="border border-black">Tanggal Selesai</TableHead>
                                        <TableHead className="border border-black">Tanggal Kembali</TableHead>
                                        <TableHead className="text-center border border-black">Telat</TableHead>
                                        <TableHead className="text-right border border-black">Denda</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pengembalians.length > 0 ? (
                                        pengembalians.map((p, i) => (
                                            <TableRow key={p.kdpengembalian} className="border-b border-black">
                                                <TableCell className="text-center font-medium border border-black">{i + 1}</TableCell>
                                                <TableCell className="font-medium border border-black">{p.kdpengembalian}</TableCell>
                                                <TableCell className="border border-black">{p.nama_pelanggan}</TableCell>
                                                <TableCell className="border border-black">{p.nama_mobil}</TableCell>
                                                <TableCell className="border border-black">{p.plat_mobil}</TableCell>
                                                <TableCell className="border border-black">{p.tglmulai}</TableCell>
                                                <TableCell className="border border-black">{p.tglselesai}</TableCell>
                                                <TableCell className="border border-black">{p.tglpengembalian}</TableCell>
                                                <TableCell className="text-center border border-black">
                                                    <Badge variant={parseTelat(p.keterlambatan) > 0 ? 'destructive' : 'success'} className="rounded-none">
                                                        {p.keterlambatan}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className={`text-right font-medium border border-black ${p.denda > 0 ? 'text-destructive' : ''}`}>
                                                    {formatCurrency(p.denda)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} className="h-24 text-center text-muted-foreground border border-black">
                                                Data pengembalian tidak ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableRow className="border-t-2 border-black bg-muted/50 hover:bg-muted/50">
                                    <TableCell colSpan={9} className="text-right font-bold uppercase border border-black">
                                        Total Denda
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-destructive border border-black">
                                        {formatCurrency(totalDenda)}
                                    </TableCell>
                                </TableRow>
                            </Table>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="border-2 border-black bg-muted/30 p-3 text-center">
                                <p className="text-xs font-bold uppercase text-muted-foreground">Mobil Sudah Kembali</p>
                                <p className="mt-1 text-lg font-bold">{mobilSudahKembali}</p>
                            </div>
                            <div className="border-2 border-black bg-muted/30 p-3 text-center">
                                <p className="text-xs font-bold uppercase text-muted-foreground">Mobil Terlambat (&gt; 1 Hari)</p>
                                <p className="mt-1 text-lg font-bold text-destructive">{mobilTerlambat}</p>
                            </div>
                            <div className="border-2 border-black bg-muted/30 p-3 text-center">
                                <p className="text-xs font-bold uppercase text-muted-foreground">Total Denda Keseluruhan</p>
                                <p className="mt-1 text-lg font-bold text-destructive">{formatCurrency(totalDenda)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
