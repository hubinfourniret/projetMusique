# Projet Musique

Monorepo npm avec:
- `frontend`: Vue + Vite
- `backend`: Express

## Installation

```sh
npm install
```

## Commandes

```sh
# Frontend (Vite)
npm run dev:front
```
```sh
# Backend (Express)
npm run dev:back
```
```sh
# Build frontend
npm run build
```
```sh
# Lancer le backend en mode start
npm run start
```
Frontend :

`css` : tailwing → daisyui


Backend :

- `routes/` → "Quelle URL fait quoi ?" (routing uniquement)
- `controllers/` → "Comment je traite la requête ?" (logique HTTP)
- `services/` → "La vraie logique métier" (votes, calculs, MQTT...)
- `entities/` → "La forme des données" (schémas, modèles)
- `middleware/` → "Ce qui s'exécute avant chaque requête" (auth, validation)
- `config/` → "Les paramètres de l'app" (port, clés API...)


# 🎵 Jukebox Appart

Application jukebox collaborative hébergée en local sur un Raspberry Pi.
Les habitants de l'appartement se connectent via leur téléphone ou PC pour rechercher des musiques, les ajouter à la file d'attente et voter. La lecture est gérée par le Raspberry Pi via l'API Spotify.

> **Stack :** Vue 3 + Vite + Tailwind + DaisyUI · Node.js + Express · WebSocket · Pinia · Spotify Web API + Web Playback SDK

---

## 📋 Sommaire

