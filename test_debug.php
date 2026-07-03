<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== MOBIL PERAWATAN ===\n";
$mobils = \App\Models\Mobil::whereRaw('LOWER(status) = ?', ['perawatan'])->get();
echo "Count: " . $mobils->count() . "\n";
foreach ($mobils as $m) {
    echo "- {$m->kdmobil} | {$m->nama_mobil} | {$m->plat_mobil} | status: {$m->status} | updated_at: {$m->updated_at}\n";
    $kembali = \App\Models\KembaliMobil::whereHas('booking', function ($q) use ($m) {
        $q->where('kdmobil', $m->kdmobil);
    })->orderBy('tglpengembalian', 'desc')->first();
    if ($kembali) {
        echo "  -> tglpengembalian: {$kembali->tglpengembalian}\n";
        $tgl = \Carbon\Carbon::parse($kembali->tglpengembalian)->startOfDay();
        $now = \Carbon\Carbon::now()->startOfDay();
        echo "  -> diffInDays: " . $tgl->diffInDays($now, false) . "\n";
    } else {
        echo "  -> Tidak ada kembali_mobil record\n";
        $tgl = \Carbon\Carbon::parse($m->updated_at)->startOfDay();
        $now = \Carbon\Carbon::now()->startOfDay();
        echo "  -> diffInDays (from updated_at): " . $tgl->diffInDays($now, false) . "\n";
    }
}

echo "\n=== ADMIN USERS ===\n";
$admins = \App\Models\User::where('role', 'admin')->get();
echo "Count: " . $admins->count() . "\n";
foreach ($admins as $a) {
    echo "- {$a->id} | {$a->nama_lengkap} | {$a->email}\n";
}

echo "\n=== NOTIFIKASI (all) ===\n";
$notifs = \App\Models\Notifikasi::latest()->take(10)->get();
echo "Count: " . \App\Models\Notifikasi::count() . "\n";
foreach ($notifs as $n) {
    echo "- id:{$n->id} | user:{$n->iduser} | mobil:{$n->kdmobil} | read:{$n->is_read} | pesan: " . substr($n->pesan, 0, 80) . "...\n";
}

echo "\n=== SEMUA MOBIL STATUS ===\n";
$all = \App\Models\Mobil::select('kdmobil', 'nama_mobil', 'status', 'updated_at')->get();
foreach ($all as $m) {
    echo "- {$m->kdmobil} | {$m->nama_mobil} | {$m->status} | {$m->updated_at}\n";
}

echo "\n=== BOOKING STATUS ===\n";
$bookings = \App\Models\BookingMobil::select('kdbooking', 'kdmobil', 'status', 'tglmulai', 'tglselesai')->latest()->take(10)->get();
foreach ($bookings as $b) {
    echo "- {$b->kdbooking} | {$b->kdmobil} | {$b->status} | {$b->tglmulai} ~ {$b->tglselesai}\n";
}

echo "\n=== KEMBALI MOBIL ===\n";
$kembalis = \App\Models\KembaliMobil::select('kdpengembalian', 'kdbooking', 'tglpengembalian', 'keterlambatan', 'denda')->latest()->take(10)->get();
foreach ($kembalis as $k) {
    echo "- {$k->kdpengembalian} | {$k->kdbooking} | kembali: {$k->tglpengembalian} | terlambat: {$k->keterlambatan} hari | denda: {$k->denda}\n";
}
