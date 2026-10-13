<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Miembro extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre', 'apellido', 'email', 'telefono', 'dni',
        'fecha_nacimiento', 'membresia_activa', 'tipo_membresia',
        'fecha_vencimiento_membresia',
    ];

    protected function casts(): array
    {
        return [
            'fecha_nacimiento' => 'date',
            'fecha_vencimiento_membresia' => 'date',
            'membresia_activa' => 'boolean',
        ];
    }

    // Relaciones
    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }

    public function asistencias()
    {
        return $this->hasMany(Asistencia::class);
    }

    public function ventas()
    {
        return $this->hasMany(Venta::class, 'cliente_id');
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('membresia_activa', true);
    }

    public function scopeVencidos($query)
    {
        return $query->where('fecha_vencimiento_membresia', '<', now())
                     ->where('membresia_activa', true);
    }

    // Accessor: nombre completo
    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombre} {$this->apellido}";
    }
}