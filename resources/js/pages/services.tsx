import { Card, CardContent } from '@/components/ui/card';
import { useScrollReveal, useStaggerReveal } from '@/hooks/use-animation';
import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Car, LifeBuoy } from 'lucide-react';
import React from 'react';

const services = [
    { title: 'Sewa Mobil Harian', icon: Car, desc: 'Pilihan sewa mobil harian dengan tarif yang sangat kompetitif.' },
    { title: 'Sewa Jangka Panjang', icon: Calendar, desc: 'Solusi transportasi untuk kebutuhan bulanan atau tahunan perusahaan.' },
    { title: 'Layanan Darurat 24/7', icon: LifeBuoy, desc: 'Bantuan darurat di jalan siap melayani Anda kapan saja.' },
];

export default function Services() {
    const headerRef = useScrollReveal();
    const cardsRef = useStaggerReveal();

    return (
        <>
            <Head title="Layanan Kami - Rental Mobil Nabil Padang" />

            <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="hero-title text-4xl font-extrabold text-white">Layanan Kami</h1>
                    <p className="hero-sub mt-2 text-emerald-100">
                        <Link href="/" className="hover:underline">
                            Beranda
                        </Link>{' '}
                        / Layanan
                    </p>
                </div>
            </section>

            <section ref={cardsRef} className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div ref={headerRef} className="reveal mb-10 text-center">
                        <p className="text-sm font-semibold text-emerald-600">Apa yang Kami Tawarkan</p>
                        <h2 className="mt-2 text-3xl font-bold">Layanan Transportasi Terbaik</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Card key={item.title} className="stagger-item text-center">
                                    <CardContent className="p-6">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                                            <Icon className="h-8 w-8 text-emerald-600" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                                        <p className="text-muted-foreground mt-2 text-sm">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

Services.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
