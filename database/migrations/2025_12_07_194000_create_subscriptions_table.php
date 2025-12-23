<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained()->cascadeOnDelete();

            $table->string('transaction_id')->unique();
            $table->string('payment_session_id')->nullable();
            $table->string('payment_id')->nullable();

            $table->enum('status', [
                'pending',
                'active',
                'failed',
                'cancelled',
                'expired',
                'refund_pending',
                'refunded'
            ])->default('pending');

            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('USD');

            $table->timestamp('started_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            $table->text('failure_reason')->nullable();
            $table->text('payment_method')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
