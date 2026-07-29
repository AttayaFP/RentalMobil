import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2, UserPlus, Upload } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

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
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('foto', file);
        setClientErrors((prev) => ({ ...prev, foto: '' }));
    };

    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (!data.email.trim()) errs.email = 'Email wajib diisi.';
        if (!data.username.trim()) errs.username = 'Username wajib diisi.';
        if (!data.nama_lengkap.trim()) errs.nama_lengkap = 'Nama lengkap wajib diisi.';
        if (!data.jenis_kelamin) errs.jenis_kelamin = 'Jenis kelamin wajib dipilih.';
        if (!data.alamat.trim()) errs.alamat = 'Alamat wajib diisi.';
        if (!data.nohp.trim()) errs.nohp = 'Nomor HP wajib diisi.';
        if (!data.password.trim()) errs.password = 'Kata sandi wajib diisi.';
        if (!data.password_confirmation.trim()) errs.password_confirmation = 'Konfirmasi kata sandi wajib diisi.';
        if (!data.foto) errs.foto = 'Foto profil wajib diunggah.';

        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!validate()) return;
        post('/register', {
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const getError = (field: string) => errors[field as keyof typeof errors] || clientErrors[field] || '';

    const inputClass = (field: string) =>
        `rounded-none bg-black text-white placeholder:text-[#7D7D7D] ${getError(field) ? 'border-red-500 focus-visible:ring-red-500' : 'border-white/10'}`;

    const ErrorMsg = ({ field }: { field: string }) => {
        const msg = getError(field);
        if (!msg) return null;
        return (
            <p className="flex items-center gap-1.5 text-sm text-red-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                {msg}
            </p>
        );
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
                                <Label htmlFor="email" className="text-white">
                                    Email <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => { setData('email', e.target.value); setClientErrors((p) => ({ ...p, email: '' })); }}
                                    autoComplete="email"
                                    placeholder="email@anda.com"
                                    className={inputClass('email')}
                                />
                                <ErrorMsg field="email" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-white">
                                    Username <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => { setData('username', e.target.value); setClientErrors((p) => ({ ...p, username: '' })); }}
                                    autoComplete="username"
                                    placeholder="username_anda"
                                    className={inputClass('username')}
                                />
                                <ErrorMsg field="username" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama_lengkap" className="text-white">
                                    Nama Lengkap <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="nama_lengkap"
                                    type="text"
                                    value={data.nama_lengkap}
                                    onChange={(e) => { setData('nama_lengkap', e.target.value); setClientErrors((p) => ({ ...p, nama_lengkap: '' })); }}
                                    placeholder="Nama lengkap Anda"
                                    className={inputClass('nama_lengkap')}
                                />
                                <ErrorMsg field="nama_lengkap" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">
                                    Jenis Kelamin <span className="text-red-400">*</span>
                                </Label>
                                <Select
                                    value={data.jenis_kelamin}
                                    onValueChange={(val) => { setData('jenis_kelamin', val); setClientErrors((p) => ({ ...p, jenis_kelamin: '' })); }}
                                >
                                    <SelectTrigger className={`rounded-none bg-black text-white ${getError('jenis_kelamin') ? 'border-red-500' : 'border-white/10'}`}>
                                        <SelectValue placeholder="Pilih jenis kelamin" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-[#202020]">
                                        <SelectItem value="L" className="text-white hover:bg-white/10">Laki-laki</SelectItem>
                                        <SelectItem value="P" className="text-white hover:bg-white/10">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                <ErrorMsg field="jenis_kelamin" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alamat" className="text-white">
                                    Alamat <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="alamat"
                                    type="text"
                                    value={data.alamat}
                                    onChange={(e) => { setData('alamat', e.target.value); setClientErrors((p) => ({ ...p, alamat: '' })); }}
                                    placeholder="Jl. Contoh No. 1, Kota"
                                    className={inputClass('alamat')}
                                />
                                <ErrorMsg field="alamat" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nohp" className="text-white">
                                    No. HP <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="nohp"
                                    type="tel"
                                    value={data.nohp}
                                    onChange={(e) => { setData('nohp', e.target.value); setClientErrors((p) => ({ ...p, nohp: '' })); }}
                                    placeholder="08xxxxxxxxxx"
                                    maxLength={15}
                                    className={inputClass('nohp')}
                                />
                                <ErrorMsg field="nohp" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">
                                    Kata Sandi <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => { setData('password', e.target.value); setClientErrors((p) => ({ ...p, password: '' })); }}
                                    autoComplete="new-password"
                                    placeholder="Min. 8 karakter"
                                    className={inputClass('password')}
                                />
                                <ErrorMsg field="password" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-white">
                                    Konfirmasi Sandi <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => { setData('password_confirmation', e.target.value); setClientErrors((p) => ({ ...p, password_confirmation: '' })); }}
                                    autoComplete="new-password"
                                    placeholder="Ulangi kata sandi"
                                    className={inputClass('password_confirmation')}
                                />
                                <ErrorMsg field="password_confirmation" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="foto" className="text-white">
                                Foto Profil <span className="text-red-400">*</span>
                            </Label>
                            <div
                                onClick={() => fotoRef.current?.click()}
                                className={`flex cursor-pointer items-center gap-3 border-2 border-dashed p-4 transition-colors hover:bg-white/5 ${getError('foto') ? 'border-red-500 hover:border-red-400' : 'border-white/10 hover:border-[#FFC000]/50'}`}
                            >
                                <Upload className={`h-5 w-5 ${getError('foto') ? 'text-red-400' : 'text-[#7D7D7D]'}`} />
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
                            />
                            <ErrorMsg field="foto" />
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
