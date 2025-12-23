<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ad_details', function (Blueprint $table) {
            $table->id();

            $table->foreignId('ad_id')
                ->constrained()
                ->cascadeOnDelete();

            /**
             * JSON flexible :
             * examples:
             * - land: { "land_type": "constructible" }
             * - house: { "bedrooms": 3, "bathrooms": 2 }
             * - rent: { "guarantee": 2, "furnished": true }
             */
            $table->json('details');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_details');
    }
};
