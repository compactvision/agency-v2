<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // MySQL DDL is not transactional: allow resuming a partial installation.
        if (! Schema::hasColumn('ads', 'first_published_at')) {
            Schema::table('ads', function (Blueprint $table) {
                $table->dateTime('first_published_at', 6)->nullable()->index();
            });
            // Existing public properties must not become new listings after an edit.
            DB::table('ads')->where('is_published', true)->where('is_approved', true)
                ->update(['first_published_at' => DB::raw('created_at')]);
        }

        if (! Schema::hasTable('property_search_alerts')) {
            Schema::create('property_search_alerts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('municipality_id')->constrained()->cascadeOnDelete();
                $table->boolean('active')->default(true);
                $table->dateTime('subscribed_at', 6);
                $table->timestamps();
                $table->unique(['user_id', 'municipality_id']);
            });
        }

        if (! Schema::hasTable('property_search_alert_deliveries')) {
            Schema::create('property_search_alert_deliveries', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('property_search_alert_id');
                $table->unsignedBigInteger('ad_id');
                $table->timestamp('sent_at');
            });
        }

        $foreignColumns = collect(Schema::getForeignKeys('property_search_alert_deliveries'))
            ->pluck('columns')->flatten();
        Schema::table('property_search_alert_deliveries', function (Blueprint $table) use ($foreignColumns) {
            if (! $foreignColumns->contains('property_search_alert_id')) {
                $table->foreign('property_search_alert_id', 'property_alert_delivery_alert_fk')
                    ->references('id')->on('property_search_alerts')->cascadeOnDelete();
            }
            if (! $foreignColumns->contains('ad_id')) {
                $table->foreign('ad_id', 'property_alert_delivery_ad_fk')
                    ->references('id')->on('ads')->cascadeOnDelete();
            }
        });
        if (! Schema::hasIndex('property_search_alert_deliveries', 'property_alert_delivery_unique')) {
            Schema::table('property_search_alert_deliveries', function (Blueprint $table) {
                $table->unique(['property_search_alert_id', 'ad_id'], 'property_alert_delivery_unique');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('property_search_alert_deliveries');
        Schema::dropIfExists('property_search_alerts');
        Schema::table('ads', fn (Blueprint $table) => $table->dropColumn('first_published_at'));
    }
};
