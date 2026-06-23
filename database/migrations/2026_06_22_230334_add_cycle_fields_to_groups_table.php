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
        Schema::table('groups', function (Blueprint $table) {
            $table->foreignId('academic_cycle_id')->nullable()->constrained('academic_cycles')->nullOnDelete();
            $table->string('classroom')->nullable();
            $table->string('shift')->nullable();
            $table->string('project_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('groups', function (Blueprint $table) {
            $table->dropForeign(['academic_cycle_id']);
            $table->dropColumn(['academic_cycle_id', 'classroom', 'shift', 'project_name']);
        });
    }
};
