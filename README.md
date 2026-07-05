# ENSAT Gaming Club Platform

Frontend Vite/React pour la plateforme web de l'ENSAT Gaming Club.

## Stack actuelle

- React 19
- Vite 7
- CSS global dans `src/styles.css`
- Donnees mockees en memoire, sans backend

Note: le depot actuel n'est pas encore migre vers TypeScript, Tailwind CSS, Framer Motion ou Lucide React. La structure a ete preparee pour rendre cette migration progressive.

## Lancer le projet

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
```

## Structure

```txt
src/
  App.jsx                 Orchestration globale, navigation, etat mocke racine
  components/
    ui/                   Briques UI generiques: Button, Field, Modal, Toast
    shared/               Composants transverses: PageHeader, Detail, Tile
  constants/              Navigation, formulaires vides, valeurs stables
  features/               Pages et features metier
    account/
    activities/
    admin/
    auth/
    events/
    home/
    ranking/
  hooks/                  Hooks reutilisables
  lib/                    Fonctions pures et donnees mockees
    mock-data/
  services/               Abstractions pretes pour futur backend
  types/                  Types JSDoc partages en attendant TypeScript strict
```

## Conventions

- Les composants React sont en `PascalCase`.
- Les fonctions et variables sont en `camelCase`.
- Les fichiers de feature restent proches du domaine metier.
- Les fonctions pures et testables vont dans `src/lib`.
- Les donnees mockees ne doivent pas etre declarees dans les composants.
- Les futurs appels backend doivent passer par `src/services`.

## Etat des donnees

Les membres, evenements, tournois, mots Wordle et demandes Minecraft sont stockes localement en memoire React. Toute modification est perdue au refresh. Le prochain vrai palier de production est de remplacer les services mockes par une API.

## Qualite

Le build Vite est le garde-fou disponible aujourd'hui:

```bash
npm run build
```

Des fichiers de configuration Prettier/ESLint-ready sont presents, mais les dependances ESLint/Prettier ne sont pas installees dans le projet actuel.
