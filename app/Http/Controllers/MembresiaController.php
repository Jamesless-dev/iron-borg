<?php

namespace App\Http\Controllers;

use App\Models\Membresia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MembresiaController extends Controller
{
    public function index(Request $request)
    {
        $query = Membresia::query();

        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        $membresias = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Membresias/Index', [
            'membresias' => $membresias,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50',
            'duracion_meses' => 'required|integer|min:1',
            'precio' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'activa' => 'boolean',
        ]);

        $validated['activa'] = $request->boolean('activa', true);

        Membresia::create($validated);

        return redirect()->route('membresias.index')
            ->with('success', 'Membresía creada exitosamente.');
    }

    public function update(Request $request, Membresia $membresia)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50',
            'duracion_meses' => 'required|integer|min:1',
            'precio' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'activa' => 'boolean',
        ]);

        $validated['activa'] = $request->boolean('activa', true);

        $membresia->update($validated);

        return redirect()->route('membresias.index')
            ->with('success', 'Membresía actualizada exitosamente.');
    }

    public function destroy(Membresia $membresia)
    {
        $membresia->delete();

        return redirect()->route('membresias.index')
            ->with('success', 'Membresía eliminada exitosamente.');
    }
}