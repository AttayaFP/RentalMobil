import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface User {
    id: number;
    nama_lengkap: string;
}

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    harga: number;
}

interface Booking {
    kdbooking: string;
    tglbooking: string;
    iduser: number;
    kdmobil: string;
    harga: number;
    tglmulai: string;
    tglselesai: string;
    lama_sewa: number;
    total_bayar: number;
    status: string;
}

interface Props {
    booking: Booking;
    users: User[];
    mobils: Mobil[];
}

export default function Edit({ booking, users, mobils }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Booking', href: '/booking' },
        { title: `Edit ${booking.kdbooking}`, href: `/booking/${booking.kdbooking}/edit` },
    ];

    const { data, setData, put, processing } = useForm({
        tglbooking: booking.tglbooking,
        iduser: booking.iduser.toString(),
        kdmobil: booking.kdmobil,
        harga: booking.harga.toString(),
        tglmulai: booking.tglmulai,
        tglselesai: booking.tglselesai,
        lama_sewa: booking.lama_sewa.toString(),
        total_bayar: booking.total_bayar.toString(),
        status: booking.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/booking/${booking.kdbooking}`, {
            onSuccess: () => toast.success('Booking berhasil diperbarui.'),
            onError: () => toast.error('Gagal memperbarui booking.'),
        });
    };

    const formatCurrency = (amount: number | string) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount) || 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${booking.kdbooking}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form onSubmit={submit}>
                    <div className="grid gap-6 lg:grid-cols-7">
                        <div className="lg:col-span-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href="/booking">
                                                <ArrowLeft className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <div>
                                            <CardTitle>Ubah Informasi Sewa</CardTitle>
                                            <CardDescription>Edit detail transaksi booking {booking.kdbooking}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Kode Booking</Label>
                                            <Input value={booking.kdbooking} readOnly className="bg-muted font-semibold" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tglbooking">Tanggal Transaksi</Label>
                                            <Input
                                                id="tglbooking"
                                                type="date"
                                                value={data.tglbooking}
                                                onChange={(e) => setData('tglbooking', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Pelanggan</Label>
                                        <Select value={data.iduser} onValueChange={(value) => setData('iduser', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Pelanggan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((u) => (
                                                    <SelectItem key={u.id} value={u.id.toString()}>
                                                        {u.nama_lengkap}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Mobil</Label>
                                        <Select value={data.kdmobil} onValueChange={(value) => setData('kdmobil', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Mobil" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mobils.map((m) => (
                                                    <SelectItem key={m.kdmobil} value={m.kdmobil}>
                                                        {m.nama_mobil}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="tglmulai">Tanggal Mulai</Label>
                                            <Input
                                                id="tglmulai"
                                                type="date"
                                                value={data.tglmulai}
                                                onChange={(e) => setData('tglmulai', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tglselesai">Tanggal Selesai</Label>
                                            <Input
                                                id="tglselesai"
                                                type="date"
                                                value={data.tglselesai}
                                                onChange={(e) => setData('tglselesai', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Status Transaksi</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Proses">Proses</SelectItem>
                                                <SelectItem value="Selesai">Selesai</SelectItem>
                                                <SelectItem value="Batal">Batal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-3 space-y-6">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Rincian Biaya</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Harga / Hari</span>
                                            <span className="font-semibold">{formatCurrency(data.harga)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Lama Sewa</span>
                                            <span className="font-semibold">{data.lama_sewa} Hari</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg bg-primary p-4 text-primary-foreground">
                                        <span className="font-semibold">Total Akhir</span>
                                        <span className="text-xl font-bold">{formatCurrency(data.total_bayar)}</span>
                                    </div>

                                    <Button type="submit" className="w-full" size="lg" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Perbarui Transaksi
                                            </>
                                        )}
                                    </Button>
                                    <Button type="button" variant="ghost" className="w-full" asChild>
                                        <Link href="/booking">Batal & Kembali</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
