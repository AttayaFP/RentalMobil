import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Users, Car, Tag, Calendar, RotateCcw, Database, ArrowRightLeft, FileText } from 'lucide-react';
import AppLogo from './app-logo';

import { usePage } from '@inertiajs/react';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Master',
            url: '#',
            icon: Database,
            items: [
                {
                    title: 'Kategori',
                    url: '/kategori',
                },
                {
                    title: 'Mobil',
                    url: '/mobil',
                },
                {
                    title: 'Pelanggan',
                    url: '/pelanggan',
                },
            ],
        },
        {
            title: 'Transaksi',
            url: '#',
            icon: ArrowRightLeft,
            items: [
                {
                    title: 'Booking',
                    url: '/booking',
                },
                {
                    title: 'Pengembalian',
                    url: '/pengembalian',
                },
            ],
        },
        {
            title: 'Laporan',
            url: '#',
            icon: FileText,
            items: [
                {
                    title: 'Laporan Pelanggan',
                    url: '/laporan/pelanggan',
                },
                {
                    title: 'Laporan Mobil',
                    url: '/laporan/mobil',
                },
                {
                    title: 'Laporan Booking',
                    url: '/laporan/booking',
                },
                {
                    title: 'Laporan Pengembalian',
                    url: '/laporan/pengembalian',
                },
                {
                    title: 'Laporan Rental',
                    url: '/laporan/rental',
                },
                {
                    title: 'Laporan Mobil Belum Kembali',
                    url: '/laporan/belum-kembali',
                },
            ],
        },
    ];

    // Filter items based on role
    const filteredItems = mainNavItems.filter(item => {
        if (userRole === 'pelanggan') {
            // Pelanggan only sees Dashboard
            return ['Dashboard'].includes(item.title);
        }
        if (userRole === 'pimpinan') {
            // Pimpinan sees Dashboard and Laporan
            return ['Dashboard', 'Laporan'].includes(item.title);
        }
        // Admin sees everything
        return true;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
