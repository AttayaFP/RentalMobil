import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Settings', href: '#' },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Kata sandi berhasil diperbarui.');
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ganti Password" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Perbarui Kata Sandi</CardTitle>
                        <CardDescription>Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={updatePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">Kata Sandi Saat Ini</Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    ref={currentPasswordInput}
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                {errors.current_password && <p className="text-sm text-destructive">{errors.current_password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Kata Sandi Baru</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi Baru</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation}</p>}
                            </div>

                            <div className="pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? <Loader2 className="animate-spin" /> : <Save />}
                                    {processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
