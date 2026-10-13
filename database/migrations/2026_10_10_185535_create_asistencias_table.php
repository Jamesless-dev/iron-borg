<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('miembro_id')->constrained('miembros')->onDelete('cascade');
            $table->timestamp('fecha_entrada')->useCurrent();
            $table->timestamp('fecha_salida')->nullable();
            $table->integer('duracion_minutos')->nullable();
            $table->string('estado', 20)->default('dentro'); // 'dentro', 'completado'
            $table->timestamps();

            $table->index('miembro_id');
            $table->index('fecha_entrada');
            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};