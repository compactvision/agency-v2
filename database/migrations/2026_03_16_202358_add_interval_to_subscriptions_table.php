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
        Schema::table('subscriptions', function (Blueprint $table) {
            // Store the billing interval per subscription so expiry is always calculated correctly
            $table->enum('interval', ['monthly', 'yearly'])->default('monthly')->after('currency');
            // Track when admin approved/rejected manual subscriptions
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->after('interval');
            $table->timestamp('cancelled_at')->nullable()->after('approved_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropColumn(['interval', 'approved_by', 'cancelled_at']);
        });
    }
};
