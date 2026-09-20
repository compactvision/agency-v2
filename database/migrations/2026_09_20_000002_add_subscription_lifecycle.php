<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->string('hidden_reason', 40)->nullable()->index();
            $table->timestamp('subscription_hidden_at')->nullable();
        });
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('payment_customer_email')->nullable();
        });
        Schema::create('subscription_notices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->restrictOnDelete();
            $table->string('kind', 30);
            $table->string('period_key', 80);
            $table->json('context')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('skipped_at')->nullable();
            $table->unsignedInteger('attempts')->default(0);
            $table->string('last_error')->nullable();
            $table->timestamps();
            $table->unique(['subscription_id', 'kind', 'period_key'], 'subscription_notice_unique');
            $table->index(['sent_at', 'skipped_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_notices');
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('payment_customer_email');
        });
        Schema::table('ads', fn (Blueprint $table) => $table->dropColumn(['hidden_reason', 'subscription_hidden_at']));
    }
};
