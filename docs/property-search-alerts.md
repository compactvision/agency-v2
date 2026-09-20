# Alertes de recherche immobilière

Après une recherche avec une commune sélectionnée, l’utilisateur peut activer une alerte. Le compte doit être connecté et son adresse e-mail vérifiée. L’alerte concerne tous les nouveaux biens de cette commune, indépendamment des autres filtres (prix, type, etc.). Une recherche textuelle seule ne définit pas une zone et ne crée pas d’alerte.

Une seule alerte existe par compte et commune. La première publication validée est mémorisée dans `ads.first_published_at`. Les annonces antérieures à l’inscription, non validées, retirées ou supprimées sont exclues. Modifier ou republier une annonce déjà signalée ne renvoie pas d’e-mail. Une réactivation repart de la date du nouveau consentement.

Chaque e-mail contient un lien signé de désabonnement, accessible sans connexion. La page demande de confirmer pour éviter les désabonnements déclenchés par les scanners de liens des messageries.

## Mise en service

- Exécuter `php artisan migrate --force` lors du déploiement, avant d’activer le nouveau code.
- Compiler les assets avec `npm run build`.
- Configurer le transport d’e-mails de production et une URL publique correcte (`APP_URL`).
- Garder le cron existant `php artisan schedule:run` toutes les minutes. Il programme les alertes et traite déjà la file `database`.

Le traitement est asynchrone, généralement dans les minutes suivant la publication, selon la charge de la file. Chaque tâche traite au plus 20 annonces, le passage suivant reprend les suivantes. Les tâches utilisent un verrou par alerte et enregistrent chaque envoi réussi ; les échecs sont retentés. Un arrêt du processus après acceptation SMTP mais avant enregistrement peut exceptionnellement provoquer un doublon : SMTP ne garantit pas un envoi exactement une fois.

Les écritures de publication doivent passer par le modèle `Ad` (comme les parcours d’administration actuels) pour enregistrer la date de première publication.

## Validation

`php artisan test --compact tests/Feature/PropertySearchAlertTest.php`
