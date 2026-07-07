# EGC Backend

Backend NestJS pour la plateforme ENSAT Gaming Club.

## Stack

- NestJS
- TypeScript strict
- PostgreSQL
- Prisma ORM
- JWT pour l'authentification

## Structure

- `src/common`: filtres, guards, interceptors et utilitaires transverses.
- `src/config`: validation et lecture de la configuration.
- `src/database`: Prisma et acces base de donnees.
- `src/modules`: modules metier par domaine EGC.

## Commandes

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run start:dev
```

L'API sera exposee par defaut sur `http://localhost:4000/api/v1`.
