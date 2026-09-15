# Newsletter Brevo

## Activation sur le serveur

1. Dans Brevo, ouvrir **Contacts → Listes**, créer une liste « Newsletter The Agency » et relever son identifiant numérique.
2. Créer une clé API Brevo dans les paramètres SMTP & API. Utiliser une **clé API**, pas une clé SMTP.
   Ajouter et valider également l’expéditeur `contact@agencydrc.com` avec le nom « The Agency » dans les paramètres des expéditeurs Brevo.
3. Renseigner dans le `.env` du serveur (jamais dans une variable `VITE_*`) :

   ```dotenv
   BREVO_API_KEY=votre-cle-api
   BREVO_NEWSLETTER_LIST_ID=123
   BREVO_SENDER_EMAIL=contact@agencydrc.com
   BREVO_SENDER_NAME="The Agency"
   ```

4. Déployer les modifications PHP et compiler les assets avec `npm run build`, puis actualiser la configuration :

   ```sh
   php artisan migrate --force
   php artisan config:cache
   ```

5. Inscrire une adresse de test depuis le site et vérifier sa présence dans la liste Brevo ainsi que la réception du mail « Bienvenue dans la newsletter de The Agency ! ». L’acceptation par l’API ne garantit pas la livraison : consulter les journaux transactionnels Brevo si le mail n’arrive pas.
6. Pour reprendre les abonnés actifs déjà enregistrés sur le site, exécuter une fois :

   ```sh
   php artisan newsletter:sync-brevo
   ```

   La commande peut être relancée après un échec : les contacts existants sont mis à jour sans duplication. Ne pas la planifier régulièrement : Brevo gère les désabonnements des campagnes, qui ne sont pas répercutés dans la base locale.

## Fonctionnement

- Le formulaire ajoute le contact à la liste Brevo avant de confirmer l'inscription et de l'enregistrer localement.
- Une configuration manquante, un délai dépassé ou une erreur Brevo donne un message d'erreur visible, sans faux succès.
- Le choix newsletter du profil ajoute ou retire le contact de cette liste. Un changement d'adresse d'un abonné retire l'ancienne adresse avant d'ajouter la nouvelle.
- La suppression du compte retire son abonnement actif de la liste Brevo avant l'anonymisation ; si Brevo échoue, la suppression est interrompue et peut être retentée.
- Les autres listes et les blocages d'envoi définis dans Brevo sont préservés. Un contact bloqué dans Brevo peut être ajouté à la liste mais ne recevra pas de campagne tant que son blocage subsiste.
- Le formulaire et l’abonnement depuis le profil envoient le mail de bienvenue directement via l’API transactionnelle Brevo. Aucune automatisation Brevo supplémentaire n’est nécessaire pour ce mail ; désactiver une éventuelle automatisation équivalente pour éviter les doublons.
- `welcome_sent_at` mémorise l’acceptation du mail par Brevo. Une inscription répétée n’envoie pas de nouveau bienvenue ; une adresse déjà inscrite avant cette fonctionnalité en reçoit un à sa prochaine inscription. L’import en ligne de commande n’envoie aucun mail de bienvenue.
- Si Brevo refuse le mail, l’inscription est conservée et le formulaire explique que le bienvenue n’a pas pu être envoyé. Une nouvelle soumission retente cet envoi. Aucun renvoi automatique en arrière-plan n’est planifié.
- Le SMTP du site reste indépendant de cette intégration.

Référence : [API de gestion des contacts Brevo](https://developers.brevo.com/docs/synchronise-contact-lists).
