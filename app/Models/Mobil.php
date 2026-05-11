<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mobil extends Model
{
    protected $table = 'mobil';

    protected $primaryKey = 'kdmobil';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'kdmobil',
        'nama_mobil',
        'thn_mobil',
        'plat_mobil',
        'warna_mobil',
        'stnk_mobil',
        'harga',
        'kdkategori',
        'foto',
        'status',
    ];

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kdkategori', 'kdkategori');
    }
}
