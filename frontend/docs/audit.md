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
- Ajout de `AuthContext`, `ToastContext` et `AppDataContext` pour supprimer le prop drilling depuis `App.jsx`.
- Generalisation des services domaine : membres, evenements, tournois, Wordle et Minecraft.
- Uniformisation des retours services avec `ApiResponse<T>` et des adaptateurs memoire prets a etre remplaces par des appels backend.
- Activation de `checkJs` via `jsconfig.json` pour faire remonter les erreurs JSDoc dans l'editeur sans migrer immediatement en TypeScript.

## Dettes restantes

- Migrer progressivement les fichiers `.jsx` vers `.tsx`.
- Installer et activer `typescript`, `@types/react` et `@types/react-dom` avant une verification stricte complete.
- Renforcer ESLint/Prettier avec des regles de type-aware linting lorsque TypeScript sera installe.
- Remplacer le CSS global par Tailwind/design tokens si Tailwind est vraiment choisi.
- Decouper davantage `features/admin/Admin.jsx`, qui reste volontairement fonctionnel mais trop dense.
- Ajouter des tests unitaires sur `src/lib/wordle.js`, les Contexts et les services mockes.
- Reintegrer Tailwind et Framer Motion apres stabilisation du contrat backend si la stack cible reste celle annoncee.
