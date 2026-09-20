# Module d’abonnement — audit et exploitation

## Audit avant modification

Architecture Laravel 12 / React 19 / Inertia 2. Le domaine `Billing` contient les modèles `Plan`, `PlanFeature`, `Subscription`, `WebhookLog`, les repositories, les use cases d’activation/expiration, les passerelles et les webhooks RDCard/Acoriss. Les paiements manuels passent également par `Dashboard/TransactionController`. Les annonces sont dans `Domains/Ads`, les quotas dans `Domains/Quotas`. Les Policies et Form Requests contrôlent déjà la propriété des annonces ; les routes publiques et privées sont séparées. Les plans, les souscriptions, les médias et les paiements possèdent déjà des contraintes et un historique conservé.

Les migrations existantes possèdent notamment une unicité sur `payment_id`, `payment_session_id`, `transaction_id`, et un index `(status, expires_at)` : ils sont réutilisés. Les dates métier existantes sont `started_at` et `expires_at` ; aucun doublon `starts_at`/`ends_at` n’a été ajouté.

Le scheduler disposait d’un job quotidien d’expiration, de rappels J-7/J-3/J0 et d’un worker court de la file `database` chaque minute. Les notifications passaient par des événements/listeners et des Mailables. Aucun prélèvement automatique récurrent n’existe : chaque paiement achète une période.

Anomalies constatées :

1. Validité dispersée : dates de début et preuve de paiement non vérifiées ; fin absente considérée illimitée.
2. `QuotaService` et `QuotaEnforcer` lisent des clés différentes, comptent le mois ou un compteur remis à zéro ; absence de limite assimilée à l’illimité.
3. Réactivation par `update(is_published)` et approbation administrative sans contrôle cohérent des droits.
4. Activation manuelle du dashboard sans use case commun, verrou, notification ou actualisation des quotas.
5. Plusieurs abonnements actifs possibles, jours restants perdus au renouvellement.
6. Expiration : statut seul modifié, aucun masquage réversible ni réactivation sélective.
7. Rappels fondés sur une égalité de date, pas de journal persistant, pas de relance hebdomadaire.
8. Listeners recherchant le dernier abonnement du couple utilisateur/plan plutôt que l’abonnement de l’événement.
9. Informations de quota, masquage et suivi insuffisantes dans les interfaces.
10. Pas de contrôle complémentaire du client retourné par la passerelle.

Baseline réellement exécutée : `php artisan test --compact` — **203 réussis, 1 échec**, test de structure `AccessibilityMarkupTest`. Celui-ci interdisait tout défilement intérieur du menu mobile alors que ce défilement est nécessaire sur les petits écrans. Le test a été corrigé pour vérifier le conteneur contraint et son défilement ; le menu lui-même n’a pas été modifié.

## Architecture et règles retenues

- `Subscription::usable()` et `isActive()` : statut `active`, `started_at <= maintenant < expires_at`, paiement attesté par `payment_id` ou approbation administrative `approved_by`. Aucune preuve historique n’est inventée.
- `SubscriptionEntitlements` : droits, quota courant, validation des annonces et données du dashboard. `QuotaService` reste une façade rétrocompatible de `QuotaEnforcer`.
- `ActivateSubscription` : paiement automatique et approbation manuelle convergent vers une transaction verrouillant d’abord l’utilisateur, puis l’abonnement. La contrainte unique existante empêche le réemploi d’un paiement entre comptes. Les rejouements restent sans effet après expiration/remplacement.
- `SubscriptionLifecycle` : expiration, rapprochement de doublons historiques, masquage, remise en ligne, annulation et préparation des notifications.
- `subscription_notices` : journal/outbox avec unicité `(subscription_id, kind, period_key)`, résultat d’envoi, abandon, tentatives et classe d’erreur non sensible. `SendSubscriptionNotice` est un job en queue ; il reprend le verrou du propriétaire puis celui du journal et revérifie l’utilité de l’envoi.
- `Ad::publiclyVisible()` protège les recherches, détails, contacts, visites, favoris, alertes de recherche, compteurs et sitemap. Le cache du sitemap ne dépasse pas la prochaine échéance : même sans scheduler, aucun bien expiré n’est consultable publiquement.
- `hidden_reason` et `subscription_hidden_at` distinguent expiration, quota inférieur, annulation, retrait manuel et suspension administrative, sans écraser le statut métier. Aucune annonce/photo n’est supprimée par ce cycle de vie.

