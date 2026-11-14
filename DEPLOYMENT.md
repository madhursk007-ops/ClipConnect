# ClipConnect deployment

ClipConnect is a React/Vite frontend served by the Express API, with PostgreSQL managed through Prisma. The repository includes a Render Blueprint at `render.yaml` for a same-origin full-stack preview.

## Deploy a preview with Render

1. Connect the GitHub repository `madhursk007-ops/ClipConnect` to Render.
2. In Render, create a new **Blueprint** and select this repository.
3. Select the `master` branch after the integration pull request has been merged.
4. Review the resources described by `render.yaml` and confirm creation.
5. Wait for the service build and health check to complete.
6. Open the Render service URL. The React app and `/api` endpoints are served from the same origin.

The Blueprint:
- Installs backend and frontend dependencies.
- Builds the React application.
- Generates Prisma Client.
- Applies the checked-in PostgreSQL migrations.
- Starts the Express server.
- Creates a PostgreSQL database and generates JWT secrets.

## Preview resource limitations

The Blueprint currently uses free resources to avoid creating paid services without your approval. These are suitable for a temporary preview, not production:

- Free Render web services spin down after 15 minutes without traffic and can take about a minute to wake.
- Free Render Postgres databases expire 30 days after creation, have no backups, and are limited to 1 GB.
- Upgrade the web service and database before storing real customer data or relying on the application.

See [Render free instance limitations](https://render.com/docs/free).

## Required runtime configuration

The Blueprint generates `JWT_SECRET` and `JWT_REFRESH_SECRET` and obtains `DATABASE_URL` from its Render Postgres resource. The server reads:

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Set to `production` by the Blueprint |
| `PORT` | Supplied by the hosting platform |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Access-token signing secret |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret |
| `JWT_EXPIRE` | Access-token lifetime |
| `JWT_REFRESH_EXPIRE` | Refresh-token lifetime |
| `CORS_ORIGIN` | Optional comma-separated trusted origins |
| `FRONTEND_URL` | Optional frontend URL for email links |

Cloudinary, email, and Stripe integrations require their own provider credentials. Do not enable payments or real file uploads until those credentials and webhook settings have been configured and tested. Never commit secrets to GitHub.

## Local development

Requirements: Node.js 18+, npm, and PostgreSQL.

### Backend

```bash
cd backend
npm ci
cp .env.example .env
```

Set `DATABASE_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` in `.env`, then:

```bash
npm run db:generate
npm run db:migrate
npm run dev
```

The API health endpoint is `http://localhost:5000/api/health`.

### React frontend

In a second terminal:

```bash
cd frontend-react
npm ci
npm run dev
```

Vite proxies `/api` and `/socket.io` to the local backend. For a separately hosted API, set `VITE_API_URL` to its API base URL at build time.

## Verification before production

The GitHub Actions workflow checks the React production build, Prisma schema, and backend test command. A successful build is not an end-to-end production test.

Before production use, test with a persistent PostgreSQL database and configured service credentials:
- Client and editor registration, login, logout, and refresh-token expiry.
- Role-protected dashboards and profile updates.
- Project creation, discovery, proposal submission, and proposal acceptance.
- Message persistence and Socket.IO delivery.
- File uploads, email delivery, and Stripe test-mode webhooks.
- Mobile layout, error handling, backups, and recovery.

Do not use sample profiles or demo data as evidence that these workflows are live.
