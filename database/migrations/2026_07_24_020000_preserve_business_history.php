<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->assertDataCanBeConstrained();

        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('anonymized_at')->nullable()->index();
        });

        Schema::table('ads', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('plans', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('plan_name')->nullable()->after('plan_id');
            $table->string('plan_interval')->nullable()->after('plan_name');
            $table->json('plan_features')->nullable()->after('plan_interval');
            $table->softDeletes();

            $table->index(
                ['user_id', 'status', 'expires_at'],
                'subscriptions_user_status_expiry_index'
            );
            $table->index(
                ['status', 'expires_at'],
                'subscriptions_status_expiry_index'
            );
            $table->index(
                ['plan_id', 'status'],
                'subscriptions_plan_status_index'
            );
            $table->unique('payment_id', 'subscriptions_payment_id_unique');
            $table->unique(
                'payment_session_id',
                'subscriptions_payment_session_id_unique'
            );
        });

        Schema::table('ad_details', function (Blueprint $table) {
            $table->unique('ad_id', 'ad_details_ad_id_unique');
        });

        Schema::table('ad_amenity', function (Blueprint $table) {
            $table->unique(['ad_id', 'amenity_id'], 'ad_amenity_pair_unique');
        });

        Schema::table('ad_images', function (Blueprint $table) {
            $table->index(['ad_id', 'position'], 'ad_images_ad_position_index');
            $table->index('path', 'ad_images_path_index');
        });

        $this->snapshotExistingSubscriptions();
    }

    public function down(): void
    {
        Schema::table('ad_images', function (Blueprint $table) {
            $table->dropIndex('ad_images_ad_position_index');
            $table->dropIndex('ad_images_path_index');
        });

        Schema::table('ad_amenity', function (Blueprint $table) {
            $table->dropUnique('ad_amenity_pair_unique');
        });

        Schema::table('ad_details', function (Blueprint $table) {
            $table->dropUnique('ad_details_ad_id_unique');
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropUnique('subscriptions_payment_id_unique');
            $table->dropUnique('subscriptions_payment_session_id_unique');
            $table->dropIndex('subscriptions_user_status_expiry_index');
            $table->dropIndex('subscriptions_status_expiry_index');
            $table->dropIndex('subscriptions_plan_status_index');
            $table->dropSoftDeletes();
            $table->dropColumn(['plan_name', 'plan_interval', 'plan_features']);
        });

        Schema::table('plans', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('ads', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['anonymized_at']);
            $table->dropColumn('anonymized_at');
        });
    }

    private function assertDataCanBeConstrained(): void
    {
        $failures = [];

        $duplicateDetails = DB::table('ad_details')
            ->select('ad_id')
            ->groupBy('ad_id')
            ->havingRaw('COUNT(*) > 1')
            ->get()
            ->count();

        if ($duplicateDetails > 0) {
            $failures[] = "{$duplicateDetails} annonce(s) ont plusieurs lignes ad_details";
        }

        $duplicateAmenities = DB::table('ad_amenity')
            ->select('ad_id', 'amenity_id')
            ->groupBy('ad_id', 'amenity_id')
            ->havingRaw('COUNT(*) > 1')
            ->get()
            ->count();

        if ($duplicateAmenities > 0) {
            $failures[] = "{$duplicateAmenities} doublon(s) ad_amenity";
        }

        foreach (['payment_id', 'payment_session_id'] as $column) {
            $duplicates = DB::table('subscriptions')
                ->select($column)
                ->whereNotNull($column)
                ->groupBy($column)
                ->havingRaw('COUNT(*) > 1')
                ->get()
                ->count();

            if ($duplicates > 0) {
                $failures[] = "{$duplicates} doublon(s) subscriptions.{$column}";
            }
        }

        $orphanChecks = [
            ['subscriptions', 'user_id', 'users'],
            ['subscriptions', 'plan_id', 'plans'],
            ['ads', 'user_id', 'users'],
            ['ad_details', 'ad_id', 'ads'],
            ['ad_images', 'ad_id', 'ads'],
            ['ad_amenity', 'ad_id', 'ads'],
            ['ad_amenity', 'amenity_id', 'amenities'],
            ['quotas', 'user_id', 'users'],
            ['quotas', 'plan_id', 'plans'],
        ];

        foreach ($orphanChecks as [$child, $foreignKey, $parent]) {
            $count = DB::table($child)
                ->leftJoin($parent, "{$child}.{$foreignKey}", '=', "{$parent}.id")
                ->whereNull("{$parent}.id")
                ->count();

            if ($count > 0) {
                $failures[] = "{$count} ligne(s) orpheline(s) {$child}.{$foreignKey}";
            }
        }

        if ($failures !== []) {
            throw new RuntimeException(
                "Migration interrompue : corrigez l’intégrité des données avant de relancer.\n- "
                .implode("\n- ", $failures)
            );
        }
    }

    private function snapshotExistingSubscriptions(): void
    {
        DB::table('subscriptions')
            ->orderBy('id')
            ->chunkById(100, function ($subscriptions) {
                foreach ($subscriptions as $subscription) {
                    $plan = DB::table('plans')->find($subscription->plan_id);

                    if (! $plan) {
                        continue;
                    }

                    $features = DB::table('plan_features')
                        ->where('plan_id', $plan->id)
                        ->orderBy('id')
                        ->get(['name', 'value'])
                        ->map(fn ($feature) => [
                            'name' => $feature->name,
                            'value' => $feature->value,
                        ])
                        ->all();

                    DB::table('subscriptions')
                        ->where('id', $subscription->id)
                        ->update([
                            'plan_name' => $plan->name,
                            'plan_interval' => $subscription->interval ?: $plan->interval,
                            'plan_features' => json_encode($features, JSON_THROW_ON_ERROR),
                        ]);
                }
            }, 'id');
    }
};