### Choix métier appliqués

- Les limites viennent de l’instantané `plan_features` acheté, avec repli sur le plan pour les anciens enregistrements sans instantané. Une modification ultérieure d’un plan ne modifie pas les droits déjà achetés.
- Compatibilité des clés `listing_limit` et `Listings per month`. Le quota représente désormais les **biens publiés simultanément**, indépendamment du mois de création. Les annonces en attente de validation réservent aussi des places lors de la soumission ; l’approbation revérifie les places effectivement publiques.
- `Unlimited` signifie illimité. Le `0` explicite des clés historiques techniques `listing_limit`/`image_limit` conserve leur convention « illimité ». Une valeur absente, négative ou invalide n’accorde aucun quota. Il n’existe pas de quota total à vie dans le modèle actuel.
- Les comptes peuvent conserver/créer des brouillons sans droit actif. La publication et la remise en ligne sont contrôlées côté serveur, y compris pour un administrateur agissant sur le bien d’un propriétaire.
- Renouvellement anticipé : la période achetée s’ajoute à la fin de la couverture valide restante. La nouvelle formule prend effet immédiatement et la nouvelle ligne couvre le reliquat plus la durée achetée ; l’ancienne ligne est conservée avec statut `cancelled` et motif de remplacement. Pas de calcul monétaire au prorata. Les fins de mois utilisent l’addition sans débordement.
- Passage à une formule inférieure : conserver les biens les plus récemment publiés (`first_published_at DESC, id DESC`), masquer le surplus avec `plan_limit`. Au renouvellement, seuls les biens encore approuvés, au statut `published`, complets et masqués pour `subscription_expired` ou `plan_limit` peuvent être rétablis. Les autres états restent inchangés.
- Annulation à terme : `cancelled_at` mémorise la demande, les droits demeurent jusqu’à l’échéance ; cela ne configure aucun prélèvement fournisseur. Annulation immédiate : droits retirés et motif `subscription_cancelled`, sans réactivation automatique de ces biens.
- Les rappels J-7 sont préparés dès que la date se situe dans les sept prochains jours. Un passage retardé à J-5 fonctionne. Les anciens rappels J-3/J0 ne sont plus planifiés séparément.
- Les relances après expiration commencent à J+7, une fois par période de sept jours. Après interruption, seule la période courante est rappelée, pas tout l’historique. Les relances s’arrêtent après renouvellement, retrait de tous les biens concernés, anonymisation du compte ou désactivation de `notifications_enabled`. Les confirmations de paiement/expiration restent transactionnelles.
- Les doublons historiques actifs sont rapprochés en conservant la couverture valide à l’échéance la plus lointaine ; les données et paiements sont préservés et l’action auditée. Les données sans preuve de paiement ou sans dates cohérentes ne donnent jamais de droits ; elles nécessitent une vérification humaine, pas une activation automatique.

Ces choix sont documentés ; une autre politique de prorata, de changement de formule différé ou de quota mensuel supplémentaire demanderait une décision commerciale explicite.

## Paiements et administration

RDCard conserve sa vérification HMAC du corps brut, la session, la référence locale, le montant et la devise. La référence/session rattache toujours le paiement à son propriétaire. Si le fournisseur retourne un e-mail client, il doit correspondre à celui enregistré au checkout (`payment_customer_email`), avec repli sur l’utilisateur pour les anciens paiements. Le retour navigateur interroge le fournisseur côté serveur : un simple paramètre de succès ne suffit jamais.

