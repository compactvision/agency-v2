<?php

namespace App\Domains\Quotas\Services;

use App\Domains\Ads\Models\Ad;
use App\Domains\Billing\Models\Subscription;
use Illuminate\Support\Facades\Log;

class QuotaService
{
    /**
     * Récupérer le quota d’un plan (à partir des plan_features)
     */
    public function getPlanQuota(int $planId): int
    {
        $key = "plan_quota_{$planId}";

        return cache()->remember($key, 3600, function () use ($planId) {
            $plan = \App\Domains\Billing\Models\Plan::with('features')->find($planId);

            if (!$plan) {
                return 0;
            }

            $feature = $plan->features->firstWhere('name', 'Listings per month');

            if (!$feature) {
                return 0;
            }

            return strtolower($feature->value) === 'unlimited'
                ? PHP_INT_MAX
                : intval($feature->value);
        });
    }

    /**
     * Vérifier les quotas d’un utilisateur
     */
    public function check(int $userId, ?Subscription $subscription): array
    {
        if (!$subscription || $subscription->status !== 'active') {
            return [
                'allowed' => 0,
                'used' => 0,
                'remaining' => 0,
                'plan_quota' => 0,
                'plan_name' => null
            ];
        }

        // Capacité max du plan
        $max = $this->getPlanQuota($subscription->plan_id);

        // Nombre d’annonces publiées ce mois-ci
        $used = $this->countUserAdsThisMonth($userId);

        return [
            'allowed' => $max,
            'used' => $used,
            'remaining' => max($max - $used, 0),
            'plan_quota' => $max,
            'plan_name' => $subscription->plan->name
        ];
    }

    /**
     * Consommer une unité de quota
     */
    public function consume(int $userId, ?Subscription $subscription, int $amount = 1): array
    {
        if (!$subscription || $subscription->status !== 'active') {
            throw new \Exception("User has no active subscription");
        }

        $quota = $this->check($userId, $subscription);

        if ($quota['remaining'] < $amount) {
            throw new \Exception("Quota exceeded: not enough remaining slots");
        }

        // Ici normalement tu enregistres l’annonce publiée
        // Pour le moment on fait juste un log
        Log::info("Quota consumed", [
            'user_id' => $userId,
            'amount' => $amount
        ]);

        return [
            'success' => true,
            'message' => "Consumed {$amount} quota units",
            'remaining' => $quota['remaining'] - $amount
        ];
    }

    /**
     * Compter les publications (annonces) du mois
     * TODO: intégrer le module Ads
     */
    public function countUserAdsThisMonth(int $userId): int
    {
        return Ad::where('user_id', $userId)
            ->whereIn('status', ['pending_validation', 'published'])
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
    }

    /**
     * Reset du quota d'un utilisateur (ADMIN)
     */
    public function reset(int $userId, int $planId): void
    {
        // Quand le module Ads sera prêt, on efface les annonces du mois :
        // Ad::where('user_id', $userId)
        //   ->whereMonth(...)
        //   ->delete();

        Log::warning("Quota reset by admin", [
            'user_id' => $userId,
            'plan_id' => $planId
        ]);
    }

    /**
     * Nombre max d'images par annonce selon le plan
     */
    public function getMaxImagesPerAd(?Subscription $subscription): int
    {
        if (!$subscription || $subscription->status !== 'active') {
            return 0;
        }

        $plan = $subscription->plan()->with('features')->first();
        if (!$plan) {
            return 0;
        }

        $feature = $plan->features
            ->firstWhere('name', 'Images per ad');

        if (!$feature) {
            return 0;
        }

        return strtolower($feature->value) === 'unlimited'
            ? PHP_INT_MAX
            : (int) $feature->value;
    }

    /**
     * Vérifier si on peut ajouter X images à une annonce
     */
    public function canAddImages(Ad $ad, int $incomingCount): bool
    {
        $subscription = $ad->user->subscription;

        $max = $this->getMaxImagesPerAd($subscription);

        if ($max === 0) {
            return false;
        }

        $current = $ad->images()->count();

        return ($current + $incomingCount) <= $max;
    }

}
