import { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Car } from 'lucide-react';
import { toast } from 'sonner';

interface UnratedPengembalian {
    kdpengembalian: string;
    kdbooking: string;
    nama_mobil: string;
    foto_mobil?: string | null;
    tglpengembalian: string;
}

export default function RatingDialog() {
    const { auth } = usePage<{
        auth: {
            user: { id: number; role: string } | null;
            unrated_pengembalian?: UnratedPengembalian | null;
        };
    }>().props;

    const unrated = auth?.unrated_pengembalian;

    const { data, setData, post, processing, reset } = useForm({
        rating: 5,
        ulasan: '',
    });

    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [dismissed, setDismissed] = useState(false);

    if (!auth?.user || auth.user.role !== 'pelanggan' || !unrated || dismissed) {
        return null;
    }

    const currentRating = hoveredRating !== null ? hoveredRating : data.rating;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setDismissed(true);
        post(`/pengembalian/${unrated.kdpengembalian}/rating`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Terima kasih atas rating & ulasan Anda!');
                reset();
            },
            onError: () => {
                setDismissed(false);
                toast.error('Gagal menyimpan rating. Silakan coba lagi.');
            },
        });
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && setDismissed(true)}>
            <DialogContent className="sm:max-w-md rounded-none border-2 border-primary/40 bg-card text-foreground">
                <DialogHeader className="space-y-2 text-center sm:text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Car className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl font-bold uppercase tracking-wider">
                        Beri Rating Pengembalian
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Mobil <span className="font-semibold text-foreground">{unrated.nama_mobil}</span> telah berhasil dikembalikan. Bagaimana pengalaman rental Anda?
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-2">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Label className="text-sm font-semibold uppercase tracking-wider">
                            Pilih Rating
                        </Label>
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(null)}
                                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                                >
                                    <Star
                                        className={`h-8 w-8 ${
                                            star <= currentRating
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-muted-foreground/30'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-xs font-semibold text-primary">
                            {currentRating === 5 && 'Sangat Memuaskan (5/5)'}
                            {currentRating === 4 && 'Memuaskan (4/5)'}
                            {currentRating === 3 && 'Cukup (3/5)'}
                            {currentRating === 2 && 'Kurang (2/5)'}
                            {currentRating === 1 && 'Sangat Kurang (1/5)'}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ulasan" className="text-sm font-medium">
                            Ulasan / Catatan (Opsional)
                        </Label>
                        <Textarea
                            id="ulasan"
                            placeholder="Tulis kesan & pesan Anda mengenai pelayanan atau kondisi mobil..."
                            value={data.ulasan}
                            onChange={(e) => setData('ulasan', e.target.value)}
                            rows={3}
                            className="rounded-none border-primary/20 bg-background text-sm focus:border-primary"
                        />
                    </div>

                    <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDismissed(true)}
                            className="rounded-none border-primary/30"
                        >
                            Nanti Saja
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-none font-bold uppercase tracking-wider"
                        >
                            Kirim Rating
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
