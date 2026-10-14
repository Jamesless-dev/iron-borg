<?php

namespace Database\Seeders;

use App\Models\Membresia;
use Illuminate\Database\Seeder;

class MembresiaSeeder extends Seeder
{
    public function run(): void
    {
        $membresias = [
            ['nombre' => 'Básica', 'duracion_meses' => 1, 'precio' => 80.00, 'descripcion' => 'Acceso básico al gimnasio'],
            ['nombre' => 'Estándar', 'duracion_meses' => 3, 'precio' => 200.00, 'descripcion' => 'Acceso completo + clases grupales'],
            ['nombre' => 'Premium', 'duracion_meses' => 6, 'precio' => 350.00, 'descripcion' => 'Todo incluido + entrenador personal'],
            ['nombre' => 'Anual', 'duracion_meses' => 12, 'precio' => 600.00, 'descripcion' => 'Membresía anual completa'],
        ];

        foreach ($membresias as $m) {
            Membresia::create($m);
        }
    }
}