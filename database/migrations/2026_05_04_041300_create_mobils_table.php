<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mobil', function (Blueprint $table) {
            $table->char('kdmobil', 10)->primary();
            $table->string('nama_mobil', 255)->nullable();
            $table->integer('thn_mobil')->nullable();
            $table->string('plat_mobil', 255)->nullable();
            $table->string('warna_mobil', 255)->nullable();
            $table->string('stnk_mobil', 255)->nullable();
            $table->double('harga')->nullable();
            $table->char('kdkategori', 10)->nullable();
            $table->string('foto', 255)->nullable();
            $table->timestamps();

            $table->foreign('kdkategori')->references('kdkategori')->on('kategori')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mobil');
    }
};
