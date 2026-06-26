<x-mail::message>
# 🎉 Votre abonnement est activé !

Bonjour **{{ $subscription->user->name ?? 'Utilisateur' }}**,

Votre abonnement au plan **{{ $subscription->plan->name }}** est maintenant **actif**.

| Détails | |
|---|---|
| Plan | {{ $subscription->plan->name }} |
| Montant | {{ $subscription->amount }} {{ $subscription->currency }} |
| Début | {{ $subscription->started_at?->format('d/m/Y') }} |
| Expiration | {{ $subscription->expires_at?->format('d/m/Y') ?? 'Illimité' }} |

<x-mail::button :url="config('app.url') . '/dashboard/billing'">
Voir mon abonnement
</x-mail::button>

Merci de votre confiance,<br>
{{ config('app.name') }}
</x-mail::message>
