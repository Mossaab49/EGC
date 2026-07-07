# Modules

Chaque dossier represente un domaine metier de la plateforme EGC.

- `auth`: connexion, JWT, session utilisateur.
- `users`: membres, admin, reset de mot de passe.
- `events`: evenements publics et activation d'une seule inscription ouverte.
- `tournaments`: tournois, inscription et annulation.
- `ranking`: classements mensuel et hebdomadaire.
- `wordle`: banque de mots et validation des tentatives.
- `minecraft`: demandes d'acces au serveur Minecraft.

La regle pour la suite: un controller expose l'API, un service porte la logique,
les DTOs valident les entrees.
