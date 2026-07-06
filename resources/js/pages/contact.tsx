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

            <section className="bg-black py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold uppercase tracking-wide text-white">Hubungi Kami</h1>
                    <p className="mt-2 text-[#7D7D7D]">
                        <Link href="/" className="text-[#FFC000] hover:text-[#917300] hover:underline">Beranda</Link> / Kontak
                    </p>
                </div>
            </section>

            <section className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="reveal mb-8 text-2xl font-bold uppercase text-white">Informasi Pengembang</h2>
                    <div ref={infoRef} className="mb-12 grid gap-6 sm:grid-cols-3">
                        <Card className="stagger-item rounded-none border-white/10 bg-[#202020]">
                            <CardContent className="p-5">
                                <MapPin className="h-6 w-6 text-[#FFC000]" />
                                <p className="mt-2 text-sm font-semibold uppercase text-[#FFC000]">Nama Pengembang</p>
                                <p className="text-sm text-[#7D7D7D]">Attaya Fiqri Pradana</p>
                            </CardContent>
                        </Card>
                        <Card className="stagger-item rounded-none border-white/10 bg-[#202020]">
                            <CardContent className="p-5">
                                <GraduationCap className="h-6 w-6 text-[#FFC000]" />
                                <p className="mt-2 text-sm font-semibold uppercase text-[#FFC000]">NoBP / NIM</p>
                                <p className="text-sm text-[#7D7D7D]">2210019</p>
                            </CardContent>
                        </Card>
                        <Card className="stagger-item rounded-none border-white/10 bg-[#202020]">
                            <CardContent className="p-5">
                                <Globe className="h-6 w-6 text-[#FFC000]" />
                                <p className="mt-2 text-sm font-semibold uppercase text-[#FFC000]">Tujuan Website</p>
                                <p className="text-sm text-[#7D7D7D]">Skripsi S1 Sistem Informasi</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div ref={formRef} className="grid gap-8 md:grid-cols-2">
                        <Card className="reveal rounded-none border-white/10 bg-[#202020]">
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-lg font-bold uppercase text-white">Kirim Pesan</h3>
                                <form className="space-y-4">
                                    <Input placeholder="Nama Anda" className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]" />
                                    <Input type="email" placeholder="Email Anda" className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]" />
                                    <Input placeholder="Subjek" className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]" />
                                    <Textarea rows={5} placeholder="Pesan" className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]" />
                                    <Button type="button" className="w-full rounded-none bg-[#FFC000] text-black hover:bg-[#917300]">
                                        Kirim Pesan
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="reveal rounded-none border-white/10 bg-[#202020]">
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-lg font-bold uppercase text-white">Lokasi Kami</h3>
                                <div className="flex h-48 items-center justify-center bg-[#181818]">
                                    <p className="text-sm text-[#7D7D7D]">Peta lokasi kantor rental mobil akan ditampilkan di sini.</p>
                                </div>
                                <p className="mt-4 text-sm text-[#7D7D7D]">
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
