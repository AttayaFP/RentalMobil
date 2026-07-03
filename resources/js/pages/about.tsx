import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Car, Shield, Users, Award } from 'lucide-react';
import React from 'react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/use-animation';

export default function About() {
    const aboutRef = useScrollReveal();
    const valuesRef = useStaggerReveal();
    const ctaRef = useScrollReveal();

    return (
        <>
            <Head title="Tentang Kami - Rental Mobil Nabil Padang" />

            <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="hero-title text-4xl font-extrabold text-white">Tentang Kami</h1>
                    <p className="hero-sub mt-2 text-emerald-100">
                        <Link href="/" className="hover:underline">Beranda</Link> / Tentang Kami
                    </p>
                </div>
            </section>

            <section ref={aboutRef} className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <div className="reveal flex h-80 items-center justify-center rounded-lg bg-emerald-100">
                            <Car className="h-24 w-24 text-emerald-600" />
                        </div>
                        <div className="reveal">
                            <p className="text-sm font-semibold text-emerald-600">Selamat Datang di Rental Mobil Nabil Padang</p>
                            <h2 className="mt-2 text-3xl font-bold">Perusahaan Rental Mobil Terpercaya</h2>
                            <p className="mt-4 text-muted-foreground">
                                Kami adalah penyedia layanan transportasi terkemuka yang berkomitmen untuk memberikan pengalaman berkendara yang aman, nyaman, dan terjangkau bagi semua pelanggan kami. Dengan mobil yang terawat dengan baik dan pelayanan pelanggan yang ramah, kami siap mendukung perjalanan Anda.
                            </p>
                            <p className="mt-3 text-muted-foreground">
                                Visi kami adalah menjadi pilihan utama dalam layanan penyewaan kendaraan dengan mengedepankan kualitas dan integritas.
                            </p>
                            <Button className="mt-6" asChild>
                                <Link href="/cars">Lihat Mobil Kami</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={valuesRef} className="bg-muted/30 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-3">
                        <div className="stagger-item rounded-lg bg-white p-6 text-center shadow-sm">
                            <Shield className="mx-auto h-10 w-10 text-emerald-600" />
                            <h3 className="mt-4 text-lg font-bold">Terpercaya</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Ribuan pelanggan telah mempercayai layanan kami.</p>
                        </div>
                        <div className="stagger-item rounded-lg bg-white p-6 text-center shadow-sm">
                            <Users className="mx-auto h-10 w-10 text-emerald-600" />
                            <h3 className="mt-4 text-lg font-bold">Profesional</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Tim kami terdiri dari tenaga kerja berpengalaman.</p>
                        </div>
                        <div className="stagger-item rounded-lg bg-white p-6 text-center shadow-sm">
                            <Award className="mx-auto h-10 w-10 text-emerald-600" />
                            <h3 className="mt-4 text-lg font-bold">Berkualitas</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Armada mobil terawat dan selalu dalam kondisi prima.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={ctaRef} className="bg-emerald-700 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="reveal mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold text-white">Ingin Menjadi Bagian dari Perjalanan Kami?</h2>
                        <p className="mt-4 text-emerald-100">
                            Hubungi kami sekarang untuk mendapatkan penawaran terbaik khusus untuk perjalanan Anda berikutnya.
                        </p>
                        <Button className="mt-6 bg-white text-emerald-700 hover:bg-emerald-50" asChild>
                            <Link href="/contact">Hubungi Kami</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

About.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
