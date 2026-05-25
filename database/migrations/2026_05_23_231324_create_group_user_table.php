<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('group_user', function (Blueprint $table) {
        $table->foreignId('group_id')->constrained('groups')->cascadeOnDelete();
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        // Evitar que un alumno esté dos veces en el mismo grupo
        $table->unique(['group_id', 'user_id']); 
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_user');
    }
};
