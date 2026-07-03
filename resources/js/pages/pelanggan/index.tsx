import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, UserPlus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pelanggan', href: '/pelanggan' },
];

interface Pelanggan {
    id: number;
    nama_lengkap: string;
    username: string;
    email: string;
    jenis_kelamin: string;
    alamat: string;
    nohp: string;
    role: string;
    foto: string | null;
    created_at: string;
}

interface Props {
    pelanggans: Pelanggan[];
    filters: {
        search?: string;
        date?: string;
    };
}

const PER_PAGE = 10;

export default function Index({ pelanggans, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const debounceTimer = useMemo(() => ({ current: null as ReturnType<typeof setTimeout> | null }), []);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        setPage(1);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            router.get('/pelanggan', { search: value }, { preserveState: true, replace: true });
        }, 300);
    }, [debounceTimer]);

    const filtered = useMemo(() => {
        if (!search) return pelanggans;
        const q = search.toLowerCase();
        return pelanggans.filter(
            (p) =>
                p.nama_lengkap.toLowerCase().includes(q) ||
                p.username.toLowerCase().includes(q) ||
                p.email.toLowerCase().includes(q),
        );
    }, [pelanggans, search]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/pelanggan/${deleteId}`, {
            onSuccess: () => {
                toast.success('Pelanggan berhasil dihapus');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus pelanggan');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pelanggan" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Daftar Pelanggan
                                </CardTitle>
                                <CardDescription>Kelola data pelanggan dan pengguna sistem</CardDescription>
                            </div>
                            <Button onClick={() => router.visit('/pelanggan/create')}>
                                <UserPlus className="h-4 w-4" />
                                Tambah Pelanggan
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, email, atau username..."
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
                                    <TableHead>Foto</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>No HP</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.length > 0 ? (
                                    paginated.map((p, i) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{(page - 1) * PER_PAGE + i + 1}</TableCell>
                                            <TableCell>
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={p.foto ? `/storage/${p.foto}` : undefined} alt={p.nama_lengkap} />
                                                    <AvatarFallback>{p.nama_lengkap.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-medium">{p.nama_lengkap}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">@{p.username}</Badge>
                                            </TableCell>
                                            <TableCell>{p.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={p.jenis_kelamin === 'L' ? 'default' : 'secondary'}>
                                                    {p.jenis_kelamin === 'L' ? 'L' : 'P'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{p.nohp || '-'}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={p.role === 'admin' ? 'destructive' : p.role === 'pimpinan' ? 'warning' : 'success'}
                                                >
                                                    {p.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => router.visit(`/pelanggan/${p.id}/edit`)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => setDeleteId(p.id)}
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
                                            Tidak ada data pelanggan
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
                        <DialogTitle>Hapus Pelanggan</DialogTitle>
                        <DialogDescription>
                            Data pelanggan ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
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
