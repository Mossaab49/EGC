# Audit Frontend

## Constat

- Le projet reel est un prototype React/Vite en JSX, pas une base TypeScript/Tailwind.
- Avant refactor, `src/App.jsx` melangeait donnees mockees, composants UI, pages, logique Wordle, logique admin et orchestration globale.
- Les donnees etaient declarees inline dans les composants, ce qui rendait le branchement backend plus couteux.
- Aucun outil ESLint, Prettier ou TypeScript strict n'etait configure dans les dependances.

## Refactor applique

- Passage a une architecture feature-based.
- Extraction des composants UI partages.
- Extraction des donnees mockees dans `src/lib/mock-data`.
- Extraction de la logique Wordle dans `src/lib/wordle`.
- Creation d'une couche `src/services` pour remplacer facilement le fetch local par une API plus tard.
- Creation d'un hook `useToast`.
- Ajout de types JSDoc centralises dans `src/types/domain.js`.

## Dettes restantes

- Migrer progressivement les fichiers `.jsx` vers `.tsx`.
- Installer et activer `typescript`, `eslint`, `prettier`, `@types/react`, `@types/react-dom`.
- Remplacer le CSS global par Tailwind/design tokens si Tailwind est vraiment choisi.
- Decouper davantage `features/admin/Admin.jsx`, qui reste volontairement fonctionnel mais trop dense.
- Ajouter des tests unitaires sur `src/lib/wordle.js` et les futurs services API.
