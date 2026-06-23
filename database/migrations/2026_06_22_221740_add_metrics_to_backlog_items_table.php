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
        Schema::table('backlog_items', function (Blueprint $table) {
            $table->integer('story_points')->default(1)->after('status');
            $table->timestamp('completed_at')->nullable()->after('story_points');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('backlog_items', function (Blueprint $table) {
            $table->dropColumn(['story_points', 'completed_at']);
        });
    }
};
