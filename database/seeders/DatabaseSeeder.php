<?php

namespace Database\Seeders;

use App\Models\Kategori;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Mobil;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        User::factory()->create([
            'nama_lengkap' => 'Test User',
            'username' => 'testuser',
            'email' => 'test@example.com',
            'role' => 'admin',
        ]);

        $suv = Kategori::create([
            'kdkategori' => 'K001',
            'nama_kategori' => 'SUV',
        ]);

        $sedan = Kategori::create([
            'kdkategori' => 'K002',
            'nama_kategori' => 'Sedan',
        ]);

        Mobil::create([
            'kdmobil' => 'M001',
            'nama_mobil' => 'Toyota Fortuner',
            'thn_mobil' => 2023,
            'plat_mobil' => 'B 1234 ABC',
            'warna_mobil' => 'Hitam',
            'stnk_mobil' => '12345678',
            'harga' => 500000,
            'kdkategori' => 'K001',
        ]);

        Mobil::create([
            'kdmobil' => 'M002',
            'nama_mobil' => 'Honda Civic',
            'thn_mobil' => 2022,
            'plat_mobil' => 'B 5678 DEF',
            'warna_mobil' => 'Putih',
            'stnk_mobil' => '87654321',
            'harga' => 450000,
            'kdkategori' => 'K002',
        ]);

        Mobil::create([
            'kdmobil' => 'M003',
            'nama_mobil' => 'Mitsubishi Pajero',
            'thn_mobil' => 2023,
            'plat_mobil' => 'B 9012 GHI',
            'warna_mobil' => 'Silver',
            'stnk_mobil' => '11223344',
            'harga' => 550000,
            'kdkategori' => 'K001',
        ]);
    }
}
