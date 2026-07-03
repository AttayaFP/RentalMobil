import GuestLayout from '@/layouts/guest-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Handshake, CalendarCheck } from 'lucide-react';
import React from 'react';
import { useHeroAnimation, useScrollReveal, useStaggerReveal } from '@/hooks/use-animation';
import heroBg from '@/assets/images/logo.jpg';

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    thn_mobil: number;
    plat_mobil: string;
    warna_mobil: string;
    harga: number;
    kdkategori: string;
    status: string;
    foto: string | null;
}

interface Props {
    mobils: Mobil[];
}

export default function Welcome({ mobils = [] }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; role: string; nama_lengkap?: string; name?: string } | null } }>().props;
    const user = auth?.user;
    const heroRef = useHeroAnimation();
    const middleRef = useScrollReveal();
    const carsRef = useStaggerReveal();

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const handleSewaClick = (kdmobil?: string) => {
        if (!user) {
            router.visit('/login');
        } else if (user.role === 'pelanggan') {
            router.visit(`/booking/create${kdmobil ? '?kdmobil=' + kdmobil : ''}`);
        } else {
            router.visit('/booking');
        }
    };

    return (
        <>
            <Head title="Rental Mobil Nabil Padang" />

            <section
                ref={heroRef}
                className="relative overflow-hidden"
                style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="hero-title text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Cara Cepat &amp; Mudah Menyewa Mobil
                        </h1>
                        <p className="hero-sub mt-6 text-lg text-emerald-100 sm:text-xl">
                            Temukan mobil terbaik untuk perjalanan Anda dengan harga yang sangat kompetitif dan pelayanan prima.
                        </p>
                        <div className="hero-cta mt-8">
                            <Button
                                size="lg"
                                className="rounded-full bg-white px-8 text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleSewaClick()}
                            >
                                Pesan Mobil Sekarang
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={middleRef} className="bg-muted/30 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="reveal rounded-lg bg-emerald-600 p-8 text-white">
                            <h2 className="text-xl font-bold">Rencanakan Perjalanan</h2>
                            <p className="mt-2 text-emerald-100">Temukan mobil yang sesuai dengan kebutuhan Anda.</p>
                            <Button
                                className="mt-6 w-full rounded-lg bg-white text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleSewaClick()}
                            >
                                Cek Ketersediaan Mobil
                            </Button>
                        </div>
                        <div className="reveal rounded-lg bg-white p-8 shadow-sm">
                            <h3 className="text-lg font-bold">Sewa Mobil Impian Anda Sekarang</h3>
                            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <MapPin className="mx-auto h-8 w-8 text-emerald-600" />
                                    <p className="mt-2 text-sm font-medium">Pilih Lokasi</p>
                                </div>
                                <div>
                                    <Handshake className="mx-auto h-8 w-8 text-emerald-600" />
                                    <p className="mt-2 text-sm font-medium">Penawaran Terbaik</p>
                                </div>
                                <div>
                                    <CalendarCheck className="mx-auto h-8 w-8 text-emerald-600" />
                                    <p className="mt-2 text-sm font-medium">Pesan Mobil</p>
                                </div>
                            </div>
                            <Button
                                className="mt-6 w-full"
                                onClick={() => handleSewaClick()}
                            >
                                Mulai Sewa Sekarang
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={carsRef} className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="reveal mb-10 text-center">
                        <h2 className="text-3xl font-bold">Mobil Unggulan</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {mobils.length > 0 ? (
                            mobils.slice(0, 6).map((mobil) => (
                                <Card key={mobil.kdmobil} className="stagger-item overflow-hidden">
                                    <div className="relative h-48 w-full bg-muted">
                                        <img
                                            src={mobil.foto ? `/storage/${mobil.foto}` : '/img/car-placeholder.png'}
                                            alt={mobil.nama_mobil}
                                            className="h-full w-full object-cover"
                                        />
                                        <Badge
                                            variant={mobil.status === 'Tersedia' ? 'success' : 'destructive'}
                                            className="absolute left-3 top-3"
                                        >
                                            {mobil.status}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="text-lg font-bold">{mobil.nama_mobil}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {mobil.thn_mobil} &middot; {mobil.warna_mobil}
                                        </p>
                                        <p className="mt-2 text-lg font-semibold text-emerald-600">
                                            {formatCurrency(mobil.harga)}
                                            <span className="text-sm font-normal text-muted-foreground"> /hari</span>
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Button
                                            className="w-full"
                                            disabled={mobil.status !== 'Tersedia'}
                                            onClick={() => mobil.status === 'Tersedia' && handleSewaClick(mobil.kdmobil)}
                                        >
                                            {mobil.status === 'Tersedia' ? 'Sewa' : 'Tidak Tersedia'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-muted-foreground">
                                Tidak ada mobil tersedia saat ini.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
