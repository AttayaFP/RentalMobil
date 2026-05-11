<?php

namespace App\Http\Controllers;

use App\Models\BookingMobil;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Notification;

class PaymentController extends Controller
{
    public function notificationHandler(Request $request)
    {
        // Set konfigurasi midtrans
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        // Instance midtrans notification
        try {
            $notification = new Notification;
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid signature key'], 403);
        }

        $transaction = $notification->transaction_status;
        $type = $notification->payment_type;
        $orderId = $notification->order_id; // ini adalah kdbooking
        $fraud = $notification->fraud_status;

        $booking = BookingMobil::where('kdbooking', $orderId)->first();

        if (! $booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        if ($transaction == 'capture') {
            // For credit card transaction, we need to check whether transaction is challenge by FDS or not
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    $booking->status = 'challenge';
                } else {
                    $booking->status = 'success';
                }
            }
        } elseif ($transaction == 'settlement') {
            $booking->status = 'success';
        } elseif ($transaction == 'pending') {
            $booking->status = 'pending';
        } elseif ($transaction == 'deny') {
            $booking->status = 'deny';
        } elseif ($transaction == 'expire') {
            $booking->status = 'expire';
        } elseif ($transaction == 'cancel') {
            $booking->status = 'cancel';
        }

        // Simpan transaction details dari midtrans
        $booking->transaction_id = $notification->transaction_id;
        $booking->transaction_time = $notification->transaction_time;
        $booking->payment_type = $type;
        $booking->save();

        return response()->json(['message' => 'Notification processed successfully']);
    }
}
