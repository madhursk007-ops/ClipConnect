# ClipConnect — Video Editor Marketplace

ClipConnect is a full-stack marketplace project designed to connect video editors with clients and content creators. The repository contains a Node.js API, a React/Vite frontend, a static HTML/CSS/JavaScript frontend, and a separately deployable prototype.

> **Project status:** Active development. Features described below are represented in the codebase; deployment, production readiness, and end-to-end behavior must be verified in a configured environment before being described as production-ready.

## Product direction

- Editor profiles with skills, portfolios, pricing, and availability
- Client project posting and editor proposals
- Project collaboration and messaging
- Ratings and reviews
- Search and discovery
- Subscription and payment integration groundwork
- AI-assisted matching and project workflows

## Technology

| Layer | Stack |
|---|---|
| API | Node.js, Express |
| Data access | Prisma ORM |
| Database | PostgreSQL |
| Authentication and security | JWT, bcryptjs, Helmet, express-rate-limit, validation middleware |
| Realtime | Socket.IO |
| Media | Cloudinary integration |
| Payments | Stripe integration |
| React frontend | React 18, Vite, React Router, Zustand, Axios, Framer Motion |
| Static frontend | HTML, CSS, vanilla JavaScript |

## Repository layout

```text
.
├── backend/                 # Express API, Prisma schema and migrations
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── prisma/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── frontend/                # Static HTML/CSS/JavaScript client
├── frontend-react/          # React + Vite client
├── prototype/               # Standalone GitHub Pages prototype
├── .github/workflows/       # Prototype deployment workflow
├── DEPLOYMENT.md
└── README.md
```

## Run locally

### Requirements

- Node.js 18 or newer
- npm 9 or newer
- PostgreSQL
- Environment variables configured locally

### 1. Configure the API

```bash
cd backend
npm ci
cp .env.example .env
```

Set the required values in your local `.env` file. At minimum, configure a valid PostgreSQL `DATABASE_URL` and strong application secrets. Never commit `.env` or paste secrets into issues or pull requests.

### 2. Prepare the database

```bash
npx prisma generate
npx prisma migrate deploy
```

For local development where migrations need to be created, use the Prisma development workflow documented by the team.

### 3. Start the API

```bash
npm run dev
```

The default API port is configured through the environment. Check `backend/server.js` and your local environment settings for the health endpoint and port.

### 4. Run the React frontend

In a second terminal:

```bash
cd frontend-react
npm ci
npm run dev
```

Use the Vite URL printed in the terminal. Configure the frontend API base URL to match your local backend.

## Useful scripts

### Backend

```bash
npm run dev
npm start
npm test
npm run lint
npm run db:generate
npm run db:migrate:prod
npm run db:studio
```

### React frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Security notes

- Keep all credentials in environment variables or the hosting provider's secret manager.
- Use `.env.example` for placeholder variable names only.
- Do not commit dependencies, build output, local logs, or user data.
- Rotate any credential that has ever been committed to a public repository.
- Configure production CORS origins, HTTPS, database access controls, and payment-provider webhooks before deployment.

## Current verification

A repository listing is not proof that a feature works end to end. Before a release, run backend tests and lint, build and lint the React frontend, validate database migrations against a disposable PostgreSQL database, and test the main user journeys with configured services.

## Contributing

1. Create a focused branch.
2. Make a small, testable change.
3. Run the relevant checks.
4. Document configuration changes and new environment variables.
5. Open a pull request describing behavior and test evidence.

## Maintainer

**Madhur S. Khadabadi** — [GitHub](https://github.com/madhursk007-ops)