Le protocole existant et ses tests ont été conservés. Aucun appel de paiement réel ni envoi SMTP réel n’a été effectué pendant les tests. Les pages de documentation RDCard référencées par le projet n’étaient pas accessibles depuis l’outil de consultation lors de cette intervention ; le format du protocole n’a pas été redéfini.

Le dashboard montre formule, statut, période, jours restants, quota public et biens masqués. L’administration dispose des filtres de statut/échéance, références de paiement, douze derniers événements de notification par abonnement, erreurs d’envoi, prolongation ou annulation avec motif obligatoire. `SubscriptionPolicy` protège ces actions ; l’acteur, l’ancienne valeur, la nouvelle valeur et le motif sont enregistrés dans `audit_logs`.

## Migration et mise en service

Nouvelle migration : `2026_09_20_000002_add_subscription_lifecycle.php` :

- `ads.hidden_reason`, `ads.subscription_hidden_at` ;
- `subscriptions.payment_customer_email` ;
- table `subscription_notices`, contraintes et index du journal.

La migration d’alertes de recherche `000001` provient de la fonctionnalité précédente et fournit déjà `first_published_at`. Ne pas supprimer les migrations ni les données existantes.

```bash
php artisan integrity:audit
php artisan migrate --force
npm run build
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
```

L’audit est en lecture seule : régulariser les paiements/dates historiques signalés avant la mise en production, à partir de preuves. Ne pas marquer arbitrairement des abonnements comme payés.

La commande centrale est :

```bash
php artisan subscriptions:process-lifecycle
```

Elle tourne chaque minute, avec `withoutOverlapping(10)`, `onOneServer()` et le fuseau `config('app.timezone')` (UTC dans ce projet). Le cache de verrouillage doit être partagé entre serveurs. SQLite utilise `IMMEDIATE` et une attente de verrou de 5 secondes ; MySQL utilise les verrous de lignes et les transactions. Garder la base et le serveur en UTC ; les dates de l’interface sont converties au fuseau du navigateur, puis transmises en ISO avec fuseau pour les actions administratives.

Variables nécessaires : `APP_URL` HTTPS public, `DB_*`, `CACHE_STORE=database` (ou Redis partagé), `QUEUE_CONNECTION=database`, `DB_QUEUE_RETRY_AFTER=180`, configuration `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`. Les identifiants RDCard existants restent `RDCARD_ENVIRONMENT`, `RDCARD_API_KEY`, `RDCARD_SECRET_KEY`, éventuellement `RDCARD_BASE_URL`/`RDCARD_SERVICE_ID`. Aucun secret ne va dans une variable `VITE_*`.

Cron sur HostKing, inchangé :

```cron
* * * * * cd /chemin/agency-v2 && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1
```

Le scheduler traite déjà la file `database` avec un worker court. Sur serveur dédié, un worker supervisé peut remplacer ce drainage court (désactiver alors la tâche `queue-drain` dans `routes/console.php`) :

```ini
[program:agency-queue]
command=/usr/bin/php /chemin/agency-v2/artisan queue:work database --queue=default --sleep=3 --tries=3 --timeout=130
numprocs=1
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stopwaitsecs=180
redirect_stderr=true
stdout_logfile=/var/log/agency-queue.log
```

Le timeout doit rester inférieur à `retry_after`. Les jobs d’e-mail d’abonnement ont un timeout de 45 secondes. Le délai de reprise database a été porté à 180 secondes pour couvrir également les jobs existants de 120 secondes. Après déploiement, `queue:restart` laisse finir les jobs avant reprise du nouveau code.

```bash
php artisan queue:failed
php artisan queue:retry <uuid>
php artisan schedule:list
```

Surveiller les jobs échoués, les erreurs du journal et le cron. Le journal conserve les notifications non envoyées et les reprogramme après une interruption. Comme avec tout SMTP sans clé d’idempotence fournisseur, un arrêt brutal **après acceptation SMTP mais avant commit SQL** peut exceptionnellement produire un doublon lors de la reprise ; les répétitions ordinaires et les exécutions concurrentes sont dédupliquées. Une garantie externe exactement une fois demanderait un fournisseur acceptant une clé idempotente, non disponible dans le transport existant.

