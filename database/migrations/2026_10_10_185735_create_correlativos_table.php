<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('correlativos', function (Blueprint $table) {
            $table->string('tipo_documento', 10)->primary();
            $table->string('serie', 4);
            $table->integer('ultimo_numero')->default(0);
            $table->timestamps();
        });

        // Insertar correlativo inicial
        DB::table('correlativos')->insert([
            'tipo_documento' => 'VENTA',
            'serie' => 'B001',
            'ultimo_numero' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('correlativos');
    }
};