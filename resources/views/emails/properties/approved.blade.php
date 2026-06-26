<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f89b29; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #f89b29; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Félicitations, {{ $ad->user->name }} !</h2>
        </div>
        <div class="content">
            <p>Nous avons d'excellentes nouvelles. Votre propriété <strong>{{ $ad->title }}</strong> a été approuvée par notre équipe d'administration.</p>
            <p>Elle est désormais en ligne et visible par tous nos utilisateurs.</p>
            <center>
                <a href="{{ url('/property/' . $ad->id) }}" class="button" style="color: white !important;">Voir ma propriété</a>
            </center>
            <p>Merci de votre confiance.</p>
            <p>L'équipe {{ config('app.name') }}</p>
        </div>
    </div>
</body>
</html>
