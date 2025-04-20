# 📚 API Documentation — Video Matchmaking Backend

---

## Authentification

### POST `/api/v1/auth/login`
- **Description** : Connexion d'un utilisateur
- **Body** :
```json
{
  "email": "user@mail.com",
  "password": "secret"
}
```
- **Réponse** :
```json
{
  "token": "JWT...",
  "user": { ... }
}
```

### POST `/api/v1/auth/register`
- **Description** : Inscription d'un utilisateur
- **Body** :
```json
{
  "email": "user@mail.com",
  "password": "secret",
  "username": "pseudo"
}
```
- **Réponse** :
```json
{
  "token": "JWT...",
  "user": { ... }
}
```

---

## Profils Utilisateur

### GET `/api/v1/users/me`
- **Description** : Récupérer le profil de l'utilisateur courant
- **Headers** : `Authorization: Bearer <JWT>`

### PATCH `/api/v1/users/me`
- **Description** : Modifier le profil utilisateur
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "bio": "...",
  "birth_date": "YYYY-MM-DD",
  "language": ["fr", "en"],
  "nationality": ["FR"],
  "sex": "male"
}
```

### GET `/api/v1/users/:id`
- **Description** : Récupérer le profil d’un autre utilisateur
- **Headers** : `Authorization: Bearer <JWT>`

### DELETE `/api/v1/users/me`
- **Description** : Supprimer son propre compte
- **Headers** : `Authorization: Bearer <JWT>`

---

## Filtres de Recherche

### GET `/api/v1/user-filters/`
- **Description** : Récupérer les préférences de filtre de l'utilisateur
- **Headers** : `Authorization: Bearer <JWT>`

### PATCH `/api/v1/user-filters/`
- **Description** : Mettre à jour les préférences de filtre
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "min_age": 18,
  "max_age": 30,
  "language": ["fr", "en"],
  "nationality": ["FR", "BE"],
  "sex": ["female"],
  "radius_km": 50
}
```

---

## Localisation Live

### WebSocket: `user:location:update`
- **Description** : Met à jour la position GPS de l'utilisateur
- **Payload** :
```json
{
  "userId": "uuid",
  "lat": 48.8566,
  "lng": 2.3522
}
```

---

## Recherche d'utilisateurs (Matchmaking)

### POST `/api/v1/users/search`
- **Description** : Recherche des utilisateurs selon les filtres et la géolocalisation
- **Headers** : `Authorization: Bearer <JWT>`
- **Body (optionnel)** :
```json
{
  "minAge": 18,
  "maxAge": 30,
  "language": ["fr", "en"],
  "nationality": ["FR", "BE"],
  "sex": ["female"],
  "radiusKm": 50
}
```
- **Réponse** :
```json
{
  "results": [
    {
      "id": "...",
      "username": "...",
      "language": ["fr"],
      "nationality": ["FR"],
      "sex": "female",
      "location": "SRID=4326;POINT(2.3522 48.8566)",
      "address": "Paris, Île-de-France, France",
      ...
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 42
}
```

---

## Blocage et Amis

### POST `/api/v1/blocks/`
- **Description** : Bloquer un utilisateur
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "blocked_id": "uuid"
}
```

### GET `/api/v1/blocks/`
- **Description** : Liste des utilisateurs bloqués
- **Headers** : `Authorization: Bearer <JWT>`

### DELETE `/api/v1/blocks/:blocked_id`
- **Description** : Débloquer un utilisateur
- **Headers** : `Authorization: Bearer <JWT>`

### POST `/api/v1/friendships/`
- **Description** : Envoyer une demande d'ami
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "friend_id": "uuid"
}
```

### POST `/api/v1/friendships/accept`
- **Description** : Accepter une demande d’ami
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "friend_id": "uuid"
}
```

### POST `/api/v1/friendships/reject`
- **Description** : Refuser une demande d’ami
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "friend_id": "uuid"
}
```

