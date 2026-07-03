import GuestLayout from '@/layouts/guest-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2, UserPlus, Upload } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        username: string;
        nama_lengkap: string;
        jenis_kelamin: string;
        alamat: string;
        nohp: string;
        password: string;
        password_confirmation: string;
        foto: File | null;
    }>({
        email: '',
        username: '',
        nama_lengkap: '',
        jenis_kelamin: '',
        alamat: '',
        nohp: '',
        password: '',
        password_confirmation: '',
        foto: null,
    });

    const fotoRef = useRef<HTMLInputElement>(null);

    const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('foto', file);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun Baru" />

            <div className="flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Bergabung Bersama Kami</CardTitle>
                        <CardDescription>Daftarkan akun Anda untuk mulai menyewa mobil</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} encType="multipart/form-data" className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                        placeholder="email@anda.com"
                                    />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username *</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="username_anda"
                                    />
                                    {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                                    <Input
                                        id="nama_lengkap"
                                        type="text"
                                        value={data.nama_lengkap}
                                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                                        required
                                        placeholder="Nama lengkap Anda"
                                    />
                                    {errors.nama_lengkap && <p className="text-sm text-destructive">{errors.nama_lengkap}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Jenis Kelamin *</Label>
                                    <Select value={data.jenis_kelamin} onValueChange={(val) => setData('jenis_kelamin', val)}>
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
                                    <Label htmlFor="alamat">Alamat *</Label>
                                    <Input
                                        id="alamat"
                                        type="text"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        required
                                        placeholder="Jl. Contoh No. 1, Kota"
                                    />
                                    {errors.alamat && <p className="text-sm text-destructive">{errors.alamat}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nohp">No. HP *</Label>
                                    <Input
                                        id="nohp"
                                        type="tel"
                                        value={data.nohp}
                                        onChange={(e) => setData('nohp', e.target.value)}
                                        required
                                        placeholder="08xxxxxxxxxx"
                                        maxLength={15}
                                    />
                                    {errors.nohp && <p className="text-sm text-destructive">{errors.nohp}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Kata Sandi *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        placeholder="Min. 8 karakter"
                                    />
                                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Sandi *</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        placeholder="Ulangi kata sandi"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foto">Foto Profil *</Label>
                                <div
                                    onClick={() => fotoRef.current?.click()}
                                    className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-primary hover:bg-muted/50"
                                >
                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            {data.foto ? data.foto.name : 'Klik untuk upload foto profil'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">JPG, PNG, GIF — Maks. 2 MB</p>
                                    </div>
                                </div>
                                <Input
                                    ref={fotoRef}
                                    id="foto"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/gif"
                                    onChange={handleFoto}
                                    className="hidden"
                                    required
                                />
                                {errors.foto && <p className="text-sm text-destructive">{errors.foto}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <UserPlus />
                                )}
                                {processing ? 'Mendaftarkan...' : 'DAFTAR SEKARANG'}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Sudah memiliki akun?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Masuk ke Akun
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </GuestLayout>
    );
}
