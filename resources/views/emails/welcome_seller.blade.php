<x-mail::message>
    # Bienvenue chez Agency DRC !

    Bonjour **{{ $name }}**,

    Félicitations ! Votre profil a été mis à jour avec succès. Vous êtes désormais enregistré en tant que
    **{{ $role }}** sur notre plateforme.

    Vous pouvez dès maintenant commencer à :
    * Publier vos annonces immobilières
    * Gérer vos propriétés en toute simplicité
    * Suivre vos performances depuis votre espace dédié

    <x-mail::button :url="config('app.url') . '/dashboard'">
        Accéder à mon tableau de bord
    </x-mail::button>

    Nous sommes ravis de vous accompagner dans le développement de vos activités immobilières.

    À très bientôt,<br>
    L'équipe {{ config('app.name') }}
</x-mail::message>