### GET `/api/v1/friendships/`
- **Description** : Liste des amis et des demandes
- **Headers** : `Authorization: Bearer <JWT>`

### DELETE `/api/v1/friendships/:friend_id`
- **Description** : Retirer un ami
- **Headers** : `Authorization: Bearer <JWT>`

---

## Conversations & Messages

### GET `/api/v1/conversations/`
- **Description** : Liste les conversations de l'utilisateur
- **Headers** : `Authorization: Bearer <JWT>`

### POST `/api/v1/conversations/`
- **Description** : Créer une nouvelle conversation
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "participant_ids": ["user_id_1", "user_id_2"]
}
```

### GET `/api/v1/messages/:conversationId`
- **Description** : Liste les messages d'une conversation
- **Headers** : `Authorization: Bearer <JWT>`

### POST `/api/v1/messages/`
- **Description** : Envoyer un message
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "conversation_id": "uuid",
  "content": "Hello!"
}
```

### PATCH `/api/v1/messages/:messageId`
- **Description** : Modifier un message
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "content": "Nouveau contenu"
}
```

### DELETE `/api/v1/messages/:messageId`
- **Description** : Supprimer un message
- **Headers** : `Authorization: Bearer <JWT>`

### DELETE `/api/v1/conversations/:conversationId`
- **Description** : Supprimer une conversation
- **Headers** : `Authorization: Bearer <JWT>`

---

## Notifications & WebSocket

### WebSocket events (à l’écoute côté client)
- `message:new` — Nouveau message reçu
- `message:edited` — Message édité
- `conversation:deleted` — Conversation supprimée
- `user:location:update` — Mise à jour de la position

---

## Appels Vidéo

### POST `/api/v1/video-call/start`
- **Description** : Démarrer un appel vidéo avec un utilisateur
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "callee_id": "uuid"
}
```
- **Réponse** :
```json
{
  "call_id": "uuid",
  "room_url": "https://..."
}
```

### POST `/api/v1/video-call/accept`
- **Description** : Accepter un appel vidéo entrant
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "call_id": "uuid"
}
```

### POST `/api/v1/video-call/end`
- **Description** : Terminer un appel vidéo
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "call_id": "uuid"
}
```

---

## Matchmaking Vidéo Live

### POST `/api/v1/video-live-matchmaking/join`
- **Description** : Rejoindre la file d'attente pour le matchmaking vidéo live
- **Headers** : `Authorization: Bearer <JWT>`

### POST `/api/v1/video-live-matchmaking/leave`
- **Description** : Quitter la file d'attente
- **Headers** : `Authorization: Bearer <JWT>`

### GET `/api/v1/video-live-matchmaking/status`
- **Description** : Statut de l'utilisateur dans la file d'attente
- **Headers** : `Authorization: Bearer <JWT>`

---

## Upload de fichiers

### POST `/api/v1/upload`
- **Description** : Uploader un fichier (image, vidéo, etc.)
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** : `multipart/form-data`

---

## Endpoints additionnels

### Santé

#### GET `/health`
- **Description** : Vérifier que l'API est en ligne
- **Réponse** :
```json
{
  "status": "ok",
  "timestamp": 1713580000000
}
```

---

### Modération

#### POST `/api/moderation/report`
- **Description** : Signaler un utilisateur
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "reported_id": "uuid",
  "reason": "spam"
}
```

---

### Webhook

#### POST `/api/webhook/videosdk`
- **Description** : Webhook pour événements VideoSDK (usage interne)
- **Body** : selon la doc VideoSDK

---

### Vidéo classique (création de room)

#### POST `/api/video/room`
- **Description** : Créer un room vidéo pour une session
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "match_id": "uuid"
}
```
- **Réponse** :
```json
{
  "room_url": "https://..."
}
```

---

### Matchmaking (classique)

#### POST `/api/v1/matchmaking/`
- **Description** : Demander une mise en relation
- **Headers** : `Authorization: Bearer <JWT>`

