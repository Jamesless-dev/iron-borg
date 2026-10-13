<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Correlativo extends Model
{
    protected $primaryKey = 'tipo_documento';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['tipo_documento', 'serie', 'ultimo_numero'];

    // Método estático para generar el siguiente número de venta
    public static function generarNumeroVenta(): string
    {
        $correlativo = self::findOrFail('VENTA');
        $correlativo->ultimo_numero += 1;
        $correlativo->save();

        return $correlativo->serie . '-' . str_pad($correlativo->ultimo_numero, 7, '0', STR_PAD_LEFT);
    }
}