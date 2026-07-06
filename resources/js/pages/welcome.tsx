import GuestLayout from '@/layouts/guest-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Handshake, CalendarCheck, ArrowRight, Star, Shield, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
    useHeroAnimation,
    useScrollReveal,
    useStaggerReveal,
    useParallax,
    useTextSplit,
    useMagneticButton,
    useMarquee,
    useCountUp,
    useScaleReveal,
} from '@/hooks/use-animation';
import heroBg from '@/assets/images/logo.jpg';
import GoldParticles from '@/components/gold-particles';
import Carousel from '@/components/carousel';
import { motion } from 'framer-motion';

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    thn_mobil: number;
    plat_mobil: string;
    warna_mobil: string;
    harga: number;
    kdkategori: string;
    status: string;
    foto: string | null;
}

interface Props {
    mobils: Mobil[];
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Welcome({ mobils = [] }: Props) {
    const { auth } = usePage<{
        auth: {
            user: { id: number; role: string; nama_lengkap?: string; name?: string } | null;
            pending_booking?: {
                kdbooking: string;
                nama_mobil: string;
                total_bayar: number;
                created_at: string;
            } | null;
        };
    }>().props;
    const user = auth?.user;
    const pendingBooking = auth?.pending_booking;
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isExpired, setIsExpired] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const heroRef = useHeroAnimation();
    const middleRef = useScrollReveal();
    const carsRef = useStaggerReveal();
    const parallaxRef = useParallax(0.2);
    const titleRef = useTextSplit();
    const ctaRef = useMagneticButton();
    const marqueeRef = useMarquee(25);
    const statsRef = useStaggerReveal();
    const ctaSectionRef = useScaleReveal();
    const stat1Ref = useCountUp(500, { suffix: '+' });
    const stat2Ref = useCountUp(50, { suffix: '+' });
    const stat3Ref = useCountUp(5);
    const stat4Ref = useCountUp(24, { suffix: '/7' });

