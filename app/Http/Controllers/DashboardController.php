<?php

namespace App\Http\Controllers;

use App\Models\Miembro;
use App\Models\Pago;
use App\Models\Venta;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Miembros activos
        $miembrosActivos = Miembro::where('membresia_activa', true)->count();

        // Ingresos del mes actual (pagos + ventas)
        $inicioMes = Carbon::now()->startOfMonth();
        $finMes = Carbon::now()->endOfMonth();

        $ingresosPagos = Pago::whereBetween('created_at', [$inicioMes, $finMes])
            ->where('estado', 'completado')
            ->sum('monto');

        $ingresosVentas = Venta::whereBetween('fecha', [$inicioMes, $finMes])
            ->where('estado', 'completado')
            ->sum('total');

        $ingresosMes = (float) $ingresosPagos + (float) $ingresosVentas;

        // Miembros por vencer en 7 días
        $porVencer = Miembro::where('membresia_activa', true)
            ->whereBetween('fecha_vencimiento_membresia', [
                Carbon::now()->toDateString(),
                Carbon::now()->addDays(7)->toDateString(),
            ])
            ->count();

        // Datos del gráfico: últimos 6 meses
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $mes = Carbon::now()->subMonths($i);
            $inicio = $mes->copy()->startOfMonth();
            $fin = $mes->copy()->endOfMonth();

            $pagos = Pago::whereBetween('created_at', [$inicio, $fin])
                ->where('estado', 'completado')
                ->sum('monto');

            $ventas = Venta::whereBetween('fecha', [$inicio, $fin])
                ->where('estado', 'completado')
                ->sum('total');

            $chartData[] = [
                'mes' => $mes->format('M'),
                'ingresos' => round((float) $pagos + (float) $ventas, 2),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'miembrosActivos' => $miembrosActivos,
                'ingresosMes' => $ingresosMes,
                'porVencer' => $porVencer,
            ],
            'chartData' => $chartData,
        ]);
    }
}