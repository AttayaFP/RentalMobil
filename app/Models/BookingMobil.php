<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingMobil extends Model
{
    protected $table = 'booking_mobil';

    protected $primaryKey = 'kdbooking';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'kdbooking',
        'tglbooking',
        'iduser',
        'kdmobil',
        'harga',
        'payment_type',
        'payment_method',
        'tglmulai',
        'tglselesai',
        'lama_sewa',
        'total_bayar',
        'transaction_id',
        'transaction_time',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'iduser', 'id');
    }

    public function mobil()
    {
        return $this->belongsTo(Mobil::class, 'kdmobil', 'kdmobil');
    }

    public function pengembalian()
    {
        return $this->hasOne(KembaliMobil::class, 'kdbooking', 'kdbooking');
    }

    public static function notifyOtherInterestedCustomers($kdmobil, $tglmulai, $tglselesai, $excludeKdbooking = null)
    {
        $query = self::where('kdmobil', $kdmobil)
            ->where(function ($q) use ($tglmulai, $tglselesai) {
                $q->where('tglmulai', '<=', $tglselesai)
                  ->where('tglselesai', '>=', $tglmulai);
            })
            ->where('payment_type', 'reminder')
            ->where('status', 'Expired');

        if ($excludeKdbooking) {
            $query->where('kdbooking', '!=', $excludeKdbooking);
        }

        $interestedBookings = $query->with(['user', 'mobil'])->get();

        foreach ($interestedBookings as $booking) {
            if ($booking->user) {
                $exists = Notifikasi::where('iduser', $booking->iduser)
                    ->where('kdmobil', $kdmobil)
                    ->where('pesan', 'like', "%" . date('d-m-Y', strtotime($booking->tglmulai)) . "%")
                    ->where('is_read', false)
                    ->exists();

                if (!$exists) {
                    Notifikasi::create([
                        'iduser' => $booking->iduser,
                        'kdmobil' => $kdmobil,
                        'pesan' => "Kabar baik! Mobil " . $booking->mobil->nama_mobil . " yang sebelumnya ingin Anda sewa pada tanggal " . date('d-m-Y', strtotime($booking->tglmulai)) . " s/d " . date('d-m-Y', strtotime($booking->tglselesai)) . " kini sudah tersedia kembali. Silakan lakukan pemesanan ulang!",
                        'is_read' => false,
                    ]);
                    $booking->update(['status' => 'Notified']);
                }
            }
        }
    }

    public static function notifyFutureInterestedCustomers($kdmobil)
    {
        $today = now()->format('Y-m-d');
        
        $interestedBookings = self::where('kdmobil', $kdmobil)
            ->where('tglmulai', '>=', $today)
            ->where('payment_type', 'reminder')
            ->where('status', 'Expired')
            ->with(['user', 'mobil'])
            ->get();

        foreach ($interestedBookings as $booking) {
            if ($booking->user) {
                $exists = Notifikasi::where('iduser', $booking->iduser)
                    ->where('kdmobil', $kdmobil)
                    ->where('pesan', 'like', "%" . date('d-m-Y', strtotime($booking->tglmulai)) . "%")
                    ->where('is_read', false)
                    ->exists();

                if (!$exists) {
                    Notifikasi::create([
                        'iduser' => $booking->iduser,
                        'kdmobil' => $kdmobil,
                        'pesan' => "Kabar baik! Mobil " . $booking->mobil->nama_mobil . " yang sebelumnya ingin Anda sewa pada tanggal " . date('d-m-Y', strtotime($booking->tglmulai)) . " s/d " . date('d-m-Y', strtotime($booking->tglselesai)) . " kini sudah tersedia kembali untuk dipesan!",
                        'is_read' => false,
                    ]);
                    $booking->update(['status' => 'Notified']);
                }
            }
        }
    }

    public static function autoExpirePendingBookings($minutes = 1)
    {
        $expiredBookings = self::whereIn('status', ['Pending', 'pending'])
            ->where('created_at', '<', now()->subMinutes($minutes))
            ->get();

        foreach ($expiredBookings as $booking) {
            $booking->update(['status' => 'Expired']);
            self::notifyOtherInterestedCustomers($booking->kdmobil, $booking->tglmulai, $booking->tglselesai, $booking->kdbooking);
        }
    }
}

