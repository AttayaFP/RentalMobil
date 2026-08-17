<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SopController extends Controller
{
    public function agree(Request $request): RedirectResponse
    {
        $request->session()->put('sop_agreed', true);

        return redirect()->intended('/')->with('success', 'Terima kasih telah menyetujui SOP Nabil Rental Mobil Padang.');
    }

    public function decline(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login')->with('error', 'Anda harus menyetujui SOP untuk menyewa kendaraan di Nabil Rental Mobil Padang.');
    }
}
