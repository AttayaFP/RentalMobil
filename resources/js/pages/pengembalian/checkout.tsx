import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengembalian', href: '/pengembalian' },
    { title: 'Checkout', href: '#' },
];

interface Pengembalian {
    kdpengembalian: string;
    denda: number;
}

interface Props {
    pengembalian: Pengembalian;
    snap_token: string;
    client_key: string;
    is_production: boolean;
}

declare global {
    interface Window {
        snap: {
            pay: (
                token: string,
                options?: {
                    onSuccess?: (result: unknown) => void;
                    onPending?: (result: unknown) => void;
                    onError?: (result: unknown) => void;
                    onClose?: () => void;
                },
            ) => void;
        };
    }
}

export default function Checkout({ pengembalian, snap_token, client_key, is_production }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const user = auth?.user;
    const isPelanggan = user?.role === 'pelanggan';

    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error' | 'none'>('none');
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    useEffect(() => {
        const midtransScriptUrl = is_production
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js';

        let script = document.querySelector('script[id="midtrans-script"]') as HTMLScriptElement;
        if (!script) {
            script = document.createElement('script');
            script.id = 'midtrans-script';
            script.src = midtransScriptUrl;
            script.setAttribute('data-client-key', client_key);
            script.async = true;
            script.onload = () => setIsScriptLoaded(true);
            document.body.appendChild(script);
        } else {
            setIsScriptLoaded(true);
        }
    }, [client_key, is_production]);

    const handlePay = useCallback(() => {
        if (window.snap) {
            window.snap.pay(snap_token, {
                onSuccess: function (result: unknown) {
                    setPaymentStatus('success');
                    axios.post(`/pengembalian/${pengembalian.kdpengembalian}/success`, result)
                        .then(() => {
                            router.visit(isPelanggan ? '/' : '/pengembalian');
                        });
                },
                onPending: function () {
                    setPaymentStatus('pending');
                },
                onError: function () {
                    setPaymentStatus('error');
                },
                onClose: function () {
                    setPaymentStatus('none');
                },
            });
        } else {
            toast.error('Gerbang pembayaran Midtrans belum siap. Silakan tunggu sebentar.');
        }
    }, [snap_token, pengembalian.kdpengembalian, isPelanggan]);

    useEffect(() => {
        if (isScriptLoaded) {
            const timer = setTimeout(() => {
                handlePay();
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isScriptLoaded, handlePay]);

    const content = (
        <div className="mx-auto max-w-lg">
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CreditCard className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Pembayaran Denda</CardTitle>
                    <CardDescription>
                        Kode Pengembalian:{' '}
                        <Badge variant="secondary">{pengembalian.kdpengembalian}</Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg border border-dashed bg-muted/50 p-6 text-center">
                        <p className="text-xs font-medium uppercase text-muted-foreground">Total Denda</p>
                        <p className="mt-1 text-3xl font-bold">{formatCurrency(pengembalian.denda)}</p>
                    </div>

                    {paymentStatus === 'none' && (
                        <div className="space-y-3 text-center">
                            <p className="text-sm text-muted-foreground">Gerbang pembayaran Midtrans sedang disiapkan...</p>
                            <Button onClick={handlePay} className="w-full" size="lg">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Bayar Sekarang
                            </Button>
                        </div>
                    )}

                    {paymentStatus === 'pending' && (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
                            <p className="font-semibold">Menunggu Pembayaran</p>
                            <p className="text-sm text-muted-foreground">Silakan selesaikan transaksi pada jendela Midtrans.</p>
                        </div>
                    )}

                    {paymentStatus === 'success' && (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                            <p className="text-lg font-semibold">Pembayaran Berhasil!</p>
                            <p className="text-sm text-muted-foreground">Mohon tunggu, Anda akan diarahkan...</p>
                        </div>
                    )}

                    {paymentStatus === 'error' && (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <XCircle className="h-16 w-16 text-destructive" />
                            <p className="text-lg font-semibold">Pembayaran Gagal</p>
                            <p className="text-sm text-muted-foreground">Terjadi kesalahan. Silakan coba kembali.</p>
                            <Button onClick={handlePay} variant="outline">
                                Coba Lagi
                            </Button>
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={isPelanggan ? '/' : '/pengembalian'}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    if (isPelanggan) {
        return (
            <div className="min-h-screen bg-muted/30">
                <Head title="Checkout Pembayaran Denda" />
                <div className="container mx-auto px-4 py-24">
                    {content}
                </div>
            </div>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Checkout Pembayaran Denda" />
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 rounded-xl p-4">
                {content}
            </div>
        </AppLayout>
    );
}
