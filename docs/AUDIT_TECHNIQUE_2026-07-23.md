# Audit technique — AgencyDRC

Date : 23 juillet 2026  
Périmètre : dépôt Laravel/React, code backend, frontend, migrations, routes, tests et configuration de déploiement.  
Contrainte d’hébergement : hébergement mutualisé HostKing, sans supposer la disponibilité d’un processus permanent, de Redis, de Node.js ou d’un accès root.

## Résumé exécutif

Le projet est un monolithe Laravel 12 structuré par domaines, rendu avec Inertia et React 19. La base est saine : Form Requests, transactions sur plusieurs opérations d’annonces, pagination, relations Eloquent, Sanctum, Fortify, 2FA et Spatie Permission sont déjà présents. Le build de production réussit et le découpage Vite par page fonctionne.

L’application n’était toutefois pas prête pour une mise en production financière. Le webhook Acoriss acceptait des événements non signés, les routes de paiement simulé restaient enregistrées hors développement et une route API pouvait vérifier une adresse e-mail à partir d’un simple identifiant et d’un SHA-1 prévisible. Ces P0 ont été corrigés dans ce lot.

Les risques critiques de paiement, d’autorisation, d’authentification, de dépendances et de XSS identifiés lors de l’audit ont été corrigés le 24 juillet 2026. Les risques structurels restants concernent surtout le SEO, l’optimisation des médias, les pages publiques dépendantes du JavaScript et la dette TypeScript. Sur un mutualisé, la file `database` et le scheduler sont viables uniquement si les tâches cron sont configurées correctement.

## Stack détectée

- PHP 8.4.17 dans l’environnement d’audit ; contrainte projet `^8.2`.
- Laravel 12.41.1.
- Inertia Laravel 2.0.11 et `@inertiajs/react` 2.x.
- React 19, TypeScript 5.7, Vite 7, Tailwind CSS 4.
- Fortify 1.32, Sanctum 4.2, Spatie Permission 6.23.
- Pest 4 / PHPUnit 12, 84 tests après les corrections.
- Base configurée en MySQL dans l’environnement local ; migrations compatibles SQLite pour les tests.
- Cache, sessions et queues configurés sur la base de données.
- Médias stockés sur le disque public local.
- Paiement externe Acoriss, plus une passerelle simulée locale.
- Internationalisation française/anglaise côté client.

## Cartographie

| Zone | Emplacement | Rôle |
|---|---|---|
| Entrées web | `routes/web.php`, `routes/settings.php` | Pages Inertia, dashboard et compte |
| API modulaire | `app/Domains/*/Routes/api.php` | Auth, annonces, facturation, quotas, référentiels, analytics |
| Métier | `app/Domains/*/Services`, `Application/UseCases` | Annonces, abonnements, quotas, CMS |
| Données | `app/Domains/*/Models`, `app/Models` | Eloquent et relations |
| UI | `resources/js/pages`, `resources/js/components` | Pages publiques et dashboard |
| Auth | Fortify + Sanctum + Spatie | Session web, tokens API, rôles |
| Asynchrone | `Infrastructure/Jobs`, `Listeners`, `routes/console.php` | Expirations et e-mails |
| Stockage | disque `public` | Photos de biens et profils |
| Tests | `tests/Feature`, `tests/Unit` | Auth, annonces, abonnements, réglages |

Modules réellement présents : annonces immobilières, catégories, équipements, localisations RDC, favoris, plans et abonnements, quotas, profils vendeur/agence, CMS de pages, notifications, analytics partiels et newsletter. Les contrats, loyers, propriétaires, locataires, visites et comptabilité immobilière décrits dans le prompt ne sont pas implémentés et ne doivent pas être inventés.

## Audit architectural

### Points positifs

- Découpage par domaines explicite.
- Services et Use Cases déjà utilisés pour plusieurs workflows.
- Transactions sur la création/mise à jour d’annonces.
- Ressources API et Form Requests présentes.
- Routes administratives web regroupées derrière `admin`.
- Pagination serveur sur les listes importantes.

### Dette

