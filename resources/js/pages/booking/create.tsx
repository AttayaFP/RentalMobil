import BookingLayout from '@/layouts/booking-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Car, User, CreditCard, CalendarDays, AlertTriangle, Bell, Loader2 } from 'lucide-react';

interface AuthUser {
    id: number;
    nama_lengkap: string;
    role: string;
}

interface UserItem {
    id: number;
    nama_lengkap: string;
}

interface MobilItem {
    kdmobil: string;
    nama_mobil: string;
    plat_mobil: string;
    harga: number;
    foto: string | null;
    status: string;
}

interface Props {
    users: UserItem[];
    mobils: MobilItem[];
    selected_kdmobil?: string;
    next_kdbooking: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Booking', href: '/booking' },
    { title: 'Buat Booking', href: '/booking/create' },
];

export default function Create({ users, mobils, selected_kdmobil, next_kdbooking }: Props) {
    const { auth } = usePage<{ auth: { user: AuthUser } }>().props;
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm({
        kdbooking: next_kdbooking,
        tglbooking: new Date().toISOString().split('T')[0],
        iduser: user.role === 'pelanggan' ? user.id.toString() : '',
        kdmobil: selected_kdmobil || '',
        harga: '',
        tglmulai: '',
        tglselesai: '',
        lama_sewa: '',
        total_bayar: '',
        payment_method: 'Midtrans',
        status: 'Pending',
    });

    const [availableMobils, setAvailableMobils] = useState<MobilItem[]>(mobils);
    const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
    const [isReminderRequested, setIsReminderRequested] = useState(false);
    const [isReminderProcessing, setIsReminderProcessing] = useState(false);

    useEffect(() => {
        setIsReminderRequested(false);
    }, [data.kdmobil, data.tglmulai, data.tglselesai]);

    const handleReminderRequest = () => {
        if (!data.kdmobil || !data.tglmulai || !data.tglselesai) return;
        setIsReminderProcessing(true);
        router.post('/booking/request-reminder', {
            kdmobil: data.kdmobil,
            tglmulai: data.tglmulai,
            tglselesai: data.tglselesai,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsReminderRequested(true);
                setIsReminderProcessing(false);
                toast.success('Pengingat berhasil diaktifkan.');
            },
            onError: () => {
                setIsReminderProcessing(false);
                toast.error('Gagal mengaktifkan pengingat.');
            },
        });
    };

    useEffect(() => {
        if (data.tglmulai && data.tglselesai) {
            setIsLoadingAvailable(true);
            fetch(`/booking/available-cars?tglmulai=${data.tglmulai}&tglselesai=${data.tglselesai}`)
                .then((res) => res.json())
                .then((resData) => {
                    setAvailableMobils(resData);
                    setIsLoadingAvailable(false);
                })
                .catch(() => {
                    setIsLoadingAvailable(false);
                });
        } else {
            setAvailableMobils(mobils);
        }
    }, [data.tglmulai, data.tglselesai, mobils]);

    const isSelectedMobilUnavailable =
        data.kdmobil && !isLoadingAvailable && !availableMobils.some((m) => m.kdmobil?.toString().trim() === data.kdmobil?.toString().trim());

    const selectedMobil: MobilItem | null =
        mobils.find((m) => m.kdmobil?.toString().trim() === data.kdmobil?.toString().trim()) ?? null;

    useEffect(() => {
        const m = mobils.find((x) => x.kdmobil?.toString().trim() === data.kdmobil?.toString().trim()) ?? null;
        setData('harga', m ? m.harga.toString() : '');
    }, [data.kdmobil, mobils, setData]);

    useEffect(() => {
        if (data.tglmulai && data.tglselesai && data.harga) {
            const start = new Date(data.tglmulai);
            const end = new Date(data.tglselesai);
            if (end >= start) {
                const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
                const total = days * parseFloat(data.harga);
                setData((prev) => ({ ...prev, lama_sewa: days.toString(), total_bayar: total.toString() }));
            } else {
                setData((prev) => ({ ...prev, lama_sewa: '', total_bayar: '' }));
            }
        }
    }, [data.tglmulai, data.tglselesai, data.harga, setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/booking', {
            onSuccess: () => toast.success('Booking berhasil dibuat.'),
            onError: () => toast.error('Gagal membuat booking. Periksa kembali data Anda.'),
        });
    };

    const formatCurrency = (v: string | number | undefined) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(v) || 0);

    const today = new Date().toISOString().split('T')[0];

    return (
        <BookingLayout breadcrumbs={breadcrumbs} title="Buat Booking">
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form onSubmit={submit}>
                    <div className="grid gap-6 lg:grid-cols-7">
                        <div className="lg:col-span-4 space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href="/booking">
                                                <ArrowLeft className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <div>
                                            <CardTitle>Informasi Penyewaan</CardTitle>
                                            <CardDescription>Lengkapi detail booking di bawah ini</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Kode Booking</Label>
                                            <Input value={data.kdbooking} readOnly className="bg-muted font-semibold" />
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
                                            {errors.tglbooking && <p className="text-sm text-destructive">{errors.tglbooking}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Pelanggan</Label>
                                        {user.role === 'pelanggan' ? (
                                            <Input value={user.nama_lengkap} readOnly className="bg-muted font-semibold" />
                                        ) : (
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
                                        )}
                                        {errors.iduser && <p className="text-sm text-destructive">{errors.iduser}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Pilih Mobil</Label>
                                        <Select value={data.kdmobil} onValueChange={(value) => setData('kdmobil', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Mobil" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mobils.map((m) => {
                                                    const isAvailable = availableMobils.some(
                                                        (am) => am.kdmobil?.toString().trim() === m.kdmobil?.toString().trim(),
                                                    );
                                                    if (!isAvailable && m.kdmobil?.toString().trim() !== data.kdmobil?.toString().trim()) {
                                                        return null;
                                                    }
                                                    return (
                                                        <SelectItem
                                                            key={m.kdmobil}
                                                            value={m.kdmobil}
                                                            disabled={!isAvailable && !isLoadingAvailable}
                                                        >
                                                            {m.nama_mobil} — {m.plat_mobil} ({formatCurrency(m.harga)}/hari)
                                                            {!isAvailable && !isLoadingAvailable ? ' [TIDAK TERSEDIA]' : ''}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {isLoadingAvailable && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Memeriksa ketersediaan mobil...
                                            </p>
                                        )}
                                        {errors.kdmobil && <p className="text-sm text-destructive">{errors.kdmobil}</p>}

                                        {isSelectedMobilUnavailable && (
                                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                                                <div className="flex items-start gap-2">
                                                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                                                    <div className="flex-1 space-y-2">
                                                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                                                            Mobil Tidak Tersedia
                                                        </p>
                                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                                            Mobil <strong>{selectedMobil?.nama_mobil}</strong> sudah dipesan pada tanggal{' '}
                                                            {data.tglmulai} s/d {data.tglselesai}.
                                                        </p>
                                                        {availableMobils.length > 0 && (
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-semibold uppercase text-amber-800 dark:text-amber-200">
                                                                    Alternatif Tersedia:
                                                                </p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {availableMobils.map((am) => (
                                                                        <Button
                                                                            key={am.kdmobil}
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="h-7 text-xs"
                                                                            onClick={() => setData('kdmobil', am.kdmobil)}
                                                                        >
                                                                            {am.nama_mobil}
                                                                        </Button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-between border-t border-amber-200 pt-2 dark:border-amber-800">
                                                            <span className="text-xs font-medium text-amber-800 dark:text-amber-200">
                                                                Ingin sewa mobil ini jika tersedia kembali?
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant={isReminderRequested ? 'default' : 'secondary'}
                                                                size="sm"
                                                                className="h-7 text-xs"
                                                                onClick={handleReminderRequest}
                                                                disabled={isReminderRequested || isReminderProcessing}
                                                            >
                                                                {isReminderProcessing ? (
                                                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    <Bell className="mr-1 h-3 w-3" />
                                                                )}
                                                                {isReminderRequested ? 'Pengingat Aktif' : 'Beri Tahu Saya'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="tglmulai">Tanggal Mulai</Label>
                                            <Input
                                                id="tglmulai"
                                                type="date"
                                                value={data.tglmulai}
                                                min={today}
                                                onChange={(e) => setData('tglmulai', e.target.value)}
                                                required
                                            />
                                            {errors.tglmulai && <p className="text-sm text-destructive">{errors.tglmulai}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tglselesai">Tanggal Selesai</Label>
                                            <Input
                                                id="tglselesai"
                                                type="date"
                                                value={data.tglselesai}
                                                min={data.tglmulai || today}
                                                onChange={(e) => setData('tglselesai', e.target.value)}
                                                required
                                            />
                                            {errors.tglselesai && <p className="text-sm text-destructive">{errors.tglselesai}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Metode Pembayaran</Label>
                                        <Input value="Midtrans (Otomatis)" readOnly className="bg-muted" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-3 space-y-6">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Car className="h-5 w-5" />
                                        Pratinjau Mobil
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                                        {selectedMobil?.foto ? (
                                            <img
                                                src={`/storage/${selectedMobil.foto}`}
                                                alt={selectedMobil.nama_mobil}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                                                <Car className="h-12 w-12" />
                                                <p className="mt-2 text-sm">Pratinjau Mobil</p>
                                            </div>
                                        )}
                                        {selectedMobil && (
                                            <Badge className="absolute bottom-2 right-2" variant="secondary">
                                                {selectedMobil.plat_mobil}
                                            </Badge>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold">{selectedMobil?.nama_mobil || 'Belum Memilih Mobil'}</h3>
                                        <p className="text-sm font-semibold text-primary">
                                            {selectedMobil ? formatCurrency(selectedMobil.harga) + ' / hari' : '-'}
                                        </p>
                                    </div>

                                    <div className="space-y-2 border-t pt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Harga / Hari</span>
                                            <span className="font-semibold">{formatCurrency(data.harga)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Durasi Sewa</span>
                                            <span className="font-semibold">{data.lama_sewa || 0} Hari</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Metode Pembayaran</span>
                                            <Badge variant="secondary">Midtrans</Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg bg-primary p-4 text-primary-foreground">
                                        <span className="font-semibold">Total Pembayaran</span>
                                        <span className="text-xl font-bold">{formatCurrency(data.total_bayar)}</span>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={processing || !data.kdmobil || !data.tglmulai || !data.tglselesai || !!isSelectedMobilUnavailable || isLoadingAvailable}
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Sewa Sekarang
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
        </BookingLayout>
    );
}
