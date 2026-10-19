<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Miembro;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AsistenciaController extends Controller
{
    public function index(Request $request)
    {
        $hoy = Carbon::today();
        $asistenciasHoy = Asistencia::whereDate('fecha_entrada', $hoy)->count();
        $miembrosDentro = Asistencia::where('estado', 'dentro')->count();

        $query = Asistencia::with('miembro:id,nombre,apellido,dni,email');

        if ($request->filled('fecha')) {
            $query->whereDate('fecha_entrada', $request->fecha);
        }

        $asistencias = $query->orderBy('fecha_entrada', 'desc')->get();

        return Inertia::render('Asistencia/Index', [
            'stats' => [
                'asistenciasHoy' => $asistenciasHoy,
                'miembrosDentro' => $miembrosDentro,
            ],
            'asistencias' => $asistencias,
            'filters' => $request->only('fecha'),
            'miembro' => null,
            'asistenciaActiva' => null,
            'errorBusqueda' => null,
        ]);
    }

    public function buscarMiembro(Request $request)
    {
        $busqueda = trim($request->query('busqueda', ''));

        if (strlen($busqueda) < 1) {
            return back()->with('error', 'Ingresa al menos 1 carácter para buscar');
        }

        // ILIKE para PostgreSQL (case-insensitive)
        $miembro = Miembro::where(function ($q) use ($busqueda) {
                $q->where('nombre', 'ilike', "%{$busqueda}%")
                  ->orWhere('apellido', 'ilike', "%{$busqueda}%")
                  ->orWhere('dni', 'ilike', "%{$busqueda}%")
                  ->orWhereRaw("CONCAT(nombre, ' ', apellido) ILIKE ?", ["%{$busqueda}%"]);
            })
            ->where('membresia_activa', true)
            ->first(['id', 'nombre', 'apellido', 'dni', 'email', 'telefono', 'tipo_membresia', 'fecha_vencimiento_membresia']);

        if (!$miembro) {
            return Inertia::render('Asistencia/Index', [
                'stats' => [
                    'asistenciasHoy' => Asistencia::whereDate('fecha_entrada', today())->count(),
                    'miembrosDentro' => Asistencia::where('estado', 'dentro')->count(),
                ],
                'asistencias' => Asistencia::with('miembro:id,nombre,apellido,dni,email')
                    ->orderBy('fecha_entrada', 'desc')
                    ->get(),
                'miembro' => null,
                'asistenciaActiva' => null,
                'errorBusqueda' => "No encontramos a '{$busqueda}'. Verifica el nombre o DNI.",
                'filters' => $request->only('fecha'),
            ]);
        }

        $asistenciaActiva = Asistencia::where('miembro_id', $miembro->id)
            ->where('estado', 'dentro')
            ->first();

        return Inertia::render('Asistencia/Index', [
            'stats' => [
                'asistenciasHoy' => Asistencia::whereDate('fecha_entrada', today())->count(),
                'miembrosDentro' => Asistencia::where('estado', 'dentro')->count(),
            ],
            'asistencias' => Asistencia::with('miembro:id,nombre,apellido,dni,email')
                ->orderBy('fecha_entrada', 'desc')
                ->get(),
            'miembro' => $miembro,
            'asistenciaActiva' => $asistenciaActiva,
            'errorBusqueda' => null,
            'filters' => $request->only('fecha'),
        ]);
    }

    public function checkIn(Request $request)
    {
        $request->validate([
            'miembro_id' => 'required|exists:miembros,id',
        ]);

        $existe = Asistencia::where('miembro_id', $request->miembro_id)
            ->where('estado', 'dentro')
            ->exists();

        if ($existe) {
            return back()->with('error', 'El miembro ya está registrado dentro del gimnasio.');
        }

        Asistencia::create([
            'miembro_id' => $request->miembro_id,
            'fecha_entrada' => now(),
            'estado' => 'dentro',
        ]);

        return back()->with('success', 'Check-in registrado exitosamente.');
    }

    public function checkOut(Request $request)
    {
        $request->validate([
            'asistencia_id' => 'required|exists:asistencias,id',
        ]);

        $asistencia = Asistencia::findOrFail($request->asistencia_id);

        $entrada = Carbon::parse($asistencia->fecha_entrada);
        $salida = now();
        
        // Redondear a entero para evitar error de PostgreSQL
        $duracion = (int) round($entrada->diffInMinutes($salida));

        $asistencia->update([
            'fecha_salida' => $salida,
            'duracion_minutos' => $duracion,
            'estado' => 'completado',
        ]);

        return back()->with('success', 'Check-out registrado exitosamente.');
    }

    public function exportar(Request $request)
    {
        $query = Asistencia::with('miembro:id,nombre,apellido,dni');

        if ($request->filled('fecha')) {
            $query->whereDate('fecha_entrada', $request->fecha);
        }

        $asistencias = $query->orderBy('fecha_entrada', 'desc')->get();

        $csv = "Miembro,DNI,Hora Entrada,Hora Salida,Duración (min),Estado\n";

        foreach ($asistencias as $a) {
            $nombre = "{$a->miembro->nombre} {$a->miembro->apellido}";
            $dni = $a->miembro->dni ?? '-';
            $entrada = Carbon::parse($a->fecha_entrada)->format('Y-m-d H:i:s');
            $salida = $a->fecha_salida ? Carbon::parse($a->fecha_salida)->format('Y-m-d H:i:s') : '-';
            $duracion = $a->duracion_minutos ?? '-';
            $estado = $a->estado === 'dentro' ? 'Dentro' : 'Completado';

            $csv .= "\"{$nombre}\",\"{$dni}\",\"{$entrada}\",\"{$salida}\",\"{$duracion}\",\"{$estado}\"\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="asistencias_' . date('Y-m-d') . '.csv"');
    }
}