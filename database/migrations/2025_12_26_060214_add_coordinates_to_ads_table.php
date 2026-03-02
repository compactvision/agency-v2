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
        Schema::table('ads', function (Blueprint $table) {
            $table->decimal('latitude', 10, 8)->nullable()->after('municipality_id');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
        });
    }

    public function down(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
