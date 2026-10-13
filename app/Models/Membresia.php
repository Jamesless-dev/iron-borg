<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Membresia extends Model
{
    use HasFactory;

    protected $table = 'membresias';

    protected $fillable = ['nombre', 'duracion_meses', 'precio', 'descripcion', 'activa'];

    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'activa' => 'boolean',
        ];
    }

    public function scopeActivas($query)
    {
        return $query->where('activa', true);
    }
}