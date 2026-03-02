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
        Schema::table('ads', function (Blueprint $table) {
            // Index simples pour les tris fréquents
            $table->index('price');
            $table->index('created_at');
            
            // Index composites pour les filtres combinés fréquents
            // (ex: afficher les annonces publiées et validées d'une ville spécifique)
            $table->index(['status', 'is_published']);
            $table->index(['municipality_id', 'status', 'is_published'], 'ads_municipality_status_published_index');
            $table->index(['city_id', 'status', 'is_published'], 'ads_city_status_published_index');
            
            // Index pour la recherche par catégorie et type (Vente/Location)
            $table->index(['category_id', 'ad_type'], 'ads_category_type_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->dropIndex(['price']);
            $table->dropIndex(['created_at']);
            
            $table->dropIndex(['status', 'is_published']);
            $table->dropIndex('ads_municipality_status_published_index');
            $table->dropIndex('ads_city_status_published_index');
            
            $table->dropIndex('ads_category_type_index');
        });
    }
};
