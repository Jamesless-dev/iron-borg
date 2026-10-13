<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            $table->string('numero_venta', 20)->unique();
            $table->timestamp('fecha')->useCurrent();
            $table->foreignId('cliente_id')->nullable()->constrained('miembros')->nullOnDelete();
            $table->string('cliente_nombre', 150)->nullable();
            $table->string('cliente_documento', 20)->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('igv', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('metodo_pago', 30)->default('Efectivo');
            $table->string('estado', 20)->default('completado');
            $table->foreignId('usuario_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('observacion')->nullable();
            $table->timestamps();

            $table->index('fecha');
            $table->index('numero_venta');
            $table->index('cliente_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};