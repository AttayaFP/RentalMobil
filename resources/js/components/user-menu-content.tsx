import { Button } from '@/components/ui/button';
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Car, Check, LogOut, Settings, Wrench, X } from 'lucide-react';
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

interface UserMenuContentProps {
    user: User;
    onOpenNotif?: () => void;
}

export function UserMenuContent({ user, onOpenNotif }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const { auth } = usePage<{
        auth: {
            notifications?: NotificationItem[];
            mobil_selesai_rawat?: MobilSelesaiRawat[];
            user: { role: string };
        };
    }>().props;

    const notifications = auth?.notifications || [];
    const mobilSelesaiRawat = auth?.mobil_selesai_rawat || [];
    const isAdmin = auth?.user?.role === 'admin';
    const totalAlerts = notifications.length + mobilSelesaiRawat.length;

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    onOpenNotif?.();
                }}>
                    <div className="relative flex items-center w-full">
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notifikasi</span>
                        {totalAlerts > 0 && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                                {totalAlerts}
                            </span>
                        )}
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={cleanup}>
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
