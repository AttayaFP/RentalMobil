<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function index(Request $request)
    {
        $query = Kategori::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kdkategori', 'like', "%{$search}%")
                    ->orWhere('nama_kategori', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        return Inertia::render('kategori/index', [
            'kategoris' => $query->latest()->get(),
            'filters' => $request->only(['search', 'date']),
        ]);
    }

    private function generateKdKategori(): string
    {
        $last = Kategori::orderByRaw('CAST(SUBSTRING(kdkategori, 5) AS UNSIGNED) DESC')
            ->whereRaw('kdkategori REGEXP "^KTG-[0-9]+$"')
            ->first();

        if ($last) {
            $number = (int) substr($last->kdkategori, 4) + 1;
        } else {
            $number = 1;
        }

        return 'KTG-'.str_pad($number, 3, '0', STR_PAD_LEFT);
    }

    public function create()
    {
        return Inertia::render('kategori/create', [
            'next_kdkategori' => $this->generateKdKategori(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kdkategori' => 'required|string|max:10|unique:kategori,kdkategori',
            'nama_kategori' => 'required|string|max:255',
        ]);

        Kategori::create($request->all());

        return redirect()->route('kategori.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function edit(string $id)
    {
        $kategori = Kategori::findOrFail($id);

        return Inertia::render('kategori/edit', [
            'kategori' => $kategori,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $kategori = Kategori::findOrFail($id);

        $request->validate([
            'nama_kategori' => 'required|string|max:255',
        ]);

        $kategori->update($request->all());

        return redirect()->route('kategori.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $kategori = Kategori::findOrFail($id);
        $kategori->delete();

        return redirect()->route('kategori.index')->with('success', 'Kategori berhasil dihapus.');
    }
}