- Plusieurs pages React sont excessivement grandes : `EditProperties.tsx` dépasse 3 100 lignes, `Message.tsx` 2 000 lignes, `Settings.tsx` 1 900 lignes et `PropertyDetails.tsx` 1 700 lignes.
- Un dossier dupliqué `resources/js/components copyy` contient une copie complète de composants.
- Les autorisations sont dispersées dans les contrôleurs avec `hasRole()` ; aucune Policy d’annonce n’est présente.
- Des écrans sont des coquilles avec données statiques ou vides : logs d’audit, chatbot, messagerie et plusieurs compteurs.
- `contactSend()` confirme un envoi sans envoyer ni conserver le message.
- Les e-mails sont tantôt synchrones, tantôt en queue.
- Le même domaine facturation mélange anciens services et architecture Commands/UseCases/Repositories.

## Défaillances priorisées

| Priorité | Fichier | Cause et impact | Correction | Difficulté / tests |
|---|---|---|---|---|
| P0 corrigé | `AcorissWebhookHandler.php` | Aucun contrôle de signature : activation frauduleuse possible | HMAC SHA-256, secret obligatoire, comparaison constante, redaction des logs | Faible ; 4 tests |
| P0 corrigé | `Billing/Routes/api.php`, `routes/web.php` | Routes et interface de paiement simulé disponibles hors local | Enregistrement conditionnel en environnement local | Faible ; test 404 |
| P0 corrigé | `Auth/Routes/api.php` | Vérification e-mail fondée sur ID + SHA-1 sans URL signée | Middleware `signed` + throttle | Faible ; 2 tests |
| P1 corrigé | `AuthService.php` | Inscription non transactionnelle et dépendante d’un rôle préchargé | Transaction et création idempotente du rôle de base | Faible ; tests d’inscription |
| P1 corrigé | `bootstrap/app.php` | 404/405/429 API transformés en 500 | Préservation des statuts HTTP | Faible ; couvert par test route mock |
| P1 | `ActivateSubscription.php`, `StatusUpdater.php` | Pas de verrou, pas de garde d’état, montant/devise non comparés | Transaction, `lockForUpdate`, idempotency key, contrôle montant/devise/payment ID | Moyen ; concurrence et replay |
| P1 | `WebhookLog` et logs applicatifs | Les journaux de webhook contiennent le payload complet ; aucune rétention | Redaction récursive, chiffrement/accès admin, purge planifiée | Moyen |
| P1 | `LogController.php` | L’écran « audit logs » sert une liste vide | Table d’audit append-only et événements sensibles | Élevé ; tests rôles et anciennes/nouvelles valeurs |
| P1 | `PropertyController.php`, API Ads | Autorisation dupliquée et non systématique | `AdPolicy`, route model binding, `authorizeResource` | Moyen ; matrice propriétaire/admin |
| P1 | `AuthService.php` | Chaque connexion API crée un nouveau token sans expiration/révocation globale | Nommage appareil, expiration, liste/révocation et limite de tokens | Moyen |
| P1 | `AdService.php` | Fichiers écrits avant commit DB ; rollback peut laisser des orphelins | compensation après échec, nettoyage planifié ou stockage temporaire | Moyen |
| P1 | uploads annonces/profil | Validation `image` et taille seulement ; pas de dimensions, réencodage ou scan | décodage/réencodage, dimensions max, WebP, noms isolés, quota total | Moyen |
| P1 corrigé | pages publiques | Pas de sitemap, canonical, JSON-LD, Open Graph ni politique de filtres | Métadonnées serveur, sitemap et données structurées | Faible ; 6 tests SEO |
| P1 corrigé | `robots.txt` | Autorise tout et n’annonce aucun sitemap | robots dynamique avec sitemap et exclusion des zones techniques | Faible |
| P1 corrigé | rendu Inertia public | SSR configuré mais exige un daemon Node absent en mutualisé ; sinon HTML initial pauvre | Métadonnées Blade et données initiales Laravel sans daemon SSR | Moyen ; le DOM visuel reste hydraté par React |
| P2 | tests | Couverture métier faible : paiement, permissions, filtres, uploads | Tests Feature et intégration DB MySQL | Moyen |
| P2 | TypeScript | Plus de 100 erreurs de typage observées | Corriger par module sans désactiver `strict` | Élevé |
| P2 | composants React | Composants géants et duplications | Extraction progressive par sections/hooks | Élevé |
| P2 | recherche | `%terme%` sur titre/description, JSON pour chambres | FULLTEXT ou colonnes indexables selon mesures | Moyen |
| P2 | `ad_details` | Pas d’unicité sur `ad_id` malgré relation `hasOne` | Index unique après contrôle des doublons | Faible ; migration de données |
| P2 | subscriptions | `updateOrCreate(['user_id'])` écrase l’historique d’abonnement | Conserver les transactions et définir l’abonnement courant séparément | Élevé |
| P2 | utilisateurs/annonces | `cascadeOnDelete` détruit annonces et abonnements à la suppression du compte | anonymisation/soft delete et rétention financière | Élevé |
| P2 | fuseau horaire | Application en UTC alors que le marché est Kinshasa | Stocker UTC, afficher Africa/Kinshasa explicitement | Faible |
| P3 | formatage | Deux fichiers React ne passent pas Prettier | Formater dans un lot frontend ciblé | Faible |

