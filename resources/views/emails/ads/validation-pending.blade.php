<x-mail::message>
    # Bonjour {{ $userName }},

    Nous vous confirmons la bonne réception de votre annonce **"{{ $propertyTitle }}"** (Référence: {{ $reference }}).

    Votre annonce est actuellement en cours de validation par notre équipe d'experts. Cette étape nous permet de
    garantir la qualité et le sérieux des offres publiées sur notre plateforme. Ce processus prend généralement moins de
    **24 heures**.

    Vous recevrez une notification dès que votre annonce sera en ligne, ou si des informations complémentaires sont
    nécessaires.

    <x-mail::button :url="config('app.url') . '/dashboard/properties'">
        Suivre l'état de mon annonce
    </x-mail::button>

    Merci de votre confiance.

    Cordialement,<br>
    L'équipe {{ config('app.name') }}
</x-mail::message>