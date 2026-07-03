import GuestLayout from '@/layouts/guest-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/use-animation';

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    thn_mobil: number;
    plat_mobil: string;
    warna_mobil: string;
    harga: number;
    foto: string | null;
    status: string;
}

interface Props {
    mobils: Mobil[];
}

export default function Cars({ mobils }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; role: string } | null } }>().props;
    const user = auth?.user;
    const headerRef = useScrollReveal();
    const gridRef = useStaggerReveal();

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const handleSewa = (kdmobil: string) => {
        if (!user) {
            router.visit('/login');
        } else if (user.role === 'pelanggan') {
            router.visit(`/booking/create?kdmobil=${kdmobil}`);
        } else {
            router.visit('/booking');
        }
    };

    return (
        <>
            <Head title="Mobil Kami - Rental Mobil Nabil Padang" />

            <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="hero-title text-4xl font-extrabold text-white">Mobil Kami</h1>
                    <p className="hero-sub mt-2 text-emerald-100">
                        <Link href="/" className="hover:underline">Beranda</Link> / Pilihan Mobil
                    </p>
                </div>
            </section>

            <section ref={gridRef} className="bg-muted/30 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div ref={headerRef} className="reveal mb-10 text-center">
                        <p className="text-sm font-semibold text-emerald-600">Pilihan Terbaik</p>
                        <h2 className="mt-2 text-3xl font-bold">Armada Kami</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {mobils.length > 0 ? (
                            mobils.map((mobil) => (
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
                                        <p className="text-sm text-muted-foreground">{mobil.plat_mobil}</p>
                                        <p className="mt-2 text-lg font-semibold text-emerald-600">
                                            {formatCurrency(mobil.harga)}
                                            <span className="text-sm font-normal text-muted-foreground"> /hari</span>
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Button
                                            className="w-full"
                                            disabled={mobil.status !== 'Tersedia'}
                                            onClick={() => mobil.status === 'Tersedia' && handleSewa(mobil.kdmobil)}
                                        >
                                            {mobil.status === 'Tersedia' ? 'Sewa Sekarang' : 'Tidak Tersedia'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-muted-foreground">
                                Maaf, saat ini tidak ada mobil yang tersedia untuk disewa.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

Cars.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
