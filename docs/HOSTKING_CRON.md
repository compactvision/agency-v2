# Cron HostKing

La plateforme utilise la file `database` et un seul cron mutualisé. Les jobs
planifiés, les e-mails en attente et la purge des anciennes données sont tous
pilotés par le scheduler Laravel.

Configurer dans le panneau HostKing une tâche exécutée chaque minute :

```cron
* * * * * cd /chemin/absolu/vers/agency-v2 && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1
```

Adapter le chemin du projet et celui de PHP à ceux affichés par HostKing.
Ne pas ajouter un second cron `queue:work` : le scheduler lance déjà un worker
court avec `--stop-when-empty`, adapté aux limites d’un hébergement mutualisé.

Après chaque déploiement :

```bash
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
