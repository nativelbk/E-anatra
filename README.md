# e-Anatra — Plateforme Éducative Intelligente

> "L'intelligence artificielle peut rendre l'éducation plus accessible, personnalisée et inclusive."

---

## Prérequis

- [Node.js](https://nodejs.org) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (pour PostgreSQL)
- Une clé API IA : [Claude (Anthropic)](https://console.anthropic.com) ou [OpenAI](https://platform.openai.com)

---

## Démarrage rapide

### 1. Variables d'environnement

```bash
cp .env.example .env
```

Ouvrir `.env` et remplir :

```env
ANTHROPIC_API_KEY=sk-ant-...    # Clé Claude (recommandé)
# ou
OPENAI_API_KEY=sk-...           # Clé OpenAI
AI_PROVIDER=claude              # claude | openai
```

> **Sans clé API**, l'app fonctionne quand même en mode démonstration.

---

### 2. Démarrer la base de données

S'assurer que **Docker Desktop est ouvert**, puis :

```bash
docker compose up -d postgres
```

---

### 3. Backend (NestJS)

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

API disponible sur : `http://localhost:3001`  
Swagger (docs API) : `http://localhost:3001/api/docs`

---

### 4. Frontend (React)

Dans un **nouveau terminal** :

```bash
cd frontend
npm install
npm run dev
```

Application disponible sur : `http://localhost:5173`

---

## Comptes de démonstration

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `eleve@demo.com` | `demo1234` | Élève |
| `prof@demo.com` | `prof1234` | Enseignant |
| `admin@demo.com` | `admin1234` | Administrateur |

---

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion, Recharts |
| Backend | NestJS, TypeScript, Prisma ORM, PostgreSQL, JWT |
| IA | Claude API (Anthropic) · OpenAI · Mode mock sans clé |

---

## Structure du projet

```
e-Anatra2.0/
├── frontend/
│   └── src/
│       ├── pages/          # Landing, Login, Register, Dashboard,
│       │                   # Chat (IA), Quiz, Library, Profile, Admin
│       ├── components/     # Sidebar, Header
│       ├── store/          # Zustand (auth)
│       └── lib/            # Axios + appels API
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma   # Modèles BDD
│   │   └── seed.ts         # Données de démo
│   └── src/
│       ├── auth/           # JWT, register, login
│       ├── ai/             # Service Claude / OpenAI / mock
│       ├── chat/           # Conversations + messages IA
│       ├── quiz/           # Génération & correction de quiz
│       ├── courses/        # Bibliothèque pédagogique
│       ├── progress/       # Statistiques & recommandations
│       └── users/          # Gestion utilisateurs
├── docker-compose.yml
└── .env.example
```

---

## Fonctionnalités

- **Assistant IA** — interface ChatGPT, historique, explications étape par étape
- **Quiz IA** — génération automatique par matière et niveau, correction + explications
- **Tableau de bord** — progression, scores, graphiques, recommandations personnalisées
- **Bibliothèque** — cours filtrables par matière (Maths, Sciences, Informatique…) et niveau
- **Multi-rôles** — Élève / Enseignant / Administrateur
- **Dark mode** — interface moderne, responsive mobile/tablette/desktop

---

## Commandes utiles

```bash
# Voir les logs de la base de données
docker compose logs -f postgres

# Ouvrir Prisma Studio (interface visuelle BDD)
cd backend && npx prisma studio

# Recréer les données de démo
cd backend && npx prisma db seed

# Build de production
cd frontend && npm run build
cd backend  && npm run build
```
