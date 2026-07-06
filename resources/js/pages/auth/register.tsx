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
        <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
            <Head title="Daftar Akun Baru" />

            <Card className="w-full max-w-2xl rounded-none border-white/10 bg-[#202020]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl uppercase text-white">Bergabung Bersama Kami</CardTitle>
                    <CardDescription className="text-[#7D7D7D]">Daftarkan akun Anda untuk mulai menyewa mobil</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={submit} encType="multipart/form-data" className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="email@anda.com"
                                    className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-white">Username *</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="username_anda"
                                    className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                />
                                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama_lengkap" className="text-white">Nama Lengkap *</Label>
                                <Input
                                    id="nama_lengkap"
                                    type="text"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    required
                                    placeholder="Nama lengkap Anda"
                                    className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                />
                                {errors.nama_lengkap && <p className="text-sm text-red-500">{errors.nama_lengkap}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Jenis Kelamin *</Label>
                                <Select value={data.jenis_kelamin} onValueChange={(val) => setData('jenis_kelamin', val)}>
                                    <SelectTrigger className="rounded-none border-white/10 bg-black text-white">
                                        <SelectValue placeholder="Pilih jenis kelamin" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#202020] border-white/10">
                                        <SelectItem value="L" className="text-white hover:bg-white/10">Laki-laki</SelectItem>
                                        <SelectItem value="P" className="text-white hover:bg-white/10">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenis_kelamin && <p className="text-sm text-red-500">{errors.jenis_kelamin}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alamat" className="text-white">Alamat *</Label>
                                <Input
                                    id="alamat"
                                    type="text"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    required
                                    placeholder="Jl. Contoh No. 1, Kota"
                                    className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                />
                                {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nohp" className="text-white">No. HP *</Label>
                                <Input
                                    id="nohp"
                                    type="tel"
                                    value={data.nohp}
                                    onChange={(e) => setData('nohp', e.target.value)}
                                    required
                                    placeholder="08xxxxxxxxxx"
                                    maxLength={15}
                                    className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                />
                                {errors.nohp && <p className="text-sm text-red-500">{errors.nohp}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">Kata Sandi *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    placeholder="Min. 8 karakter"
                                    className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-white">Konfirmasi Sandi *</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    placeholder="Ulangi kata sandi"
                                    className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="foto" className="text-white">Foto Profil *</Label>
                            <div
                                onClick={() => fotoRef.current?.click()}
                                className="flex cursor-pointer items-center gap-3 border-2 border-dashed border-white/10 p-4 transition-colors hover:border-[#FFC000]/50 hover:bg-white/5"
                            >
                                <Upload className="h-5 w-5 text-[#7D7D7D]" />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {data.foto ? data.foto.name : 'Klik untuk upload foto profil'}
                                    </p>
                                    <p className="text-xs text-[#7D7D7D]">JPG, PNG, GIF — Maks. 2 MB</p>
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
                            {errors.foto && <p className="text-sm text-red-500">{errors.foto}</p>}
                        </div>

                        <Button type="submit" className="w-full rounded-none bg-[#FFC000] text-black hover:bg-[#917300]" disabled={processing}>
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
                    <p className="text-sm text-[#7D7D7D]">
                        Sudah memiliki akun?{' '}
                        <Link href="/login" className="font-semibold text-[#FFC000] hover:text-[#917300] hover:underline">
                            Masuk ke Akun
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
