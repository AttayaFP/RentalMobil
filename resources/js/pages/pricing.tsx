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

            <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="hero-title text-4xl font-extrabold text-white">Daftar Harga</h1>
                    <p className="hero-sub mt-2 text-emerald-100">
                        <Link href="/" className="hover:underline">Beranda</Link> / Daftar Harga
                    </p>
                </div>
            </section>

            <section ref={tableRef} className="bg-muted/30 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div ref={headerRef} className="reveal mb-10 text-center">
                        <p className="text-sm font-semibold text-emerald-600">Tarif Rental</p>
                        <h2 className="mt-2 text-3xl font-bold">Harga Sewa Mobil Terbaik</h2>
                    </div>
                    <div className="stagger-item overflow-hidden rounded-lg border bg-white shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Gambar</TableHead>
                                    <TableHead>Nama Mobil</TableHead>
                                    <TableHead>Tarif Per Hari</TableHead>
                                    <TableHead className="text-center">Sewa</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mobils.map((mobil) => (
                                    <TableRow key={mobil.kdmobil}>
                                        <TableCell>
                                            <img
                                                src={mobil.foto ? `/storage/${mobil.foto}` : '/img/car-placeholder.png'}
                                                alt={mobil.nama_mobil}
                                                className="h-16 w-24 rounded object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{mobil.nama_mobil}</TableCell>
                                        <TableCell className="font-semibold text-emerald-600">{formatCurrency(mobil.harga)}</TableCell>
                                        <TableCell className="text-center">
                                            {mobil.status === 'Tersedia' ? (
                                                <Button size="sm" onClick={() => handleSewa(mobil.kdmobil)}>
                                                    Sewa
                                                </Button>
                                            ) : (
                                                <Badge variant="secondary">Habis</Badge>
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
