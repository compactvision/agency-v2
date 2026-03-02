<x-mail::message>
# Bonjour {{ $userName }},

Merci d'avoir publié votre propriété **"{{ $propertyTitle }}"** (Référence: {{ $reference }}) sur notre plateforme.

Votre annonce est actuellement en cours de validation par notre équipe d'administration. Ce processus prend généralement moins de 24 heures.

Vous recevrez un nouvel email dès que votre annonce sera publiée ou si des modifications sont nécessaires.

<x-mail::button :url="config('app.url') . '/dashboard/properties'">
Voir mes propriétés
</x-mail::button>

Cordialement,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
