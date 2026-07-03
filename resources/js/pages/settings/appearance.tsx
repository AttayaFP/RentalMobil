import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Settings', href: '#' },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Tampilan" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Tema Aplikasi</CardTitle>
                        <CardDescription>Pilih tema yang paling nyaman untuk mata Anda saat mengelola operasional rental.</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <AppearanceTabs />

                        <p className="text-xs text-muted-foreground">
                            Pengaturan ini akan disimpan secara lokal di browser Anda.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
