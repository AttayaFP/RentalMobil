<?php

namespace App\Http\Controllers;

use App\Models\BookingMobil;
use App\Models\Mobil;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    private const PENDING_LOCK_MINUTES = 1;

    public function index(Request $request)
    {
        BookingMobil::autoExpirePendingBookings(self::PENDING_LOCK_MINUTES);
        $query = BookingMobil::query();

        if (Auth::user() && Auth::user()->role === 'pelanggan') {
            $query->where('iduser', Auth::id())
                ->whereIn('status', ['Selesai', 'Success', 'Berhasil']);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kdbooking', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('nama_lengkap', 'like', "%{$search}%");
                    })
                    ->orWhereHas('mobil', function ($m) use ($search) {
                        $m->where('nama_mobil', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('tglbooking', $request->date);
        }

        return Inertia::render('booking/index', [
            'bookings' => $query->with(['user', 'mobil'])->latest()->get(),
            'filters' => $request->only(['search', 'date']),
        ]);
    }

    public function getAvailableCars(Request $request)
    {
        BookingMobil::autoExpirePendingBookings(self::PENDING_LOCK_MINUTES);
        $request->validate([
            'tglmulai' => 'required|date',
            'tglselesai' => 'required|date|after_or_equal:tglmulai',
        ]);

        $tglmulai = $request->tglmulai;
        $tglselesai = $request->tglselesai;

        $bookedMobilIds = BookingMobil::where(function ($q) {
            $q->whereIn('status', ['Sukses', 'success', 'Success', 'Berhasil', 'Selesai', 'challenge'])
                ->orWhere(function ($qp) {
                    $qp->whereIn('status', ['Pending', 'pending'])
                        ->where('created_at', '>=', now()->subMinutes(self::PENDING_LOCK_MINUTES));
                });
        })
            ->where(function ($q) use ($tglmulai, $tglselesai) {
                $q->where('tglmulai', '<=', $tglselesai)
                    ->where('tglselesai', '>=', $tglmulai);
            })
            ->pluck('kdmobil')
            ->unique();

        $mobils = Mobil::where('status', 'Tersedia')
            ->whereNotIn('kdmobil', $bookedMobilIds)
            ->get();

        return response()->json($mobils->map(fn($m) => [
            'kdmobil' => $m->kdmobil,
            'nama_mobil' => $m->nama_mobil,
            'plat_mobil' => $m->plat_mobil,
            'harga' => $m->harga,
            'foto' => $m->foto,
            'status' => $m->status,
        ]));
    }

    private function generateKdBooking(): string
    {
        $last = BookingMobil::orderByRaw('CAST(SUBSTRING(kdbooking, 3) AS UNSIGNED) DESC')
            ->whereRaw('kdbooking REGEXP "^BO[0-9]+$"')
            ->first();

        if ($last) {
            $number = (int) substr($last->kdbooking, 2) + 1;
        } else {
            $number = 1;
        }

        return 'BO' . str_pad($number, 3, '0', STR_PAD_LEFT);
    }

    public function create(Request $request)
    {
        $user = Auth::user();
        $mobils = Mobil::where('status', 'Tersedia')->get();

        return Inertia::render('booking/create', [
            'users' => User::all(),
            'mobils' => $mobils->map(fn($m) => [
                'kdmobil' => $m->kdmobil,
                'nama_mobil' => $m->nama_mobil,
                'plat_mobil' => $m->plat_mobil,
                'harga' => $m->harga,
                'foto' => $m->foto,
                'status' => $m->status,
            ]),
            'selected_kdmobil' => $request->query('kdmobil'),
            'next_kdbooking' => $this->generateKdBooking(),
        ]);
    }

    public function store(Request $request)
    {
        BookingMobil::autoExpirePendingBookings(self::PENDING_LOCK_MINUTES);
        $request->validate([
            'tglbooking' => 'required|date',
            'iduser' => 'required',
            'kdmobil' => 'required|exists:mobil,kdmobil',
            'harga' => 'required|numeric',
            'tglmulai' => 'required|date',
            'tglselesai' => 'required|date|after_or_equal:tglmulai',
            'lama_sewa' => 'required|integer',
            'total_bayar' => 'required|numeric',
            'payment_method' => 'required|string',
            'status' => 'required|string',
        ]);

        $overlapResult = DB::transaction(function () use ($request) {
            $mobil = Mobil::where('kdmobil', $request->kdmobil)->lockForUpdate()->first();

            if (!$mobil || $mobil->status !== 'Tersedia') {
                return 'not_available';
            }

            $overlapExists = BookingMobil::where('kdmobil', $request->kdmobil)
                ->where(function ($q) {
                    $q->whereIn('status', ['Sukses', 'success', 'Success', 'Berhasil', 'Selesai', 'challenge'])
                        ->orWhere(function ($qp) {
                            $qp->whereIn('status', ['Pending', 'pending'])
                                ->where('created_at', '>=', now()->subMinutes(self::PENDING_LOCK_MINUTES));
                        });
                })
                ->where(function ($q) use ($request) {
                    $q->where('tglmulai', '<=', $request->tglselesai)
                        ->where('tglselesai', '>=', $request->tglmulai);
                })
                ->exists();

            if ($overlapExists) {
                return 'overlap';
            }

            return 'ok';
        });

        if ($overlapResult === 'not_available') {
            return back()->withErrors(['kdmobil' => 'Maaf, mobil ini sudah tidak tersedia untuk disewa.']);
        }

        if ($overlapResult === 'overlap') {
            return back()->withErrors(['kdmobil' => 'Maaf, mobil ini sudah dibooking oleh pelanggan lain pada rentang tanggal tersebut. Silakan pilih tanggal atau mobil lain.']);
        }

        $existingReminder = BookingMobil::where('iduser', $request->iduser)
            ->where('kdmobil', $request->kdmobil)
            ->where('tglmulai', $request->tglmulai)
            ->where('tglselesai', $request->tglselesai)
            ->whereIn('status', ['Expired', 'Notified'])
            ->where('payment_type', 'reminder')
            ->first();

        if ($existingReminder) {
            $existingReminder->update([
                'tglbooking' => $request->tglbooking,
                'harga' => $request->harga,
                'lama_sewa' => $request->lama_sewa,
                'total_bayar' => $request->total_bayar,
                'payment_method' => $request->payment_method,
                'transaction_id' => 'TRX-' . strtoupper(bin2hex(random_bytes(4))),
                'transaction_time' => now(),
                'status' => 'Pending',
            ]);

            return redirect()->route('booking.checkout', $existingReminder->kdbooking);
        }

        $data = $request->all();
        $data['kdbooking'] = $this->generateKdBooking();

        if (! isset($data['transaction_id'])) {
            $data['transaction_id'] = 'TRX-' . strtoupper(bin2hex(random_bytes(4)));
            $data['transaction_time'] = now();
        }

        $booking = BookingMobil::create($data);

        return redirect()->route('booking.checkout', $booking->kdbooking);
    }

    public function checkout(string $kdbooking)
    {
        $booking = BookingMobil::findOrFail($kdbooking);
        $user = User::findOrFail($booking->iduser);
        $mobil = Mobil::findOrFail($booking->kdmobil);

        Config::$serverKey = trim(config('midtrans.server_key'));
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
        Config::$curlOptions = config('midtrans.curl_options', []);

        $params = [
            'transaction_details' => [
                'order_id' => $booking->kdbooking . '-' . time(),
                'gross_amount' => (int) $booking->total_bayar,
            ],
            'customer_details' => [
                'first_name' => $user->nama_lengkap,
                'email' => $user->email,
                'phone' => $user->nohp,
            ],
            'item_details' => [
                [
                    'id' => $mobil->kdmobil,
                    'price' => (int) $booking->harga,
                    'quantity' => (int) $booking->lama_sewa,
                    'name' => 'Sewa Mobil ' . $mobil->nama_mobil,
                ],
            ],
            'expiry' => [
                'start_time' => date("Y-m-d H:i:s O", time()),
                'unit' => 'minute',
                'duration' => self::PENDING_LOCK_MINUTES,
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            return Inertia::render('booking/checkout', [
                'booking' => $booking,
                'snap_token' => $snapToken,
                'client_key' => trim(config('midtrans.client_key')),
                'is_production' => (bool) config('midtrans.is_production'),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('booking.index')->with('error', 'Gagal menghubungkan ke Midtrans: ' . $e->getMessage());
        }
    }

    public function success(Request $request, string $kdbooking)
    {
        $booking = BookingMobil::findOrFail($kdbooking);

        $booking->update([
            'status' => 'Sukses',
            'payment_type' => $request->payment_type,
            'payment_method' => $request->payment_method ?? $request->payment_type ?? 'Midtrans',
            'transaction_id' => $request->transaction_id,
            'transaction_time' => $request->transaction_time ?? now(),
        ]);
        $mobil = Mobil::find($booking->kdmobil);
        if ($mobil) {
            $mobil->update(['status' => 'Disewa']);
        }

        return response()->json(['message' => 'Payment recorded successfully']);
    }

    public function invoice(string $kdbooking)
    {
        $booking = BookingMobil::findOrFail($kdbooking);
        $user = User::findOrFail($booking->iduser);
        $mobil = Mobil::findOrFail($booking->kdmobil);

        return Inertia::render('booking/invoice', [
            'booking' => $booking,
            'user' => $user,
            'mobil' => $mobil,
        ]);
    }

    public function edit(string $id)
    {
        $booking = BookingMobil::findOrFail($id);

        return Inertia::render('booking/edit', [
            'booking' => $booking,
            'users' => User::all(),
            'mobils' => Mobil::all(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        BookingMobil::autoExpirePendingBookings(self::PENDING_LOCK_MINUTES);
        $booking = BookingMobil::findOrFail($id);

        $request->validate([
            'tglbooking' => 'required|date',
            'iduser' => 'required|exists:users,id',
            'kdmobil' => 'required|exists:mobil,kdmobil',
            'harga' => 'required|numeric',
            'tglmulai' => 'required|date',
            'tglselesai' => 'required|date|after_or_equal:tglmulai',
            'lama_sewa' => 'required|integer',
            'total_bayar' => 'required|numeric',
            'status' => 'required|string',
        ]);

        $overlapResult = DB::transaction(function () use ($request, $id) {
            $mobil = Mobil::where('kdmobil', $request->kdmobil)->lockForUpdate()->first();

            if (!$mobil) {
                return 'not_found';
            }

            $overlapExists = BookingMobil::where('kdmobil', $request->kdmobil)
                ->where('kdbooking', '!=', $id)
                ->where(function ($q) {
                    $q->whereIn('status', ['Sukses', 'success', 'Success', 'Berhasil', 'Selesai', 'challenge'])
                        ->orWhere(function ($qp) {
                            $qp->whereIn('status', ['Pending', 'pending'])
                                ->where('created_at', '>=', now()->subMinutes(self::PENDING_LOCK_MINUTES));
                        });
                })
                ->where(function ($q) use ($request) {
                    $q->where('tglmulai', '<=', $request->tglselesai)
                        ->where('tglselesai', '>=', $request->tglmulai);
                })
                ->exists();

            if ($overlapExists) {
                return 'overlap';
            }

            return 'ok';
        });

        if ($overlapResult === 'not_found') {
            return back()->withErrors(['kdmobil' => 'Maaf, data mobil tidak ditemukan.']);
        }

        if ($overlapResult === 'overlap') {
            return back()->withErrors(['kdmobil' => 'Maaf, mobil ini sudah dibooking oleh pelanggan lain pada rentang tanggal tersebut. Silakan pilih tanggal atau mobil lain.']);
        }

        $booking->update($request->all());

        if (in_array($request->status, ['Batal', 'Gagal', 'Expired', 'expire', 'cancel', 'deny'])) {
            BookingMobil::notifyOtherInterestedCustomers($booking->kdmobil, $booking->tglmulai, $booking->tglselesai, $booking->kdbooking);
        }

        return redirect()->route('booking.index')->with('success', 'Booking berhasil diperbarui.');
    }

    public function requestReminder(Request $request)
    {
        $request->validate([
            'kdmobil' => 'required|exists:mobil,kdmobil',
            'tglmulai' => 'required|date',
            'tglselesai' => 'required|date|after_or_equal:tglmulai',
        ]);

        $exists = BookingMobil::where('iduser', Auth::id())
            ->where('kdmobil', $request->kdmobil)
            ->where('tglmulai', $request->tglmulai)
            ->where('tglselesai', $request->tglselesai)
            ->exists();

        if (!$exists) {
            $mobil = Mobil::find($request->kdmobil);
            $tglmulai = new \DateTime($request->tglmulai);
            $tglselesai = new \DateTime($request->tglselesai);
            $lamaSewa = max(1, $tglmulai->diff($tglselesai)->days);

            BookingMobil::create([
                'kdbooking' => $this->generateKdBooking(),
                'tglbooking' => now()->format('Y-m-d'),
                'iduser' => Auth::id(),
                'kdmobil' => $request->kdmobil,
                'harga' => $mobil->harga,
                'payment_type' => 'reminder',
                'payment_method' => 'reminder',
                'tglmulai' => $request->tglmulai,
                'tglselesai' => $request->tglselesai,
                'lama_sewa' => $lamaSewa,
                'total_bayar' => $mobil->harga * $lamaSewa,
                'transaction_id' => 'REM-' . time(),
                'transaction_time' => now(),
                'status' => 'Expired',
            ]);
        }

        return redirect()->back()->with('success', 'Pengingat berhasil diaktifkan. Kami akan memberi tahu Anda jika mobil ini sudah tersedia kembali!');
    }
}
