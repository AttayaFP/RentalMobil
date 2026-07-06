<?php

namespace App\Http\Middleware;

use App\Models\BookingMobil;
use App\Models\Mobil;
use App\Models\Notifikasi;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $notifications = [];
        $mobilSelesaiRawat = [];
        $pendingBooking = null;

        if ($request->user()) {
            $user = $request->user();

            if ($user->role === 'pelanggan') {
                Notifikasi::generatePassiveNotifications($user->id);

                BookingMobil::autoExpirePendingBookings(1);

                $pending = BookingMobil::where('iduser', $user->id)
                    ->whereIn('status', ['Pending', 'pending'])
                    ->where('created_at', '>=', now()->subMinutes(1))
                    ->with(['mobil'])
                    ->latest()
                    ->first();

                if ($pending) {
                    $pendingBooking = [
                        'kdbooking' => $pending->kdbooking,
                        'nama_mobil' => $pending->mobil->nama_mobil ?? '-',
                        'total_bayar' => (int) $pending->total_bayar,
                        'created_at' => $pending->created_at->toISOString(),
                    ];
                }
            }

            if ($user->role === 'admin') {
                Notifikasi::generateAdminMaintenanceNotifications();
            }

            if ($user->role === 'admin') {
                $notifications = Notifikasi::where('iduser', $user->id)
                    ->where('is_read', false)
                    ->where('pesan', 'not like', '%perawatan%')
                    ->latest()
                    ->get();
            } elseif ($user->role === 'pelanggan') {
                $notifications = Notifikasi::where('iduser', $user->id)
                    ->where('is_read', false)
                    ->where('pesan', 'not like', '%perawatan%')
                    ->latest()
                    ->get();
            } else {
                $notifications = collect();
            }

            if ($user->role === 'admin') {
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

                        return $tglPengembalian->diffInDays(\Carbon\Carbon::now()->startOfDay(), false) >= 2;
                    })
                    ->values()
                    ->toArray();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'notifications' => $notifications,
                'mobil_selesai_rawat' => $mobilSelesaiRawat,
                'pending_booking' => $pendingBooking,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
