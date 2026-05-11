<?php

namespace App\Http\Controllers;

use App\Models\BookingMobil;
use App\Models\KembaliMobil;
use App\Models\Mobil;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengembalianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('pengembalian/index', [
            'pengembalians' => KembaliMobil::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('pengembalian/create', [
            'bookings' => BookingMobil::all(),
            'users' => User::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
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

        KembaliMobil::create($request->all());

        // Update Mobil status to 'Perawatan' and Booking status to 'Selesai'
        $booking = BookingMobil::find($request->kdbooking);
        if ($booking) {
            $mobil = Mobil::find($booking->kdmobil);
            if ($mobil) {
                $mobil->update(['status' => 'Perawatan']);
            }
            $booking->update(['status' => 'Selesai']);
        }

        return redirect()->route('pengembalian.index')->with('success', 'Pengembalian berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $pengembalian = KembaliMobil::findOrFail($id);

        return Inertia::render('pengembalian/edit', [
            'pengembalian' => $pengembalian,
            'bookings' => BookingMobil::all(),
            'users' => User::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
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

        return redirect()->route('pengembalian.index')->with('success', 'Pengembalian berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pengembalian = KembaliMobil::findOrFail($id);
        $pengembalian->delete();

        return redirect()->route('pengembalian.index')->with('success', 'Pengembalian berhasil dihapus.');
    }
}
