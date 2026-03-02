<x-mail::message>
# Nouvelle propriété à valider

Une nouvelle propriété a été soumise pour validation par **{{ $userName }}** ({{ $userEmail }}).

**Détails de la propriété :**
- **Titre :** {{ $propertyTitle }}
- **Référence :** {{ $reference }}

Veuillez l'analyser et décider de sa publication depuis votre tableau de bord.

<x-mail::button :url="config('app.url') . '/dashboard/admin/ads/pending'">
Accéder aux validations
</x-mail::button>

Merci,<br>
Système {{ config('app.name') }}
</x-mail::message>
