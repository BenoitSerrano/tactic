# Tactic - Plateforme de correction automatisée

Tactic est une application web permettant aux professeurs de langue de créer et corriger des examens de manière automatisée.

## Architecture

Le projet est organisé en monorepo avec :

-   Backend Node.js/TypeScript dans

src

-   Frontend React dans

client

## Installation

```sh
# Installation des dépendances
npm install
cd src/client && npm install

# Variables d'environnement
cp .env.example .env
cd src/client && cp .env.example .env
```

## Scripts disponibles

### Backend

```sh
# Démarrer le serveur de développement
npm run startDev

# Lancer les tests
npm run test:back

# Compiler le code TypeScript
npm run buildServer
```

### Frontend

```sh
cd src/client

# Démarrer l'application en mode développement
npm start

# Lancer les tests
npm run test

# Créer un build de production
npm run build
```

### Base de données

```sh
# Générer une migration
npm run migration:generate --name=nom-de-la-migration

# Exécuter les migrations
npm run migration:run
```

## Déploiement

1. Créer un build de production : `npm run build`
2. L'application sera accessible sur `http://localhost:3000`

## Technologies utilisées

-   Backend : Node.js, TypeScript, TypeORM
-   Frontend : React, Material-UI
-   Base de données : PostgreSQL
-   Paiement : Stripe
-   Hébergement : Scalingo
