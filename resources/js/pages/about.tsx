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

            <section className="bg-black py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold uppercase tracking-wide text-white">Tentang Kami</h1>
                    <p className="mt-2 text-[#7D7D7D]">
                        <Link href="/" className="text-[#FFC000] hover:text-[#917300] hover:underline">Beranda</Link>
                        {' '}/ Tentang Kami
                    </p>
                </div>
            </section>

            <section ref={aboutRef} className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <div className="reveal flex h-80 items-center justify-center bg-[#202020]">
                            <Car className="h-24 w-24 text-[#FFC000]" />
                        </div>
                        <div className="reveal">
                            <p className="text-sm font-semibold uppercase tracking-wide text-[#FFC000]">Selamat Datang di Rental Mobil Nabil Padang</p>
                            <h2 className="mt-2 text-3xl font-bold uppercase text-white">Perusahaan Rental Mobil Terpercaya</h2>
                            <p className="mt-4 text-[#7D7D7D]">
                                Kami adalah penyedia layanan transportasi terkemuka yang berkomitmen untuk memberikan pengalaman berkendara yang aman, nyaman, dan terjangkau bagi semua pelanggan kami. Dengan mobil yang terawat dengan baik dan pelayanan pelanggan yang ramah, kami siap mendukung perjalanan Anda.
                            </p>
                            <p className="mt-3 text-[#7D7D7D]">
                                Visi kami adalah menjadi pilihan utama dalam layanan penyewaan kendaraan dengan mengedepankan kualitas dan integritas.
                            </p>
                            <Button className="mt-6 rounded-none bg-[#FFC000] text-black hover:bg-[#917300]" asChild>
                                <Link href="/cars">Lihat Mobil Kami</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={valuesRef} className="bg-[#181818] py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-3">
                        <div className="stagger-item border border-white/10 bg-[#202020] p-6 text-center">
                            <Shield className="mx-auto h-10 w-10 text-[#FFC000]" />
                            <h3 className="mt-4 text-lg font-bold uppercase text-white">Terpercaya</h3>
                            <p className="mt-2 text-sm text-[#7D7D7D]">Ribuan pelanggan telah mempercayai layanan kami.</p>
                        </div>
                        <div className="stagger-item border border-white/10 bg-[#202020] p-6 text-center">
                            <Users className="mx-auto h-10 w-10 text-[#FFC000]" />
                            <h3 className="mt-4 text-lg font-bold uppercase text-white">Profesional</h3>
                            <p className="mt-2 text-sm text-[#7D7D7D]">Tim kami terdiri dari tenaga kerja berpengalaman.</p>
                        </div>
                        <div className="stagger-item border border-white/10 bg-[#202020] p-6 text-center">
                            <Award className="mx-auto h-10 w-10 text-[#FFC000]" />
                            <h3 className="mt-4 text-lg font-bold uppercase text-white">Berkualitas</h3>
                            <p className="mt-2 text-sm text-[#7D7D7D]">Armada mobil terawat dan selalu dalam kondisi prima.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={ctaRef} className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="reveal mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold uppercase text-white">Ingin Menjadi Bagian dari Perjalanan Kami?</h2>
                        <p className="mt-4 text-[#7D7D7D]">
                            Hubungi kami sekarang untuk mendapatkan penawaran terbaik khusus untuk perjalanan Anda berikutnya.
                        </p>
                        <Button className="mt-6 rounded-none bg-[#FFC000] text-black hover:bg-[#917300]" asChild>
                            <Link href="/contact">Hubungi Kami</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

About.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
