import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Printer, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Pelanggan', href: '/laporan/pelanggan' },
];

interface Pelanggan {
    id: number;
    nama_lengkap: string;
    username: string;
    email: string;
    nohp: string;
    created_at: string;
}

interface Props {
    pelanggans: Pelanggan[];
    filters: {
        search?: string;
    };
}

export default function PelangganReport({ pelanggans, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const debounceTimer = useMemo(() => ({ current: null as ReturnType<typeof setTimeout> | null }), []);

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                router.get('/laporan/pelanggan', { search: value }, { preserveState: true, replace: true });
            }, 300);
        },
        [debounceTimer],
    );

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pelanggan" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Laporan Data Pelanggan
                                </CardTitle>
                                <CardDescription>Cari dan cetak data pelanggan rental</CardDescription>
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
                                    placeholder="Cari ID, nama, atau email pelanggan..."
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
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>No HP</TableHead>
                                    <TableHead>Terdaftar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pelanggans.length > 0 ? (
                                    pelanggans.map((p, i) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="text-center font-medium">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{p.nama_lengkap}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">@{p.username}</Badge>
                                            </TableCell>
                                            <TableCell>{p.email}</TableCell>
                                            <TableCell>{p.nohp || '-'}</TableCell>
                                            <TableCell>{formatDate(p.created_at)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            Data pelanggan tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={5} className="text-right font-medium uppercase">
                                        Total Seluruh Pelanggan
                                    </TableCell>
                                    <TableCell className="font-bold">{pelanggans.length} Pelanggan</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
