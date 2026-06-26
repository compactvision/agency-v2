<x-mail::message>
# 🔔 Nouvelle demande d'abonnement manuel

Bonjour Admin,

Un utilisateur vient de faire une demande d'abonnement au plan **{{ $planName }}** et attend votre validation.

| Détails | |
|---|---|
| Utilisateur ID | {{ $userId }} |
| Plan | {{ $planName }} |
| Subscription ID | {{ $subscriptionId }} |

Rendez-vous dans le panneau d'administration pour approuver ou rejeter cette demande.

<x-mail::button :url="config('app.url') . '/dashboard/admin/subscriptions/' . $subscriptionId">
Voir la demande
</x-mail::button>

{{ config('app.name') }}
</x-mail::message>
