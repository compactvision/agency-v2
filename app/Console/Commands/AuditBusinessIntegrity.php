<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class AuditBusinessIntegrity extends Command
{
    protected $signature = 'integrity:audit
        {--media : Vérifier aussi que chaque fichier ad_images existe sur le disque public}';

    protected $description = 'Audite les doublons, orphelins, instantanés d’abonnement et médias';

    public function handle(): int
    {
        $errors = [];
        $warnings = [];

        $this->checkDuplicates(
            'ad_details',
            ['ad_id'],
            'annonces avec plusieurs lignes de détails',
            $errors
        );
        $this->checkDuplicates(
            'ad_amenity',
            ['ad_id', 'amenity_id'],
            'doublons annonce/équipement',
            $errors
        );
        $this->checkDuplicates(
            'ad_images',
            ['ad_id', 'position'],
            'positions d’image dupliquées (indexées mais non bloquantes)',
            $warnings
        );
        $this->checkDuplicates(
            'subscriptions',
            ['payment_id'],
            'identifiants de paiement dupliqués',
            $errors,
            'payment_id'
        );
        $this->checkDuplicates(
            'subscriptions',
            ['payment_session_id'],
            'sessions de paiement dupliquées',
            $errors,
            'payment_session_id'
        );

        foreach ([
            ['subscriptions', 'user_id', 'users'],
            ['subscriptions', 'plan_id', 'plans'],
            ['ads', 'user_id', 'users'],
            ['ad_details', 'ad_id', 'ads'],
            ['ad_images', 'ad_id', 'ads'],
            ['ad_amenity', 'ad_id', 'ads'],
            ['ad_amenity', 'amenity_id', 'amenities'],
            ['quotas', 'user_id', 'users'],
            ['quotas', 'plan_id', 'plans'],
        ] as [$child, $foreignKey, $parent]) {
            $count = DB::table($child)
                ->leftJoin($parent, "{$child}.{$foreignKey}", '=', "{$parent}.id")
                ->whereNull("{$parent}.id")
                ->count();

            if ($count > 0) {
                $errors[] = "{$count} ligne(s) orpheline(s) {$child}.{$foreignKey}";
            }
        }

        if (Schema::hasColumn('subscriptions', 'plan_name')) {
            $missingSnapshots = DB::table('subscriptions')
                ->whereNull('plan_name')
                ->orWhereNull('plan_interval')
                ->count();

            if ($missingSnapshots > 0) {
                $errors[] = "{$missingSnapshots} abonnement(s) sans instantané commercial complet";
            }
        }

        if ($this->option('media')) {
            $missingMedia = 0;

            DB::table('ad_images')
                ->orderBy('id')
                ->chunkById(200, function ($images) use (&$missingMedia) {
                    foreach ($images as $image) {
                        if (! Storage::disk('public')->exists($image->path)) {
                            $missingMedia++;
                            $this->line("  - média absent : ad_images#{$image->id} ({$image->path})");
                        }
                    }
                });

            if ($missingMedia > 0) {
                $errors[] = "{$missingMedia} fichier(s) média référencé(s) mais absent(s)";
            }
        }

        foreach ($warnings as $warning) {
            $this->warn($warning);
        }

        if ($errors !== []) {
            $this->error('Audit d’intégrité échoué.');
            foreach ($errors as $error) {
                $this->line("  - {$error}");
            }

            return self::FAILURE;
        }

        $this->info('Audit d’intégrité réussi : aucun blocage détecté.');

        return self::SUCCESS;
    }

    private function checkDuplicates(
        string $table,
        array $columns,
        string $label,
        array &$results,
        ?string $notNullColumn = null
    ): void {
        $query = DB::table($table)->select($columns);

        if ($notNullColumn !== null) {
            $query->whereNotNull($notNullColumn);
        }

        $count = $query
            ->groupBy(...$columns)
            ->havingRaw('COUNT(*) > 1')
            ->get()
            ->count();

        if ($count > 0) {
            $results[] = "{$count} {$label}";
        }
    }
}
