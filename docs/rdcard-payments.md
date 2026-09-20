# Paiements automatiques RDCard

Les plans `automatic` ouvrent le checkout hébergé RDCard. Les plans `manual` conservent leur procédure existante. Chaque achat active la durée du plan choisi ; cette intégration ne crée pas de prélèvement récurrent.

## Configuration serveur

Renseigner dans `.env` :

```dotenv
APP_URL=https://votre-domaine.tld
RDCARD_ENVIRONMENT=sandbox
RDCARD_BASE_URL=
RDCARD_API_KEY=
RDCARD_SECRET_KEY=
RDCARD_SERVICE_ID=
```

Les deux clés sont nécessaires. `RDCARD_ENVIRONMENT=sandbox` utilise sandbox.checkout.rdcard.net ; `live` utilise checkout.rdcard.net. Laisser `RDCARD_BASE_URL` vide pour sélectionner automatiquement le serveur. Les noms `PG_API_KEY`, `PG_API_SECRET` et `PG_ENVIRONMENT` du projet de référence sont aussi acceptés. `RDCARD_SERVICE_ID` est optionnel. Le secret API signe aussi les webhooks, conformément au guide de sécurité. Ne jamais utiliser de variables `VITE_` pour ces secrets. Les anciennes variables `ACORISS_*` servent uniquement à l'ancien endpoint webhook ; elles ne configurent pas RDCard.

Après configuration, exécuter `php artisan config:cache`. Dans le dashboard RDCard, déclarer l'URL HTTPS publique `https://votre-domaine.tld/api/webhooks/rdcard` (également envoyée comme `callbackUrl`). Les URL de retour sont construites par l'application. En local, utiliser un tunnel HTTPS et les clés de test fournies par RDCard ; aucun paiement fictif n'est généré automatiquement selon l'environnement.

## Fonctionnement

- POST `/api/v1/sessions` sur l'hôte RDCard : montant en dollars USD, sans multiplication par 100 (un forfait à 15 $ envoie `amount: 15` et un article à `price: 15`), référence locale unique de 40 caractères, identité du client, détail du plan, URLs de callback/succès/annulation.
- Authentification `X-API-KEY` et HMAC-SHA256 hexadécimal dans `X-SIGNATURE`, calculé sur les octets exacts du JSON. La session retournée utilise le champ `id`.
- GET `/api/v1/sessions/:id` au retour du navigateur, avec signature de l’identifiant de paiement, comme dans le SDK utilisé par `skv-community` : `P` en attente, `S` réussi, `C` annulé. Les paramètres du navigateur ne prouvent jamais un paiement.
- Le webhook vérifie `X-Signature` sur le corps brut et lit `data.payment`. Avant toute modification, il contrôle la session enregistrée, la référence, le montant et la devise.
- Un succès active une seule fois l'abonnement, ses quotas et sa date d'expiration. Les notifications répétées ne prolongent pas sa durée. Une notification d'échec tardive ne désactive pas un abonnement payé.
- `cancelUrl` pointe vers `/billing/cancel?transaction=…`, accessible au propriétaire connecté. Après vérification RDCard, ce retour ferme la tentative impayée avec le statut `cancelled`, la date d’annulation et le message « Votre paiement a été annulé. Vous pouvez réessayer. ». Les anciennes sessions utilisant `/billing/return?transaction=…&cancelled=1` restent compatibles.
- Les annulations du webhook ou du statut RDCard `C` sont également enregistrées comme `cancelled`, distinctes des échecs `failed`. La liste des transactions affiche « Annulé ». Un retour explicite d’annulation ferme la tentative même si RDCard répond encore `P` ou est indisponible ; cela ne révoque pas la session chez RDCard. Un succès vérifié tardif peut toujours activer cette tentative et efface la date d’annulation. Un paiement déjà confirmé ne peut pas être annulé par le retour navigateur.
- Sur un retour normal, les erreurs réseau laissent la demande en attente, sans activation.
- Le checkout RDCard peut renvoyer le navigateur en GET vers `callbackUrl` après fermeture du popup OTP. Les nouvelles sessions incluent `?transaction=…` dans ce callback : le GET redirige vers la vérification serveur authentifiée puis la page de résultat. Seul le statut RDCard vérifié détermine alors si la tentative est annulée, payée ou encore en attente. Le POST à la même adresse reste un webhook exigeant sa signature et utilisant uniquement la référence du corps signé. Les anciennes sessions sans référence reviennent à l’historique des abonnements, sans modifier une tentative arbitraire.
- Si le webhook arrive avant l'enregistrement de l'identifiant de session, une réponse 503 demande à RDCard de réessayer. Le retour du navigateur vérifie aussi le paiement côté serveur.
- Les administrateurs ne valident/rejettent pas manuellement les paiements RDCard. Les journaux de webhook conservent uniquement les références, montants et devises.

## Validation avant mise en service

```sh
php artisan test --compact tests/Feature/Billing
```

Les tests utilisent `Http::fake` et aucune transaction réelle. Avec les clés RDCard et une URL publique, tester un achat de test, une annulation, une notification répétée et le retour navigateur avant d'utiliser les clés de production. Vérifier que le montant affiché au checkout correspond au prix du plan et que le dashboard RDCard reçoit des réponses 2xx aux webhooks.

Documentation consultée : [référence API](https://docs.checkout.rdcard.net/fr/api-reference), [webhooks](https://docs.checkout.rdcard.net/fr/guides/webhooks), [sécurité](https://docs.checkout.rdcard.net/fr/guides/security).

Vérification sandbox effectuée avec les clés locales : création de session réussie et consultation signée retournant `P` (en attente), sans effectuer de paiement.

## Pages de résultat

Les retours succès et annulation redirigent vers `/billing/result?transaction=…`. Cette page authentifiée affiche le statut enregistré en base, le forfait, le montant et la référence copiable, avec un écran animé adapté au succès ou à l’annulation. Un paiement en attente propose une vérification explicite via le retour serveur. Les paramètres du navigateur ne peuvent pas transformer un paiement en succès. Le récapitulatif est réservé au propriétaire de la transaction. Les animations respectent la préférence de réduction des mouvements.

Pour déployer les pages, compiler et publier les assets avec `npm run build`, puis rafraîchir les routes avec `php artisan route:cache`.
