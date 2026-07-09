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

## Deploiement

Variables d'environnement obligatoires sur l'hebergeur :

- `NODE_ENV=production`
- `PORT`
- `API_PREFIX`
- `FRONTEND_URL`
- `DATABASE_URL`
- `JWT_SECRET` avec une valeur forte de 32 caracteres minimum
- `JWT_EXPIRES_IN`
- `MINECRAFT_API_KEY` avec une valeur aleatoire de 32 caracteres minimum

Avant le premier demarrage en production, appliquer les migrations Prisma :

```bash
npx prisma migrate deploy
```

Build de production :

```bash
npm run build
```

Demarrage production :

```bash
npm run start:prod
```

Ne pas utiliser de wildcard CORS en production. `FRONTEND_URL` doit correspondre a l'origine exacte du frontend public.

## API pour les plugins Minecraft

Toutes les routes plugin exigent cet en-tete :

```http
X-Minecraft-Api-Key: valeur-de-MINECRAFT_API_KEY
```

Lire les points d'un joueur :

```bash
curl -H "X-Minecraft-Api-Key: votre-cle" \
  http://localhost:4000/api/v1/minecraft/plugin/players/SteveEGC/points
```

Reponse :

```json
{
  "ok": true,
  "data": {
    "minecraftName": "SteveEGC",
    "points": 25
  },
  "error": null
}
```

Crediter une tache :

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Minecraft-Api-Key: votre-cle" \
  -d "{\"minecraftName\":\"SteveEGC\",\"points\":5,\"task\":\"Premier diamant\",\"eventId\":\"serveur-1:uuid-unique\"}" \
  http://localhost:4000/api/v1/minecraft/plugin/points
```

`eventId` doit etre unique pour chaque recompense. Le plugin peut renvoyer la
meme requete apres une erreur reseau : `applied` vaudra `false` et aucun point
ne sera ajoute une deuxieme fois.
