import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn, Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
            <Head title="Masuk Akun" />

            <Card className="w-full max-w-md rounded-none border-white/10 bg-[#202020]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl uppercase text-white">Selamat Datang</CardTitle>
                    <CardDescription className="text-[#7D7D7D]">Masuk untuk mengelola pesanan Anda</CardDescription>
                </CardHeader>

                <CardContent>
                    {status && (
                        <div className="mb-4 border border-[#FFC000]/30 bg-[#181818] p-3 text-center text-sm text-[#FFC000]">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="login" className="text-white">Username atau Email</Label>
                            <Input
                                id="login"
                                type="text"
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                                required
                                autoFocus
                                autoComplete="username"
                                placeholder="username atau email@anda.com"
                                className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                            />
                            {errors.login && <p className="text-sm text-red-500">{errors.login}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-white">Kata Sandi</Label>
                                {canResetPassword && (
                                    <Link href="/forgot-password" className="text-xs text-[#7D7D7D] hover:text-[#FFC000]">
                                        Lupa sandi?
                                    </Link>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded-none border-white/10 bg-black"
                            />
                            <Label htmlFor="remember" className="text-sm font-normal text-[#7D7D7D]">
                                Ingat Saya
                            </Label>
                        </div>

                        <Button type="submit" className="w-full rounded-none bg-[#FFC000] text-black hover:bg-[#917300]" disabled={processing}>
                            {processing ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <LogIn />
                            )}
                            {processing ? 'Menyambungkan...' : 'MASUK SEKARANG'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-[#7D7D7D]">
                        Belum memiliki akun?{' '}
                        <Link href="/register" className="font-semibold text-[#FFC000] hover:text-[#917300] hover:underline">
                            Daftar Akun Baru
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
