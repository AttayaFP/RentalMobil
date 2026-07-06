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

            <section className="bg-black py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold uppercase tracking-wide text-white">Layanan Kami</h1>
                    <p className="mt-2 text-[#7D7D7D]">
                        <Link href="/" className="text-[#FFC000] hover:text-[#917300] hover:underline">
                            Beranda
                        </Link>{' '}
                        / Layanan
                    </p>
                </div>
            </section>

            <section ref={cardsRef} className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div ref={headerRef} className="reveal mb-10 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#FFC000]">Apa yang Kami Tawarkan</p>
                        <h2 className="mt-2 text-3xl font-bold uppercase text-white">Layanan Transportasi Terbaik</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Card key={item.title} className="stagger-item rounded-none border-white/10 bg-[#202020] text-center">
                                    <CardContent className="p-6">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#181818]">
                                            <Icon className="h-8 w-8 text-[#FFC000]" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-bold uppercase text-white">{item.title}</h3>
                                        <p className="mt-2 text-sm text-[#7D7D7D]">{item.desc}</p>
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
