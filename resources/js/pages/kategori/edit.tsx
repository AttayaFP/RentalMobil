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

interface Kategori {
    kdkategori: string;
    nama_kategori: string;
}

interface Props {
    kategori: Kategori;
}

export default function Edit({ kategori }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kategori', href: '/kategori' },
        { title: `Edit ${kategori.kdkategori}`, href: `/kategori/${kategori.kdkategori}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nama_kategori: kategori.nama_kategori,
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (!data.nama_kategori.trim()) errs.nama_kategori = 'Nama kategori wajib diisi.';

        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        put(`/kategori/${kategori.kdkategori}`, {
            onSuccess: () => toast.success('Kategori berhasil diperbarui'),
            onError: () => toast.error('Gagal memperbarui kategori'),
            onFinish: () => setShowConfirm(false),
        });
    };

    const getError = (field: string) => errors[field as keyof typeof errors] || clientErrors[field] || '';

    const inputClass = (field: string) =>
        getError(field) ? 'border-red-500 focus-visible:ring-red-500' : '';

    const ErrorMsg = ({ field }: { field: string }) => {
        const msg = getError(field);
        if (!msg) return null;
        return (
            <p className="flex items-center gap-1.5 text-sm text-red-500">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                {msg}
            </p>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${kategori.kdkategori}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/kategori">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Kategori</h1>
                        <p className="text-sm text-muted-foreground">Ubah nama kategori {kategori.kdkategori}</p>
                    </div>
                </div>

                <Card className="max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-base">Ubah Data Kategori</CardTitle>
                        <CardDescription>Kode kategori tidak dapat diubah</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kode Kategori</Label>
                                <Input value={kategori.kdkategori} disabled />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama_kategori">
                                    Nama Kategori <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nama_kategori"
                                    value={data.nama_kategori}
                                    onChange={(e) => { setData('nama_kategori', e.target.value); setClientErrors((p) => ({ ...p, nama_kategori: '' })); }}
                                    className={inputClass('nama_kategori')}
                                />
                                <ErrorMsg field="nama_kategori" />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" asChild>
                                    <Link href="/kategori">Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Simpan Perubahan</DialogTitle>
                        <DialogDescription>Perubahan nama kategori akan disimpan.</DialogDescription>
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
