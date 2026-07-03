import BookingLayout from '@/layouts/booking-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, CheckCircle2, XCircle, Loader2, ArrowLeft, Clock } from 'lucide-react';
import axios from 'axios';

interface Booking {
    kdbooking: string;
    total_bayar: number;
    status: string;
}

interface Props {
    booking: Booking;
    snap_token: string;
    client_key: string;
    is_production?: boolean;
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Booking', href: '/booking' },
    { title: 'Checkout', href: '#' },
];

export default function Checkout({ booking, snap_token, client_key, is_production }: Props) {
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error' | 'none'>('none');
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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
                    toast.success('Pembayaran berhasil!');
                    axios.post(`/booking/${booking.kdbooking}/success`, result).then(() => {
                        router.get(`/booking/${booking.kdbooking}/invoice`);
                    });
                },
                onPending: function () {
                    setPaymentStatus('pending');
                    toast.info('Menunggu konfirmasi pembayaran.');
                },
                onError: function () {
                    setPaymentStatus('error');
                    toast.error('Pembayaran gagal.');
                },
                onClose: function () {
                    setPaymentStatus('none');
                },
            });
        } else {
            toast.error('Gerbang pembayaran Midtrans belum siap. Silakan tunggu sebentar.');
        }
    }, [snap_token, booking.kdbooking]);

    useEffect(() => {
        if (isScriptLoaded) {
            const timer = setTimeout(() => {
                handlePay();
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isScriptLoaded, handlePay]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    return (
        <BookingLayout breadcrumbs={breadcrumbs} title="Checkout Pembayaran">
            <div className="flex h-full flex-1 items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <CreditCard className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle>Konfirmasi Pembayaran</CardTitle>
                        <CardDescription>
                            Kode Transaksi: <span className="font-bold text-foreground">{booking.kdbooking}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-lg border border-dashed bg-muted/50 p-6 text-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Total yang Harus Dibayar
                            </p>
                            <p className="mt-2 text-3xl font-bold">{formatCurrency(booking.total_bayar)}</p>
                        </div>

                        {paymentStatus === 'none' && (
                            <div className="space-y-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    {isScriptLoaded
                                        ? 'Gerbang pembayaran Midtrans siap.'
                                        : 'Memuat gerbang pembayaran Midtrans...'}
                                </p>
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handlePay}
                                    disabled={!isScriptLoaded}
                                >
                                    {!isScriptLoaded && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Bayar Sekarang
                                </Button>
                            </div>
                        )}

                        {paymentStatus === 'pending' && (
                            <div className="flex flex-col items-center gap-3 py-4">
                                <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
                                <h3 className="text-lg font-bold">Menunggu Pembayaran</h3>
                                <p className="text-sm text-muted-foreground">
                                    Silakan selesaikan transaksi pada jendela Midtrans.
                                </p>
                            </div>
                        )}

                        {paymentStatus === 'success' && (
                            <div className="flex flex-col items-center gap-3 py-4">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                                <h3 className="text-lg font-bold">Pembayaran Berhasil!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Mohon tunggu, Anda akan diarahkan ke halaman invoice...
                                </p>
                            </div>
                        )}

                        {paymentStatus === 'error' && (
                            <div className="flex flex-col items-center gap-3 py-4">
                                <XCircle className="h-12 w-12 text-destructive" />
                                <h3 className="text-lg font-bold">Pembayaran Gagal</h3>
                                <p className="text-sm text-muted-foreground">
                                    Terjadi kesalahan saat memproses pembayaran.
                                </p>
                                <Button variant="outline" onClick={handlePay}>
                                    Coba Lagi
                                </Button>
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <Button variant="ghost" className="w-full" asChild>
                                <Link href="/booking">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </BookingLayout>
    );
}
