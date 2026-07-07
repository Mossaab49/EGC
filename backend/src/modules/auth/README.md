# Auth Module

Ce module gere uniquement l'authentification et le changement de mot de passe.
Il n'expose aucune inscription publique.

## Flux actuel

1. Un administrateur cree un membre dans le module `users`.
2. Le backend genere un mot de passe temporaire, le hash avec bcrypt, puis stocke
   `passwordHash` et `mustChangePassword = true`.
3. Le membre se connecte via `POST /auth/login`.
4. La reponse contient un `accessToken` JWT et les champs publics:
   `id`, `name`, `email`, `role`, `mustChangePassword`.
5. Si `mustChangePassword` vaut `true`, le frontend force l'ecran de changement
   de mot de passe.
6. Le membre appelle `POST /auth/change-password` avec le token Bearer.
7. Le backend verifie le mot de passe actuel, hash le nouveau, puis met
   `mustChangePassword = false`.

## Routes

- `POST /auth/login`: public, retourne un JWT si les identifiants sont valides.
- `GET /auth/me`: protege par JWT, restaure la session cote frontend.
- `POST /auth/change-password`: protege par JWT, change le mot de passe.

## Utilisation frontend

Envoyer le token sur les routes protegees:

```http
Authorization: Bearer <accessToken>
```

## Plus tard

- Refresh tokens.
- Rate limiting sur `/auth/login`.
- Journalisation des connexions.
- Flux "mot de passe oublie" par email.
