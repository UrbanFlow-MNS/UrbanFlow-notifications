# UrbanFlow - Microservice Notifications

Microservice de gestion des notifications pour le système de transport urbain UrbanFlow.

## Description

Ce microservice gère l'envoi et le suivi des notifications à destination des utilisateurs du système UrbanFlow (opérateurs, techniciens, superviseurs). Il supporte plusieurs canaux de communication et types de notifications.

## Architecture

**Framework** : NestJS  
**ORM** : TypeORM  
**Base de données** : PostgreSQL  
**Langage** : TypeScript

## Modèle de données

### Entité Notification

| Champ | Type | Description |
|-------|------|-------------|
| `id` | number | Identifiant unique |
| `recipientUserId` | number | ID de l'utilisateur destinataire |
| `title` | string | Titre de la notification |
| `content` | text | Contenu détaillé |
| `type` | NotificationType | Type de notification |
| `channel` | NotificationChannel | Canal d'envoi |
| `status` | NotificationStatus | Statut d'envoi |
| `priority` | NotificationPriority | Niveau de priorité |
| `sourceMicroservice` | string | Microservice source |
| `sourceEntityId` | number | ID de l'entité source |
| `sentAt` | timestamp | Date/heure d'envoi (nullable) |

### Énumérations

#### NotificationType
- `INCIDENT_CREATED` - Nouvel incident créé
- `INCIDENT_UPDATED` - Incident mis à jour
- `INCIDENT_ASSIGNED` - Incident affecté à un technicien
- `TRANSPORT_DELAY` - Retard de transport
- `SYSTEM_INFO` - Information système

#### NotificationChannel
- `EMAIL` - Email
- `SMS` - SMS
- `PUSH` - Notification push mobile
- `IN_APP` - Notification in-app

#### NotificationStatus
- `PENDING` - En attente d'envoi
- `SENT` - Envoyée avec succès
- `FAILED` - Échec d'envoi
- `READ` - Lue par l'utilisateur

#### NotificationPriority
- `LOW` - Priorité basse
- `NORMAL` - Priorité normale (par défaut)
- `HIGH` - Priorité haute

## Structure du projet

```
UrbanFlow-notifications/
├── src/
│   ├── models/
│   │   ├── notificationEnums.ts       # Énumérations
│   │   └── notificationModel.ts       # Interface TypeScript
│   ├── entities/
│   │   └── notification.entity.ts     # Entité TypeORM
│   ├── app.module.ts                  # Module principal
│   └── main.ts                        # Point d'entrée
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## Installation

### Prérequis

- Node.js 18+
- PostgreSQL 13+
- npm

### Étapes

1. Installer les dépendances
   ```bash
   npm install
   ```

2. Configurer l'environnement
   ```bash
   cp .env.example .env
   ```
   
   Éditer `.env` avec vos paramètres PostgreSQL :
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=urbanflow_notifications
   NODE_ENV=development
   ```

3. Créer la base de données
   ```sql
   CREATE DATABASE urbanflow_notifications;
   ```

4. Lancer le microservice
   ```bash
   npm run start:dev
   ```

   Le serveur démarre sur http://localhost:3000

## Scripts disponibles

```bash
npm run build           # Compiler TypeScript
npm start               # Lancer en production
npm run start:dev       # Lancer en mode développement
npm run typeorm         # Commandes TypeORM
```

## Configuration

La configuration TypeORM se trouve dans `src/app.module.ts`.

Variables d'environnement :
- `DB_HOST` - Hôte PostgreSQL (défaut: localhost)
- `DB_PORT` - Port PostgreSQL (défaut: 5432)
- `DB_USERNAME` - Nom d'utilisateur (défaut: postgres)
- `DB_PASSWORD` - Mot de passe
- `DB_NAME` - Nom de la base (défaut: urbanflow_notifications)
- `NODE_ENV` - Environnement (development/production)

En développement, `synchronize: true` crée automatiquement les tables.  
En production, utiliser les migrations TypeORM.

## Intégration

Ce microservice reçoit des événements des autres microservices UrbanFlow :

- **Microservice Incidents** : INCIDENT_CREATED, INCIDENT_UPDATED, INCIDENT_ASSIGNED
- **Microservice Transport** : TRANSPORT_DELAY
- **Système** : SYSTEM_INFO

Chaque notification stocke le microservice source (`sourceMicroservice`) et l'ID de l'entité concernée (`sourceEntityId`).