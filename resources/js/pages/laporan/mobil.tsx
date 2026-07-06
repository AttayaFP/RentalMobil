import logoImg from '@/assets/images/logo.jpg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Printer, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Mobil', href: '/laporan/mobil' },
];

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    thn_mobil: number;
    plat_mobil: string;
    warna_mobil: string;
    stnk_mobil: string;
    harga: number;
    nama_kategori: string;
    status: string;
}

interface Props {
    mobils: Mobil[];
    filters: {
        search?: string;
    };
}

export default function MobilReport({ mobils, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const debounceTimer = useMemo(() => ({ current: null as ReturnType<typeof setTimeout> | null }), []);

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                router.get('/laporan/mobil', { search: value }, { preserveState: true, replace: true });
            }, 300);
        },
        [debounceTimer],
    );

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Mobil" />

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
                        <h2 className="text-center text-sm font-bold uppercase">Laporan Data Mobil - Daftar Inventaris & Kondisi Seluruh Mobil</h2>
                    </div>

                    <div className="p-4">
                        <div className="no-print mb-4 flex items-center gap-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Cari kode atau nama mobil..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="rounded-none pl-9"
                                />
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
                                        <TableHead className="border border-black">Nama Mobil</TableHead>
                                        <TableHead className="border border-black">Kategori</TableHead>
                                        <TableHead className="border border-black">Tahun</TableHead>
                                        <TableHead className="border border-black">Warna</TableHead>
                                        <TableHead className="border border-black">No. STNK</TableHead>
                                        <TableHead className="border border-black">Plat</TableHead>
                                        <TableHead className="border border-black text-right">Harga</TableHead>
                                        <TableHead className="border border-black text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mobils.length > 0 ? (
                                        mobils.map((m, i) => (
                                            <TableRow key={m.kdmobil} className="border-b border-black">
                                                <TableCell className="border border-black text-center font-medium">{i + 1}</TableCell>
                                                <TableCell className="border border-black font-medium">{m.kdmobil}</TableCell>
                                                <TableCell className="border border-black">{m.nama_mobil}</TableCell>
                                                <TableCell className="border border-black">{m.nama_kategori}</TableCell>
                                                <TableCell className="border border-black">{m.thn_mobil}</TableCell>
                                                <TableCell className="border border-black">{m.warna_mobil || '-'}</TableCell>
                                                <TableCell className="border border-black">{m.stnk_mobil || '-'}</TableCell>
                                                <TableCell className="border border-black">{m.plat_mobil}</TableCell>
                                                <TableCell className="border border-black text-right font-medium">
                                                    {formatCurrency(m.harga)}
                                                </TableCell>
                                                <TableCell className="border border-black text-center">
                                                    <Badge
                                                        variant={
                                                            m.status === 'Tersedia' ? 'success' : m.status === 'Disewa' ? 'warning' : 'destructive'
                                                        }
                                                        className="rounded-none"
                                                    >
                                                        {m.status || 'Tersedia'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-muted-foreground h-24 border border-black text-center">
                                                Data mobil tidak ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableRow className="bg-muted/50 hover:bg-muted/50 border-t-2 border-black">
                                    <TableCell colSpan={9} className="border border-black text-right font-bold uppercase">
                                        Total Seluruh Mobil
                                    </TableCell>
                                    <TableCell className="border border-black text-center font-bold">{mobils.length} Unit</TableCell>
                                </TableRow>
                            </Table>
                        </div>

                        <div className="bg-muted/30 mt-4 border-2 border-black p-3 text-center">
                            <p className="text-sm font-bold uppercase">Jumlah Seluruh Data Mobil: {mobils.length} Unit</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
