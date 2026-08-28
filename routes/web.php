<?php

use App\Models\BookingMobil;
use App\Models\KembaliMobil;
use App\Models\Mobil;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $ratingsPath = storage_path('app/ratings.json');
    $ratings = file_exists($ratingsPath) ? json_decode(file_get_contents($ratingsPath), true) ?: [] : [];

    $ratingValues = array_column($ratings, 'rating');
    $ratingKepuasan = count($ratingValues) > 0
        ? round(array_sum($ratingValues) / count($ratingValues), 1)
        : 0;

    $reviews = [];
    foreach ($ratings as $kdpengembalian => $data) {
        $kembali = KembaliMobil::with(['user', 'booking.mobil'])->find($kdpengembalian);
        if ($kembali) {
            $reviews[] = [
                'kdpengembalian' => $kdpengembalian,
                'rating' => $data['rating'] ?? 5,
                'ulasan' => $data['ulasan'] ?? '',
                'nama_pelanggan' => $kembali->user->nama_lengkap ?? 'Pelanggan',
                'nama_mobil' => $kembali->booking->mobil->nama_mobil ?? 'Mobil',
                'created_at' => $data['created_at'] ?? null,
            ];
        }
    }

    return Inertia::render('welcome', [
        'mobils' => Mobil::latest()->take(6)->get(),
        'stats'  => [
            'mobil_tersedia'   => Mobil::where('status', 'Tersedia')->count(),
            'total_disewa'     => BookingMobil::whereIn('status', ['Sukses', 'Success', 'Berhasil', 'Selesai'])->count(),
            'total_pelanggan'  => User::where('role', 'pelanggan')->count(),
            'total_mobil'      => Mobil::count(),
        ],
        'rating_kepuasan' => $ratingKepuasan,
        'total_reviews'   => count($ratingValues),
        'reviews'         => array_slice(array_reverse($reviews), 0, 6),
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
use App\Http\Controllers\SopController;

Route::middleware(['auth'])->group(function () {
    Route::post('/sop/agree', [SopController::class, 'agree'])->name('sop.agree');
    Route::post('/sop/decline', [SopController::class, 'decline'])->name('sop.decline');

    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::middleware(['role:admin'])->group(function () {
        Route::resource('kategori', KategoriController::class);
        Route::resource('mobil', MobilController::class);
        Route::patch('mobil/{mobil}/status', [MobilController::class, 'updateStatus'])->name('mobil.update-status');
        Route::post('mobil/{mobil}/set-tersedia', [MobilController::class, 'setTersedia'])->name('mobil.set-tersedia');
        Route::post('mobil/{id}/set-tersedia', [MobilController::class, 'setTersedia']);
        Route::resource('pelanggan', PelangganController::class);
        Route::resource('pengembalian', PengembalianController::class);
    });

    Route::middleware(['role:admin,pimpinan'])->group(function () {
        // Laporan routes
        Route::get('laporan/pelanggan', [LaporanController::class, 'pelanggan'])->name('laporan.pelanggan');
        Route::get('laporan/mobil', [LaporanController::class, 'mobil'])->name('laporan.mobil');
        Route::get('laporan/booking', [LaporanController::class, 'booking'])->name('laporan.booking');
        Route::get('laporan/pengembalian', [LaporanController::class, 'pengembalian'])->name('laporan.pengembalian');
        Route::get('laporan/rental', [LaporanController::class, 'rental'])->name('laporan.rental');
        Route::get('laporan/belum-kembali', [LaporanController::class, 'belumKembali'])->name('laporan.belum-kembali');
    });

    Route::middleware(['role:admin,pelanggan'])->group(function () {
        Route::get('booking/{booking}/checkout', [BookingController::class, 'checkout'])->name('booking.checkout');
        Route::get('booking/{booking}/invoice', [BookingController::class, 'invoice'])->name('booking.invoice');
        Route::post('booking/{booking}/success', [BookingController::class, 'success'])->name('booking.success');
        Route::get('booking/available-cars', [BookingController::class, 'getAvailableCars'])->name('booking.available-cars');
        Route::post('booking/request-reminder', [BookingController::class, 'requestReminder'])->name('booking.request-reminder');
        Route::post('booking/{booking}/cancel', [BookingController::class, 'cancel'])->name('booking.cancel');
        Route::resource('booking', BookingController::class)->except(['destroy']);
        
        Route::get('pengembalian/{pengembalian}/checkout', [PengembalianController::class, 'checkout'])->name('pengembalian.checkout');
        Route::post('pengembalian/{pengembalian}/success', [PengembalianController::class, 'success'])->name('pengembalian.success');
        Route::post('pengembalian/{pengembalian}/rating', [PengembalianController::class, 'submitRating'])->name('pengembalian.rating');
        
        Route::post('notifikasi/{id}/read', function ($id) {
            $notif = \App\Models\Notifikasi::where('iduser', Auth::id())->findOrFail($id);
            $notif->update(['is_read' => true]);
            if (request()->wantsJson()) {
                return response()->json(['success' => true]);
            }
            return back();
        })->name('notifikasi.read');

        Route::delete('notifikasi/{id}', function ($id) {
            $notif = \App\Models\Notifikasi::where('iduser', Auth::id())->findOrFail($id);
            $notif->delete();
            if (request()->wantsJson()) {
                return response()->json(['success' => true]);
            }
            return back();
        })->name('notifikasi.delete');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