---

### Vidéo matchmaking (swipe)

#### GET `/api/v1/video-matchmaking/next`
- **Description** : Récupérer le prochain profil vidéo à matcher
- **Headers** : `Authorization: Bearer <JWT>`

---

### Upload de fichiers pour messages

#### POST `/api/v1/upload/message-media`
- **Description** : Uploader une image ou vidéo pour un message
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** : `multipart/form-data` (champ `file`)
- **Réponse** :
```json
{
  "url": "https://..."
}
```

---

### Gestion de profil avancée

#### POST `/api/v1/profiles/me/photo`
- **Description** : Uploader une photo de profil
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** : `multipart/form-data` (champ `photo`)

#### GET `/api/v1/profiles/me`
- **Description** : Récupérer son profil (alternative à `/users/me`)
- **Headers** : `Authorization: Bearer <JWT>`

#### PATCH `/api/v1/profiles/me`
- **Description** : Modifier son profil
- **Headers** : `Authorization: Bearer <JWT>`
- **Body** :
```json
{
  "bio": "...",
  "language": ["fr"],
  ...
}
```

#### GET `/api/v1/profiles/:userId`
- **Description** : Récupérer le profil public d’un utilisateur
- **Headers** : `Authorization: Bearer <JWT>`

---

### Gestion des blocks

#### POST `/api/v1/blocks/:userId`
- **Description** : Bloquer un utilisateur
- **Headers** : `Authorization: Bearer <JWT>`

#### DELETE `/api/v1/blocks/:userId`
- **Description** : Débloquer un utilisateur
- **Headers** : `Authorization: Bearer <JWT>`

#### GET `/api/v1/blocks/`
- **Description** : Liste des utilisateurs bloqués
- **Headers** : `Authorization: Bearer <JWT>`

---

### Gestion des amis (routes REST)

#### POST `/api/v1/friendships/request/:userId`
- **Description** : Envoyer une demande d'ami
- **Headers** : `Authorization: Bearer <JWT>`

#### POST `/api/v1/friendships/accept/:userId`
- **Description** : Accepter une demande d'ami
- **Headers** : `Authorization: Bearer <JWT>`

#### DELETE `/api/v1/friendships/:userId`
- **Description** : Supprimer un ami
- **Headers** : `Authorization: Bearer <JWT>`

#### GET `/api/v1/friendships/`
- **Description** : Liste des amis
- **Headers** : `Authorization: Bearer <JWT>`

#### GET `/api/v1/friendships/pending`
- **Description** : Liste des demandes d’amis en attente
- **Headers** : `Authorization: Bearer <JWT>`

---

### Recherche utilisateur CRUD

#### GET `/api/v1/users/search`
- **Description** : Rechercher des utilisateurs (avec filtres)
- **Headers** : `Authorization: Bearer <JWT>`

#### GET `/api/v1/users/:id`
- **Description** : Récupérer un utilisateur par ID
- **Headers** : `Authorization: Bearer <JWT>`

#### POST `/api/v1/users/`
- **Description** : Créer un utilisateur (usage interne/admin)
- **Headers** : `Authorization: Bearer <JWT>`

#### PUT `/api/v1/users/:id`
- **Description** : Modifier un utilisateur
- **Headers** : `Authorization: Bearer <JWT>`

#### DELETE `/api/v1/users/:id`
- **Description** : Supprimer un utilisateur
- **Headers** : `Authorization: Bearer <JWT>`

---

## Notes
- Tous les endpoints nécessitent le header `Authorization: Bearer <JWT>` sauf inscription/login.
- Les réponses d'erreur sont au format `{ "error": "message" }`.
- Pour la localisation live, le front doit maintenir une connexion WebSocket et envoyer la position régulièrement.

---

**Pour toute question ou exemple de payload, se référer à ce fichier ou demander à l'équipe backend.**
