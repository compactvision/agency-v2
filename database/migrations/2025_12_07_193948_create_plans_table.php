<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');                 // Ex: Basic, Pro
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);        // USD
            $table->string('interval')->default('monthly'); // monthly, yearly
            $table->boolean('is_active')->default(true);
            $table->integer('position')->default(0); // pour tri
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
