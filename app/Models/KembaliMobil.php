<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KembaliMobil extends Model
{
    protected $table = 'kembali_mobil';

    protected $primaryKey = 'kdpengembalian';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'kdpengembalian',
        'kdbooking',
        'iduser',
        'tglmulai',
        'tglselesai',
        'tglpengembalian',
        'keterlambatan',
        'denda',
    ];

    public function booking()
    {
        return $this->belongsTo(BookingMobil::class, 'kdbooking', 'kdbooking');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'iduser', 'id');
    }
}