## Sécurité

### Authentification

Fortify fournit la session, le reset, la vérification e-mail, le throttle web et la 2FA. L’API Sanctum existe en parallèle. Les endpoints API publics n’avaient pas de throttle ; ce lot ajoute une limite à l’inscription, la connexion et la réinitialisation. Il reste à uniformiser les réponses de mot de passe oublié pour éviter l’énumération et à gérer le cycle de vie des tokens.

### Autorisations

Les annonces web vérifient généralement `user_id` ou un rôle admin, et les images API contrôlent le propriétaire. Cette protection est correcte mais fragile parce qu’elle est répétée manuellement. Les Policies doivent devenir la source unique. Les rôles `admin` et `super-admin` ne sont pas traités uniformément : certaines routes API utilisent `role:admin`, contrairement au middleware web qui accepte les deux.

### XSS et contenu

React échappe le texte par défaut. De nombreux `dangerouslySetInnerHTML` servent à rendre les libellés de pagination Laravel ; quelques écrans de logs et notifications doivent être audités pour garantir que leur source est strictement contrôlée. Les pages CMS affichent actuellement le contenu comme texte structuré, mais toute future HTML libre doit être assainie côté serveur.

### Secrets

Les valeurs de repli `fake_*` Acoriss ont été supprimées. En production, `APP_DEBUG=false`, une clé d’application unique et les quatre variables Acoriss doivent être fournies hors dépôt.

## Base de données

### Bonnes bases

- Clés étrangères sur les relations centrales.
- Référence d’annonce et transaction d’abonnement uniques.
- Favoris uniques par couple utilisateur/annonce.
- Index sur prix, date, statut/publication, ville/commune et catégorie/type.
- Décimaux pour les montants.

### Risques

- `ad_details.ad_id` devrait être unique.
- `payment_id` et `payment_session_id` devraient être indexés, et `payment_id` unique lorsqu’il est non nul.
- La recherche `%terme%` ne bénéficie pas d’un index B-tree.
- Les suppressions en cascade contredisent la conservation d’un historique financier.
- Les coordonnées n’ont pas de validation de plage (`latitude -90..90`, `longitude -180..180`).
- Le prix `decimal(10,2)` plafonne à 99 999 999,99 ; vérifier l’adéquation au marché et aux devises locales.
- Les migrations n’ont pas pu être comparées à la base MySQL locale : l’accès réseau à MySQL est interdit dans le bac à sable d’audit.

## Performance

### Mesures disponibles

- Build Vite : réussi, 2 920 modules, environ 32,8 s.
- Bundle partagé principal : 422,25 kB brut / 136,30 kB gzip.
- CSS principal : 234,15 kB brut / 32,41 kB gzip.
- Page Home : 177,02 kB / 53,44 kB gzip en plus du socle partagé.
- Éditeur de bien : 209,62 kB / 56,72 kB gzip.
- Le build signale deux assets CSS introuvables : `/patterns/grid.svg` et `/patterns/hero-pattern.svg`.
- Plusieurs logos PNG pèsent entre 1,0 et 1,4 Mo.
- 43 composants TSX contiennent des balises `<img>`, mais seulement 4 fichiers utilisent explicitement `loading`.

### Backend

