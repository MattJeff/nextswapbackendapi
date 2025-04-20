# Video Matchmaking Backend

![CI](https://github.com/mathishiguinen/video-matchmaking-backend/actions/workflows/ci.yml/badge.svg)

Backend for a real-time video matchmaking social app, built with Node.js, TypeScript, Express, and Supabase.

## Features
- Secure authentication (Supabase Auth)
- User profile management
- Geospatial user search (PostGIS)
- Real-time matchmaking (VideoSDK.live)
- Friendships and blocking
- Profile photo upload (Supabase Storage)
- Row Level Security (RLS) enforced

## Tech Stack
- Node.js, TypeScript, Express
- Supabase (PostgreSQL + PostGIS, Auth, Storage, Realtime)
- Zod for validation

## Setup
1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Supabase keys
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run in development:
   ```bash
   npm run dev
   ```

## Docker (Production Ready)
Build and run in production mode:
```bash
docker build -t video-backend .
docker run -p 3000:3000 --env-file .env video-backend
```

## Continuous Integration (GitHub Actions)
- Lint, build, and tests run automatically on push/PR to `main` ([.github/workflows/ci.yml](.github/workflows/ci.yml)).
- To run locally:
  ```bash
  npm run lint
  npm run build
  npm test
  ```

## API Documentation (Swagger)
- [swagger.yaml](./swagger.yaml) covers all endpoints (auth, profiles, friendships, blocks, matchmaking).
- Serve it locally with Swagger UI:
  ```bash
  npm install swagger-ui-express yamljs
  # See below for /docs endpoint
  ```
- Or use [Swagger Editor](https://editor.swagger.io/) for interactive docs.

## Deployment (Render, Railway, etc.)
- Deploy on [Render](https://render.com/) or [Railway](https://railway.app/) using the Dockerfile or Node.js template.
- Set your environment variables in the dashboard.
- Example Render build command: `npm run build`  Start command: `node dist/server.js`

## Serve Swagger Docs at /docs
Add this in your `src/app.ts`:
```ts
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

## Security & Monitoring
- RLS enforced at the DB level (see `sql/schema.sql`)
- Input validation everywhere (Zod)
- Centralized error handling
- Add monitoring (Sentry, Datadog…) by plugging into Express error middleware
- Rate limiting possible via `express-rate-limit`

---

## Project Structure
- `src/` — source code
- `src/routes/` — Express route handlers
- `src/middleware/` — authentication & validation middleware
- `src/controllers/` — business logic
- `src/utils/` — helpers and error classes
- `src/config/` — Supabase client and config

---
See the technical specification for details on endpoints and architecture.
