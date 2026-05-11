<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{

    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'username' => 'required|string|max:255|unique:' . User::class,
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string|max:255',
            'nohp' => 'required|string|max:15',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $fotoPath = $request->file('foto')->store('users', 'public');

        $user = User::create([
            'email' => $request->email,
            'username' => $request->username,
            'nama_lengkap' => $request->nama_lengkap,
            'jenis_kelamin' => $request->jenis_kelamin,
            'alamat' => $request->alamat,
            'nohp' => $request->nohp,
            'password' => $request->password,
            'foto' => $fotoPath,
            'role' => 'pelanggan',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('home');
    }
}
