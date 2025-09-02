# XFoli AI

AI-powered portfolio intelligence: track holdings in real time and understand the “why” behind daily moves through concise, narrative analysis.

Production: https://xfoli-ai.vercel.app/

## Overview

XFoli AI is a full‑stack application that combines a modern Next.js frontend with a FastAPI backend to deliver:
- Real‑time portfolio tracking with sortable, responsive dashboards
- AI‑style narrative explanations of daily performance context
- Clean UX for portfolio creation, holding management, and insights

This README focuses on clarity for engineering managers and recruiters: what was built, how it’s architected, why certain tradeoffs were made, and how to run it locally.

## Highlights

- TypeScript Next.js 15 App Router with server components where appropriate and client components for interactivity
- Strong linting and type hygiene (ESLint + @typescript-eslint), React Hooks dependency correctness, and explicit types
- Auth via Supabase (email link and OAuth), client session token propagated to backend via Bearer token
- FastAPI backend with SQLModel for data modeling, clean REST endpoints, and request validation
- External market data via Finnhub with basic in‑memory caching and parallelized fetches
- Production deploys: Vercel (frontend) and Render (backend)

## Architecture

- Frontend (Next.js / TypeScript)
  - App Router structure under `frontend/app/`
  - Reusable UI primitives in `frontend/components/ui/`
  - API client with request de‑duplication and auth header propagation in `frontend/lib/api.ts`
  - Pages: marketing (`(marketing)`), auth (`(auth)`), and application (`/dashboard`)

- Backend (FastAPI / Python)
  - Entry: `backend/app/main.py` with CORS, routers, and health endpoint
  - Routers: `backend/app/api/` (`portfolios.py`, `search.py`, `agent.py`, `account.py`)
  - Data: `sqlmodel` models in `backend/app/database/models.py`
  - DB session and engine in `backend/app/database/session.py`
  - Market data integration in `backend/app/services/finnhub_service.py` with simple caching and parallelization

- Data model (simplified)
  - `Portfolio`: id, name, user_id, relationship to holdings
  - `Holding`: id, ticker, quantity, portfolio_id (unique per portfolio,ticker)
  - `SupportedTicker`: ticker metadata for validation

## Key Features

- Portfolio CRUD with ownership checks and cascade delete
- Holdings add/update/remove with ticker validation
- Portfolio details endpoint that enriches holdings with live market data and aggregates totals
- Client‑side sorting, memoized computations, and resilient network handling
- Robust error surface and edge‑case handling (preflight/CORS, auth propagation, network timeouts)

## Security & Auth

- Supabase Auth used on the frontend
- Access token stored client‑side and attached to backend requests as `Authorization: Bearer <token>`
- Backend extracts user id (see `app/auth/security.py`) to scope data per user

## Notable Implementation Details

- Request de‑duplication: `frontend/lib/api.ts` caches in‑flight requests by method:endpoint:body to avoid redundant calls
- Sorting stability and type safety: mixed string/number comparisons handled explicitly to satisfy TypeScript overloads
- React hooks correctness: effects depend on memoized callbacks (`useCallback`) to avoid stale closures and lint warnings
- Market data: ThreadPoolExecutor for parallel quote fetches and 60s in‑memory cache to limit API usage

## Tech Stack

- Frontend: Next.js 15, TypeScript, React, App Router, ESLint, Tailwind‑style utility classes
- Auth: Supabase (email link + OAuth ready)
- Backend: FastAPI, SQLModel, SQLAlchemy, Uvicorn
- Data: Relational DB via `DATABASE_URL` (SQLModel/SQLAlchemy). Designed for Postgres on Render.
- Integrations: Finnhub for quotes and news
- Deploy: Vercel (frontend), Render (backend)

## Local Development

### Prerequisites
- Node 18+
- Python 3.11+
- A Postgres database (local or cloud)

### Environment

Frontend (`frontend/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Backend (`backend/.env`):
```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/xfoli
FINNHUB_API_KEY=your_finnhub_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role
CORS_ORIGINS=http://localhost:3000
```

### Run

Backend:
```
cd backend
pip install -e .
python run_dev.py
```
This starts Uvicorn with FastAPI at http://localhost:8000

Frontend:
```
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

## Production Deployments

- Frontend: Vercel. Set `NEXT_PUBLIC_API_URL` to your Render backend URL in Vercel project settings. Redeploy without build cache to ensure env propagation.
- Backend: Render Web Service
  - Root Directory: `backend`
  - Build: `./render_build.sh`
  - Start: `./render_start.sh`
  - Env: `CORS_ORIGINS=https://xfoli-ai.vercel.app` and DB + Finnhub keys
  - Health: `/health`

## API Overview (Selected)

Base: `${API_BASE_URL}/api`

- `GET /portfolios/` — list portfolios for current user
- `POST /portfolios/` — create portfolio `{ name }`
- `GET /portfolios/{id}` — portfolio with enriched holding data
- `POST /portfolios/{id}/holdings` — add holding `{ ticker, quantity }`
- `PATCH /portfolios/holdings/{holding_id}` — update holding quantity
- `DELETE /portfolios/holdings/{holding_id}` — remove holding
- `DELETE /portfolios/{id}` — delete portfolio and holdings

See `backend/app/api/portfolios.py` for full details.

## Testing Considerations

- Unit‑level: service methods (e.g., quote fetch + cache), model validation, and API client utilities
- Integration: end‑to‑end portfolio flows against a seeded Postgres and mocked Finnhub
- Frontend: validate hooks dependencies via ESLint rule, smoke test core pages

## Accessibility & UX

- Keyboard focus states on interactive elements
- Semantic headings and structure on marketing pages
- Clear error messages and confirmations for destructive actions

## Roadmap

- Add server‑side rendering for selected data views to reduce client work
- Expand AI analysis to summarize market news across holdings
- Add pagination/virtualization for large portfolios
- Replace in‑memory cache with Redis for multi‑instance backend

## License

This repository is provided as sample application code. Licensing can be adapted per company policy. 