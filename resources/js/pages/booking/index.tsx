import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Plus, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface Booking {
    kdbooking: string;
    tglbooking: string;
    iduser: number;
    kdmobil: string;
    harga: number;
    payment_type: string;
    payment_method: string;
    tglmulai: string;
    tglselesai: string;
    lama_sewa: number;
    total_bayar: number;
    transaction_id: string;
    transaction_time: string;
    status: string;
    user: { nama_lengkap: string };
    mobil: { nama_mobil: string; plat_mobil: string };
}

interface Props {
    bookings: Booking[];
    filters: {
        search?: string;
        date?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Booking', href: '/booking' },
];

const PER_PAGE = 10;

function getStatusBadge(status: string) {
    const s = (status || '').toLowerCase();
    if (['sukses', 'success', 'berhasil'].includes(s)) return 'default';
    if (['pending', 'proses'].includes(s)) return 'secondary';
    if (['selesai'].includes(s)) return 'outline';
    if (['batal', 'gagal', 'expired'].includes(s)) return 'destructive';
    return 'secondary';
}

export default function Index({ bookings, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get('/booking', { search }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const formatDate = (s: string) => {
        if (!s) return '-';
        const d = new Date(s);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const totalPages = Math.ceil(bookings.length / PER_PAGE);
    const paginated = bookings.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Booking" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Riwayat Pemesanan</CardTitle>
                                <CardDescription>Monitor semua transaksi penyewaan mobil</CardDescription>
                            </div>
                            <Button asChild>
                                <Link href="/booking/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat Booking
                                </Link>
                            </Button>
                        </div>
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari kode booking, pelanggan, atau mobil..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead>Kode Booking</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Mobil</TableHead>
                                    <TableHead>Tanggal Sewa</TableHead>
                                    <TableHead>Durasi</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.length > 0 ? (
                                    paginated.map((b, i) => (
                                        <TableRow key={b.kdbooking}>
                                            <TableCell className="font-medium">
                                                {(currentPage - 1) * PER_PAGE + i + 1}
                                            </TableCell>
                                            <TableCell className="font-semibold">{b.kdbooking}</TableCell>
                                            <TableCell>{b.user?.nama_lengkap || `ID: ${b.iduser}`}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{b.mobil?.nama_mobil || b.kdmobil}</span>
                                                    <span className="text-xs text-muted-foreground">{b.mobil?.plat_mobil}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs">
                                                    <span>{formatDate(b.tglmulai)}</span>
                                                    <span className="text-muted-foreground">s/d {formatDate(b.tglselesai)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{b.lama_sewa} hari</TableCell>
                                            <TableCell className="font-semibold">{formatCurrency(b.total_bayar)}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadge(b.status)}>
                                                    {b.status || 'Proses'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/booking/${b.kdbooking}/invoice`}>
                                                        <FileText className="mr-1 h-4 w-4" />
                                                        Invoice
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                                            Belum ada data pemesanan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, bookings.length)} dari {bookings.length} data
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm">{currentPage} / {totalPages}</span>
                                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
