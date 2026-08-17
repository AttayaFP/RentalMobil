import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle2, LogOut, FileText } from 'lucide-react';

interface SopPoint {
    title: string;
    description: string;
}

const sopPoints: SopPoint[] = [
    {
        title: '1. Jaminan Sewa Kendaraan',
        description: 'Pelanggan wajib menyerahkan jaminan berupa kendaraan bermotor (sepeda motor) beserta STNK asli yang masih berlaku selama masa penyewaan.',
    },
    {
        title: '2. Batas & Peruntukan Penggunaan',
        description: 'Kendaraan hanya boleh digunakan untuk keperluan yang sah menurut hukum dan dilarang keras dipindahtangankan, digadaikan, atau disewakan kembali kepada pihak ketiga.',
    },
    {
        title: '3. Pengembalian & Denda Keterlambatan',
        description: 'Kendaraan wajib dikembalikan tepat waktu sesuai dengan jadwal yang telah disepakati. Keterlambatan pengembalian akan dikenakan denda sesuai dengan regulasi tarif sewa mobil per harinya.',
    },
    {
        title: '4. Bahan Bakar & Kebersihan Kendaraan',
        description: 'Posisi/level bahan bakar (BBM) saat pengembalian wajib sama dengan posisi awal saat pengambilan kendaraan, serta pelanggan wajib menjaga kebersihan interior dan eksterior kendaraan.',
    },
    {
        title: '5. Tanggung Jawab Kerusakan & Kehilangan',
        description: 'Apabila terjadi kehilangan perlengkapan kendaraan selama masa sewa, pelanggan wajib mengganti sesuai dengan perlengkapan yang hilang. Sedangkan untuk kerusakan fisik kendaraan, pelanggan wajib berhubungan langsung dengan petugas kendaraan untuk mengonfirmasi barang/komponen apa saja yang perlu dibeli guna memperbaiki kerusakan fisik tersebut.',
    },
    {
        title: '6. Prosedur Pembatalan Pemesanan (Booking)',
        description: 'Apabila pelanggan yang telah melakukan pemesanan (booking) membatalkan penyewaan pada hari yang telah ditentukan, pelanggan wajib memberikan pemberitahuan resmi melalui menu Contact pada aplikasi dengan mengirimkan pesan pembatalan beserta nomor rekening pengembalian dana.',
    },
    {
        title: '7. Kebijakan Pengembalian Dana (Refund)',
        description: 'Pengembalian dana (refund) akibat pembatalan penyewaan mobil adalah sebesar 50% dari total uang yang telah dibayarkan.',
    },
];

export default function SopDialog() {
    const { auth } = usePage<{
        auth: {
            user: { id: number; role: string; nama_lengkap?: string; name?: string } | null;
            sop_agreed?: boolean;
        };
    }>().props;

    const [submitting, setSubmitting] = useState(false);

    const isPelanggan = auth?.user?.role === 'pelanggan';
    const sopAgreed = auth?.sop_agreed ?? true;

    if (!isPelanggan || sopAgreed) {
        return null;
    }

    const handleAgree = () => {
        setSubmitting(true);
        router.post('/sop/agree', {}, {
            onFinish: () => setSubmitting(false),
        });
    };

    const handleDecline = () => {
        setSubmitting(true);
        router.post('/sop/decline', {}, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <Dialog open={true}>
            <DialogContent
                className="max-w-3xl rounded-none border-2 border-primary/40 bg-black text-white p-6 shadow-2xl [&>button]:hidden"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 border border-primary/30">
                            <ShieldAlert className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Standard Operating Procedure (SOP)
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                PT. Nabil Rental Mobil Padang — Syarat & Ketentuan Penyewaan Kendaraan
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="my-4 max-h-[55vh] overflow-y-auto pr-2 space-y-4 text-sm leading-relaxed">
                    <div className="rounded-none border border-primary/20 bg-muted/20 p-3 text-xs text-amber-300">
                        PENTING: Harap membaca dan memahami seluruh ketentuan di bawah ini secara teliti sebelum melanjutkan penggunaan layanan rental mobil kami.
                    </div>

                    <div className="space-y-3.5">
                        {sopPoints.map((point, index) => (
                            <div key={index} className="rounded-none border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-primary/30">
                                <h4 className="font-semibold text-primary mb-1 text-sm">{point.title}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{point.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-2 sm:justify-between items-center">
                    <p className="text-[11px] text-muted-foreground text-center sm:text-left">
                        Dengan menekan tombol <span className="text-primary font-medium">Setuju & Lanjutkan</span>, Anda menyatakan telah membaca dan menyetujui seluruh ketentuan SOP di atas.
                    </p>
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-none border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive text-xs w-1/2 sm:w-auto"
                            onClick={handleDecline}
                            disabled={submitting}
                        >
                            <LogOut className="mr-1.5 h-3.5 w-3.5" />
                            Tidak Setuju
                        </Button>
                        <Button
                            type="button"
                            className="rounded-none bg-primary text-black font-semibold hover:bg-primary/90 text-xs w-1/2 sm:w-auto"
                            onClick={handleAgree}
                            disabled={submitting}
                        >
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            Setuju & Lanjutkan
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
