<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->replaceBusinessForeignKeys('restrict');
    }

    public function down(): void
    {
        $this->replaceBusinessForeignKeys('cascade');
    }

    private function replaceBusinessForeignKeys(string $onDelete): void
    {
        Schema::table('subscriptions', function (Blueprint $table) use ($onDelete) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['plan_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete($onDelete);
            $table->foreign('plan_id')->references('id')->on('plans')->onDelete($onDelete);
        });

        Schema::table('ads', function (Blueprint $table) use ($onDelete) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete($onDelete);
        });

        Schema::table('quotas', function (Blueprint $table) use ($onDelete) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['plan_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete($onDelete);
            $table->foreign('plan_id')->references('id')->on('plans')->onDelete($onDelete);
        });

        Schema::table('newsletter_subscriptions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }
};
