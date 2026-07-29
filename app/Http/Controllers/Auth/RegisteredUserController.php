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
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar, gunakan email lain.',
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah digunakan, pilih yang lain.',
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'alamat.required' => 'Alamat wajib diisi.',
            'nohp.required' => 'Nomor HP wajib diisi.',
            'nohp.max' => 'Nomor HP maksimal 15 karakter.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'foto.required' => 'Foto profil wajib diunggah.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format foto harus jpeg, png, jpg, atau gif.',
            'foto.max' => 'Ukuran foto maksimal 2MB.',
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
