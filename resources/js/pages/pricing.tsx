import GuestLayout from '@/layouts/guest-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { useScrollReveal, useStaggerReveal } from '@/hooks/use-animation';

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    plat_mobil: string;
    harga: number;
    foto: string | null;
    status?: string;
}

interface Props {
    mobils: Mobil[];
}

export default function Pricing({ mobils }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; role: string } | null } }>().props;
    const user = auth?.user;
    const headerRef = useScrollReveal();
    const tableRef = useStaggerReveal();

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const handleSewa = (kdmobil: string) => {
        if (!user) {
            router.visit('/login');
        } else if (user.role === 'pelanggan') {
            router.visit(`/booking/create?kdmobil=${kdmobil}`);
        } else {
            router.visit('/booking');
        }
    };

    return (
        <>
            <Head title="Daftar Harga - Rental Mobil Nabil Padang" />

            <section className="bg-black py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold uppercase tracking-wide text-white">Daftar Harga</h1>
                    <p className="mt-2 text-[#7D7D7D]">
                        <Link href="/" className="text-[#FFC000] hover:text-[#917300] hover:underline">Beranda</Link> / Daftar Harga
                    </p>
                </div>
            </section>

            <section ref={tableRef} className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div ref={headerRef} className="reveal mb-10 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#FFC000]">Tarif Rental</p>
                        <h2 className="mt-2 text-3xl font-bold uppercase text-white">Harga Sewa Mobil Terbaik</h2>
                    </div>
                    <div className="stagger-item overflow-hidden border border-white/10 bg-[#202020]">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-2 border-white/10 bg-[#181818] hover:bg-[#181818]">
                                    <TableHead className="w-[100px] text-white">Gambar</TableHead>
                                    <TableHead className="text-white">Nama Mobil</TableHead>
                                    <TableHead className="text-white">Tarif Per Hari</TableHead>
                                    <TableHead className="text-center text-white">Sewa</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mobils.map((mobil) => (
                                    <TableRow key={mobil.kdmobil} className="border-b border-white/10 hover:bg-white/5">
                                        <TableCell className="border border-white/10">
                                            <img
                                                src={mobil.foto ? `/storage/${mobil.foto}` : '/img/car-placeholder.png'}
                                                alt={mobil.nama_mobil}
                                                className="h-16 w-24 object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="border border-white/10 font-medium text-white">{mobil.nama_mobil}</TableCell>
                                        <TableCell className="border border-white/10 font-semibold text-[#FFC000]">{formatCurrency(mobil.harga)}</TableCell>
                                        <TableCell className="border border-white/10 text-center">
                                            {mobil.status === 'Tersedia' ? (
                                                <Button size="sm" className="rounded-none bg-[#FFC000] text-black hover:bg-[#917300]" onClick={() => handleSewa(mobil.kdmobil)}>
                                                    Sewa
                                                </Button>
                                            ) : (
                                                <Badge variant="secondary" className="rounded-none">Habis</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </section>
        </>
    );
}

Pricing.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
