<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MiembroController;
use App\Http\Controllers\MembresiaController;
use App\Http\Controllers\AsistenciaController; 
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Recursos del sistema
    Route::resource('miembros', MiembroController::class);
    Route::resource('membresias', MembresiaController::class); 

    // Asistencia
    Route::get('/asistencia', [AsistenciaController::class, 'index'])->name('asistencia.index');
    Route::get('/asistencia/buscar', [AsistenciaController::class, 'buscarMiembro'])->name('asistencia.buscar'); 
    Route::post('/asistencia/checkin', [AsistenciaController::class, 'checkIn'])->name('asistencia.checkin');
    Route::post('/asistencia/checkout', [AsistenciaController::class, 'checkOut'])->name('asistencia.checkout');
    Route::get('/asistencia/exportar', [AsistenciaController::class, 'exportar'])->name('asistencia.exportar');
});

require __DIR__.'/auth.php';