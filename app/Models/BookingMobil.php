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
}
