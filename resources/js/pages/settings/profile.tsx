import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Settings', href: '#' },
];

export default function Profile() {
    const { auth } = usePage<{ auth: { user: { nama_lengkap: string; email: string } } }>().props;

    const { data, setData, patch, errors, processing } = useForm({
        nama_lengkap: auth.user.nama_lengkap,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/settings/profile', {
            onSuccess: () => toast.success('Profil berhasil diperbarui.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profil Saya" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Informasi Profil</CardTitle>
                        <CardDescription>Perbarui informasi dasar akun Anda di sini.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                                <Input
                                    id="nama_lengkap"
                                    type="text"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    required
                                />
                                {errors.nama_lengkap && <p className="text-sm text-destructive">{errors.nama_lengkap}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>

                            <div className="pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? <Loader2 className="animate-spin" /> : <Save />}
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
