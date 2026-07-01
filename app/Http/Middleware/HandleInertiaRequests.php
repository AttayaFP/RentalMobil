<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'notifications' => $request->user() 
                    ? (function() use ($request) {
                        \App\Models\Notifikasi::generatePassiveNotifications($request->user()->id);
                        return \App\Models\Notifikasi::where('iduser', $request->user()->id)->where('is_read', false)->latest()->get();
                      })()
                    : [],
                'mobil_selesai_rawat' => $request->user() && $request->user()->role === 'admin'
                    ? (function() {
                        return \App\Models\Mobil::whereRaw('LOWER(status) = ?', ['perawatan'])
                            ->get()
                            ->filter(function ($mobil) {
                                $latestKembali = \App\Models\KembaliMobil::whereHas('booking', function ($q) use ($mobil) {
                                    $q->where('kdmobil', $mobil->kdmobil);
                                })->orderBy('tglpengembalian', 'desc')->first();

                                if ($latestKembali && $latestKembali->tglpengembalian) {
                                    $tglPengembalian = \Carbon\Carbon::parse($latestKembali->tglpengembalian)->startOfDay();
                                } else {
                                    $tglPengembalian = \Carbon\Carbon::parse($mobil->updated_at)->startOfDay();
                                }

                                $hariIni = \Carbon\Carbon::now()->startOfDay();

                                return $tglPengembalian->diffInDays($hariIni, false) >= 2;
                            })
                            ->values()
                            ->toArray();
                      })()
                    : [],
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }
}
