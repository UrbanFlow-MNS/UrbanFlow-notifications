<<<<<<< HEAD
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
=======
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
>>>>>>> aa408d0d9169d9854428216203c4280d51feb9cf
