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
        Schema::create('kembali_mobil', function (Blueprint $table) {
            $table->char('kdpengembalian', 10)->primary();
            $table->char('kdbooking', 10)->nullable();
            $table->unsignedBigInteger('iduser')->nullable();
            $table->date('tglmulai')->nullable();
            $table->date('tglselesai')->nullable();
            $table->date('tglpengembalian')->nullable();
            $table->integer('keterlambatan')->nullable();
            $table->double('denda')->nullable();
            $table->timestamps();

            $table->foreign('iduser')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('kdbooking')->references('kdbooking')->on('booking_mobil')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kembali_mobil');
    }
};
