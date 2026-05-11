import AdminLayout from '@/layouts/AdminLayout';
import TemplateLayout from '@/layouts/TemplateLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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
}

declare global {
    interface Window {
        snap: any;
    }
}

export default function Checkout({ booking, snap_token, client_key }: Props) {
    const { auth } = usePage<any>().props;
    const user = auth?.user;
    const isPelanggan = user?.role === 'pelanggan';

    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error' | 'none'>('none');

    useEffect(() => {
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
        const script = document.createElement('script');
        script.src = midtransScriptUrl;
        script.setAttribute('data-client-key', client_key);
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, [client_key]);

    const handlePay = () => {
        if (window.snap) {
            window.snap.pay(snap_token, {
                onSuccess: function (result: any) {
                    setPaymentStatus('success');
                    axios.post(`/booking/${booking.kdbooking}/success`, result)
                        .then(() => { router.get(`/booking/${booking.kdbooking}/invoice`); });
                },
                onPending: function (result: any) { setPaymentStatus('pending'); },
                onError: function (result: any) { setPaymentStatus('error'); },
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => { handlePay(); }, 1500);
        return () => clearTimeout(timer);
    }, [snap_token]);

    const content = (
        <div className="row justify-content-center">
            <div className="col-lg-6" data-aos="zoom-in">
                <div className="card shadow-lg border-0 text-center overflow-hidden" style={{ borderRadius: '20px' }}>
                    <div className="p-5 bg-dark text-white">
                        <div className="mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(249, 109, 0, 0.1)', border: '2px solid #f96d00' }}>
                            <i className="ion-ios-card" style={{ fontSize: '40px', color: '#f96d00' }}></i>
                        </div>
                        <h3 className="font-weight-bold mb-1">Konfirmasi Pembayaran</h3>
                        <p className="opacity-75 small">Kode Transaksi: <span className="font-weight-bold" style={{ color: '#f96d00' }}>{booking.kdbooking}</span></p>
                    </div>
                    
                    <div className="card-body p-5 bg-white">
                        <div className="p-4 mb-5 rounded-xl" style={{ backgroundColor: '#f8f9fa', border: '1px dashed #ddd' }}>
                            <p className="text-muted small text-uppercase font-weight-bold mb-2">Total yang Harus Dibayar</p>
                            <h2 className="font-weight-bold mb-0" style={{ color: '#222831' }}>
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(booking.total_bayar)}
                            </h2>
                        </div>

                        {paymentStatus === 'none' && (
                            <div className="animate__animated animate__fadeIn">
                                <p className="text-muted small mb-4">Gerbang pembayaran Midtrans sedang disiapkan...</p>
                                <button onClick={handlePay} className="btn btn-primary btn-block py-3 font-weight-bold shadow-sm" style={{ backgroundColor: '#f96d00', borderColor: '#f96d00', borderRadius: '10px' }}>
                                    BAYAR SEKARANG
                                </button>
                            </div>
                        )}

                        {paymentStatus === 'pending' && (
                            <div className="text-warning animate__animated animate__pulse animate__infinite">
                                <div className="spinner-border mb-3" role="status"></div>
                                <h5 className="font-weight-bold">Menunggu Pembayaran</h5>
                                <p className="small text-muted">Silakan selesaikan transaksi pada jendela Midtrans.</p>
                            </div>
                        )}

                        {paymentStatus === 'success' && (
                            <div className="text-success">
                                <i className="ion-ios-checkmark-circle mb-3 d-block" style={{ fontSize: '60px' }}></i>
                                <h4 className="font-weight-bold">Pembayaran Berhasil!</h4>
                                <p className="small text-muted">Mohon tunggu, Anda akan diarahkan ke halaman invoice...</p>
                            </div>
                        )}

                        <div className="mt-5 pt-4 border-top">
                            <Link href={isPelanggan ? "/" : "/booking"} className="btn btn-link text-muted small">
                                <i className="ion-ios-arrow-back mr-2"></i> Kembali
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isPelanggan) {
        return (
            <TemplateLayout showHero={false}>
                <section className="ftco-section bg-light py-5">
                    <div className="container">
                        {content}
                    </div>
                </section>
            </TemplateLayout>
        );
    }

    return (
        <AdminLayout title="Penyelesaian Pembayaran">
            <Head title="Checkout Pembayaran" />
            {content}
        </AdminLayout>
    );
}
