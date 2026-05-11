<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Mobil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MobilController extends Controller
{
    public function index(Request $request)
    {
        $query = Mobil::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kdmobil', 'like', "%{$search}%")
                    ->orWhere('nama_mobil', 'like', "%{$search}%")
                    ->orWhere('plat_mobil', 'like', "%{$search}%")
                    ->orWhere('thn_mobil', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        return Inertia::render('mobil/index', [
            'mobils' => $query->latest()->get(),
            'filters' => $request->only(['search', 'date']),
        ]);
    }

    private function generateKdMobil(): string
    {
        $last = Mobil::orderByRaw('CAST(SUBSTRING(kdmobil, 5) AS UNSIGNED) DESC')
            ->whereRaw('kdmobil REGEXP "^MBL-[0-9]+$"')
            ->first();

        if ($last) {
            $number = (int) substr($last->kdmobil, 4) + 1;
        } else {
            $number = 1;
        }

        return 'MBL-'.str_pad($number, 3, '0', STR_PAD_LEFT);
    }

    public function create()
    {
        return Inertia::render('mobil/create', [
            'kategoris' => Kategori::all(),
            'next_kdmobil' => $this->generateKdMobil(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kdmobil' => 'required|string|max:10|unique:mobil,kdmobil',
            'nama_mobil' => 'required|string|max:255',
            'thn_mobil' => 'required|integer',
            'plat_mobil' => 'required|string|max:255',
            'warna_mobil' => 'required|string|max:255',
            'stnk_mobil' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'kdkategori' => 'required|string|max:10',
            'status' => 'required|string|in:Tersedia,Disewa,Perawatan',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->all();
        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('mobils', 'public');
        }

        Mobil::create($data);

        return redirect()->route('mobil.index')->with('success', 'Mobil berhasil ditambahkan.');
    }

    public function edit(string $id)
    {
        $mobil = Mobil::findOrFail($id);

        return Inertia::render('mobil/edit', [
            'mobil' => $mobil,
            'kategoris' => Kategori::all(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $mobil = Mobil::findOrFail($id);

        $request->validate([
            'nama_mobil' => 'required|string|max:255',
            'thn_mobil' => 'required|integer',
            'plat_mobil' => 'required|string|max:255',
            'warna_mobil' => 'required|string|max:255',
            'stnk_mobil' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'kdkategori' => 'required|string|max:10',
            'status' => 'required|string|in:Tersedia,Disewa,Perawatan',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->all();
        if ($request->hasFile('foto')) {
            if ($mobil->foto) {
                Storage::disk('public')->delete($mobil->foto);
            }
            $data['foto'] = $request->file('foto')->store('mobils', 'public');
        }

        $mobil->update($data);

        return redirect()->route('mobil.index')->with('success', 'Mobil berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $mobil = Mobil::findOrFail($id);
        $mobil->delete();

        return redirect()->route('mobil.index')->with('success', 'Mobil berhasil dihapus.');
    }

    public function updateStatus(Request $request, string $id)
    {
        $mobil = Mobil::findOrFail($id);
        $request->validate([
            'status' => 'required|string|in:Tersedia,Disewa,Perawatan',
        ]);

        $mobil->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status mobil berhasil diperbarui.');
    }
}