## Tests et limites de validation

Les tests couvrent les droits sans abonnement/pending/failed, les dates incohérentes, les quotas et la propriété du bien, le rappel J-7 et son rattrapage, l’expiration exacte, le maintien des données, les états administratifs/manuels, les relances hebdomadaires, leur arrêt au renouvellement, les réactivations partielles, l’illimité, les changements de formule, l’approbation manuelle, le remboursement, l’audit administratif, la reprise après interruption et les fuseaux.

Les fixtures des tests de pages publiques ont été rendues explicitement payées ; aucune vérification de droits n’a été désactivée. Deux processus PHP indépendants, partageant une base SQLite temporaire, testent les paiements identiques/différents simultanés et l’envoi concurrent du même e-mail. Les verrous MySQL sont implémentés, mais ce test de concurrence automatisé utilise SQLite.

Résultats réels de la validation finale :

- `php artisan test --compact` : **238 tests réussis, 4 254 assertions**, 26,73 secondes.
- `npm run types` : réussite, aucune erreur TypeScript.
- `npm run build -- --outDir /private/tmp/agency-subscriptions-build` : réussite, 32,70 secondes. Les assets de contrôle sont dans ce répertoire temporaire, pas déployés. Deux avertissements de motifs SVG déjà référencés dans le projet (`/patterns/grid.svg`, `/patterns/hero-pattern.svg`) restent résolus au runtime.
- Laravel Pint sur les fichiers PHP concernés et `git diff --check` : réussite.
- Les routes d’abonnement ont été vérifiées par `route:list`. `schedule:list` confirme le cycle de vie et le drainage de queue chaque minute, avec les tâches de purge existantes.
- Migration `000002` appliquée avec succès sur **MySQL local** le 20 septembre 2026.
- `php artisan integrity:audit` sur **MySQL local** : réussite, aucun blocage ; un avertissement préexistant de positions d’images dupliquées, non bloquant. Aucune image n’a été supprimée ou déplacée.

Les tests ont été exécutés avec des transports simulés ; pas de paiement RDCard ni d’e-mail réel. La recette fournisseur en sandbox, le worker et le cron du serveur de production restent à vérifier au déploiement. Aucun déploiement distant n’a été réalisé.

## Inventaire des fichiers

Les fichiers ci-dessous concernent cette intervention. Les fichiers de connexion/inscription et les ajouts initiaux de l’alerte de recherche déjà présents ne sont pas inclus. Le test et le job d’alertes de recherche ont été adaptés à la nouvelle règle de visibilité.

