<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
        .reason-box { background-color: #fff; padding: 15px; border-left: 4px solid #e74c3c; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Mise à jour concernant votre annonce</h2>
        </div>
        <div class="content">
            <p>Bonjour {{ $ad->user->name }},</p>
            <p>Nous avons étudié votre annonce pour la propriété <strong>{{ $ad->title }}</strong>, mais malheureusement, nous ne pouvons pas l'approuver en l'état.</p>
            <p><strong>Motif du rejet :</strong></p>
            <div class="reason-box">
                {{ $reason }}
            </div>
            <p>Vous pouvez vous connecter à votre espace pour corriger ces éléments et soumettre à nouveau votre propriété pour vérification.</p>
            <p>Merci de votre compréhension.</p>
            <p>L'équipe {{ config('app.name') }}</p>
        </div>
    </div>
</body>
</html>
