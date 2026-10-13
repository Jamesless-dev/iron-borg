<?php

namespace App\Http\Controllers;

use App\Models\Miembro;
use App\Models\Membresia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MiembroController extends Controller
{
    public function index(Request $request)
    {
        $query = Miembro::query();

        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('apellido', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('dni', 'like', "%{$search}%");
            });
        }

        $miembros = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Miembros/Index', [
            'miembros' => $miembros,
            'membresias' => Membresia::where('activa', true)->get(['id', 'nombre', 'duracion_meses', 'precio']),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'dni' => 'nullable|string|max:20|unique:miembros,dni',
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'nullable|email|max:100|unique:miembros,email',
            'telefono' => 'nullable|string|max:20',
            'fecha_nacimiento' => 'nullable|date',
            'tipo_membresia' => 'nullable|string|max:50',
            'membresia_activa' => 'boolean',
        ]);

        $validated['membresia_activa'] = $request->boolean('membresia_activa', true);

        Miembro::create($validated);

        return redirect()->route('miembros.index')
            ->with('success', 'Miembro creado exitosamente.');
    }

    public function update(Request $request, Miembro $miembro)
    {
        $validated = $request->validate([
            'dni' => 'nullable|string|max:20|unique:miembros,dni,' . $miembro->id,
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'nullable|email|max:100|unique:miembros,email,' . $miembro->id,
            'telefono' => 'nullable|string|max:20',
            'fecha_nacimiento' => 'nullable|date',
            'tipo_membresia' => 'nullable|string|max:50',
            'membresia_activa' => 'boolean',
        ]);

        $validated['membresia_activa'] = $request->boolean('membresia_activa', true);

        $miembro->update($validated);

        return redirect()->route('miembros.index')
            ->with('success', 'Miembro actualizado exitosamente.');
    }

    public function destroy(Miembro $miembro)
    {
        $miembro->delete();

        return redirect()->route('miembros.index')
            ->with('success', 'Miembro eliminado exitosamente.');
    }
}