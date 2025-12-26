<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez Compact Agency</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; color: white; }
        .content { padding: 40px; color: #374151; line-height: 1.6; }
        .footer { background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 0.875rem; }
        h1 { margin: 0; font-size: 24px; font-weight: 800; }
        p { margin-bottom: 20px; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background-color 0.2s; }
        .btn:hover { background-color: #d97706; }
        .accent { color: #d97706; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenue parmi nous !</h1>
        </div>
        <div class="content">
            <p>Bonjour <span class="accent">{{ $user->name }}</span>,</p>
            <p>Félicitations ! Votre profil a été mis à jour avec succès. Vous êtes désormais enregistré en tant que <span class="accent">{{ $roleName == 'agency' ? 'Agence Immobilière' : 'Vendeur Particulier' }}</span> sur Compact Agency.</p>
            <p>Vous pouvez dès maintenant commencer à publier vos annonces, gérer vos propriétés et suivre vos performances depuis votre tableau de bord.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ url('/dashboard') }}" class="btn">Accéder à mon tableau de bord</a>
            </div>
            <p>Nous sommes ravis de vous accompagner dans le développement de vos activités immobilières.</p>
            <p>À très bientôt,<br>L'équipe Compact Agency</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Compact Agency. Tous droits réservés.
        </div>
    </div>
</body>
</html>
