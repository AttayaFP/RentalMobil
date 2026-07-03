import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, User } from 'lucide-react';
import React from 'react';

const posts = [
    { date: '25 Mei 2026', title: 'Tips Merawat Mobil Rental Agar Tetap Nyaman', excerpt: 'Pelajari cara merawat mobil rental dengan benar agar perjalanan Anda tetap aman dan nyaman selama masa sewa.' },
    { date: '12 Juni 2026', title: 'Destinasi Wisata Tersembunyi di Sumatera Barat', excerpt: 'Jelajahi keindahan tersembunyi Sumatera Barat yang wajib dikunjungi saat Anda menyewa mobil.' },
    { date: '05 Juli 2026', title: 'Cara Memilih Mobil yang Tepat untuk Perjalanan Jauh', excerpt: 'Panduan lengkap memilih jenis mobil yang sesuai untuk perjalanan jauh bersama keluarga.' },
];

export default function Blog() {
    return (
        <>
            <Head title="Blog - Rental Mobil Nabil Padang" />

            <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-white">Blog &amp; Artikel</h1>
                    <p className="mt-2 text-emerald-100">
                        <Link href="/" className="hover:underline">Beranda</Link> / Blog
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post, index) => (
                            <Card key={index} className="overflow-hidden">
                                <div className="h-48 w-full bg-gradient-to-br from-emerald-100 to-teal-100" />
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" />
                                            Admin
                                        </span>
                                    </div>
                                    <h3 className="mt-3 text-lg font-bold leading-snug">{post.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                                    <Button variant="link" className="mt-2 h-auto p-0 text-emerald-600">
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
