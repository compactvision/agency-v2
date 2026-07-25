<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_id')->nullable()->constrained('ads')->nullOnDelete();
            $table->foreignId('visitor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('visitor_name');
            $table->string('visitor_email');
            $table->string('visitor_phone', 30);
            $table->dateTime('scheduled_at');
            $table->string('status', 20)->default('pending');
            $table->text('message')->nullable();
            $table->timestamps();

            $table->index(['owner_id', 'status', 'scheduled_at']);
            $table->index(['visitor_id', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_visits');
    }
};
