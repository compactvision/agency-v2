<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->id();

            // Ownership
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();

            // Business type
            $table->enum('ad_type', ['sale', 'rent']);

            // Human readable unique reference
            $table->string('reference')->unique();

            // Core info
            $table->string('title');
            $table->text('description')->nullable();

            // Pricing
            $table->decimal('price', 10, 2);
            $table->string('currency')->default('USD');

            // Optional generic data
            $table->integer('surface')->nullable();

            // Location
            $table->foreignId('country_id')->nullable()->constrained();
            $table->foreignId('city_id')->nullable()->constrained();
            $table->foreignId('municipality_id')->nullable()->constrained();

            // Lifecycle
            $table->enum('status', [
                'draft',              // created
                'pending_validation', // seller requested publication
                'published',          // admin approved
                'rejected',           // admin rejected
                'archived'            // expired / removed
            ])->default('draft');

            // Admin moderation
            $table->text('rejection_reason')->nullable();

            // Visibility
            $table->boolean('is_published')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
