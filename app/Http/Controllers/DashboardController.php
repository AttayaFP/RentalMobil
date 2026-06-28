<?php

namespace App\Http\Controllers;

use App\Models\BookingMobil;
use App\Models\Mobil;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
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
                    $tglPengembalian = \Carbon\Carbon::parse($latestKembali->tglpengembalian)->startOfDay();
                } else {
                    $tglPengembalian = \Carbon\Carbon::parse($mobil->updated_at)->startOfDay();
                }

                $hariIni = \Carbon\Carbon::now()->startOfDay();

                return $tglPengembalian->diffInDays($hariIni, false) >= 2;
            })
            ->values();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_mobil' => Mobil::count(),
                'total_pelanggan' => User::where('role', 'pelanggan')->count(),
                'booking_aktif' => BookingMobil::where('status', '!=', 'Selesai')->count(),
                'total_pendapatan' => (float) BookingMobil::where('status', 'Selesai')->sum('total_bayar'),
                'mobil_tersedia' => Mobil::where('status', 'Tersedia')->count(),
                'mobil_disewa' => Mobil::where('status', 'Disewa')->count(),
                'mobil_perawatan' => Mobil::where('status', 'Perawatan')->count(),
            ],
            'recent_bookings' => BookingMobil::with(['user', 'mobil'])
                ->latest()
                ->take(5)
                ->get(),
            'mobil_selesai_rawat' => $mobilSelesaiRawat,
        ]);
    }
}
