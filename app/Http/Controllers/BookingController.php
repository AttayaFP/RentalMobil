<?php

namespace App\Http\Controllers;

use App\Models\BookingMobil;
use App\Models\Mobil;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = BookingMobil::query();

        if (auth()->user()->role === 'pelanggan') {
            // Customers can only see their own bookings that are already successful/paid
            $query->where('iduser', auth()->id())
                ->whereIn('status', ['Selesai', 'Success', 'Berhasil']);
        }

        return Inertia::render('booking/index', [
            'bookings' => $query->get(),
        ]);
    }

    /**
     * Generate next booking code in format BO001, BO002, etc.
     */
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

        return 'BO'.str_pad($number, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $user = auth()->user();

        // Hanya mobil yang Tersedia yang bisa dibooking baru
        $mobils = Mobil::where('status', 'Tersedia')->get();

        return Inertia::render('booking/create', [
            'users' => User::all(),
            'mobils' => $mobils->map(fn ($m) => [
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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

        // Cek kembali ketersediaan mobil di server-side
        $mobil = Mobil::find($request->kdmobil);
        if (!$mobil || $mobil->status !== 'Tersedia') {
            return back()->withErrors(['kdmobil' => 'Maaf, mobil ini sudah tidak tersedia untuk disewa.']);
        }

        $data = $request->all();
        $data['kdbooking'] = $this->generateKdBooking();

        if (! isset($data['transaction_id'])) {
            $data['transaction_id'] = 'TRX-'.strtoupper(bin2hex(random_bytes(4)));
            $data['transaction_time'] = now();
        }

        $booking = BookingMobil::create($data);

        return redirect()->route('booking.checkout', $booking->kdbooking);
    }

    /**
     * Show the checkout page with Midtrans Snap Token.
     */
    public function checkout(string $kdbooking)
    {
        $booking = BookingMobil::findOrFail($kdbooking);
        $user = User::findOrFail($booking->iduser);
        $mobil = Mobil::findOrFail($booking->kdmobil);

        // Set Midtrans Configuration
        Config::$serverKey = trim(config('midtrans.server_key'));
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        $params = [
            'transaction_details' => [
                'order_id' => $booking->kdbooking.'-'.time(), // Add timestamp to avoid duplicate order_id
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
                    'name' => 'Sewa Mobil '.$mobil->nama_mobil,
                ],
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            return Inertia::render('booking/checkout', [
                'booking' => $booking,
                'snap_token' => $snapToken,
                'client_key' => trim(config('midtrans.client_key')),
            ]);
        } catch (\Exception $e) {
            return redirect()->route('booking.index')->with('error', 'Gagal menghubungkan ke Midtrans: '.$e->getMessage());
        }
    }

    /**
     * Update booking status after successful payment.
     */
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

        // Update mobil status to 'Disewa'
        $mobil = Mobil::find($booking->kdmobil);
        if ($mobil) {
            $mobil->update(['status' => 'Disewa']);
        }

        return response()->json(['message' => 'Payment recorded successfully']);
    }

    /**
     * Show the invoice for a successful booking.
     */
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $booking = BookingMobil::findOrFail($id);

        return Inertia::render('booking/edit', [
            'booking' => $booking,
            'users' => User::all(),
            'mobils' => Mobil::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
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

        $booking->update($request->all());

        return redirect()->route('booking.index')->with('success', 'Booking berhasil diperbarui.');
    }
}