- [Architecture générale](#-architecture-générale)
- [Flux de données](#-flux-de-données)
- [Structure du projet](#-structure-du-projet)
- [Backend](#-backend)
- [Frontend](#-frontend)
- [Raspberry Pi](#-raspberry-pi)
- [Variables d'environnement](#-variables-denvironnement)
- [Installation](#-installation)
- [Routes API](#-routes-api)
- [Messages WebSocket](#-messages-websocket)
- [Roadmap](#-roadmap)

---

## 🏗 Architecture générale

```
┌─────────────────────────────────────────────────────────┐
│                    Raspberry Pi                          │
│                                                          │
│   ┌──────────────────────┐   ┌────────────────────────┐ │
│   │  Chromium (kiosk)    │   │  Express + WebSocket   │ │
│   │  Web Playback SDK    │◄──│  :3000                 │ │
│   │  → 1 device Spotify  │   │  Queue interne         │ │
│   └──────────────────────┘   └───────────┬────────────┘ │
│                                           │              │
└───────────────────────────────────────────┼──────────────┘
                                            │ HTTP + WS (LAN)
                              ┌─────────────┴──────────────┐
                              │   Téléphones / PC           │
                              │   Vue 3 app                 │
                              │   → Recherche               │
                              │   → File d'attente          │
                              │   → Votes (roadmap)         │
                              └─────────────────────────────┘
```

---

## 🔄 Flux de données

### Ajout d'une musique

```
[Client Vue]
    │  POST /api/track/add  { track }
    ▼
[Express]
    │  Queue.add(track)
    │  POST Spotify /v1/me/player/queue?uri=...&device_id=...
    │  broadcastQueue(Queue.all)
    ▼
[WebSocket → tous les clients]
    │  { type: 'QUEUE_UPDATE', queue: [...] }
    ▼
[Pinia store → Vue réactif]
    └─ Affichage mis à jour sur tous les appareils connectés
```

### État de lecture (Pi → clients)

```
[Web Playback SDK - Chromium Pi]
    │  player_state_changed
    │  POST /api/player/state  { track, position, duration, paused }
    ▼
[Express]
    │  broadcastPlayerState(payload)
    ▼
[WebSocket → tous les clients]
    │  { type: 'PLAYER_STATE', payload: { ... } }
    ▼
[Pinia store]
    └─ Barre de progression + titre mis à jour en temps réel
```

---

## 📁 Structure du projet

```
jukebox/
│
├── backend/
│   └── src/
│       ├── server.js               # Point d'entrée Express + WebSocket
│       ├── websocket.js            # Gestion WS + broadcast
│       ├── entities/
│       │   └── Queue.js            # File d'attente en mémoire
│       └── routes/
│           ├── auth.js             # OAuth Spotify + getFreshToken()
│           ├── search.js           # GET /api/search
│           ├── track.js            # POST /api/track/add|addNext · DELETE /delete
│           └── player.js           # POST /api/player/state|next|previous|toggle
│
├── frontend/
│   └── src/
│       ├── main.js                 # createApp + createPinia (une seule instance)
│       ├── App.vue                 # store.connect() au montage
│       ├── router/
│       │   └── index.js
│       ├── stores/
│       │   └── queueStore.js       # State global : queue, player, WebSocket
│       ├── services/
│       │   └── musicService.js     # Appels HTTP vers le backend
│       ├── composables/
│       │   └── usePlayerProgress.js
│       ├── components/
│       │   ├── PlayerProgress.vue  # Barre de progression
│       │   ├── MiniPlayer.vue      # Bandeau lecture en bas
│       │   └── Icons/
│       └── views/
│           ├── HomeView.vue
│           ├── SearchView.vue      # Recherche + ajout queue
│           ├── FocusView.vue       # Lecteur plein écran
│           └── ListView.vue        # File d'attente
│
└── player.html                     # Ouvert par Chromium sur le Pi
                                    # Initialise le Web Playback SDK
```

---

## 🔧 Backend

### Auth — `routes/auth.js`

Le token Spotify est **mis en cache** côté serveur et rafraîchi automatiquement 60 secondes avant expiration. Tous les fichiers importent `getFreshToken()` directement.

| Route | Description |
|-------|-------------|
| `GET /api/auth/login` | Redirige vers Spotify *(setup one-shot)* |
| `GET /api/auth/callback` | Reçoit le `code`, retourne le `refresh_token` |
| `GET /api/auth/token` | Retourne un `access_token` frais pour le SDK |

### Queue — `entities/Queue.js`

File d'attente en mémoire sur le Pi. Synchronisée en temps réel via WebSocket.

```js
Queue.add(track)       // Ajoute en fin de file
Queue.addNext(track)   // Ajoute juste après le titre en cours
Queue.remove(id)       // Supprime par id
Queue.all              // Retourne le tableau complet
```

### WebSocket — `websocket.js`

À chaque nouvelle connexion, le client reçoit **immédiatement** la queue actuelle sans attendre un changement.

---

## 🖥 Frontend

### Store Pinia — `stores/queueStore.js`

**Une seule instance** partagée entre toutes les pages. La connexion WebSocket est ouverte une seule fois dans `App.vue` via `store.connect()`.

**State**

| Propriété | Type | Description |
|-----------|------|-------------|
| `queue` | `Track[]` | File d'attente complète |
| `currentTrack` | `Track \| null` | Titre en cours de lecture |
| `position` | `number` | Position en ms |
| `duration` | `number` | Durée totale en ms |
| `isPaused` | `boolean` | État play/pause |

**Getters**

| Getter | Description |
|--------|-------------|
| `progress` | Pourcentage écoulé (0–100) |
| `elapsed` | Temps écoulé formaté `m:ss` |
| `total` | Durée totale formatée `m:ss` |

### Service HTTP — `services/musicService.js`

```js
searchTracks(query)   // GET    /api/search?q=
add(track)            // POST   /api/track/add
addNext(track)        // POST   /api/track/addNext
removeTrack(id)       // DELETE /api/track/delete?id=
```

### Format d'un objet `Track`

```js
{
  id:       "6AoOzPhqx5LbtYfKBlBrEG",
  title:    "Bohemian Rhapsody",
  artist:   "Queen",
  album:    "A Night at the Opera",
  cover:    "https://i.scdn.co/image/...",
  uri:      "spotify:track:6AoOzPhqx5LbtYfKBlBrEG",
  duration: 354000   // ms
}
```

---

## 🍓 Raspberry Pi

### `player.html` — Web Playback SDK

Chromium s'ouvre automatiquement sur cette page au démarrage du Pi. Le SDK crée un device nommé **"Jukebox Appart 🎵"** visible dans Spotify Connect et enregistre son `device_id` auprès du backend.

> ⚠️ Un compte **Spotify Premium** est requis pour le Web Playback SDK.

### Lancement automatique au boot

```bash
# /etc/rc.local
chromium-browser --kiosk --no-sandbox http://localhost:3000/player.html
```

---

## 🔑 Variables d'environnement

Créer un fichier `backend/.env` :

```env
SPOTIFY_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
SPOTIFY_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
SPOTIFY_REFRESH_TOKEN=xxxxxxxxxxxxxxxxxxxx
```

> Le `SPOTIFY_REFRESH_TOKEN` s'obtient en ouvrant `http://localhost:3000/api/auth/login` une seule fois dans un navigateur.

---

## 🚀 Installation

```bash
# Backend
cd backend
npm install
node src/server.js

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

L'application est accessible sur le réseau local via l'IP du Pi :

```
http://192.168.x.x:5173
```

---

## 📡 Routes API

| Méthode | Route | Corps | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/auth/login` | — | Setup OAuth *(one-shot)* |
| `GET` | `/api/auth/callback` | — | Callback OAuth |
| `GET` | `/api/auth/token` | — | Token frais pour le SDK |
| `GET` | `/api/search?q=` | — | Recherche Spotify |
| `POST` | `/api/track/add` | `{ track }` | Ajoute en fin de queue |
| `POST` | `/api/track/addNext` | `{ track }` | Ajoute après le titre en cours |
| `DELETE` | `/api/track/delete?id=` | — | Supprime de la queue |
| `POST` | `/api/track/device` | `{ device_id }` | Enregistre le device Pi |
| `POST` | `/api/player/state` | `{ track, position, duration, paused }` | État SDK → back |
| `POST` | `/api/player/next` | — | Piste suivante |
| `POST` | `/api/player/previous` | — | Piste précédente |
| `POST` | `/api/player/toggle` | — | Play / Pause |

---

## 📨 Messages WebSocket

| Type | Direction | Payload | Description |
|------|-----------|---------|-------------|
| `QUEUE_UPDATE` | back → clients | `{ queue: Track[] }` | Mise à jour de la file |
| `PLAYER_STATE` | back → clients | `{ track, position, duration, paused }` | État de lecture |

---

## 🗺 Roadmap

- [ ] **Système de votes** — les utilisateurs votent pour le prochain titre
- [ ] **Multi-room** — synchronisation audio via [Snapcast](https://github.com/badaix/snapcast) sur plusieurs Pi
- [ ] **Historique** — liste des titres joués
- [ ] **Interface admin** — gestion de la queue depuis le Pi


