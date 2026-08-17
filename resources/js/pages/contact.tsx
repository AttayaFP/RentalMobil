import GuestLayout from '@/layouts/guest-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, GraduationCap, Globe, Send, Phone } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/use-animation';
import { toast } from 'sonner';

interface AuthUser {
    id: number;
    nama_lengkap?: string;
    name?: string;
    email?: string;
    nohp?: string;
}

export default function Contact() {
    const { auth } = usePage<{ auth: { user: AuthUser | null } }>().props;
    const user = auth?.user;

    const infoRef = useStaggerReveal();
    const formRef = useScrollReveal();

    const [nama, setNama] = useState(user?.nama_lengkap || user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [nohp, setNohp] = useState(user?.nohp || '');
    const [pesan, setPesan] = useState('');

    useEffect(() => {
        if (user) {
            setNama(user.nama_lengkap || user.name || '');
            setEmail(user.email || '');
            setNohp(user.nohp || '');
        }
    }, [user]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!pesan.trim()) {
            toast.error('Silakan isi pesan Anda terlebih dahulu.');
            return;
        }

        const adminPhone = '6282287140724';
        const formattedText = `Halo Admin PT. Nabil Rental Mobil Padang,

Nama: ${nama || '-'}
Email: ${email || '-'}
No. HP: ${nohp || '-'}

Pesan:
${pesan.trim()}`;

        const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(formattedText)}`;
        toast.success('Mengarahkan ke WhatsApp Admin...');
        window.open(waUrl, '_blank');
    };

    return (
        <>
            <Head title="Kontak - Rental Mobil Nabil Padang" />

            <section className="bg-black py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold uppercase tracking-wide text-white">Hubungi Kami</h1>
                    <p className="mt-2 text-[#7D7D7D]">
                        <Link href="/" className="text-[#FFC000] hover:text-[#917300] hover:underline">
                            Beranda
                        </Link>{' '}
                        / Kontak
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
                                <h3 className="mb-4 text-lg font-bold uppercase text-white">Kirim Pesan ke WhatsApp</h3>
                                <form onSubmit={handleSendMessage} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase text-[#7D7D7D]">Nama Lengkap</Label>
                                        <Input
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            placeholder="Nama Anda"
                                            required
                                            className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase text-[#7D7D7D]">Email</Label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email Anda"
                                            required
                                            className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase text-[#7D7D7D]">Nomor HP / WhatsApp</Label>
                                        <Input
                                            type="tel"
                                            value={nohp}
                                            onChange={(e) => setNohp(e.target.value)}
                                            placeholder="Nomor HP Anda (cth: 08123456789)"
                                            required
                                            className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase text-[#7D7D7D]">Pesan</Label>
                                        <Textarea
                                            rows={5}
                                            value={pesan}
                                            onChange={(e) => setPesan(e.target.value)}
                                            placeholder="Tuliskan pesan Anda di sini..."
                                            required
                                            className="rounded-none border-white/10 bg-black text-white placeholder:text-[#7D7D7D]"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full rounded-none bg-[#FFC000] text-black hover:bg-[#917300]">
                                        <Send className="mr-2 h-4 w-4" />
                                        Kirim Pesan (WhatsApp)
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="reveal rounded-none border-white/10 bg-[#202020]">
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-lg font-bold uppercase text-white">Lokasi & Kontak Kami</h3>
                                <div className="space-y-4 text-sm text-[#7D7D7D]">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#FFC000]" />
                                        <div>
                                            <p className="font-semibold text-white">Alamat Kantor</p>
                                            <p>Komplek Perumdam III/4, Tunggul Hitam, Kota Padang</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="mt-1 h-5 w-5 shrink-0 text-[#FFC000]" />
                                        <div>
                                            <p className="font-semibold text-white">WhatsApp Admin</p>
                                            <p>+62 822-8714-0724 (082287140724)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex h-44 items-center justify-center border border-white/5 bg-[#181818]">
                                    <p className="text-sm text-[#7D7D7D]">Peta lokasi kantor rental mobil Padang.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
}

Contact.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
