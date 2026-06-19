<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_backlog_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_id')->constrained('dailys')->cascadeOnDelete();
            $table->foreignId('backlog_item_id')->constrained('backlog_items')->cascadeOnDelete();
            $table->enum('type', ['yesterday', 'today']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_backlog_item');
    }
};
