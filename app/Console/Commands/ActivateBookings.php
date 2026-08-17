<?php

namespace App\Console\Commands;

use App\Models\BookingMobil;
use Illuminate\Console\Command;

class ActivateBookings extends Command
{
    protected $signature = 'booking:activate';

    protected $description = 'Activate bookings whose start date has arrived by updating car status to Disewa';

    public function handle(): void
    {
        BookingMobil::autoActivateBookings();
        $this->info('Booking activation completed.');
    }
}