- `app/Console/Commands/AuditBusinessIntegrity.php`
- `app/Console/Commands/ProcessSubscriptionLifecycle.php`
- `app/Domains/Ads/Models/Ad.php`
- `app/Domains/Ads/Resources/AdResource.php`
- `app/Domains/Ads/Routes/api.php`
- `app/Domains/Ads/Services/AdService.php`
- `app/Domains/Billing/Application/UseCases/ActivateSubscription.php`
- `app/Domains/Billing/Application/UseCases/ApproveManualSubscription.php`
- `app/Domains/Billing/Application/UseCases/ExpireSubscriptions.php`
- `app/Domains/Billing/Application/UseCases/RejectManualSubscription.php`
- `app/Domains/Billing/Application/UseCases/RequestManualSubscription.php`
- `app/Domains/Billing/Domain/Events/SubscriptionActivated.php`
- `app/Domains/Billing/Domain/Events/SubscriptionExpired.php`
- `app/Domains/Billing/Domain/ValueObjects/BillingInterval.php`
- `app/Domains/Billing/Domain/ValueObjects/PlanLimits.php`
- `app/Domains/Billing/Infrastructure/Jobs/SendSubscriptionExpiringReminder.php`
- `app/Domains/Billing/Infrastructure/Jobs/SendSubscriptionNotice.php`
- `app/Domains/Billing/Infrastructure/Listeners/SendSubscriptionActivatedMail.php`
- `app/Domains/Billing/Infrastructure/Listeners/SendSubscriptionExpiredMail.php`
- `app/Domains/Billing/Infrastructure/Mail/SubscriptionLifecycleMail.php`
- `app/Domains/Billing/Infrastructure/Repositories/SubscriptionRepository.php`
- `app/Domains/Billing/Models/Subscription.php`
- `app/Domains/Billing/Models/SubscriptionNotice.php`
- `app/Domains/Billing/Requests/ManageSubscriptionRequest.php`
- `app/Domains/Billing/Resources/SubscriptionResource.php`
- `app/Domains/Billing/Services/BillingService.php`
- `app/Domains/Billing/Services/RdcardPaymentService.php`
- `app/Domains/Billing/Services/StatusUpdater.php`
- `app/Domains/Billing/Services/SubscriptionEntitlements.php`
- `app/Domains/Billing/Services/SubscriptionLifecycle.php`
- `app/Domains/Billing/Services/SubscriptionManager.php`
- `app/Domains/Billing/Webhooks/RdcardWebhookHandler.php`
- `app/Domains/Locations/Services/MunicipalityService.php`
- `app/Domains/Quotas/Services/QuotaEnforcer.php`
- `app/Domains/Quotas/Services/QuotaService.php`
- `app/Http/Controllers/Dashboard/DashboardController.php`
- `app/Http/Controllers/Dashboard/PropertyController.php`
- `app/Http/Controllers/Dashboard/SubscriptionController.php`
- `app/Http/Controllers/Dashboard/TransactionController.php`
- `app/Http/Controllers/PageController.php`
- `app/Http/Controllers/SeoController.php`
- `app/Http/Middleware/EnsureSeller.php`
- `app/Http/Middleware/EnsureSellerWithActiveSubscription.php`
- `app/Jobs/SendPropertySearchAlerts.php`
- `app/Models/User.php`
- `app/Policies/AdPolicy.php`
- `app/Policies/SubscriptionPolicy.php`
- `app/Providers/AppServiceProvider.php`
- `app/Support/UserAnonymizer.php`
- `config/database.php`
- `config/queue.php`
- `database/migrations/2026_09_20_000002_add_subscription_lifecycle.php`
- `docs/subscription-lifecycle.md`
- `lang/en/subscriptions.php`
- `lang/fr/subscriptions.php`
- `resources/js/components/forms/TarifPopup.tsx`
- `resources/js/components/subscriptions/SubscriptionAdminDetails.tsx`
- `resources/js/components/subscriptions/SubscriptionSummary.tsx`
- `resources/js/pages/dashboard/Index.tsx`
- `resources/js/pages/dashboard/properties/Properties.tsx`
- `resources/js/pages/dashboard/subscriptions/Package.tsx`
- `resources/views/emails/billing/lifecycle.blade.php`
- `routes/console.php`
- `routes/web.php`
- `tests/Feature/AccessibilityMarkupTest.php`
- `tests/Feature/Ads/AdAuthorizationTest.php`
- `tests/Feature/Billing/RdcardPaymentTest.php`
- `tests/Feature/Billing/SubscriptionLifecycleTest.php`
- `tests/Feature/BusinessIntegrityTest.php`
- `tests/Feature/ContactDeliveryTest.php`
- `tests/Feature/PerformanceOptimizationTest.php`
- `tests/Feature/PropertySearchAlertTest.php`
- `tests/Feature/PropertyVisitTest.php`
- `tests/Feature/Seo/PublicSeoTest.php`
- `tests/Feature/SubscriptionCheckTest.php`
- `tests/Pest.php`
- `tests/Support/subscription-activation-worker.php`
- `tests/Unit/SubscriptionConcurrencyTest.php`
