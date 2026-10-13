<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'miembro_id', 'fecha_entrada', 'fecha_salida',
        'duracion_minutos', 'estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_entrada' => 'datetime',
            'fecha_salida' => 'datetime',
        ];
    }

    public function miembro()
    {
        return $this->belongsTo(Miembro::class);
    }

    // Scope: reemplaza tu vista v_asistencias
    public function scopeConDatosMiembro($query)
    {
        return $query->with('miembro:id,nombre,apellido,email,telefono,membresia_activa,fecha_vencimiento_membresia')
                     ->orderBy('fecha_entrada', 'desc');
    }

    public function scopeDentro($query)
    {
        return $query->where('estado', 'dentro');
    }
}