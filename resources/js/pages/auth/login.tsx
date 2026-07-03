import GuestLayout from '@/layouts/guest-layout';
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
        <GuestLayout>
            <Head title="Masuk Akun" />

            <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Selamat Datang</CardTitle>
                        <CardDescription>Masuk untuk mengelola pesanan Anda</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {status && (
                            <div className="mb-4 rounded-md bg-emerald-50 p-3 text-center text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login">Username atau Email</Label>
                                <Input
                                    id="login"
                                    type="text"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    placeholder="username atau email@anda.com"
                                />
                                {errors.login && <p className="text-sm text-destructive">{errors.login}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Kata Sandi</Label>
                                    {canResetPassword && (
                                        <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
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
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-input"
                                />
                                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                                    Ingat Saya
                                </Label>
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
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
                        <p className="text-sm text-muted-foreground">
                            Belum memiliki akun?{' '}
                            <Link href="/register" className="font-semibold text-primary hover:underline">
                                Daftar Akun Baru
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </GuestLayout>
    );
}
