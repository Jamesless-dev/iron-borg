<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'nombre' => 'Administrador',
            'rol' => 'ADMIN',
            'activo' => true,
        ]);

        User::create([
            'username' => 'empleado',
            'password' => Hash::make('empleado123'),
            'nombre' => 'Empleado Demo',
            'rol' => 'EMPLEADO',
            'activo' => true,
        ]);
    }
}