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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Pencil, Trash2, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react';

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    thn_mobil: number;
    plat_mobil: string;
    warna_mobil: string;
    stnk_mobil: string;
    harga: number;
    kdkategori: string;
    status: string;
    foto: string | null;
}

interface Props {
    mobils: Mobil[];
    filters: {
        search?: string;
        date?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mobil', href: '/mobil' },
];

const PER_PAGE = 10;

export default function Index({ mobils, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get('/mobil', { search }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/mobil/${deleteId}`, {
            onSuccess: () => {
                toast.success('Data mobil berhasil dihapus.');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus data mobil.');
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const totalPages = Math.ceil(mobils.length / PER_PAGE);
    const paginatedMobils = mobils.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Mobil" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Daftar Mobil</CardTitle>
                                <CardDescription>Kelola armada rental mobil Anda</CardDescription>
                            </div>
                            <Button asChild>
                                <Link href="/mobil/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Mobil
                                </Link>
                            </Button>
                        </div>
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari kode, nama, atau plat..."
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
                                    <TableHead>Foto</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Plat</TableHead>
                                    <TableHead>Tahun</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedMobils.length > 0 ? (
                                    paginatedMobils.map((mobil, index) => (
                                        <TableRow key={mobil.kdmobil}>
                                            <TableCell className="font-medium">
                                                {(currentPage - 1) * PER_PAGE + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                {mobil.foto ? (
                                                    <img
                                                        src={`/storage/${mobil.foto}`}
                                                        alt={mobil.nama_mobil}
                                                        className="h-10 w-16 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-16 items-center justify-center rounded bg-muted">
                                                        <ImageOff className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-semibold">{mobil.nama_mobil}</TableCell>
                                            <TableCell>{mobil.plat_mobil}</TableCell>
                                            <TableCell>{mobil.thn_mobil}</TableCell>
                                            <TableCell className="font-semibold">{formatCurrency(mobil.harga)}</TableCell>
                                            <TableCell>{mobil.kdkategori}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        mobil.status === 'Tersedia'
                                                            ? 'default'
                                                            : mobil.status === 'Disewa'
                                                              ? 'secondary'
                                                              : 'destructive'
                                                    }
                                                >
                                                    {mobil.status || 'Tersedia'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/mobil/${mobil.kdmobil}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Dialog
                                                        open={deleteId === mobil.kdmobil}
                                                        onOpenChange={(open) => {
                                                            if (!open) setDeleteId(null);
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => setDeleteId(mobil.kdmobil)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Hapus Mobil?</DialogTitle>
                                                                <DialogDescription>
                                                                    Data mobil <span className="font-semibold">{mobil.nama_mobil}</span> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                                            Tidak ada data mobil ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan {(currentPage - 1) * PER_PAGE + 1} - {Math.min(currentPage * PER_PAGE, mobils.length)} dari {mobils.length} data
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Sebelumnya
                                    </Button>
                                    <span className="text-sm font-medium">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Selanjutnya
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
