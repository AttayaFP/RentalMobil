import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Tag, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori', href: '/kategori' },
];

interface Kategori {
    kdkategori: string;
    nama_kategori: string;
}

interface Props {
    kategoris: Kategori[];
    filters: {
        search?: string;
        date?: string;
    };
}

const PER_PAGE = 10;

export default function Index({ kategoris, filters }: Props) {
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
                router.get('/kategori', { search: value }, { preserveState: true, replace: true });
            }, 300);
        },
        [debounceTimer],
    );

    const filtered = useMemo(() => {
        if (!search) return kategoris;
        const q = search.toLowerCase();
        return kategoris.filter((k) => k.kdkategori.toLowerCase().includes(q) || k.nama_kategori.toLowerCase().includes(q));
    }, [kategoris, search]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/kategori/${deleteId}`, {
            onSuccess: () => {
                toast.success('Kategori berhasil dihapus');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus kategori');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Mobil" />

            <div className="flex flex-col gap-6 p-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Tag className="h-5 w-5" />
                                        Daftar Kategori
                                    </CardTitle>
                                    <CardDescription className="mt-1">Kelola kategori jenis mobil</CardDescription>
                                </div>
                                <Button onClick={() => router.visit('/kategori/create')}>
                                    <Plus className="h-4 w-4" />
                                    Tambah Kategori
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="relative max-w-sm flex-1">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="Cari kode atau nama kategori..."
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
                                        <TableHead className="w-40">Kode Kategori</TableHead>
                                        <TableHead>Nama Kategori</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginated.length > 0 ? (
                                        paginated.map((k, i) => (
                                            <TableRow key={k.kdkategori}>
                                                <TableCell className="font-medium">{(page - 1) * PER_PAGE + i + 1}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{k.kdkategori}</Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{k.nama_kategori}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => router.visit(`/kategori/${k.kdkategori}/edit`)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => setDeleteId(k.kdkategori)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                                                Tidak ada data kategori
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {totalPages > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-muted-foreground text-sm">
                                        Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length}{' '}
                                        data
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm">
                                            {page} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kategori</DialogTitle>
                        <DialogDescription>Kategori yang dihapus tidak dapat dikembalikan.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
