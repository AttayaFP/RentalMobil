import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RotateCcw, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengembalian', href: '/pengembalian' },
];

interface Pengembalian {
    kdpengembalian: string;
    kdbooking: string;
    iduser: number;
    tglmulai: string;
    tglselesai: string;
    tglpengembalian: string;
    keterlambatan: number;
    denda: number;
    user: { nama_lengkap: string };
    booking: { kdbooking: string; mobil: { nama_mobil: string; plat_mobil: string } };
}

interface Props {
    pengembalians: Pengembalian[];
    filters: {
        search?: string;
        date?: string;
    };
}

const PER_PAGE = 10;

export default function Index({ pengembalians, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const debounceTimer = useMemo(() => ({ current: null as ReturnType<typeof setTimeout> | null }), []);

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            setPage(1);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                router.get('/pengembalian', { search: value }, { preserveState: true, replace: true });
            }, 300);
        },
        [debounceTimer],
    );

    const filtered = useMemo(() => {
        if (!search) return pengembalians;
        const q = search.toLowerCase();
        return pengembalians.filter(
            (p) =>
                p.kdpengembalian.toLowerCase().includes(q) ||
                p.kdbooking.toLowerCase().includes(q) ||
                p.user?.nama_lengkap?.toLowerCase().includes(q) ||
                p.booking?.mobil?.nama_mobil?.toLowerCase().includes(q),
        );
    }, [pengembalians, search]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/pengembalian/${deleteId}`, {
            onSuccess: () => {
                toast.success('Pengembalian berhasil dihapus dan status mobil telah diperbarui.');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus pengembalian.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Pengembalian" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <RotateCcw className="h-5 w-5" />
                                    Data Pengembalian Mobil
                                </CardTitle>
                                <CardDescription>Kelola pengembalian unit dan denda</CardDescription>
                            </div>
                            <Button onClick={() => router.visit('/pengembalian/create')}>
                                <Plus className="h-4 w-4" />
                                Input Pengembalian
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kode kembali, booking, atau nama..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead>Kode</TableHead>
                                    <TableHead>Booking</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Mobil</TableHead>
                                    <TableHead>Tanggal Kembali</TableHead>
                                    <TableHead>Keterlambatan</TableHead>
                                    <TableHead>Denda</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.length > 0 ? (
                                    paginated.map((p, i) => (
                                        <TableRow key={p.kdpengembalian}>
                                            <TableCell className="font-medium">{(page - 1) * PER_PAGE + i + 1}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{p.kdpengembalian}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{p.kdbooking}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{p.user?.nama_lengkap || `#${p.iduser}`}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{p.booking?.mobil?.nama_mobil || '-'}</span>
                                                    <span className="text-xs text-muted-foreground">{p.booking?.mobil?.plat_mobil || ''}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{p.tglpengembalian}</TableCell>
                                            <TableCell>
                                                {p.keterlambatan > 0 ? (
                                                    <Badge variant="destructive" className="gap-1">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        {p.keterlambatan} Hari
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Tepat Waktu
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className={p.denda > 0 ? 'font-semibold text-destructive' : 'text-green-600'}>
                                                {p.denda > 0 ? formatCurrency(p.denda) : 'Gratis'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => router.visit(`/pengembalian/${p.kdpengembalian}/edit`)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => setDeleteId(p.kdpengembalian)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                                            Belum ada data pengembalian.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length} data
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm">
                                        {page} / {totalPages}
                                    </span>
                                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Pengembalian?</DialogTitle>
                        <DialogDescription>
                            Status booking dan ketersediaan mobil akan dikembalikan otomatis. Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
