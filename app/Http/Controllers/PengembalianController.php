<?php

namespace App\Http\Controllers;

use App\Models\BookingMobil;
use App\Models\KembaliMobil;
use App\Models\Mobil;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class PengembalianController extends Controller
{
    public function index(Request $request)
    {
        $query = KembaliMobil::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kdpengembalian', 'like', "%{$search}%")
                    ->orWhere('kdbooking', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('nama_lengkap', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('tglpengembalian', $request->date);
        }

        return Inertia::render('pengembalian/index', [
            'pengembalians' => $query->with(['user', 'booking'])->latest()->get(),
            'filters' => $request->only(['search', 'date']),
        ]);
    }

    private function generateKdPengembalian(): string
    {
        $last = KembaliMobil::orderByRaw('CAST(SUBSTRING(kdpengembalian, 5) AS UNSIGNED) DESC')
            ->whereRaw('kdpengembalian REGEXP "^KMB-[0-9]+$"')
            ->first();

        if ($last) {
            $number = (int) substr($last->kdpengembalian, 4) + 1;
        } else {
            $number = 1;
        }

        return 'KMB-'.str_pad($number, 3, '0', STR_PAD_LEFT);
    }

    public function create()
    {
        return Inertia::render('pengembalian/create', [
            'bookings' => BookingMobil::where('status', '!=', 'Selesai')->get(),
            'users' => User::all(),
            'next_kdpengembalian' => $this->generateKdPengembalian(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kdpengembalian' => 'required|string|max:10|unique:kembali_mobil,kdpengembalian',
            'kdbooking' => 'required|exists:booking_mobil,kdbooking',
            'iduser' => 'required|exists:users,id',
            'tglmulai' => 'required|date',
            'tglselesai' => 'required|date|after_or_equal:tglmulai',
            'tglpengembalian' => 'required|date',
            'keterlambatan' => 'required|integer',
            'denda' => 'required|numeric',
        ]);

        $pengembalian = KembaliMobil::create($request->all());
        $booking = BookingMobil::find($request->kdbooking);
        if ($booking) {
            $mobil = Mobil::find($booking->kdmobil);
            if ($mobil) {
                $mobil->update(['status' => 'Perawatan']);
            }
            $booking->update(['status' => 'Selesai']);
        }

        if ($request->input('payment_type') === 'transfer' && $pengembalian->denda > 0) {
            return redirect()->route('pengembalian.checkout', $pengembalian->kdpengembalian);
        }

        return redirect()->route('pengembalian.index')->with('success', 'Pengembalian berhasil ditambahkan.');
    }

    public function edit(string $id)
    {
        $pengembalian = KembaliMobil::findOrFail($id);

        return Inertia::render('pengembalian/edit', [
            'pengembalian' => $pengembalian,
            'bookings' => BookingMobil::where('status', '!=', 'Selesai')
                ->orWhere('kdbooking', $pengembalian->kdbooking)
                ->get(),
            'users' => User::all(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $pengembalian = KembaliMobil::findOrFail($id);

        $request->validate([
            'kdbooking' => 'required|exists:booking_mobil,kdbooking',
            'iduser' => 'required|exists:users,id',
            'tglmulai' => 'required|date',
            'tglselesai' => 'required|date|after_or_equal:tglmulai',
            'tglpengembalian' => 'required|date',
            'keterlambatan' => 'required|integer',
            'denda' => 'required|numeric',
        ]);

        $pengembalian->update($request->all());

        if ($request->input('payment_type') === 'transfer' && $pengembalian->denda > 0) {
            return redirect()->route('pengembalian.checkout', $pengembalian->kdpengembalian);
        }

        return redirect()->route('pengembalian.index')->with('success', 'Pengembalian berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $pengembalian = KembaliMobil::findOrFail($id);

        // Revert booking and car status
        $booking = BookingMobil::find($pengembalian->kdbooking);
        if ($booking) {
            $booking->update(['status' => 'Success']);
            $mobil = Mobil::find($booking->kdmobil);
            if ($mobil) {
                $mobil->update(['status' => 'Disewa']);
            }
        }

        $pengembalian->delete();

        return redirect()->route('pengembalian.index')->with('success', 'Pengembalian berhasil dihapus.');
    }

    public function checkout(string $kdpengembalian)
    {
        $pengembalian = KembaliMobil::findOrFail($kdpengembalian);
        $user = User::findOrFail($pengembalian->iduser);
        $booking = BookingMobil::findOrFail($pengembalian->kdbooking);
        $mobil = Mobil::findOrFail($booking->kdmobil);

        Config::$serverKey = trim(config('midtrans.server_key'));
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        $params = [
            'transaction_details' => [
                'order_id' => $pengembalian->kdpengembalian.'-'.time(),
                'gross_amount' => (int) $pengembalian->denda,
            ],
            'customer_details' => [
                'first_name' => $user->nama_lengkap,
                'email' => $user->email,
                'phone' => $user->nohp,
            ],
            'item_details' => [
                [
                    'id' => $pengembalian->kdpengembalian,
                    'price' => (int) $pengembalian->denda,
                    'quantity' => 1,
                    'name' => 'Denda Pengembalian '.$mobil->nama_mobil,
                ],
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            return Inertia::render('pengembalian/checkout', [
                'pengembalian' => $pengembalian,
                'snap_token' => $snapToken,
                'client_key' => trim(config('midtrans.client_key')),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('pengembalian.index')->with('error', 'Gagal menghubungkan ke Midtrans: '.$e->getMessage());
        }
    }

    public function success(Request $request, string $kdpengembalian)
    {
        $pengembalian = KembaliMobil::findOrFail($kdpengembalian);
        // We can log the payment details or update a local status if we have it,
        // but for now we simply return a JSON success response.
        return response()->json(['message' => 'Denda payment recorded successfully']);
    }
}
