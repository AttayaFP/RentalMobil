import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori', href: '/kategori' },
    { title: 'Tambah', href: '/kategori/create' },
];

interface Props {
    next_kdkategori: string;
}

export default function Create({ next_kdkategori }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        kdkategori: next_kdkategori,
        nama_kategori: '',
    });

    const [showConfirm, setShowConfirm] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        post('/kategori', {
            onSuccess: () => toast.success('Kategori berhasil ditambahkan'),
            onError: () => toast.error('Gagal menambahkan kategori'),
            onFinish: () => setShowConfirm(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kategori" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/kategori">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Tambah Kategori Baru</h1>
                        <p className="text-sm text-muted-foreground">Buat kategori baru untuk jenis mobil</p>
                    </div>
                </div>

                <Card className="max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-base">Data Kategori</CardTitle>
                        <CardDescription>Masukkan kode dan nama kategori</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="kdkategori">Kode Kategori</Label>
                                <Input id="kdkategori" value={data.kdkategori} onChange={(e) => setData('kdkategori', e.target.value)} required />
                                {errors.kdkategori && <p className="text-sm text-destructive">{errors.kdkategori}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama_kategori">Nama Kategori</Label>
                                <Input
                                    id="nama_kategori"
                                    placeholder="Contoh: Sport Utility Vehicle"
                                    value={data.nama_kategori}
                                    onChange={(e) => setData('nama_kategori', e.target.value)}
                                    required
                                />
                                {errors.nama_kategori && <p className="text-sm text-destructive">{errors.nama_kategori}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" asChild>
                                    <Link href="/kategori">Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Simpan Kategori Baru</DialogTitle>
                        <DialogDescription>Pastikan kode dan nama kategori sudah benar.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirm(false)}>
                            Batal
                        </Button>
                        <Button onClick={confirmSubmit} disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Ya, Simpan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
