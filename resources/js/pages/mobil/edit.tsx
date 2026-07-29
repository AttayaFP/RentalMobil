import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Upload } from 'lucide-react';

interface Kategori {
    kdkategori: string;
    nama_kategori: string;
}

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
    mobil: Mobil;
    kategoris: Kategori[];
}

export default function Edit({ mobil, kategoris }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mobil', href: '/mobil' },
        { title: mobil.nama_mobil, href: `/mobil/${mobil.kdmobil}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT' as const,
        nama_mobil: mobil.nama_mobil,
        thn_mobil: mobil.thn_mobil,
        plat_mobil: mobil.plat_mobil,
        warna_mobil: mobil.warna_mobil,
        stnk_mobil: mobil.stnk_mobil,
        harga: mobil.harga,
        kdkategori: mobil.kdkategori,
        status: mobil.status,
        foto: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(mobil.foto ? `/storage/${mobil.foto}` : null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setPreview(URL.createObjectURL(file));
            setClientErrors((prev) => ({ ...prev, foto: '' }));
        }
    };

    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (!data.nama_mobil.trim()) errs.nama_mobil = 'Nama mobil wajib diisi.';
        if (!data.plat_mobil.trim()) errs.plat_mobil = 'Plat nomor wajib diisi.';
        if (!data.warna_mobil.trim()) errs.warna_mobil = 'Warna mobil wajib diisi.';
        if (!data.stnk_mobil.trim()) errs.stnk_mobil = 'Nomor STNK wajib diisi.';
        if (!data.kdkategori) errs.kdkategori = 'Kategori wajib dipilih.';
        if (!data.harga || data.harga <= 0) errs.harga = 'Harga sewa wajib diisi dan harus lebih dari 0.';
        if (!data.thn_mobil) errs.thn_mobil = 'Tahun mobil wajib diisi.';

        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        post(`/mobil/${mobil.kdmobil}`, {
            onSuccess: () => {
                toast.success('Data mobil berhasil diperbarui.');
            },
            onError: () => {
                toast.error('Gagal memperbarui data mobil. Periksa kembali data Anda.');
            },
            onFinish: () => {
                setShowConfirm(false);
            },
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
            <Head title={`Edit ${mobil.nama_mobil}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/mobil">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <CardTitle>Edit Mobil: {mobil.nama_mobil}</CardTitle>
                                <CardDescription>Ubah informasi mobil {mobil.kdmobil}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="foto">Foto Mobil</Label>
                                    <div className={`relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 transition-colors hover:border-primary/50 ${getError('foto') ? 'border-red-500' : ''}`}>
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="h-full w-full rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <Upload className={`h-8 w-8 ${getError('foto') ? 'text-red-500' : ''}`} />
                                                <span className="text-sm">Klik untuk ganti foto</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    <p className="text-center text-xs text-muted-foreground">Kosongkan jika tidak ingin ganti foto</p>
                                    <ErrorMsg field="foto" />
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="kdmobil">Kode Mobil</Label>
                                            <Input id="kdmobil" value={mobil.kdmobil} readOnly className="bg-muted font-semibold" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nama_mobil">
                                                Nama Mobil <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="nama_mobil"
                                                value={data.nama_mobil}
                                                onChange={(e) => { setData('nama_mobil', e.target.value); setClientErrors((p) => ({ ...p, nama_mobil: '' })); }}
                                                className={inputClass('nama_mobil')}
                                            />
                                            <ErrorMsg field="nama_mobil" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="plat_mobil">
                                                Plat Nomor <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="plat_mobil"
                                                value={data.plat_mobil}
                                                onChange={(e) => { setData('plat_mobil', e.target.value); setClientErrors((p) => ({ ...p, plat_mobil: '' })); }}
                                                className={inputClass('plat_mobil')}
                                            />
                                            <ErrorMsg field="plat_mobil" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="warna_mobil">
                                                Warna Mobil <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="warna_mobil"
                                                value={data.warna_mobil}
                                                onChange={(e) => { setData('warna_mobil', e.target.value); setClientErrors((p) => ({ ...p, warna_mobil: '' })); }}
                                                className={inputClass('warna_mobil')}
                                            />
                                            <ErrorMsg field="warna_mobil" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="stnk_mobil">
                                                Nomor STNK <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="stnk_mobil"
                                                value={data.stnk_mobil}
                                                onChange={(e) => { setData('stnk_mobil', e.target.value); setClientErrors((p) => ({ ...p, stnk_mobil: '' })); }}
                                                className={inputClass('stnk_mobil')}
                                            />
                                            <ErrorMsg field="stnk_mobil" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kdkategori">
                                                Kategori <span className="text-red-500">*</span>
                                            </Label>
                                            <Select value={data.kdkategori} onValueChange={(value) => { setData('kdkategori', value); setClientErrors((p) => ({ ...p, kdkategori: '' })); }}>
                                                <SelectTrigger className={inputClass('kdkategori')}>
                                                    <SelectValue placeholder="Pilih Kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kategoris.map((k) => (
                                                        <SelectItem key={k.kdkategori} value={k.kdkategori}>
                                                            {k.nama_kategori}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <ErrorMsg field="kdkategori" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="harga">
                                                Harga Sewa / Hari (Rp) <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="harga"
                                                type="number"
                                                value={data.harga}
                                                onChange={(e) => { setData('harga', e.target.value ? parseInt(e.target.value) : 0); setClientErrors((p) => ({ ...p, harga: '' })); }}
                                                className={inputClass('harga')}
                                            />
                                            <ErrorMsg field="harga" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="thn_mobil">
                                                Tahun <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="thn_mobil"
                                                type="number"
                                                value={data.thn_mobil}
                                                onChange={(e) => { setData('thn_mobil', e.target.value ? parseInt(e.target.value) : new Date().getFullYear()); setClientErrors((p) => ({ ...p, thn_mobil: '' })); }}
                                                className={inputClass('thn_mobil')}
                                            />
                                            <ErrorMsg field="thn_mobil" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Tersedia">Tersedia</SelectItem>
                                                    <SelectItem value="Perawatan">Perawatan</SelectItem>
                                                    <SelectItem value="Disewa">Disewa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-6">
                                <Button variant="outline" asChild>
                                    <Link href="/mobil">Batal</Link>
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
                        <DialogTitle>Simpan Perubahan?</DialogTitle>
                        <DialogDescription>
                            Data mobil <span className="font-semibold">{mobil.nama_mobil}</span> akan diperbarui. Pastikan perubahan yang Anda buat sudah benar.
                        </DialogDescription>
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
