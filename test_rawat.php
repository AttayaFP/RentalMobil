<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\KembaliMobil;

echo "=== KEMBALI MOBIL ===\n";
$kembalis = KembaliMobil::with('booking')->get();
foreach ($kembalis as $k) {
    echo "ID: {$k->idkembali} | Booking: {$k->kdbooking} | Tgl Pengembalian: {$k->tglpengembalian} | Mobil: " . ($k->booking ? $k->booking->kdmobil : 'N/A') . "\n";
}
