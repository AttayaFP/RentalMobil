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
        Schema::create('booking_mobil', function (Blueprint $table) {
            $table->char('kdbooking', 10)->primary();
            $table->date('tglbooking')->nullable();
            $table->unsignedBigInteger('iduser')->nullable();
            $table->char('kdmobil', 10)->nullable();
            $table->double('harga')->nullable();
            $table->string('payment_type', 255)->nullable();
            $table->string('payment_method', 255)->nullable();
            $table->date('tglmulai')->nullable();
            $table->date('tglselesai')->nullable();
            $table->integer('lama_sewa')->nullable();
            $table->double('total_bayar')->nullable();
            $table->string('transaction_id', 255)->nullable();
            $table->dateTime('transaction_time')->nullable();
            $table->string('status', 255)->nullable();
            $table->timestamps();

            $table->foreign('iduser')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('kdmobil')->references('kdmobil')->on('mobil')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_mobil');
    }
};
