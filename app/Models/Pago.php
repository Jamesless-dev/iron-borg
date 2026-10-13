<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        'miembro_id', 'monto', 'metodo_pago', 'descripcion',
        'numero_factura', 'estado',
    ];

    protected function casts(): array
    {
        return ['monto' => 'decimal:2'];
    }

    public function miembro()
    {
        return $this->belongsTo(Miembro::class);
    }
}