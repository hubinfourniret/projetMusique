# projetMusique

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

# Backend (Express)
npm run dev:back

# Build frontend
npm run build

# Lancer le backend en mode start
npm run start
```

Backend :

- `routes/` → "Quelle URL fait quoi ?" (routing uniquement)
- `controllers/` → "Comment je traite la requête ?" (logique HTTP)
- `services/` → "La vraie logique métier" (votes, calculs, MQTT...)
- `entities/` → "La forme des données" (schémas, modèles)
- `middleware/` → "Ce qui s'exécute avant chaque requête" (auth, validation)
- `config/` → "Les paramètres de l'app" (port, clés API...)


