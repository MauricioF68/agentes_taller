<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups')->cascadeOnDelete();
            
            // NUEVO: Llave foránea hacia categories
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->string('original_name');
            $table->string('file_path');
            
            // Además, prepararemos el terreno para la Fase 2 (Los checks de estado de IA)
            $table->enum('status_ai', ['pending', 'vectorized', 'failed'])->default('pending');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};