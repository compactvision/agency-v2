<?php

namespace App\Console\Commands;

use App\Models\NewsletterSubscription;
use App\Services\BrevoNewsletter;
use Illuminate\Console\Command;
use Illuminate\Validation\ValidationException;

class SyncBrevoNewsletter extends Command
{
    protected $signature = 'newsletter:sync-brevo';

    protected $description = 'Import existing active newsletter subscriptions into the configured Brevo list';

    public function handle(BrevoNewsletter $brevo): int
    {
        $count = 0;
        foreach (NewsletterSubscription::where('is_active', true)->lazyById(100) as $subscription) {
            try {
                $brevo->subscribe($subscription->email);
            } catch (ValidationException) {
                $this->error("Synchronisation interrompue après {$count} contact(s). Vérifiez la configuration et les journaux, puis relancez la commande.");

                return self::FAILURE;
            }
            $count++;
        }

        $this->info("{$count} contact(s) synchronisé(s) avec Brevo.");

        return self::SUCCESS;
    }
}
