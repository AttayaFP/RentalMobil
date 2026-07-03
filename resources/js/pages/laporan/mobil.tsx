import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Printer, Search } from 'lucide-react';

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

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Laporan Inventaris Mobil
                                </CardTitle>
                                <CardDescription>Cari dan cetak daftar inventaris mobil</CardDescription>
                            </div>
                            <Button onClick={() => window.print()}>
                                <Printer className="h-4 w-4" />
                                Cetak Laporan
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kode atau nama mobil..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12 text-center">No</TableHead>
                                    <TableHead>Kode</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Tahun</TableHead>
                                    <TableHead>Plat</TableHead>
                                    <TableHead>Warna</TableHead>
                                    <TableHead className="text-right">Harga</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mobils.length > 0 ? (
                                    mobils.map((m, i) => (
                                        <TableRow key={m.kdmobil}>
                                            <TableCell className="text-center font-medium">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{m.kdmobil}</TableCell>
                                            <TableCell>{m.nama_mobil}</TableCell>
                                            <TableCell>{m.thn_mobil}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{m.plat_mobil}</Badge>
                                            </TableCell>
                                            <TableCell>{m.warna_mobil || '-'}</TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(m.harga)}</TableCell>
                                            <TableCell>{m.nama_kategori}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={m.status === 'Tersedia' ? 'success' : 'destructive'}>
                                                    {m.status || 'Tersedia'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                                            Data mobil tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={8} className="text-right font-medium uppercase">
                                        Total Seluruh Mobil / Armada
                                    </TableCell>
                                    <TableCell className="text-center font-bold">{mobils.length} Unit</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
