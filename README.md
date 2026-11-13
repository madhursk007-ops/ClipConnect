# ClipConnect

A full-stack marketplace concept connecting video editors with clients and content creators.

## Overview

ClipConnect brings client project listings and editor discovery into one place. The repository includes a responsive HTML/CSS/JavaScript frontend and an Express API backed by PostgreSQL and Prisma.

Core product areas include:
- Editor profiles, portfolios, skills and availability
- Project listings and editor proposals
- Client/editor messaging with Socket.IO
- Ratings and reviews
- Search and filtering
- Authentication and account profiles

> **Project status:** This repository contains an evolving application. Feature availability and production readiness should be verified against the current implementation and deployment environment.

## Tech stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Socket.IO client

### Backend
- Node.js and Express
- PostgreSQL with Prisma ORM
- JWT authentication and bcryptjs
- Socket.IO for real-time communication
- Helmet, CORS and express-rate-limit
- Cloudinary, Nodemailer and Stripe integrations (require provider credentials)

## Repository structure

```text
ClipConnect/
├── backend/
│   ├── config/
│   ├── middlewares/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   ├── js/
│   └── *.html
└── README.md
```

## Requirements

- Node.js 18 or later
- npm
- PostgreSQL 14 or later (local or hosted)
- Git

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/madhursk007-ops/ClipConnect.git
cd ClipConnect
```

### 2. Configure the backend

```bash
cd backend
npm install
cp .env.example .env
```

Set at least these values in `.env`:

```dotenv
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/clipconnect?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-another-long-random-secret"
CORS_ORIGIN="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"
```

Create the `clipconnect` database in PostgreSQL, then generate Prisma Client and apply the migrations:

```bash
npm run db:generate
npm run db:migrate
```

Start the API:

```bash
npm run dev
```

The API defaults to `http://localhost:5000`. Check its health endpoint at `http://localhost:5000/api/health`.

### 3. Serve the frontend

In a second terminal:

```bash
cd frontend
npx serve . -p 3000
```

Open `http://localhost:3000`.

The frontend uses `/api` by default, which is suitable when the frontend and API are served behind the same origin/reverse proxy. If the API is hosted on a separate origin, define its base URL before the application scripts load:

```html
<script>
  window.CLIPCONNECT_CONFIG = {
    apiBase: "https://your-api-host.example.com/api"
  };
</script>
```

Use your actual deployed API URL and add the frontend origin to the backend's `CORS_ORIGIN` environment variable. Do not commit real credentials or secrets.

## Useful backend scripts

Run these from the `backend` directory:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm start` | Start the server |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Create/apply development migrations |
| `npm run db:migrate:prod` | Apply existing migrations in production |
| `npm run db:studio` | Open Prisma Studio |
| `npm test` | Run the configured test command |

## API overview

The Express application mounts route groups under `/api`:

- `/api/auth` — registration, login and account actions
- `/api/users` — editor/client profiles and discovery
- `/api/projects` — project listings and proposals
- `/api/messages` — conversations and messages
- `/api/reviews` — reviews
- `/api/ai` — AI-related endpoints
- `/api/subscription` — subscription endpoints
- `/api/stats` — statistics
- `/api/health` — service health check

Refer to the route files for the current request and response contracts.

## Deployment notes

1. Deploy the backend to a Node.js host that supports long-running HTTP and Socket.IO connections.
2. Configure PostgreSQL and all required environment variables on the hosting provider.
3. Run `npm run db:generate` during the build and `npm run db:migrate:prod` as part of the release process.
4. Set `CORS_ORIGIN` to the exact frontend origin(s), comma-separated when needed.
5. Configure `CLIPCONNECT_CONFIG.apiBase` in the frontend when the API is hosted separately.
6. Configure provider credentials (Cloudinary, email and Stripe) only when enabling those integrations.

The server binds to `0.0.0.0` and uses the hosting provider's `PORT` environment variable when supplied.

## Security reminders

- Use unique, strong secrets for JWT configuration.
- Keep `.env` out of version control.
- Use HTTPS for deployed frontend and API traffic.
- Restrict CORS to trusted frontend origins.
- Verify payment, email, upload and authentication flows before enabling them for real users.

## License

See the repository's [LICENSE](LICENSE) file.
