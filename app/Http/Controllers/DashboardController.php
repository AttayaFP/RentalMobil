<?php

namespace App\Http\Controllers;

use App\Models\BookingMobil;
use App\Models\Mobil;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        if (Auth::user()->role === 'pelanggan') {
            return redirect('/');
        }

        $mobilSelesaiRawat = Mobil::whereRaw('LOWER(status) = ?', ['perawatan'])
            ->get()
            ->filter(function ($mobil) {
                $latestKembali = \App\Models\KembaliMobil::whereHas('booking', function ($q) use ($mobil) {
                    $q->where('kdmobil', $mobil->kdmobil);
                })->orderBy('tglpengembalian', 'desc')->first();

                if ($latestKembali && $latestKembali->tglpengembalian) {
                    $tglPengembalian = Carbon::parse($latestKembali->tglpengembalian)->startOfDay();
                } else {
                    $tglPengembalian = Carbon::parse($mobil->updated_at)->startOfDay();
                }

                $hariIni = Carbon::now()->startOfDay();

                return $tglPengembalian->diffInDays($hariIni, false) >= 2;
            })
            ->values();

        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $total = BookingMobil::whereIn('status', ['Sukses', 'Success', 'Berhasil', 'Selesai'])
                ->whereYear('tglbooking', $date->year)
                ->whereMonth('tglbooking', $date->month)
                ->sum('total_bayar');
            $monthlyRevenue[] = [
                'month' => $date->format('M Y'),
                'revenue' => (float) $total,
            ];
        }

        $bookingByStatus = BookingMobil::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'total' => (int) $item->total,
                ];
            });

        $monthlyBookings = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = BookingMobil::whereYear('tglbooking', $date->year)
                ->whereMonth('tglbooking', $date->month)
                ->count();
            $monthlyBookings[] = [
                'month' => $date->format('M Y'),
                'bookings' => (int) $count,
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'total_mobil' => Mobil::count(),
                'total_pelanggan' => User::where('role', 'pelanggan')->count(),
                'booking_aktif' => BookingMobil::whereIn('status', ['Sukses', 'Success', 'Berhasil'])->count(),
                'total_pendapatan' => (float) BookingMobil::whereIn('status', ['Sukses', 'Success', 'Berhasil', 'Selesai'])->sum('total_bayar'),
                'mobil_tersedia' => Mobil::where('status', 'Tersedia')->count(),
                'mobil_disewa' => Mobil::where('status', 'Disewa')->count(),
                'mobil_perawatan' => Mobil::where('status', 'Perawatan')->count(),
            ],
            'recent_bookings' => BookingMobil::with(['user', 'mobil'])
                ->latest()
                ->take(5)
                ->get(),
            'mobil_selesai_rawat' => $mobilSelesaiRawat,
            'chart_data' => [
                'monthly_revenue' => $monthlyRevenue,
                'booking_by_status' => $bookingByStatus,
                'monthly_bookings' => $monthlyBookings,
            ],
        ]);
    }
}
