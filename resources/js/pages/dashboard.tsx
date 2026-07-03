import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Head, Link, usePage } from '@inertiajs/react';
import { Car, Users, CalendarCheck, DollarSign, ArrowRight, TrendingUp, BarChart3 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from 'recharts';
import { useCountUp, useStaggerReveal, useScrollReveal } from '@/hooks/use-animation';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface StatProps {
    total_mobil: number;
    total_pelanggan: number;
    booking_aktif: number;
    total_pendapatan: number;
    mobil_tersedia: number;
    mobil_disewa: number;
    mobil_perawatan: number;
}

interface Booking {
    kdbooking: string;
    iduser: number;
    kdmobil: string;
    total_bayar: number;
    status: string;
    user: { nama_lengkap: string };
    mobil: { nama_mobil: string };
}

interface ChartData {
    monthly_revenue: { month: string; revenue: number }[];
    booking_by_status: { status: string; total: number }[];
    monthly_bookings: { month: string; bookings: number }[];
}

interface Props {
    stats: StatProps;
    recent_bookings: Booking[];
    mobil_selesai_rawat?: { kdmobil: string; nama_mobil: string; plat_mobil: string }[];
    chart_data: ChartData;
}

const revenueChartConfig = {
    revenue: {
        label: 'Pendapatan',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

const bookingChartConfig = {
    bookings: {
        label: 'Booking',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

const mobilStatusData = (stats: StatProps) => [
    { name: 'Tersedia', value: stats.mobil_tersedia, fill: 'var(--chart-2)' },
    { name: 'Disewa', value: stats.mobil_disewa, fill: 'var(--chart-1)' },
    { name: 'Perawatan', value: stats.mobil_perawatan, fill: 'var(--chart-4)' },
];

const mobilChartConfig = {
    tersedia: { label: 'Tersedia', color: 'var(--chart-2)' },
    disewa: { label: 'Disewa', color: 'var(--chart-1)' },
    perawatan: { label: 'Perawatan', color: 'var(--chart-4)' },
} satisfies ChartConfig;

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function getStatusBadgeVariant(status: string) {
    if (['Selesai', 'Sukses', 'Success', 'Berhasil'].includes(status)) return 'default';
    if (status === 'Pending') return 'secondary';
    if (['Batal', 'Gagal', 'Expired'].includes(status)) return 'destructive';
    return 'outline';
}

export default function Dashboard({ stats, recent_bookings, chart_data }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string; nama_lengkap?: string; name?: string } } }>().props;
    const user = auth.user;
    const userName = user?.nama_lengkap || user?.name || 'User';
    const isPimpinan = user?.role === 'pimpinan';

    const statsRef = useStaggerReveal();
    const chartsRef = useScrollReveal();
    const tablesRef = useScrollReveal();

    const totalMobilRef = useCountUp(stats.total_mobil);
    const totalPelangganRef = useCountUp(stats.total_pelanggan);
    const bookingAktifRef = useCountUp(stats.booking_aktif);
    const totalPendapatanRef = useCountUp(stats.total_pendapatan, { prefix: 'Rp ' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4">
                <div className="reveal flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Selamat Datang, {userName}</h1>
                        <p className="text-muted-foreground text-sm">Pantau seluruh aktivitas operasional rental Anda.</p>
                    </div>
                </div>

                <div ref={statsRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="stagger-item">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Mobil</CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div ref={totalMobilRef} className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Armada rental</p>
                        </CardContent>
                    </Card>

                    <Card className="stagger-item">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div ref={totalPelangganRef} className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Pengguna terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card className="stagger-item">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Booking Aktif</CardTitle>
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div ref={bookingAktifRef} className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Transaksi berjalan</p>
                        </CardContent>
                    </Card>

                    <Card className="stagger-item">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div ref={totalPendapatanRef} className="text-2xl font-bold">Rp 0</div>
                            <p className="text-xs text-muted-foreground">Dari booking selesai</p>
                        </CardContent>
                    </Card>
                </div>

                <div ref={chartsRef} className="grid grid-cols-1 gap-6 lg:grid-cols-7">
                    <Card className="reveal lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Pendapatan Bulanan
                            </CardTitle>
                            <CardDescription className="mt-1">Pendapatan 6 bulan terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
                                <BarChart accessibilityLayer data={chart_data.monthly_revenue} margin={{ left: 12, right: 12 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 6)} />
                                    <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className="reveal lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="h-5 w-5" />
                                Status Armada
                            </CardTitle>
                            <CardDescription className="mt-1">Distribusi status mobil</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <ChartContainer config={mobilChartConfig} className="h-[250px] w-full">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <Pie data={mobilStatusData(stats)} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} strokeWidth={2}>
                                        {mobilStatusData(stats).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                        <CardContent className="pt-0">
                            <div className="flex justify-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--chart-2)' }} />
                                    Tersedia ({stats.mobil_tersedia})
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--chart-1)' }} />
                                    Disewa ({stats.mobil_disewa})
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--chart-4)' }} />
                                    Perawatan ({stats.mobil_perawatan})
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div ref={tablesRef} className="grid grid-cols-1 gap-6 lg:grid-cols-7">
                    <Card className="reveal lg:col-span-4">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Pemesanan Terbaru</CardTitle>
                                    <CardDescription className="mt-1">5 transaksi terakhir</CardDescription>
                                </div>
                                {!isPimpinan && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/booking">
                                            Lihat Semua
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pelanggan</TableHead>
                                        <TableHead>Mobil</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recent_bookings.length > 0 ? (
                                        recent_bookings.map((booking) => (
                                            <TableRow key={booking.kdbooking}>
                                                <TableCell className="font-medium">{booking.user?.nama_lengkap}</TableCell>
                                                <TableCell>{booking.mobil?.nama_mobil}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                                                        {booking.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                                Belum ada pemesanan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="reveal lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Booking per Bulan
                            </CardTitle>
                            <CardDescription className="mt-1">Jumlah booking 6 bulan terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={bookingChartConfig} className="h-[250px] w-full">
                                <BarChart accessibilityLayer data={chart_data.monthly_bookings} margin={{ left: 12, right: 12 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 6)} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
