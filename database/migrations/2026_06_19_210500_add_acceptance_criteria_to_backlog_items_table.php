<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('backlog_items', function (Blueprint $table) {
            $table->text('acceptance_criteria')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('backlog_items', function (Blueprint $table) {
            $table->dropColumn('acceptance_criteria');
        });
    }
};
