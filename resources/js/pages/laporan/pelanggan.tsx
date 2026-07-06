import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Printer, Search } from 'lucide-react';
import logoImg from '@/assets/images/logo.jpg';

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
    jenis_kelamin: string;
    alamat: string;
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

    const formatJK = (jk: string) => {
        if (jk === 'L') return 'Laki-laki';
        if (jk === 'P') return 'Perempuan';
        return jk || '-';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pelanggan" />

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
                            Laporan Data Pelanggan - Seluruh Data Pelanggan Terdaftar
                        </h2>
                    </div>

                    <div className="p-4">
                        <div className="no-print mb-4 flex items-center gap-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari ID, nama, atau email pelanggan..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9 rounded-none"
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
                                    <TableRow className="border-b-2 border-black bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-12 text-center border border-black">No</TableHead>
                                        <TableHead className="border border-black">ID</TableHead>
                                        <TableHead className="border border-black">Nama Lengkap</TableHead>
                                        <TableHead className="border border-black">Jenis Kelamin</TableHead>
                                        <TableHead className="border border-black">Username</TableHead>
                                        <TableHead className="border border-black">Email</TableHead>
                                        <TableHead className="border border-black">No HP</TableHead>
                                        <TableHead className="border border-black">Alamat</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pelanggans.length > 0 ? (
                                        pelanggans.map((p, i) => (
                                            <TableRow key={p.id} className="border-b border-black">
                                                <TableCell className="text-center font-medium border border-black">{i + 1}</TableCell>
                                                <TableCell className="font-medium border border-black">{p.id}</TableCell>
                                                <TableCell className="border border-black">{p.nama_lengkap}</TableCell>
                                                <TableCell className="border border-black">{formatJK(p.jenis_kelamin)}</TableCell>
                                                <TableCell className="border border-black">{p.username}</TableCell>
                                                <TableCell className="border border-black">{p.email}</TableCell>
                                                <TableCell className="border border-black">{p.nohp || '-'}</TableCell>
                                                <TableCell className="border border-black">{p.alamat || '-'}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground border border-black">
                                                Data pelanggan tidak ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableRow className="border-t-2 border-black bg-muted/50 hover:bg-muted/50">
                                    <TableCell colSpan={7} className="text-right font-bold uppercase border border-black">
                                        Jumlah Pelanggan
                                    </TableCell>
                                    <TableCell className="font-bold border border-black">{pelanggans.length}</TableCell>
                                </TableRow>
                            </Table>
                        </div>

                        <div className="mt-4 border-2 border-black bg-muted/30 p-3 text-center">
                            <p className="text-sm font-bold uppercase">
                                Jumlah Seluruh Data Pelanggan: {pelanggans.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
