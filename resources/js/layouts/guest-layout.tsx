import { ReactNode, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Car, Menu, LogOut, User, Bell, X, FileText, Settings, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import SopDialog from '@/components/sop-dialog';

interface NotificationItem {
    id: number;
    kdmobil: string | null;
    pesan: string;
    is_read: boolean;
}

interface GuestLayoutProps {
    children: ReactNode;
}

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Cars', href: '/cars' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
];

export default function GuestLayout({ children }: GuestLayoutProps) {
    const { auth } = usePage<{
        auth: {
            user: { id: number; role: string; nama_lengkap?: string; name?: string } | null;
            notifications?: NotificationItem[];
        };
    }>().props;
    const user = auth?.user;
    const notifications = auth?.notifications || [];
    const [open, setOpen] = useState(false);
    const [openNotif, setOpenNotif] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    const markAsRead = (id: number) => {
        router.post(`/notifikasi/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Notifikasi ditandai sudah dibaca'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                        <Car className="h-6 w-6 text-primary" />
                        <span>Rental Mobil Nabil</span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">
                        {user ? (
                            <>
                                {user.role === 'pelanggan' && (
                                    <Button variant="ghost" size="icon" className="relative" onClick={() => setOpenNotif(true)}>
                                        <Bell className="h-5 w-5" />
                                        {notifications.length > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                                                {notifications.length}
                                            </span>
                                        )}
                                    </Button>
                                )}

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-none border-primary/30 hover:border-primary">
                                            <User className="h-4 w-4 text-primary" />
                                            <span className="font-semibold">{user.nama_lengkap || user.name}</span>
                                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 rounded-none border-2 border-primary/30 bg-black text-white p-1">
                                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal border-b border-white/10 pb-2 mb-1">
                                            Halo, <span className="font-bold text-white">{user.nama_lengkap || user.name}</span>
                                        </DropdownMenuLabel>
                                        
                                        {user.role === 'pelanggan' ? (
                                            <>
                                                <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/20 focus:bg-primary/20 focus:text-white rounded-none">
                                                    <Link href="/booking" className="flex items-center gap-2 w-full py-1.5">
                                                        <FileText className="h-4 w-4 text-primary" />
                                                        <span>Riwayat Sewa & Invoice</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/20 focus:bg-primary/20 focus:text-white rounded-none">
                                                    <Link href="/settings/profile" className="flex items-center gap-2 w-full py-1.5">
                                                        <Settings className="h-4 w-4 text-primary" />
                                                        <span>Edit Profil</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/20 focus:bg-primary/20 focus:text-white rounded-none">
                                                <Link href="/dashboard" className="flex items-center gap-2 w-full py-1.5">
                                                    <Car className="h-4 w-4 text-primary" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuSeparator className="bg-white/10 my-1" />

                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="cursor-pointer text-destructive focus:bg-destructive/20 focus:text-destructive rounded-none py-1.5 flex items-center gap-2"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/register">Register</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <SheetDescription className="sr-only">Mobile navigation links</SheetDescription>
                            <div className="mt-6 flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <hr className="my-2" />
                                {user ? (
                                    <>
                                        <div className="px-3 py-1 text-sm border-b pb-2 mb-1">
                                            <span className="text-xs text-muted-foreground block">Halo,</span>
                                            <span className="font-bold text-primary">{user.nama_lengkap || user.name}</span>
                                        </div>
                                        {user.role === 'pelanggan' && (
                                            <>
                                                <button
                                                    onClick={() => { setOpen(false); setOpenNotif(true); }}
                                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                                >
                                                    <Bell className="h-4 w-4 text-primary" />
                                                    Notifikasi
                                                    {notifications.length > 0 && (
                                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                                                            {notifications.length}
                                                        </span>
                                                    )}
                                                </button>
                                                <Link
                                                    href="/booking"
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                                >
                                                    <FileText className="h-4 w-4 text-primary" />
                                                    Riwayat Sewa & Invoice
                                                </Link>
                                                <Link
                                                    href="/settings/profile"
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                                >
                                                    <Settings className="h-4 w-4 text-primary" />
                                                    Edit Profil
                                                </Link>
                                            </>
                                        )}
                                        {user.role !== 'pelanggan' && (
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                            >
                                                <Car className="h-4 w-4 text-primary" />
                                                Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setOpen(false);
                                                handleLogout();
                                            }}
                                            className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-accent"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setOpen(false)}
                                            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setOpen(false)}
                                            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t bg-muted/40">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex items-center gap-2 font-semibold">
                            <Car className="h-5 w-5 text-primary" />
                            Rental Mobil Nabil Padang
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Komplek Perumdam III/4, Tunggul Hitam, Kota Padang &middot; Telp: 0812-xxxx-xxxx
                        </p>
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            <Sheet open={openNotif} onOpenChange={setOpenNotif}>
                <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifikasi
                        </SheetTitle>
                        <SheetDescription>
                            {notifications.length > 0 ? `${notifications.length} notifikasi belum dibaca` : 'Tidak ada notifikasi baru'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 flex flex-col gap-3">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
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
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Bell className="h-10 w-10 text-muted-foreground/30" />
                                <p className="mt-3 text-sm text-muted-foreground">Tidak ada notifikasi</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            <SopDialog />
        </div>
    );
}
