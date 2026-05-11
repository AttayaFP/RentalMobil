<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function index()
    {
        return Inertia::render('kategori/index', [
            'kategoris' => Kategori::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('kategori/create');
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
