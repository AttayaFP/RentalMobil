<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $table = 'kategori';

    protected $primaryKey = 'kdkategori';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'kdkategori',
        'nama_kategori',
    ];
}
