<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ad_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('ad_id')
                ->constrained()
                ->cascadeOnDelete();

            // Storage info (local, s3, etc.)
            $table->string('path');
            $table->integer('position')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_images');
    }
};
