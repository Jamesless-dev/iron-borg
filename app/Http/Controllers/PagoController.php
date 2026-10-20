<?php

namespace App\Http\Controllers;

use App\Models\Correlativo;
use App\Models\Miembro;
use App\Models\Pago;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PagoController extends Controller
{
    public function index(Request $request)
    {
        $query = Pago::with('miembro:id,nombre,apellido,dni');

        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('numero_factura', 'ilike', "%{$search}%")
                  ->orWhereHas('miembro', function ($mq) use ($search) {
                      $mq->where('nombre', 'ilike', "%{$search}%")
                         ->orWhere('apellido', 'ilike', "%{$search}%")
                         ->orWhere('dni', 'ilike', "%{$search}%");
                  });
            });
        }

        // Filtro por estado
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        $pagos = $query->orderBy('created_at', 'desc')->get();

        // Stats del mes
        $inicioMes = Carbon::now()->startOfMonth();
        $finMes = Carbon::now()->endOfMonth();

        $totalMes = Pago::whereBetween('created_at', [$inicioMes, $finMes])
            ->where('estado', 'completado')
            ->sum('monto');

        $pagosMes = Pago::whereBetween('created_at', [$inicioMes, $finMes])
            ->where('estado', 'completado')
            ->count();

        $facturasEmitidas = Pago::whereNotNull('numero_factura')->count();

        return Inertia::render('Pagos/Index', [
            'pagos' => $pagos,
            'stats' => [
                'totalMes' => (float) $totalMes,
                'pagosMes' => $pagosMes,
                'facturasEmitidas' => $facturasEmitidas,
            ],
            'miembros' => Miembro::where('membresia_activa', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre', 'apellido', 'dni', 'tipo_membresia']),
            'filters' => $request->only('search', 'estado'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'miembro_id' => 'required|exists:miembros,id',
            'monto' => 'required|numeric|min:0',
            'metodo_pago' => 'required|string|max:50',
            'descripcion' => 'nullable|string',
            'estado' => 'required|in:completado,pendiente,anulado',
        ]);

        // Generar número de factura automáticamente
        $numeroFactura = Correlativo::generarNumeroVenta();

        $validated['numero_factura'] = $numeroFactura;

        Pago::create($validated);

        return redirect()->route('pagos.index')
            ->with('success', 'Pago registrado exitosamente. Factura: ' . $numeroFactura);
    }

    public function update(Request $request, Pago $pago)
    {
        $validated = $request->validate([
            'miembro_id' => 'required|exists:miembros,id',
            'monto' => 'required|numeric|min:0',
            'metodo_pago' => 'required|string|max:50',
            'descripcion' => 'nullable|string',
            'estado' => 'required|in:completado,pendiente,anulado',
        ]);

        $pago->update($validated);

        return redirect()->route('pagos.index')
            ->with('success', 'Pago actualizado exitosamente.');
    }

    public function destroy(Pago $pago)
    {
        $pago->delete();

        return redirect()->route('pagos.index')
            ->with('success', 'Pago eliminado exitosamente.');
    }
}