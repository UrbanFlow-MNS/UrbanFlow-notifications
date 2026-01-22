# Configuration SMTP Gmail pour UrbanFlow Notifications

## Qu'est-ce que SMTP ?

**SMTP (Simple Mail Transfer Protocol)** est le protocole standard pour envoyer des emails. Il permet à votre microservice d'envoyer automatiquement des notifications par email aux utilisateurs.

## Configuration Gmail (Gratuit)

### Étape 1 : Activer la validation en 2 étapes

1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Cliquez sur **Sécurité** dans le menu de gauche
3. Trouvez **Validation en deux étapes** et activez-la
4. Suivez les instructions (SMS, appli Google Authenticator, etc.)

### Étape 2 : Générer un App Password

1. Retournez dans **Sécurité** sur votre compte Google
2. Cherchez **Mots de passe des applications** (tout en bas)
3. Cliquez dessus (vous devez avoir activé la validation en 2 étapes)
4. Sélectionnez :
   - **Application** : Autre (nom personnalisé)
   - **Nom** : "UrbanFlow Notifications"
5. Cliquez sur **Générer**
6. Google vous donne un code de 16 caractères (ex: `abcd efgh ijkl mnop`)
7. **COPIEZ ce code** (vous ne pourrez plus le revoir)

### Étape 3 : Configurer votre fichier .env

1. Copiez le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Modifiez votre fichier `.env` avec vos informations :
   ```env
   # SMTP Configuration (Gmail)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=votre-email@gmail.com
   SMTP_PASSWORD=abcd efgh ijkl mnop
   SMTP_FROM_NAME=UrbanFlow
   SMTP_FROM_EMAIL=votre-email@gmail.com
   ```

   **Important** : 
   - `SMTP_USER` = votre adresse Gmail complète
   - `SMTP_PASSWORD` = le App Password généré (16 caractères, avec ou sans espaces)
   - `SMTP_FROM_EMAIL` = la même adresse que SMTP_USER

## Utilisation

### Envoyer un email de notification

```typescript
// Dans votre contrôleur ou service
await this.notificationsService.sendEmailNotification(
  'destinataire@example.com',
  notification
);
```

### Exemple complet

```typescript
// Créer une notification et l'envoyer par email
const notification = await this.notificationsService.create({
  recipientUserId: 123,
  title: 'Nouvelle alerte trafic',
  content: 'Un incident est détecté sur votre trajet habituel',
  type: NotificationType.ALERT,
  channel: NotificationChannel.EMAIL,
  priority: NotificationPriority.HIGH,
  sourceMicroservice: 'traffic-service',
  sourceEntityId: 456,
});

// Envoyer l'email
await this.notificationsService.sendEmailNotification(
  'user@example.com',
  notification
);
```

## Limites Gmail Gratuites

- **500 emails par jour** avec un compte Gmail gratuit
- **2000 emails par jour** avec Google Workspace (payant)

## Sécurité

1. **Ne commitez JAMAIS** votre fichier `.env` sur Git
2. Le `.env` est déjà dans `.gitignore`
3. Utilisez `.env.example` comme template (sans vraies valeurs)
4. Pour la production, utilisez des variables d'environnement sécurisées

## Tests

Pour tester l'envoi d'email, vous pouvez utiliser :

```bash
 npm run start:dev

# Puis faire une requête POST pour créer une notification
# et appelez la méthode sendEmailNotification
```

## Problèmes fréquents

### "Invalid login: 535-5.7.8 Username and Password not accepted"
- Vérifiez que la validation en 2 étapes est activée
- Régénérez un nouveau App Password
- Vérifiez que vous utilisez l'App Password et non votre mot de passe Gmail

### "Connection timeout"
- Vérifiez votre connexion internet
- Vérifiez que le port 587 n'est pas bloqué par votre pare-feu

### Les emails vont dans les spams
- Normal au début, demandez au destinataire de marquer comme "non spam"
- Pour une vraie production, utilisez un service comme SendGrid, Mailgun, etc.
