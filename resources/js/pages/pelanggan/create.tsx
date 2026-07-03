import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pelanggan', href: '/pelanggan' },
    { title: 'Tambah', href: '/pelanggan/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        jenis_kelamin: '',
        alamat: '',
        nohp: '',
        role: 'pelanggan',
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
        post('/pelanggan', {
            onSuccess: () => toast.success('Pelanggan berhasil ditambahkan'),
            onError: () => toast.error('Gagal menambahkan pelanggan'),
            onFinish: () => setShowConfirm(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pelanggan" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/pelanggan">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Tambah Pelanggan Baru</h1>
                        <p className="text-sm text-muted-foreground">Lengkapi informasi profil pengguna</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Foto Profil</CardTitle>
                                <CardDescription>Klik foto untuk mengganti</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4">
                                <label className="relative cursor-pointer">
                                    <Avatar className="h-32 w-32 border-2 border-dashed border-muted-foreground/25">
                                        <AvatarImage src={preview || undefined} alt="Preview" />
                                        <AvatarFallback className="text-3xl">
                                            <Camera className="h-10 w-10 text-muted-foreground" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                                        <Camera className="h-4 w-4" />
                                    </div>
                                </label>
                                {errors.foto && <p className="text-sm text-destructive">{errors.foto}</p>}
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-base">Informasi Pengguna</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                                    <Input id="nama_lengkap" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)} required />
                                    {errors.nama_lengkap && <p className="text-sm text-destructive">{errors.nama_lengkap}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pelanggan">Pelanggan</SelectItem>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                            <SelectItem value="pimpinan">Pimpinan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" value={data.username} onChange={(e) => setData('username', e.target.value)} required />
                                    {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nohp">Nomor HP / WhatsApp</Label>
                                    <Input id="nohp" value={data.nohp} onChange={(e) => setData('nohp', e.target.value)} required />
                                    {errors.nohp && <p className="text-sm text-destructive">{errors.nohp}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                    <Select value={data.jenis_kelamin} onValueChange={(v) => setData('jenis_kelamin', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">Laki-laki</SelectItem>
                                            <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis_kelamin && <p className="text-sm text-destructive">{errors.jenis_kelamin}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="alamat">Alamat Lengkap</Label>
                                    <Textarea id="alamat" rows={3} value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} required />
                                    {errors.alamat && <p className="text-sm text-destructive">{errors.alamat}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/pelanggan">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Profil'}
                        </Button>
                    </div>
                </form>
            </div>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Simpan Pelanggan Baru</DialogTitle>
                        <DialogDescription>Pastikan data yang dimasukkan sudah benar.</DialogDescription>
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
