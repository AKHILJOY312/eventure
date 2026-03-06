# Event Booking Platform

A full-stack **Event Booking Platform** for discovering services (venue, hotel, caterer, DJ, cameraman), creating bookings, and managing services/bookings from an admin dashboard.

## Highlights

- User service discovery with search + filters.
- Booking flow with date availability checks.
- Admin service CRUD and booking status management.
- Booking lists with pagination (user + admin pages).
- Clean layered backend architecture and typed frontend.

## Tech Stack

- Backend: Node.js, Express, TypeScript, MongoDB, Inversify, Zod
- Frontend: React, Vite, TypeScript, MUI, Redux Toolkit
- Infra: Docker Compose, Nginx (frontend container)

## Project Structure

```text
backend/
  src/application          # use-cases, DTOs, ports
  src/interface-adapters   # controllers, validators, HTTP layer
  src/infra                # DB models/repos, server, auth, logger
frontend/
  src/components           # atoms/molecules/organisms/pages/templates
  src/hooks                # reusable logic
  src/services             # API clients
  src/types                # shared types
```

## Run Locally

### 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment

Create `.env` files in `backend/` and `frontend/`.

Required backend vars (minimum):

- `MONGO_URI`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `PORT` (default `3000`)
- `CLIENT_URL` (default `http://localhost:5173`)

Optional frontend var:

- `VITE_SOCKET_URL`

### 3) Start apps

```bash
# backend
cd backend && npm run dev

# frontend
cd frontend && npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:3000` (`/api/*`).

## Docker Setup

Backend still needs `backend/.env` for secrets (`ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, etc.).  
`MONGO_URI` is overridden by Compose to use the Docker Mongo service.

### Development (hot reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

Or use the default root file:

```bash
docker compose up --build
```

Services:
- frontend: `http://localhost:5173`
- backend: `http://localhost:3000`
- mongo: `mongodb://localhost:27017`

### Production

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Services:
- frontend (nginx): `http://localhost`
- backend: internal only on port `3000` (proxied via frontend `/api`)
- mongo: internal Docker network volume-backed DB

## Useful Commands

```bash
cd backend && npm run build && npm run lint
cd frontend && npm run build && npm run lint
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.prod.yml up --build -d
```

## Contribution

- Follow Conventional Commits (`feat:`, `fix:`, `refactor:`).
- Keep PRs focused; include screenshots for UI changes and test steps.
- Do not commit secrets or `.env` files.
