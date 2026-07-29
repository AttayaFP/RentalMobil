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
    pelanggan: Pelanggan;
}

export default function Edit({ pelanggan }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pelanggan', href: '/pelanggan' },
        { title: `Edit ${pelanggan.nama_lengkap}`, href: `/pelanggan/${pelanggan.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: pelanggan.nama_lengkap,
        username: pelanggan.username,
        email: pelanggan.email,
        password: '',
        password_confirmation: '',
        jenis_kelamin: pelanggan.jenis_kelamin,
        alamat: pelanggan.alamat,
        nohp: pelanggan.nohp,
        role: pelanggan.role || 'pelanggan',
        foto: null as File | null,
        _method: 'PUT',
    });

    const [preview, setPreview] = useState<string | null>(pelanggan.foto ? `/storage/${pelanggan.foto}` : null);
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

        if (!data.nama_lengkap.trim()) errs.nama_lengkap = 'Nama lengkap wajib diisi.';
        if (!data.username.trim()) errs.username = 'Username wajib diisi.';
        if (!data.email.trim()) errs.email = 'Email wajib diisi.';
        if (!data.jenis_kelamin) errs.jenis_kelamin = 'Jenis kelamin wajib dipilih.';
        if (!data.nohp.trim()) errs.nohp = 'Nomor HP wajib diisi.';
        if (!data.alamat.trim()) errs.alamat = 'Alamat wajib diisi.';
        if (!data.role) errs.role = 'Role wajib dipilih.';
        if (!preview) errs.foto = 'Foto profil wajib diunggah.';

        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        post(`/pelanggan/${pelanggan.id}`, {
            onSuccess: () => toast.success('Data pelanggan berhasil diperbarui'),
            onError: () => toast.error('Gagal memperbarui data pelanggan'),
            onFinish: () => setShowConfirm(false),
        });
    };

    const getError = (field: string) => errors[field as keyof typeof errors] || clientErrors[field] || '';

    const inputClass = (field: string) =>
        `${getError(field) ? 'border-red-500 focus-visible:ring-red-500' : ''}`;

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
            <Head title={`Edit ${pelanggan.nama_lengkap}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/pelanggan">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Pelanggan</h1>
                        <p className="text-sm text-muted-foreground">Perbarui informasi {pelanggan.nama_lengkap}</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Foto Profil</CardTitle>
                                <CardDescription>
                                    Klik foto untuk mengganti{' '}
                                    <span className="text-red-500">*</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4">
                                <label className="relative cursor-pointer">
                                    <Avatar className={`h-32 w-32 border-2 border-dashed ${getError('foto') ? 'border-red-500' : 'border-muted-foreground/25'}`}>
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
                                <ErrorMsg field="foto" />
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-base">Informasi Pengguna</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_lengkap">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama_lengkap"
                                        value={data.nama_lengkap}
                                        onChange={(e) => { setData('nama_lengkap', e.target.value); setClientErrors((p) => ({ ...p, nama_lengkap: '' })); }}
                                        className={inputClass('nama_lengkap')}
                                    />
                                    <ErrorMsg field="nama_lengkap" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">
                                        Role <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.role} onValueChange={(v) => { setData('role', v); setClientErrors((p) => ({ ...p, role: '' })); }}>
                                        <SelectTrigger className={inputClass('role')}>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pelanggan">Pelanggan</SelectItem>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                            <SelectItem value="pimpinan">Pimpinan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <ErrorMsg field="role" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">
                                        Username <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="username"
                                        value={data.username}
                                        onChange={(e) => { setData('username', e.target.value); setClientErrors((p) => ({ ...p, username: '' })); }}
                                        className={inputClass('username')}
                                    />
                                    <ErrorMsg field="username" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => { setData('email', e.target.value); setClientErrors((p) => ({ ...p, email: '' })); }}
                                        className={inputClass('email')}
                                    />
                                    <ErrorMsg field="email" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nohp">
                                        Nomor HP / WhatsApp <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nohp"
                                        value={data.nohp}
                                        onChange={(e) => { setData('nohp', e.target.value); setClientErrors((p) => ({ ...p, nohp: '' })); }}
                                        className={inputClass('nohp')}
                                    />
                                    <ErrorMsg field="nohp" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin">
                                        Jenis Kelamin <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.jenis_kelamin} onValueChange={(v) => { setData('jenis_kelamin', v); setClientErrors((p) => ({ ...p, jenis_kelamin: '' })); }}>
                                        <SelectTrigger className={inputClass('jenis_kelamin')}>
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">Laki-laki</SelectItem>
                                            <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <ErrorMsg field="jenis_kelamin" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password Baru</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kosongkan jika tidak diubah"
                                        className={inputClass('password')}
                                    />
                                    <ErrorMsg field="password" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Kosongkan jika tidak diubah"
                                        className={inputClass('password_confirmation')}
                                    />
                                    <ErrorMsg field="password_confirmation" />
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="alamat">
                                        Alamat Lengkap <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="alamat"
                                        rows={3}
                                        value={data.alamat}
                                        onChange={(e) => { setData('alamat', e.target.value); setClientErrors((p) => ({ ...p, alamat: '' })); }}
                                        className={inputClass('alamat')}
                                    />
                                    <ErrorMsg field="alamat" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/pelanggan">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Simpan Perubahan</DialogTitle>
                        <DialogDescription>Perubahan data pelanggan akan disimpan.</DialogDescription>
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
