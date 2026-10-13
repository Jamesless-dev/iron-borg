<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('miembro_id')->constrained('miembros')->onDelete('cascade');
            $table->decimal('monto', 10, 2);
            $table->string('metodo_pago', 50)->nullable();
            $table->text('descripcion')->nullable();
            $table->string('numero_factura', 50)->unique()->nullable();
            $table->string('estado', 20)->default('completado');
            $table->timestamps();

            $table->index('estado');
            $table->index('miembro_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};