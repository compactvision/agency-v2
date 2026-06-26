<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->boolean('is_approved')->default(false)->after('is_published');
        });

        // Set is_approved = true for all existing published ads
        DB::table('ads')->where('status', 'published')->update(['is_approved' => true]);
    }

    public function down(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->dropColumn('is_approved');
        });
    }
};
