<x-mail::message>
    # Nouvelle propriété à valider

    Une nouvelle annonce immobilière vient d'être soumise et nécessite votre approbation.

    <x-mail::panel>
        **Détails de l'annonce :**
        * **Titre :** {{ $propertyTitle }}
        * **Référence :** {{ $reference }}
        * **Utilisateur :** {{ $userName }} ([{{ $userEmail }}](mailto:{{ $userEmail }}))
    </x-mail::panel>

    Veuillez l'examiner pour valider sa conformité avec nos standards de qualité.

    <x-mail::button :url="config('app.url') . '/dashboard/admin/ads/pending'">
        Accéder à la console de validation
    </x-mail::button>

    Merci,<br>
    Système automatisé {{ config('app.name') }}
</x-mail::message>