    useEffect(() => {
        if (!pendingBooking) return;

        const expiresAt = new Date(pendingBooking.created_at).getTime() + 60 * 1000;

        const updateTimer = () => {
            const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
            setTimeRemaining(remaining);
            if (remaining <= 0) {
                setIsExpired(true);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [pendingBooking]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const handleSewaClick = (kdmobil?: string) => {
        if (!user) {
            router.visit('/login');
        } else if (user.role === 'pelanggan') {
            router.visit(`/booking/create${kdmobil ? '?kdmobil=' + kdmobil : ''}`);
        } else {
            router.visit('/booking');
        }
    };

    return (
        <>
            <Head title="Rental Mobil Nabil Padang" />

            <section
                ref={heroRef}
                className="relative min-h-screen overflow-hidden"
            >
                <div
                    ref={parallaxRef}
                    className="absolute inset-0 z-0"
                    style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
                <GoldParticles />

                <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="mx-auto max-w-4xl text-center"
                    >
                        <motion.div variants={fadeUp} className="hero-badge mb-6">
                            <Badge className="border-gold/30 bg-gold/10 text-gold px-4 py-1.5 text-xs font-medium uppercase tracking-widest">
                                Rental Mobil Terpercaya di Padang
                            </Badge>
                        </motion.div>

                        <h1 className="hero-title text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                            <span ref={titleRef}>SEWA MOBIL IMPIAN ANDA</span>
                        </h1>

                        <p className="hero-sub mt-6 text-lg text-white/70 sm:text-xl lg:text-2xl">
                            Temukan mobil terbaik untuk perjalanan Anda dengan harga kompetitif dan pelayanan prima.
                        </p>

                        <div className="hero-cta mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <Button
                                ref={ctaRef}
                                size="lg"
                                className="bg-gold hover:bg-gold/90 text-black px-10 py-6 text-base font-semibold uppercase tracking-wider"
                                onClick={() => handleSewaClick()}
                            >
                                Pesan Mobil Sekarang
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/30 px-10 py-6 text-base text-white/80 hover:bg-white/10 hover:text-white"
                                onClick={() => router.visit('/cars')}
                            >
                                Lihat Katalog
                            </Button>
                        </div>

                        <motion.div
                            variants={fadeUp}
                            className="mt-12 flex items-center justify-center gap-8 text-sm text-white/50"
                        >
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-gold" />
                                <span>Asuransi All-Risk</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gold" />
                                <span>Layanan 24/7</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gold" />
                                <span>Rating 4.9</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="h-6 w-3.5 rounded-full border-2 border-white/40"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                            className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-gold"
                        />
                    </motion.div>
                </div>
            </section>

            <section className="relative overflow-hidden border-y border-white/5 bg-black py-4">
                <div ref={marqueeRef} className="flex overflow-hidden">
                    <div className="marquee-inner flex shrink-0 items-center gap-8 pr-8">
                        {[...Array(2)].map((_, setIdx) => (
                            <React.Fragment key={setIdx}>
                                {['TOYOTA', 'HONDA', 'SUZUKI', 'DAIHATSU', 'MITSUBISHI', 'NISSAN', 'BMW', 'MERCEDES'].map((brand) => (
                                    <span key={`${setIdx}-${brand}`} className="text-sm font-medium uppercase tracking-widest text-white/20">
                                        {brand}
                                        <span className="ml-8 text-gold/30">◆</span>
                                    </span>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            <section ref={middleRef} className="relative bg-black py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="reveal mb-12 text-center">
                        <Badge className="mb-4 border-gold/30 bg-gold/10 text-gold px-3 py-1 text-xs uppercase tracking-widest">
                            Mengapa Kami
                        </Badge>
                        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                            Pengalaman Sewa <span className="text-gold">Premium</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-white/50">
                            Kami memberikan layanan terbaik dengan armada berkualitas dan harga transparan.
                        </p>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={staggerContainer}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {[
                            { icon: MapPin, title: 'Pilih Lokasi', desc: 'Ambil mobil di lokasi terdekat Anda dengan mudah dan cepat.' },
                            { icon: Handshake, title: 'Penawaran Terbaik', desc: 'Harga transparan tanpa biaya tersembunyi. Dijamin puas.' },
                            { icon: CalendarCheck, title: 'Pesan Online', desc: 'Booking kapan saja, di mana saja. Konfirmasi instan.' },
                            { icon: Shield, title: 'Asuransi Lengkap', desc: 'Perlindungan all-risk untuk ketenangan pikiran Anda.' },
                            { icon: Clock, title: 'Layanan 24/7', desc: 'Tim support siap membantu Anda kapan pun dibutuhkan.' },
                            { icon: Star, title: 'Armada Premium', desc: 'Mobil terawat dengan standar kualitas tertinggi.' },
                        ].map((item, i) => (
                            <motion.div key={i} variants={scaleIn}>
                                <Card className="group border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-gold/30 hover:bg-white/10">
                                    <CardContent className="p-0">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center bg-gold/10 transition-colors group-hover:bg-gold/20">
                                            <item.icon className="h-6 w-6 text-gold" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                        <p className="mt-2 text-sm text-white/50">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section ref={statsRef} className="relative bg-white/[0.02] py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { ref: stat1Ref, label: 'Pelanggan Puas' },
                            { ref: stat2Ref, label: 'Unit Mobil' },
                            { ref: stat3Ref, label: 'Tahun Pengalaman' },
                            { ref: stat4Ref, label: 'Layanan Support' },
                        ].map((stat, i) => (
                            <div key={i} className="stagger-item text-center">
                                <div
                                    ref={stat.ref}
                                    className="text-4xl font-bold text-gold lg:text-5xl"
                                >
                                    0
                                </div>
                                <p className="mt-2 text-sm uppercase tracking-wider text-white/50">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section ref={carsRef} className="relative bg-black py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="reveal mb-12 text-center">
                        <Badge className="mb-4 border-gold/30 bg-gold/10 text-gold px-3 py-1 text-xs uppercase tracking-widest">
                            Armada Kami
                        </Badge>
                        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                            Mobil <span className="text-gold">Unggulan</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-white/50">
                            Pilih dari koleksi mobil premium kami yang selalu terawat dan siap jalan.
                        </p>
                    </div>

                    {mobils.length > 0 ? (
                        <>
                            <div className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                                {mobils.slice(0, 6).map((mobil, i) => (
                                    <motion.div
                                        key={mobil.kdmobil}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 0.5 }}
                                    >
                                        <Card className="stagger-item group overflow-hidden border-white/10 bg-white/5 transition-all duration-500 hover:border-gold/30 hover:bg-white/10">
                                            <div className="relative h-52 w-full overflow-hidden bg-white/5">
                                                <img
                                                    src={mobil.foto ? `/storage/${mobil.foto}` : '/img/car-placeholder.png'}
                                                    alt={mobil.nama_mobil}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <Badge
                                                    variant={mobil.status === 'Tersedia' ? 'success' : 'destructive'}
                                                    className="absolute left-3 top-3"
                                                >
                                                    {mobil.status}
                                                </Badge>
                                            </div>
                                            <CardContent className="p-5">
                                                <h3 className="text-lg font-bold text-white">{mobil.nama_mobil}</h3>
                                                <p className="mt-1 text-sm text-white/40">
                                                    {mobil.thn_mobil} · {mobil.warna_mobil}
                                                </p>
                                                <p className="mt-3 text-xl font-bold text-gold">
                                                    {formatCurrency(mobil.harga)}
                                                    <span className="text-sm font-normal text-white/40"> /hari</span>
                                                </p>
                                            </CardContent>
                                            <CardFooter className="p-5 pt-0">
                                                <Button
                                                    className="w-full bg-gold text-black hover:bg-gold/90"
                                                    disabled={mobil.status !== 'Tersedia'}
                                                    onClick={() => mobil.status === 'Tersedia' && handleSewaClick(mobil.kdmobil)}
                                                >
                                                    {mobil.status === 'Tersedia' ? 'Sewa Sekarang' : 'Tidak Tersedia'}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="sm:hidden">
                                <Carousel options={{ align: 'start' }}>
                                    {mobils.slice(0, 6).map((mobil) => (
                                        <div key={mobil.kdmobil} className="min-w-[85%] flex-none">
                                            <Card className="group overflow-hidden border-white/10 bg-white/5">
                                                <div className="relative h-44 w-full overflow-hidden bg-white/5">
                                                    <img
                                                        src={mobil.foto ? `/storage/${mobil.foto}` : '/img/car-placeholder.png'}
                                                        alt={mobil.nama_mobil}
                                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                    <Badge
                                                        variant={mobil.status === 'Tersedia' ? 'success' : 'destructive'}
                                                        className="absolute left-3 top-3"
                                                    >
                                                        {mobil.status}
                                                    </Badge>
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="text-base font-bold text-white">{mobil.nama_mobil}</h3>
                                                    <p className="mt-1 text-xs text-white/40">
                                                        {mobil.thn_mobil} · {mobil.warna_mobil}
                                                    </p>
                                                    <p className="mt-2 text-lg font-bold text-gold">
                                                        {formatCurrency(mobil.harga)}
                                                        <span className="text-xs font-normal text-white/40"> /hari</span>
                                                    </p>
                                                </CardContent>
                                                <CardFooter className="p-4 pt-0">
                                                    <Button
                                                        className="w-full bg-gold text-black hover:bg-gold/90"
                                                        size="sm"
                                                        disabled={mobil.status !== 'Tersedia'}
                                                        onClick={() => mobil.status === 'Tersedia' && handleSewaClick(mobil.kdmobil)}
                                                    >
                                                        {mobil.status === 'Tersedia' ? 'Sewa Sekarang' : 'Tidak Tersedia'}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </>
                    ) : (
                        <div className="py-16 text-center text-white/30">
                            Tidak ada mobil tersedia saat ini.
                        </div>
                    )}

                    {mobils.length > 6 && (
                        <div className="mt-10 text-center">
                            <Button
                                variant="outline"
                                className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                                onClick={() => router.visit('/cars')}
                            >
                                Lihat Semua Mobil
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <section ref={ctaSectionRef} className="relative overflow-hidden bg-gold py-20">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]" />
                </div>
                <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl">
                        Siap Untuk Perjalanan?
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-black/60">
                        Booking sekarang dan dapatkan penawaran terbaik untuk perjalanan Anda.
                    </p>
                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Button
                            size="lg"
                            className="bg-black px-10 py-6 text-base font-semibold text-gold hover:bg-black/90"
                            onClick={() => handleSewaClick()}
                        >
                            Mulai Booking
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-black/30 px-10 py-6 text-base text-black hover:bg-black/10"
                            onClick={() => router.visit('/contact')}
                        >
                            Hubungi Kami
                        </Button>
                    </div>
                </div>
            </section>

            <Dialog open={!!pendingBooking && !dismissed && !isExpired} onOpenChange={() => setDismissed(true)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-amber-500" />
                            Booking Menunggu Pembayaran
                        </DialogTitle>
                        <DialogDescription>
                            Anda memiliki booking yang belum dibayar untuk mobil <span className="font-semibold text-foreground">{pendingBooking?.nama_mobil}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <div className="rounded-lg border border-dashed bg-muted/50 p-4 text-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Pembayaran</p>
                            <p className="mt-1 text-2xl font-bold">{formatCurrency(pendingBooking?.total_bayar || 0)}</p>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <p className="text-sm font-semibold text-amber-500">
                                Waktu tersisa: {timeRemaining} detik
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        <Button
                            className="w-full"
                            onClick={() => {
                                setDismissed(true);
                                router.visit(`/booking/${pendingBooking?.kdbooking}/checkout`);
                            }}
                        >
                            Lanjutkan Pembayaran
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => setDismissed(true)}>
                            Nanti Saja
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!pendingBooking && !dismissed && isExpired} onOpenChange={() => setDismissed(true)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Booking Kadaluarsa
                        </DialogTitle>
                        <DialogDescription>
                            Waktu pembayaran untuk booking <span className="font-semibold text-foreground">{pendingBooking?.kdbooking}</span> telah habis. Silakan buat booking baru.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        <Button
                            className="w-full"
                            onClick={() => {
                                setDismissed(true);
                                router.visit('/booking/create');
                            }}
                        >
                            Buat Booking Baru
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => setDismissed(true)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
