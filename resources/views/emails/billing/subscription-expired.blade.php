<x-mail::message>
# ❌ Votre abonnement a expiré

Bonjour **{{ $subscription->user->name ?? 'Utilisateur' }}**,

Votre abonnement au plan **{{ $subscription->plan->name }}** a expiré le **{{ $subscription->expires_at?->format('d/m/Y') }}**.

Vos annonces ne sont plus visibles publiquement. Renouvelez votre abonnement pour les réactiver.

<x-mail::button :url="config('app.url') . '/dashboard/billing'" color="error">
Renouveler maintenant
</x-mail::button>

Cordialement,<br>
{{ config('app.name') }}
</x-mail::message>
