# Lot 2 — intégrité et médias

## Déploiement HostKing

Sauvegarder la base et `storage/app/public`, puis exécuter depuis le terminal du
compte d’hébergement :

```bash
php artisan integrity:audit --media
php artisan migrate --force
php artisan integrity:audit --media
php artisan optimize
```

La migration s’arrête avant toute modification si elle détecte des abonnements,
annonces, détails, médias, équipements ou quotas orphelins, ou des doublons qui
empêcheraient les nouvelles contraintes uniques.

## Politique de conservation

- Un abonnement possède un instantané du nom, de la périodicité, du prix et des
  avantages du plan au moment de sa création.
- La suppression d’un plan ou d’une annonce est un archivage logique
  (`deleted_at`).
- L’anonymisation d’un compte révoque les accès et efface ses données
  personnelles. Ses annonces sont archivées, mais leurs lignes et médias restent
  conservés. Les abonnements et quotas restent rattachés à l’identifiant
  anonymisé.
- Les clés étrangères métier utilisent `RESTRICT`. Une suppression SQL physique
  accidentelle ne peut donc plus emporter abonnements, annonces ou quotas.
- La suppression volontaire d’une image depuis l’éditeur reste une purge
  explicite du fichier et de sa ligne.

## Restauration et purge

Une annonce ou un plan archivé peut être restauré avec Eloquent
(`withTrashed()->findOrFail($id)->restore()`). Aucune purge physique automatique
n’est exécutée. Toute future politique de purge doit avoir une durée de
rétention, une sauvegarde vérifiée et une commande dédiée.
