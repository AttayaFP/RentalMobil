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
        ]);
    }
}
