<?php

namespace App\Http\Controllers;

use App\Models\BookingMobil;
use App\Models\KembaliMobil;
use App\Models\Mobil;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function pelanggan(Request $request): Response
    {
        $query = User::where('role', 'pelanggan');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('laporan/pelanggan', [
            'pelanggans' => $query->latest()->get(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function mobil(Request $request): Response
    {
        $query = Mobil::with('kategori');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kdmobil', 'like', "%{$search}%")
                  ->orWhere('nama_mobil', 'like', "%{$search}%")
                  ->orWhere('plat_mobil', 'like', "%{$search}%")
                  ->orWhereHas('kategori', function($qk) use ($search) {
                      $qk->where('nama_kategori', 'like', "%{$search}%");
                  });
            });
        }

        $mobils = $query->latest()->get()->map(function ($mobil) {
            return [
                'kdmobil' => $mobil->kdmobil,
                'nama_mobil' => $mobil->nama_mobil,
                'thn_mobil' => $mobil->thn_mobil,
                'plat_mobil' => $mobil->plat_mobil,
                'warna_mobil' => $mobil->warna_mobil,
                'stnk_mobil' => $mobil->stnk_mobil,
                'harga' => $mobil->harga,
                'nama_kategori' => $mobil->kategori->nama_kategori ?? 'N/A',
                'status' => $mobil->status,
            ];
        });

        return Inertia::render('laporan/mobil', [
            'mobils' => $mobils,
            'filters' => $request->only(['search']),
        ]);
    }

    public function booking(Request $request): Response
    {
        $query = BookingMobil::with(['user', 'mobil']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kdbooking', 'like', "%{$search}%")
                  ->orWhereHas('user', function($qu) use ($search) {
                      $qu->where('nama_lengkap', 'like', "%{$search}%");
                  })
                  ->orWhereHas('mobil', function($qm) use ($search) {
                      $qm->where('nama_mobil', 'like', "%{$search}%");
                  })
                  ->orWhere('status', 'like', "%{$search}%");
            });
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tglmulai', [$request->start_date, $request->end_date]);
        }

        $bookings = $query->latest()->get()->map(function ($booking) {
            return [
                'kdbooking' => $booking->kdbooking,
                'nama_pelanggan' => $booking->user->nama_lengkap ?? 'N/A',
                'nama_mobil' => $booking->mobil->nama_mobil ?? 'N/A',
                'plat_mobil' => $booking->mobil->plat_mobil ?? 'N/A',
                'waktu_order' => $booking->lama_sewa . ' Hari',
                'tglmulai' => $booking->tglmulai,
                'tglselesai' => $booking->tglselesai,
                'status' => $booking->status,
                'payment_type' => $booking->payment_type,
                'total_bayar' => $booking->total_bayar,
            ];
        });

        return Inertia::render('laporan/booking', [
            'bookings' => $bookings,
            'filters' => $request->only(['search', 'start_date', 'end_date']),
        ]);
    }

    public function pengembalian(Request $request): Response
    {
        $query = KembaliMobil::with(['user', 'booking.mobil']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kdpengembalian', 'like', "%{$search}%")
                  ->orWhere('kdbooking', 'like', "%{$search}%")
                  ->orWhereHas('user', function($qu) use ($search) {
                      $qu->where('nama_lengkap', 'like', "%{$search}%");
                  })
                  ->orWhereHas('booking.mobil', function($qm) use ($search) {
                      $qm->where('nama_mobil', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tglpengembalian', [$request->start_date, $request->end_date]);
        }

        $pengembalians = $query->latest()->get()->map(function ($kembali) {
            return [
                'kdpengembalian' => $kembali->kdpengembalian,
                'nama_pelanggan' => $kembali->user->nama_lengkap ?? 'N/A',
                'nama_mobil' => $kembali->booking->mobil->nama_mobil ?? 'N/A',
                'plat_mobil' => $kembali->booking->mobil->plat_mobil ?? 'N/A',
                'tglmulai' => $kembali->tglmulai,
                'tglselesai' => $kembali->tglselesai,
                'tglpengembalian' => $kembali->tglpengembalian,
                'keterlambatan' => $kembali->keterlambatan . ' Hari',
                'denda' => $kembali->denda,
            ];
        });

        return Inertia::render('laporan/pengembalian', [
            'pengembalians' => $pengembalians,
            'filters' => $request->only(['search', 'start_date', 'end_date']),
        ]);
    }

    public function rental(Request $request): Response
    {
        $query = KembaliMobil::with(['user', 'booking.mobil']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kdpengembalian', 'like', "%{$search}%")
                  ->orWhere('kdbooking', 'like', "%{$search}%")
                  ->orWhereHas('user', function($qu) use ($search) {
                      $qu->where('nama_lengkap', 'like', "%{$search}%");
                  })
                  ->orWhereHas('booking.mobil', function($qm) use ($search) {
                      $qm->where('nama_mobil', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tglmulai', [$request->start_date, $request->end_date]);
        }

        $rentals = $query->latest()->get()->map(function ($kembali) {
            $totalSewa = $kembali->booking->total_bayar ?? 0;
            $denda = $kembali->denda ?? 0;

            return [
                'koderental' => $kembali->kdpengembalian,
                'kdbooking' => $kembali->kdbooking,
                'nama_pelanggan' => $kembali->user->nama_lengkap ?? 'N/A',
                'nama_mobil' => $kembali->booking->mobil->nama_mobil ?? 'N/A',
                'plat_mobil' => $kembali->booking->mobil->plat_mobil ?? 'N/A',
                'tglmulai' => $kembali->tglmulai,
                'tglselesai' => $kembali->tglselesai,
                'tglpengembalian' => $kembali->tglpengembalian,
                'keterlambatan' => $kembali->keterlambatan . ' Hari',
                'denda' => $denda,
                'totalsewa' => $totalSewa,
                'total_seluruh' => $totalSewa + $denda,
                'status' => $kembali->booking->status ?? 'N/A',
            ];
        });

        return Inertia::render('laporan/rental', [
            'rentals' => $rentals,
            'filters' => $request->only(['search', 'start_date', 'end_date']),
        ]);
    }

    public function belumKembali(Request $request): Response
    {
        $query = BookingMobil::whereNotIn('kdbooking', KembaliMobil::pluck('kdbooking'))
            ->where('status', 'Paid')
            ->with('mobil');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kdbooking', 'like', "%{$search}%")
                  ->orWhereHas('mobil', function($qm) use ($search) {
                      $qm->where('nama_mobil', 'like', "%{$search}%")
                        ->orWhere('plat_mobil', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tglmulai', [$request->start_date, $request->end_date]);
        }

        $belumKembali = $query->latest()->get()->map(function ($booking) {
            return [
                'kdbooking' => $booking->kdbooking,
                'nama_mobil' => $booking->mobil->nama_mobil ?? 'N/A',
                'plat_mobil' => $booking->mobil->plat_mobil ?? 'N/A',
                'tglmulai' => $booking->tglmulai,
                'status' => $booking->status,
            ];
        });

        return Inertia::render('laporan/belum_kembali', [
            'bookings' => $belumKembali,
            'filters' => $request->only(['search', 'start_date', 'end_date']),
        ]);
    }
}