Les listes chargent parfois toutes les images, les détails, l’utilisateur et les localisations alors qu’une carte n’utilise qu’un sous-ensemble. Créer une ressource « résumé », sélectionner les colonnes et limiter aux images principales réduira SQL et payload. Les référentiels `Country::all()`, communes et équipements doivent être cachés avec invalidation lors des modifications admin.

### Frontend

Le code splitting par page est actif. Le bundle commun reste lourd. Les cartes doivent recevoir des images redimensionnées, des dimensions explicites, `srcset/sizes` et `loading=lazy`, sauf l’image LCP. Les pages géantes rendent les régressions et rerenders difficiles à isoler.

## UX/UI et accessibilité

- Bonne présence de textes alternatifs sur la majorité des images.
- États de formulaires et composants Radix/Headless UI déjà disponibles.
- Plusieurs textes alternatifs génériques (`img`, `brand`, `Profile`) n’apportent pas de contexte.
- Les carrousels automatiques doivent respecter `prefers-reduced-motion` et offrir pause/navigation clavier.
- Les formulaires géants doivent être segmentés avec résumé d’erreurs et focus sur le premier champ invalide.
- Vérifier `rel="noopener noreferrer"` pour tous les liens `_blank`.
- Le formulaire de contact ne doit plus annoncer un faux succès.

## SEO technique et immobilier

Le socle SEO technique a été mis en place le 24 juillet 2026 :

- slugs d’annonces stables et redirections 301 depuis les anciennes URL numériques ;
- title, description, canonical, robots, Open Graph et Twitter Cards rendus directement par Blade ;
- données structurées `RealEstateAgent`, `Residence`, `Offer` et `BreadcrumbList` ;
- sitemap XML dynamique limité aux pages indexables et annonces publiées, avec image principale ;
- `robots.txt` dynamique annonçant le sitemap et excluant les zones privées et techniques ;
- facettes de recherche en `noindex, follow` et canonical propre pour la pagination non filtrée ;
- annonces et référentiels principaux fournis dans la réponse Laravel initiale ;
- champs SEO éditables dans le CMS ;
- SSR Node désactivé par défaut pour éviter une dépendance incompatible avec HostKing mutualisé.

Les développements éditoriaux restants sont les pages locales par ville/commune/quartier, une architecture d’URL distincte par langue avant d’ajouter `hreflang`, et une éventuelle stratégie 410 pour les annonces définitivement retirées.

## Compatibilité HostKing mutualisé

Le déploiement recommandé n’utilise ni Redis ni worker permanent tant que l’offre ne les garantit pas :

1. Construire les assets Vite hors serveur et déployer `public/build`.
2. Installer Composer avec `--no-dev --optimize-autoloader`.
3. Pointer le document root vers `public`, jamais vers la racine Laravel.
4. Utiliser MySQL, `SESSION_DRIVER=database`, `CACHE_STORE=database`, `QUEUE_CONNECTION=database`.
5. Ajouter un cron chaque minute pour `php artisan schedule:run`.
6. Si aucun processus permanent n’est autorisé, ajouter un cron fréquent pour `php artisan queue:work --stop-when-empty --tries=3 --timeout=90`.
7. Exécuter au déploiement : migrations avec sauvegarde préalable, `storage:link`, puis `optimize`.
8. Vérifier que `storage` et `bootstrap/cache` sont inscriptibles, sans rendre tout le projet publiquement inscriptible.
9. Activer HTTPS forcé, cookies `secure`, sauvegardes MySQL et fichiers hors du même compte si possible.
10. Surveiller la taille des tables `jobs`, `failed_jobs`, sessions, cache et webhook logs, puis purger selon une rétention documentée.

L’Inertia SSR nécessite un processus Node permanent ; il ne faut pas le promettre sur un mutualisé sans confirmation explicite de HostKing. Une stratégie de pré-rendu ou des pages publiques Blade/Inertia enrichies côté serveur est plus robuste dans cette contrainte.

## Modifications réalisées

### Facturation

- Signature HMAC SHA-256 obligatoire sur le webhook Acoriss.
- Comparaison par `hash_equals`.
- Secret et nom d’en-tête configurables.
- Refus 401 avant toute écriture si signature absente/invalide.
- Redaction des champs de paiement sensibles et suppression des en-têtes complets.
- Throttle webhook.
- Routes mock et page demo limitées à `local`.

