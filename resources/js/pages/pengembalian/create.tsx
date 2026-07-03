import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, RotateCcw, Clock, Banknote } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengembalian', href: '/pengembalian' },
    { title: 'Input', href: '/pengembalian/create' },
];

interface Booking {
    kdbooking: string;
    iduser: number;
    kdmobil: string;
    tglmulai: string;
    tglselesai: string;
    harga: number;
    status: string;
    user: { nama_lengkap: string };
    mobil: { nama_mobil: string };
}

interface User {
    id: number;
    nama_lengkap: string;
}

interface Props {
    bookings: Booking[];
    users: User[];
    next_kdpengembalian: string;
}

export default function Create({ bookings, users, next_kdpengembalian }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        kdpengembalian: next_kdpengembalian,
        kdbooking: '',
        iduser: '',
        tglmulai: '',
        tglselesai: '',
        tglpengembalian: new Date().toISOString().split('T')[0],
        keterlambatan: '0',
        denda: '0',
        payment_type: '',
    });

    const [showDendaDialog, setShowDendaDialog] = useState(false);

    const formatCurrency = (amount: number | string) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount) || 0);

    const calculateLateFees = (tglSelesai: string, tglKembali: string, kdBooking: string) => {
        if (!tglSelesai || !tglKembali || !kdBooking) return { keterlambatan: '0', denda: '0' };

        const booking = bookings.find((b) => b.kdbooking.trim() === kdBooking.trim());
        if (!booking) return { keterlambatan: '0', denda: '0' };

        const selesai = new Date(tglSelesai);
        const riil = new Date(tglKembali);
        selesai.setHours(0, 0, 0, 0);
        riil.setHours(0, 0, 0, 0);

        const diffTime = riil.getTime() - selesai.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            const days = diffDays;
            const harga = Number(booking.harga) || 0;
            return { keterlambatan: days.toString(), denda: (diffDays * harga).toString() };
        }
        return { keterlambatan: '0', denda: '0' };
    };

    const handleBookingChange = (kdbooking: string) => {
        const booking = bookings.find((b) => b.kdbooking.trim() === kdbooking.trim());
        if (booking) {
            const fees = calculateLateFees(booking.tglselesai, data.tglpengembalian, kdbooking);
            setData((prev) => ({
                ...prev,
                kdbooking,
                iduser: booking.iduser.toString(),
                tglmulai: booking.tglmulai,
                tglselesai: booking.tglselesai,
                keterlambatan: fees.keterlambatan,
                denda: fees.denda,
            }));
        }
    };

    const handleDateChange = (tglpengembalian: string) => {
        const fees = calculateLateFees(data.tglselesai, tglpengembalian, data.kdbooking);
        setData((prev) => ({
            ...prev,
            tglpengembalian,
            keterlambatan: fees.keterlambatan,
            denda: fees.denda,
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const fineAmount = Number(data.denda) || 0;
        if (fineAmount > 0) {
            setShowDendaDialog(true);
        } else {
            post('/pengembalian', {
                onSuccess: () => toast.success('Pengembalian berhasil dicatat.'),
                onError: () => toast.error('Gagal menyimpan pengembalian.'),
            });
        }
    };

    const confirmWithPayment = (paymentType: string) => {
        setShowDendaDialog(false);
        setData('payment_type', paymentType);
        post('/pengembalian', {
            onSuccess: () => toast.success('Pengembalian berhasil dicatat.'),
            onError: () => toast.error('Gagal menyimpan pengembalian.'),
        });
    };

    const selectedBooking = bookings.find((b) => b.kdbooking === data.kdbooking);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Input Pengembalian" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/pengembalian">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <RotateCcw className="h-5 w-5" />
                                    Form Serah Terima Unit
                                </CardTitle>
                                <CardDescription>Input data pengembalian mobil</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="kdpengembalian">Kode Pengembalian</Label>
                                    <Input id="kdpengembalian" value={data.kdpengembalian} readOnly className="bg-muted font-semibold" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kdbooking">Referensi Booking</Label>
                                    <Select value={data.kdbooking} onValueChange={handleBookingChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="-- Pilih Booking Aktif --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bookings.map((b) => (
                                                <SelectItem key={b.kdbooking} value={b.kdbooking}>
                                                    {b.kdbooking} - {b.mobil.nama_mobil} ({b.tglmulai})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kdbooking && <p className="text-sm text-destructive">{errors.kdbooking}</p>}
                                </div>
                            </div>

                            {selectedBooking && (
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div>
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Pelanggan</p>
                                            <p className="font-semibold">{selectedBooking.user.nama_lengkap}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Mobil</p>
                                            <p className="font-semibold">{selectedBooking.mobil.nama_mobil}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Durasi Sewa</p>
                                            <p className="font-semibold">{data.tglmulai} s/d {data.tglselesai}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="tglpengembalian">Tanggal Pengembalian Riil</Label>
                                <Input
                                    id="tglpengembalian"
                                    type="date"
                                    value={data.tglpengembalian}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    required
                                />
                                {errors.tglpengembalian && <p className="text-sm text-destructive">{errors.tglpengembalian}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                                    <CardContent className="flex items-center gap-3 p-4">
                                        <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-xs font-medium uppercase text-blue-600 dark:text-blue-400">Keterlambatan</p>
                                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{data.keterlambatan} <span className="text-sm font-normal">Hari</span></p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className={Number(data.denda) > 0 ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950' : 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'}>
                                    <CardContent className="flex items-center gap-3 p-4">
                                        <Banknote className={`h-8 w-8 ${Number(data.denda) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
                                        <div>
                                            <p className={`text-xs font-medium uppercase ${Number(data.denda) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>Denda</p>
                                            <p className={`text-2xl font-bold ${Number(data.denda) > 0 ? 'text-red-900 dark:text-red-100' : 'text-green-900 dark:text-green-100'}`}>{formatCurrency(data.denda)}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-6">
                                <Button variant="outline" asChild>
                                    <Link href="/pengembalian">Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Konfirmasi Pengembalian'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showDendaDialog} onOpenChange={setShowDendaDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Denda</DialogTitle>
                        <DialogDescription>
                            Terdeteksi denda sebesar <span className="font-semibold text-foreground">{formatCurrency(data.denda)}</span>. Pilih metode pembayaran denda:
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowDendaDialog(false)}>
                            Batal
                        </Button>
                        <Button variant="secondary" onClick={() => confirmWithPayment('transfer')}>
                            Transfer
                        </Button>
                        <Button onClick={() => confirmWithPayment('bayar_di_tempat')}>
                            Bayar di Tempat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
