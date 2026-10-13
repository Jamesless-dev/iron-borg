<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'password',
        'nombre',
        'rol',
        'activo',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'activo' => 'boolean',
        ];
    }

    // Relaciones
    public function ventas()
    {
        return $this->hasMany(Venta::class, 'usuario_id');
    }

    // Scopes
    public function scopeAdmin($query)
    {
        return $query->where('rol', 'ADMIN');
    }

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }
}