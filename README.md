# EGC React Prototype

Prototype React/Vite pour la plateforme ENSAT Gaming Club.

## Demarrer

```bash
npm install
npm run dev
```

Ensuite, ouvrir l'URL affichee par Vite, souvent `http://localhost:5173`.

## Fonctions incluses

- Navigation entre Accueil, Evenements, Activites, Classement et Admin.
- Wordle avec etat de victoire, bonus de points et animation de tuiles.
- Inscription au tournoi avec confirmation et ticket dynamique.
- Demande Minecraft avec feedback.
- Panneau Admin ameliore : sidebar repliable, controle des effets visuels, statistiques animees, gestion interactive des membres, mots Wordle, evenements, tournois et demandes Minecraft.

## Remarque

Les donnees sont des donnees de demonstration gerees dans l'etat React. La prochaine etape cote production serait de relier ces interfaces a une API Node.js/Express et a PostgreSQL ou MongoDB.
