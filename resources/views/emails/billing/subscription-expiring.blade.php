<x-mail::message>
# ⚠️ Votre abonnement expire bientôt

Bonjour **{{ $subscription->user->name ?? 'Utilisateur' }}**,

@if($daysRemaining === 0)
Votre abonnement au plan **{{ $subscription->plan->name }}** **expire aujourd'hui**.
@else
Votre abonnement au plan **{{ $subscription->plan->name }}** expire dans **{{ $daysRemaining }} jour(s)**.
@endif

**Date d'expiration :** {{ $subscription->expires_at?->format('d/m/Y') }}

Renouvelez dès maintenant pour ne pas perdre l'accès à vos annonces et fonctionnalités.

<x-mail::button :url="config('app.url') . '/dashboard/billing'" color="success">
Renouveler mon abonnement
</x-mail::button>

Cordialement,<br>
{{ config('app.name') }}
</x-mail::message>
