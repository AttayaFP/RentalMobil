<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    protected $table = 'notifikasis';

    protected $fillable = [
        'iduser',
        'kdmobil',
        'pesan',
        'is_read',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'iduser', 'id');
    }

    public function mobil()
    {
        return $this->belongsTo(Mobil::class, 'kdmobil', 'kdmobil');
    }

    public static function generatePassiveNotifications($userId)
    {
        $today = now()->format('Y-m-d');
        
        $myFailedBookings = BookingMobil::where('iduser', $userId)
            ->where('tglmulai', '>=', $today)
            ->whereIn('status', ['Batal', 'Gagal', 'Expired', 'expire', 'cancel', 'deny'])
            ->with(['mobil'])
            ->get();

        foreach ($myFailedBookings as $booking) {
            $kdmobil = $booking->kdmobil;
            $tglmulai = $booking->tglmulai;
            $tglselesai = $booking->tglselesai;

            if ($booking->mobil && $booking->mobil->status === 'Perawatan') {
                continue;
            }

            $overlapExists = BookingMobil::where('kdmobil', $kdmobil)
                ->where('kdbooking', '!=', $booking->kdbooking)
                ->where(function ($q) {
                    $q->whereIn('status', ['Sukses', 'success', 'Success', 'Berhasil', 'Selesai', 'challenge'])
                        ->orWhere(function ($qp) {
                            $qp->whereIn('status', ['Pending', 'pending'])
                                ->where('created_at', '>=', now()->subMinutes(1));
                        });
                })
                ->where(function ($q) use ($tglmulai, $tglselesai) {
                    $q->where('tglmulai', '<=', $tglselesai)
                        ->where('tglselesai', '>=', $tglmulai);
                })
                ->exists();

            if (!$overlapExists) {
                $exists = self::where('iduser', $userId)
                    ->where('kdmobil', $kdmobil)
                    ->where('pesan', 'like', "%" . date('d-m-Y', strtotime($tglmulai)) . "%")
                    ->where('is_read', false)
                    ->exists();

                if (!$exists) {
                    self::create([
                        'iduser' => $userId,
                        'kdmobil' => $kdmobil,
                        'pesan' => "Kabar baik! Mobil " . ($booking->mobil ? $booking->mobil->nama_mobil : 'pilihan Anda') . " yang sebelumnya ingin Anda sewa pada tanggal " . date('d-m-Y', strtotime($tglmulai)) . " s/d " . date('d-m-Y', strtotime($tglselesai)) . " kini sudah tersedia kembali. Silakan lakukan pemesanan ulang!",
                        'is_read' => false,
                    ]);
                    $booking->update(['status' => 'Notified']);
                }
            }
        }
    }

    public static function generateAdminMaintenanceNotifications()
    {
        $adminUsers = User::where('role', 'admin')->get();

        $mobilsInMaintenance = Mobil::whereRaw('LOWER(status) = ?', ['perawatan'])
            ->get()
            ->filter(function ($mobil) {
                $latestKembali = KembaliMobil::whereHas('booking', function ($q) use ($mobil) {
                    $q->where('kdmobil', $mobil->kdmobil);
                })->orderBy('tglpengembalian', 'desc')->first();

                if ($latestKembali && $latestKembali->tglpengembalian) {
                    $tglPengembalian = \Carbon\Carbon::parse($latestKembali->tglpengembalian)->startOfDay();
                } else {
                    $tglPengembalian = \Carbon\Carbon::parse($mobil->updated_at)->startOfDay();
                }

                return $tglPengembalian->diffInDays(\Carbon\Carbon::now()->startOfDay(), false) >= 2;
            });

        foreach ($adminUsers as $admin) {
            foreach ($mobilsInMaintenance as $mobil) {
                $exists = self::where('iduser', $admin->id)
                    ->where('kdmobil', $mobil->kdmobil)
                    ->where('pesan', 'like', '%perawatan%')
                    ->where('is_read', false)
                    ->exists();

                if (!$exists) {
                    self::create([
                        'iduser' => $admin->id,
                        'kdmobil' => $mobil->kdmobil,
                        'pesan' => "Mobil " . $mobil->nama_mobil . " (" . $mobil->plat_mobil . ") sudah dalam status perawatan lebih dari 2 hari. Silakan ubah status menjadi Tersedia jika sudah selesai.",
                        'is_read' => false,
                    ]);
                }
            }
        }
    }
}
