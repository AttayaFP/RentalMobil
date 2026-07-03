import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Bell, Car, Check, ChevronsUpDown, Trash2, Wrench, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface NotificationItem {
    id: number;
    kdmobil: string | null;
    pesan: string;
    is_read: boolean;
}

interface MobilSelesaiRawat {
    kdmobil: string;
    nama_mobil: string;
    plat_mobil: string;
}

export function NavUser() {
    const { auth } = usePage<SharedData & {
        auth: {
            notifications?: NotificationItem[];
            mobil_selesai_rawat?: MobilSelesaiRawat[];
            user: { role: string };
        };
    }>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    const [openNotif, setOpenNotif] = useState(false);

    const notifications = auth?.notifications || [];
    const mobilSelesaiRawat = auth?.mobil_selesai_rawat || [];
    const isAdmin = auth?.user?.role === 'admin';
    const totalAlerts = notifications.length + mobilSelesaiRawat.length;

    const markAsRead = (id: number) => {
        router.post(`/notifikasi/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Notifikasi ditandai sudah dibaca'),
        });
    };

    const deleteNotif = (id: number) => {
        router.delete(`/notifikasi/${id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Notifikasi dihapus'),
        });
    };

    const setTersedia = (kdmobil: string, plat: string) => {
        router.post(`/mobil/${kdmobil}/set-tersedia`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Mobil ${plat} berhasil diubah menjadi Tersedia`),
            onError: () => toast.error('Gagal mengubah status mobil'),
        });
    };

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton size="lg" className="text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent group">
                                <UserInfo user={auth.user} />
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            align="end"
                            side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                        >
                            <UserMenuContent user={auth.user} onOpenNotif={() => setOpenNotif(true)} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <Sheet open={openNotif} onOpenChange={setOpenNotif}>
                <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifikasi
                        </SheetTitle>
                        <SheetDescription>
                            {totalAlerts > 0 ? `${totalAlerts} notifikasi belum dibaca` : 'Tidak ada notifikasi baru'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 flex flex-col gap-3">
                        {isAdmin && mobilSelesaiRawat.length > 0 && (
                            <>
                                <p className="text-xs font-semibold uppercase text-muted-foreground">Mobil Selesai Perawatan</p>
                                {mobilSelesaiRawat.map((mobil) => (
                                    <div key={mobil.kdmobil} className="flex items-start gap-3 rounded-lg border p-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/10">
                                            <Wrench className="h-4 w-4 text-orange-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{mobil.nama_mobil}</p>
                                            <p className="text-xs text-muted-foreground">{mobil.plat_mobil} — sudah selesai perawatan ≥2 hari</p>
                                            <Button
                                                size="sm"
                                                className="mt-2 h-7 text-xs"
                                                onClick={() => setTersedia(mobil.kdmobil, mobil.plat_mobil)}
                                            >
                                                <Check className="mr-1 h-3 w-3" />
                                                Ubah ke Tersedia
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {notifications.length > 0 && (
                            <>
                                <p className="text-xs font-semibold uppercase text-muted-foreground">Pemberitahuan</p>
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="flex items-start gap-3 rounded-lg border p-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                                            <Car className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm leading-relaxed">{notif.pesan}</p>
                                            <div className="mt-2 flex gap-2">
                                                {notif.kdmobil && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs"
                                                        onClick={() => {
                                                            markAsRead(notif.id);
                                                            setOpenNotif(false);
                                                            router.visit(`/booking/create?kdmobil=${notif.kdmobil}`);
                                                        }}
                                                    >
                                                        Booking Sekarang
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 text-xs text-muted-foreground"
                                                    onClick={() => markAsRead(notif.id)}
                                                >
                                                    <X className="mr-1 h-3 w-3" />
                                                    Tutup
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 text-xs text-red-500 hover:text-red-600"
                                                    onClick={() => deleteNotif(notif.id)}
                                                >
                                                    <Trash2 className="mr-1 h-3 w-3" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {totalAlerts === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Bell className="h-10 w-10 text-muted-foreground/30" />
                                <p className="mt-3 text-sm text-muted-foreground">Tidak ada notifikasi</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
