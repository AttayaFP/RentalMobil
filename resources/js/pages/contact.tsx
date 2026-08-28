import GuestLayout from '@/layouts/guest-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Send, Phone } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/use-animation';
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
                                            <p>0822-8714-0724</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 overflow-hidden border border-white/10">
                                    <div className="relative">
                                        <iframe
                                            title="Lokasi Kantor PT. Nabil Rental Mobil Padang"
                                            src="https://maps.google.com/maps?q=-0.8830877,100.3590865&hl=id&z=19&output=embed"
                                            width="100%"
                                            height="220"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="block w-full grayscale"
                                            style={{ border: 0 }}
                                        />
                                        <div className="absolute inset-0 pointer-events-none border border-[#FFC000]/10" />
                                    </div>
                                    <a
                                        href="https://www.google.com/maps/place/SEWA+TOYOTA+HIACE+PADANG+%7C%7C+RENTAL+MOBIL+PADANG.N_RENTCARPADANG/@-0.8830518,100.3591148,21z/data=!4m6!3m5!1s0x2fd4c7c84d933eff:0x2755132c5c3499b7!8m2!3d-0.8830877!4d100.3590865!16s%2Fg%2F11xfl0h729"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-[#181818] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#FFC000] transition-colors hover:bg-[#FFC000] hover:text-black"
                                    >
                                        <MapPin className="h-3.5 w-3.5" />
                                        Buka di Google Maps
                                    </a>
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