### Authentification et erreurs

- URL signée et throttle pour la vérification e-mail API.
- Throttle sur inscription, connexion et reset API.
- Inscription transactionnelle avec rôle `buyer` idempotent.
- Compatibilité POST/PATCH du profil et redirection déterministe.
- Statuts 404/405/429 API conservés au lieu d’être transformés en 500.
- Redirection de vérification e-mail cohérente avec `verified=1`.

### Tests

- Tests de sécurité ajoutés pour les webhooks, paiements, signatures e-mail, IDOR, authentification, privilèges et journaux d’audit.
- Suite passée de 55 à 84 tests, avec 253 assertions.

### Corrections complémentaires du 24 juillet 2026

- Activation des abonnements transactionnelle, verrouillée et idempotente.
- Validation stricte du montant, de la devise et de l’unicité du paiement.
- Policies sur les annonces et protection contre les accès directs à l’objet.
- Protection contre l’élévation vers `super-admin` et conservation du dernier super-administrateur.
- Expiration et révocation des jetons Sanctum, réponses d’authentification non énumérables.
- Journal d’audit persistant, valeurs sensibles masquées et purge automatique.
- Suppression d’un rendu HTML non fiable dans la modération des annonces.
- Bornes sur les filtres publics, la pagination, les images et les données immobilières.
- Dépendances Laravel/Composer et React/npm mises à jour.
- Exemple d’environnement HostKing sécurisé ajouté.
- Les 5 échecs initiaux d’authentification/profil ont été corrigés.

## Vérifications

- Suite Laravel : 90/90 tests passent, 282 assertions.
- Pint sur les fichiers modifiés : passe.
- Build Vite production : passe.
- Audit Composer : 0 vulnérabilité connue.
- Audit npm : 0 vulnérabilité connue.
- TypeScript : échoue avec plus de 100 erreurs existantes, principalement `implicit any`, types Inertia et options Chart.js.
- Prettier : échoue sur 2 fichiers existants.
- La migration du journal d’audit est validée sur SQLite par la suite de tests ; l’exécution MySQL doit faire partie du déploiement HostKing.

## Plan d’implémentation

### Lot 1 — sécurité et paiement

- Réalisé : activation idempotente et transactionnelle.
- Réalisé : contrôle du montant, de la devise et de l’identifiant de paiement.
- Réalisé : Policies et tests IDOR.
- Réalisé : expiration/révocation des tokens.
- Réalisé : piste d’audit et rétention des webhooks.

### Lot 2 — intégrité et médias

- Préserver l’historique d’abonnements.
- Remplacer les cascades destructrices par archivage/anonymisation.
- Index/contraintes après audit des données.
- Pipeline WebP/miniatures et nettoyage des orphelins.

### Lot 3 — performance

- Ressources API légères et image principale seulement.
- Cache des référentiels.
- Jobs cohérents et cron mutualisé.
- Réduction des bundles et correction TypeScript module par module.

### Lot 4 — SEO

- Réalisé : slugs stables et redirections 301.
- Réalisé : métadonnées, canonical, JSON-LD, sitemap et robots.
- Réalisé : données initiales des listes et détails fournies par Laravel.
- Réalisé : stratégie `noindex` des facettes.
- À produire : pages locales éditorialisées et URLs linguistiques distinctes.

### Lot 5 — UX/accessibilité

- Découper les composants géants.
- Corriger carrousels, focus, erreurs et doubles soumissions.
- Rendre le contact fonctionnel.
- Tests mobiles et WCAG 2.1 AA.

## Actions manuelles restantes

- Confirmer le nom exact et le format de l’en-tête de signature fourni par Acoriss. Le code accepte une valeur hexadécimale brute ou préfixée par `sha256=`.
- Définir `ACORISS_WEBHOOK_SECRET` et les autres secrets dans l’environnement HostKing.
- Configurer les deux crons HostKing et vérifier leur chemin PHP/Artisan.
- Fournir un accès de staging/MySQL pour mesurer les requêtes et vérifier `migrate:status`.
- Confirmer si HostKing autorise un worker permanent ; sinon conserver le worker cron `--stop-when-empty`.
