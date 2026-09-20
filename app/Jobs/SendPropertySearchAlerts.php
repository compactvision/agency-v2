<?php

namespace App\Jobs;

use App\Domains\Ads\Models\Ad;
use App\Mail\NewPropertySearchAlertMail;
use App\Models\PropertySearchAlert;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class SendPropertySearchAlerts implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 120;

    public int $uniqueFor = 300;

    public function __construct(public int $alertId) {}

    public function uniqueId(): string
    {
        return (string) $this->alertId;
    }

    public function middleware(): array
    {
        return [(new WithoutOverlapping('property-search-alert:'.$this->alertId))->releaseAfter(30)->expireAfter(180)];
    }

    public function backoff(): array
    {
        return [30, 120];
    }

    public function handle(): void
    {
        $alert = PropertySearchAlert::with(['user', 'municipality'])->find($this->alertId);
        if (! $alert?->active || ! $alert->user?->hasVerifiedEmail()) {
            return;
        }

        $ads = Ad::query()
            ->where('municipality_id', $alert->municipality_id)
            ->publiclyVisible()
            ->where('first_published_at', '>=', $alert->subscribed_at)
            ->whereNotExists(fn ($query) => $query->selectRaw('1')
                ->from('property_search_alert_deliveries')
                ->where('property_search_alert_id', $alert->id)
                ->whereColumn('ad_id', 'ads.id'))
            ->orderBy('first_published_at')->orderBy('id')->limit(20)->get();

        foreach ($ads as $ad) {
            // Recheck consent and visibility when the queued work actually runs.
            $alert->refresh();
            $ad = $ad->fresh();
            if (! $alert->active || ! $alert->user?->hasVerifiedEmail()) {
                return;
            }
            if (! $ad || ! $ad->isPubliclyVisible()
                || $ad->municipality_id != $alert->municipality_id
                || $ad->first_published_at < $alert->subscribed_at) {
                continue;
            }

            Mail::to($alert->user->email)->send(new NewPropertySearchAlertMail($ad, $alert));
            DB::table('property_search_alert_deliveries')->insert([
                'property_search_alert_id' => $alert->id,
                'ad_id' => $ad->id,
                'sent_at' => now(),
            ]);
        }
    }
}
