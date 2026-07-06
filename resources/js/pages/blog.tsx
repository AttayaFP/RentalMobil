import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, User } from 'lucide-react';
import React from 'react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/use-animation';

const posts = [
    { date: '25 Mei 2026', title: 'Tips Merawat Mobil Rental Agar Tetap Nyaman', excerpt: 'Pelajari cara merawat mobil rental dengan benar agar perjalanan Anda tetap aman dan nyaman selama masa sewa.' },
    { date: '12 Juni 2026', title: 'Destinasi Wisata Tersembunyi di Sumatera Barat', excerpt: 'Jelajahi keindahan tersembunyi Sumatera Barat yang wajib dikunjungi saat Anda menyewa mobil.' },
    { date: '05 Juli 2026', title: 'Cara Memilih Mobil yang Tepat untuk Perjalanan Jauh', excerpt: 'Panduan lengkap memilih jenis mobil yang sesuai untuk perjalanan jauh bersama keluarga.' },
];

export default function Blog() {
    const headerRef = useScrollReveal();
    const gridRef = useStaggerReveal();

    return (
        <>
            <Head title="Blog - Rental Mobil Nabil Padang" />

            <section className="bg-black py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold uppercase tracking-wide text-white">Blog &amp; Artikel</h1>
                    <p className="mt-2 text-[#7D7D7D]">
                        <Link href="/" className="text-[#FFC000] hover:text-[#917300] hover:underline">Beranda</Link> / Blog
                    </p>
                </div>
            </section>

            <section ref={gridRef} className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div ref={headerRef} className="reveal mb-10 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#FFC000]">Artikel Terbaru</p>
                        <h2 className="mt-2 text-3xl font-bold uppercase text-white">Baca &amp; Temukan</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post, index) => (
                            <Card key={index} className="stagger-item overflow-hidden rounded-none border-white/10 bg-[#202020]">
                                <div className="h-48 w-full bg-[#181818]" />
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-4 text-xs text-[#7D7D7D]">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" />
                                            Admin
                                        </span>
                                    </div>
                                    <h3 className="mt-3 text-lg font-bold leading-snug text-white">{post.title}</h3>
                                    <p className="mt-2 text-sm text-[#7D7D7D]">{post.excerpt}</p>
                                    <Button variant="link" className="mt-2 h-auto p-0 text-[#FFC000] hover:text-[#917300]">
                                        Baca Selengkapnya
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

Blog.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
