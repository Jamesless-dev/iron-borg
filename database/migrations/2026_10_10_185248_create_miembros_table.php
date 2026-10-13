<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('miembros', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('email', 100)->unique()->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('dni', 20)->unique()->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->boolean('membresia_activa')->default(true);
            $table->string('tipo_membresia', 50)->nullable();
            $table->date('fecha_vencimiento_membresia')->nullable();
            $table->timestamps();

            $table->index('email');
            $table->index('membresia_activa');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('miembros');
    }
};