<?php

use App\Models\Mobil;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'mobils' => Mobil::latest()->take(6)->get(),
    ]);
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/services', function () {
    return Inertia::render('services');
})->name('services');

Route::get('/pricing', function () {
    return Inertia::render('pricing', [
        'mobils' => Mobil::all(),
    ]);
})->name('pricing');

Route::get('/cars', function () {
    return Inertia::render('cars', [
        'mobils' => Mobil::all(),
    ]);
})->name('cars');

Route::get('/blog', function () {
    return Inertia::render('blog');
})->name('blog');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\MobilController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PengembalianController;

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Routes accessible by Admin and Pimpinan
    Route::middleware(['role:admin,pimpinan'])->group(function () {
        Route::resource('kategori', KategoriController::class);
        Route::resource('mobil', MobilController::class);
        Route::patch('mobil/{mobil}/status', [MobilController::class, 'updateStatus'])->name('mobil.update-status');
        Route::resource('pelanggan', PelangganController::class);
        Route::resource('pengembalian', PengembalianController::class);

        // Laporan routes
        Route::get('laporan/pelanggan', [LaporanController::class, 'pelanggan'])->name('laporan.pelanggan');
        Route::get('laporan/mobil', [LaporanController::class, 'mobil'])->name('laporan.mobil');
        Route::get('laporan/booking', [LaporanController::class, 'booking'])->name('laporan.booking');
        Route::get('laporan/pengembalian', [LaporanController::class, 'pengembalian'])->name('laporan.pengembalian');
        Route::get('laporan/rental', [LaporanController::class, 'rental'])->name('laporan.rental');
        Route::get('laporan/belum-kembali', [LaporanController::class, 'belumKembali'])->name('laporan.belum-kembali');
    });

    // Routes accessible by All (including Pelanggan)
    Route::get('booking/{booking}/checkout', [BookingController::class, 'checkout'])->name('booking.checkout');
    Route::get('booking/{booking}/invoice', [BookingController::class, 'invoice'])->name('booking.invoice');
    Route::post('booking/{booking}/success', [BookingController::class, 'success'])->name('booking.success');
    Route::resource('booking', BookingController::class)->except(['destroy']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
