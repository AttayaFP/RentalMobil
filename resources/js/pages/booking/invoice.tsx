import BookingLayout from '@/layouts/booking-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, User, Clock, Car, CreditCard, Info } from 'lucide-react';

interface Booking {
    kdbooking: string;
    tglbooking: string;
    tglmulai: string;
    tglselesai: string;
    lama_sewa: number;
    total_bayar: number;
    payment_method: string;
    status: string;
    transaction_time: string;
}

interface UserData {
    nama_lengkap: string;
    alamat: string;
    nohp: string;
}

interface MobilData {
    nama_mobil: string;
    plat_mobil: string;
    stnk_mobil: string;
}

interface Props {
    booking: Booking;
    user: UserData;
    mobil: MobilData;
}

function getStatusBadge(status: string) {
    const s = (status || '').toLowerCase();
    if (['sukses', 'success', 'berhasil', 'selesai'].includes(s)) return 'default';
    if (['pending', 'proses'].includes(s)) return 'secondary';
    if (['batal', 'gagal', 'expired'].includes(s)) return 'destructive';
    return 'outline';
}

import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { XCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function Invoice({ booking, user, mobil }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string } | null } }>().props;
    const backLink = auth?.user?.role === 'pelanggan' ? '/' : '/booking';
    const [showCancelModal, setShowCancelModal] = useState(false);

    const isPaid = ['sukses', 'success', 'berhasil'].includes((booking.status || '').toLowerCase());
    const isCancelable = ['sukses', 'success', 'berhasil', 'pending', 'proses'].includes((booking.status || '').toLowerCase());

    const { data, setData, post, processing, errors } = useForm({
        nama_bank: '',
        no_rekening: '',
        nama_rekening: '',
    });

    const handleCancelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/booking/${booking.kdbooking}/cancel`, {
            onSuccess: () => {
                toast.success(isPaid ? 'Booking berhasil dibatalkan. Pengajuan refund 50% dikirim ke Admin.' : 'Booking berhasil dibatalkan.');
                setShowCancelModal(false);
            },
            onError: () => {
                toast.error('Gagal membatalkan booking. Periksa kembali form.');
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Booking', href: '/booking' },
        { title: `Faktur #${booking.kdbooking}`, href: '#' },
    ];

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    const formatDate = (s: string) => {
        if (!s) return '-';
        const d = new Date(s);
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    };

    const formatShort = (s: string) => {
        if (!s) return '-';
        const d = new Date(s);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const txTime = booking.transaction_time || booking.tglbooking;

    return (
        <BookingLayout breadcrumbs={breadcrumbs} title={`Faktur #${booking.kdbooking}`}>
            <div className="flex flex-col gap-4 p-4">
                <div className="no-print flex items-center justify-between gap-2 flex-wrap">
                    <Button variant="ghost" asChild>
                        <Link href={backLink}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        {isCancelable && (
                            <Button
                                variant="destructive"
                                className="rounded-none"
                                onClick={() => setShowCancelModal(true)}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Batalkan Booking
                            </Button>
                        )}
                        <Button onClick={() => window.print()} className="rounded-none">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak Faktur
                        </Button>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-4xl rounded-xl border bg-card shadow-lg print:max-w-full print:rounded-none print:shadow-none print:border-0">
                    <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-500 p-6 text-white print:rounded-none">
                        <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full bg-orange-500/20" />
                        <div className="absolute bottom-[-18px] right-20 h-16 w-16 rounded-full bg-white/5" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <img
                                    src="/storage/logo/logo.jpg"
                                    alt="Logo"
                                    className="h-[90px] w-auto rounded-[10px] bg-white p-1 object-contain shadow-lg"
                                />
                                <div>
                                    <div className="text-lg font-extrabold leading-tight tracking-wide">
                                        PT. NABIL RENTAL MOBIL PADANG
                                    </div>
                                    <div className="mt-1 text-xs font-medium text-white/80">
                                        Kompek Perumdam/III/4, Tunggul Hitam, Kota Padang
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] uppercase tracking-widest text-white/50">
                                    Faktur Pembayaran
                                </div>
                                <div className="text-xl font-extrabold tracking-wide">
                                    #{booking.kdbooking}
                                </div>
                                <Badge variant={getStatusBadge(booking.status)} className="mt-1">
                                    {booking.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 p-6">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border-l-4 border-l-orange-500 bg-muted/50 p-4">
                                <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">
                                    <User className="h-3 w-3" />
                                    Informasi Pelanggan
                                </div>
                                <div className="space-y-1">
                                    <InfoRow label="Nama" value={user.nama_lengkap} />
                                    <InfoRow label="Alamat" value={user.alamat || '-'} />
                                    <InfoRow label="No. HP" value={user.nohp || '-'} />
                                </div>
                            </div>
                            <div className="rounded-lg border-l-4 border-l-slate-900 bg-muted/50 p-4">
                                <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                                    <Clock className="h-3 w-3" />
                                    Detail Transaksi
                                </div>
                                <div className="space-y-1">
                                    <InfoRow label="Waktu" value={formatDate(txTime)} />
                                    <InfoRow label="Status" value={booking.status} />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-dashed" />

                        <div>
                            <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <Car className="h-3 w-3" />
                                Detail Kendaraan & Sewa
                            </div>
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-900 text-white">
                                            <th className="px-3 py-2 text-center text-xs font-bold">Nama Mobil</th>
                                            <th className="px-3 py-2 text-center text-xs font-bold">Plat Mobil</th>
                                            <th className="px-3 py-2 text-center text-xs font-bold">STNK Mobil</th>
                                            <th className="px-3 py-2 text-center text-xs font-bold">Lama Rental</th>
                                            <th className="px-3 py-2 text-center text-xs font-bold">Tgl Rental</th>
                                            <th className="px-3 py-2 text-center text-xs font-bold">Tgl Selesai</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-3 py-3 text-center text-xs font-medium">{mobil.nama_mobil}</td>
                                            <td className="px-3 py-3 text-center text-xs font-medium">{mobil.plat_mobil}</td>
                                            <td className="px-3 py-3 text-center text-xs font-medium">{mobil.stnk_mobil}</td>
                                            <td className="px-3 py-3 text-center text-xs font-bold text-orange-600">{booking.lama_sewa} Hari</td>
                                            <td className="px-3 py-3 text-center text-xs font-medium">{formatShort(booking.tglmulai)}</td>
                                            <td className="px-3 py-3 text-center text-xs font-medium">{formatShort(booking.tglselesai)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <div className="w-full max-w-xs overflow-hidden rounded-lg border">
                                <div className="flex items-center justify-between border-b px-4 py-2">
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <CreditCard className="h-3 w-3 text-orange-500" />
                                        Metode Pembayaran
                                    </span>
                                    <span className="text-xs font-bold">{booking.payment_method || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-3">
                                    <span className="text-sm font-medium text-white/80">Total Pembayaran</span>
                                    <span className="text-lg font-extrabold text-orange-500">
                                        {formatCurrency(booking.total_bayar)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <SignatureBlock
                                title="Mengetahui,"
                                role="Pelanggan"
                                name={user.nama_lengkap}
                            />
                            <SignatureBlock
                                title={`Padang, ${new Date(txTime).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`}
                                role="Petugas"
                                name="PT. Nabil Rental Mobil"
                            />
                        </div>

                        <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3 text-center">
                            <p className="text-xs font-medium text-orange-800">
                                <Info className="mr-1 inline h-3 w-3" />
                                Terima kasih atas kepercayaan Anda. Simpan faktur ini sebagai bukti pengambilan kendaraan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogContent className="max-w-md rounded-none border-2 border-primary/40 bg-black text-white p-6 shadow-2xl">
                    <form onSubmit={handleCancelSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                Konfirmasi Pembatalan
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-1">
                                Pembatalan penyewaan mobil #{booking.kdbooking} sesuai aturan SOP Poin 6 & 7.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="my-4 space-y-4 text-xs">
                            {isPaid ? (
                                <>
                                    <div className="rounded-none border border-amber-500/30 bg-amber-500/10 p-3 space-y-1.5 text-amber-200">
                                        <div className="font-bold flex items-center gap-1">
                                            <ShieldAlert className="h-4 w-4 text-amber-400" />
                                            Kebijakan Pengembalian Dana (Refund 50%)
                                        </div>
                                        <p>Sesuai SOP, pembatalan booking berbayar akan dikenakan pemotongan 50%. Anda akan menerima refund sebesar:</p>
                                        <div className="text-sm font-extrabold text-primary pt-1">
                                            {formatCurrency(booking.total_bayar * 0.5)}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">(50% dari total bayar {formatCurrency(booking.total_bayar)})</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="nama_bank" className="text-xs text-white">Nama Bank / E-Wallet</Label>
                                            <Input
                                                id="nama_bank"
                                                placeholder="Contoh: BCA / Mandiri / BRI / GoPay"
                                                value={data.nama_bank}
                                                onChange={(e) => setData('nama_bank', e.target.value)}
                                                className="rounded-none bg-zinc-900 border-zinc-700 text-white"
                                                required
                                            />
                                            {errors.nama_bank && <p className="text-red-400 text-[11px]">{errors.nama_bank}</p>}
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="no_rekening" className="text-xs text-white">Nomor Rekening / No. HP E-Wallet</Label>
                                            <Input
                                                id="no_rekening"
                                                placeholder="Masukkan nomor rekening tujuan refund"
                                                value={data.no_rekening}
                                                onChange={(e) => setData('no_rekening', e.target.value)}
                                                className="rounded-none bg-zinc-900 border-zinc-700 text-white"
                                                required
                                            />
                                            {errors.no_rekening && <p className="text-red-400 text-[11px]">{errors.no_rekening}</p>}
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="nama_rekening" className="text-xs text-white">Nama Pemilik Rekening</Label>
                                            <Input
                                                id="nama_rekening"
                                                placeholder="Nama lengkap sesuai pemilik rekening"
                                                value={data.nama_rekening}
                                                onChange={(e) => setData('nama_rekening', e.target.value)}
                                                className="rounded-none bg-zinc-900 border-zinc-700 text-white"
                                                required
                                            />
                                            {errors.nama_rekening && <p className="text-red-400 text-[11px]">{errors.nama_rekening}</p>}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-none border border-zinc-800 bg-zinc-900 p-3 text-zinc-300">
                                    Apakah Anda yakin ingin membatalkan pesanan booking ini? Pesanan yang dibatalkan tidak dapat dikembalikan.
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-none border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                onClick={() => setShowCancelModal(false)}
                                disabled={processing}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                className="rounded-none font-bold"
                                disabled={processing}
                            >
                                Konfirmasi Pembatalan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    nav, aside, header, [data-sidebar] { display: none !important; }
                    [data-layout] { padding: 0 !important; margin: 0 !important; }
                    main { padding: 0 !important; }
                    html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    @page { size: A4 portrait; margin: 6mm; }
                }
            `}</style>
        </BookingLayout>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline text-xs">
            <span className="w-14 shrink-0 font-semibold text-muted-foreground">{label}</span>
            <span className="mx-1 text-muted-foreground">:</span>
            <span className="font-semibold break-words">{value}</span>
        </div>
    );
}

function SignatureBlock({ title, role, name }: { title: string; role: string; name: string }) {
    return (
        <div className="min-w-[160px] text-center">
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-xs font-bold">{role}</p>
            <div className="h-10" />
            <div className="border-t border-foreground pt-1 text-xs font-bold">
                ( {name} )
            </div>
        </div>
    );
}
