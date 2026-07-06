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

interface Props {
    kategoris: Kategori[];
    next_kdmobil: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mobil', href: '/mobil' },
    { title: 'Tambah', href: '/mobil/create' },
];

export default function Create({ kategoris, next_kdmobil }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        kdmobil: next_kdmobil,
        nama_mobil: '',
        thn_mobil: new Date().getFullYear(),
        plat_mobil: '',
        warna_mobil: '',
        stnk_mobil: '',
        harga: 0,
        kdkategori: '',
        status: 'Tersedia',
        foto: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        post('/mobil', {
            onSuccess: () => {
                toast.success('Mobil berhasil ditambahkan.');
            },
            onError: () => {
                toast.error('Gagal menambahkan mobil. Periksa kembali data Anda.');
            },
            onFinish: () => {
                setShowConfirm(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Mobil" />
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
                                <CardTitle>Tambah Mobil Baru</CardTitle>
                                <CardDescription>Lengkapi data mobil untuk menambahkannya ke armada</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="foto">Foto Mobil</Label>
                                    <div className="relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 transition-colors hover:border-primary/50">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="h-full w-full rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <Upload className="h-8 w-8" />
                                                <span className="text-sm">Klik untuk pilih foto</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    {errors.foto && <p className="text-sm text-destructive">{errors.foto}</p>}
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="kdmobil">Kode Mobil</Label>
                                            <Input id="kdmobil" value={data.kdmobil} readOnly className="bg-muted font-semibold" />
                                            {errors.kdmobil && <p className="text-sm text-destructive">{errors.kdmobil}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nama_mobil">Nama Mobil</Label>
                                            <Input
                                                id="nama_mobil"
                                                placeholder="Toyota Avanza"
                                                value={data.nama_mobil}
                                                onChange={(e) => setData('nama_mobil', e.target.value)}
                                            />
                                            {errors.nama_mobil && <p className="text-sm text-destructive">{errors.nama_mobil}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="plat_mobil">Plat Nomor</Label>
                                            <Input
                                                id="plat_mobil"
                                                placeholder="B 1234 ABC"
                                                value={data.plat_mobil}
                                                onChange={(e) => setData('plat_mobil', e.target.value)}
                                            />
                                            {errors.plat_mobil && <p className="text-sm text-destructive">{errors.plat_mobil}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="warna_mobil">Warna Mobil</Label>
                                            <Input
                                                id="warna_mobil"
                                                placeholder="Hitam Metalik"
                                                value={data.warna_mobil}
                                                onChange={(e) => setData('warna_mobil', e.target.value)}
                                            />
                                            {errors.warna_mobil && <p className="text-sm text-destructive">{errors.warna_mobil}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="stnk_mobil">Nomor STNK</Label>
                                            <Input
                                                id="stnk_mobil"
                                                placeholder="12345678"
                                                value={data.stnk_mobil}
                                                onChange={(e) => setData('stnk_mobil', e.target.value)}
                                            />
                                            {errors.stnk_mobil && <p className="text-sm text-destructive">{errors.stnk_mobil}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kdkategori">Kategori</Label>
                                            <Select value={data.kdkategori} onValueChange={(value) => setData('kdkategori', value)}>
                                                <SelectTrigger>
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
                                            {errors.kdkategori && <p className="text-sm text-destructive">{errors.kdkategori}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="harga">Harga Sewa / Hari (Rp)</Label>
                                            <Input
                                                id="harga"
                                                type="number"
                                                value={data.harga}
                                                onChange={(e) => setData('harga', e.target.value ? parseInt(e.target.value) : 0)}
                                            />
                                            {errors.harga && <p className="text-sm text-destructive">{errors.harga}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="thn_mobil">Tahun</Label>
                                            <Input
                                                id="thn_mobil"
                                                type="number"
                                                value={data.thn_mobil}
                                                onChange={(e) => setData('thn_mobil', e.target.value ? parseInt(e.target.value) : new Date().getFullYear())}
                                            />
                                            {errors.thn_mobil && <p className="text-sm text-destructive">{errors.thn_mobil}</p>}
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
                                    {processing ? 'Menyimpan...' : 'Simpan Mobil'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Simpan Mobil Baru?</DialogTitle>
                        <DialogDescription>
                            Pastikan data yang Anda masukkan sudah benar. Mobil baru akan ditambahkan ke dalam daftar armada.
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
