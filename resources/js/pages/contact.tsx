import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, GraduationCap, Globe } from 'lucide-react';
import React from 'react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/use-animation';

export default function Contact() {
    const infoRef = useStaggerReveal();
    const formRef = useScrollReveal();

    return (
        <>
            <Head title="Kontak - Rental Mobil Nabil Padang" />

            <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="hero-title text-4xl font-extrabold text-white">Hubungi Kami</h1>
                    <p className="hero-sub mt-2 text-emerald-100">
                        <Link href="/" className="hover:underline">Beranda</Link> / Kontak
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="reveal mb-8 text-2xl font-bold">Informasi Pengembang</h2>
                    <div ref={infoRef} className="mb-12 grid gap-6 sm:grid-cols-3">
                        <Card className="stagger-item">
                            <CardContent className="p-5">
                                <MapPin className="h-6 w-6 text-emerald-600" />
                                <p className="mt-2 text-sm font-semibold text-emerald-600">Nama Pengembang</p>
                                <p className="text-sm text-muted-foreground">Attaya Fiqri Pradana</p>
                            </CardContent>
                        </Card>
                        <Card className="stagger-item">
                            <CardContent className="p-5">
                                <GraduationCap className="h-6 w-6 text-emerald-600" />
                                <p className="mt-2 text-sm font-semibold text-emerald-600">NoBP / NIM</p>
                                <p className="text-sm text-muted-foreground">2210019</p>
                            </CardContent>
                        </Card>
                        <Card className="stagger-item">
                            <CardContent className="p-5">
                                <Globe className="h-6 w-6 text-emerald-600" />
                                <p className="mt-2 text-sm font-semibold text-emerald-600">Tujuan Website</p>
                                <p className="text-sm text-muted-foreground">Skripsi S1 Sistem Informasi</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div ref={formRef} className="grid gap-8 md:grid-cols-2">
                        <Card className="reveal">
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-lg font-bold">Kirim Pesan</h3>
                                <form className="space-y-4">
                                    <Input placeholder="Nama Anda" />
                                    <Input type="email" placeholder="Email Anda" />
                                    <Input placeholder="Subjek" />
                                    <Textarea rows={5} placeholder="Pesan" />
                                    <Button type="button" className="w-full">
                                        Kirim Pesan
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="reveal">
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-lg font-bold">Lokasi Kami</h3>
                                <div className="flex h-48 items-center justify-center rounded-lg bg-muted">
                                    <p className="text-sm text-muted-foreground">Peta lokasi kantor rental mobil akan ditampilkan di sini.</p>
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Komplek Perumdam III/4, Tunggul Hitam, Kota Padang
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
}

Contact.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
