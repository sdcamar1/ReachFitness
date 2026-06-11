# REACH Fitness Repository Guide

## Project

REACH Fitness is a marketing and appointment-booking platform for a single-trainer coaching studio.

- Frontend: React, Vite, Tailwind CSS, React Router, shadcn-style components
- Backend: FastAPI, PyMongo, JWT authentication, Resend email
- Database: MongoDB Atlas
- Production: two Vercel projects connected to this repository

## Repository Layout

- `frontend/`: public site, booking flow, login, and admin dashboard
- `frontend/public/images/`: assets published by Vite
- `backend/app/`: FastAPI application code
- `backend/index.py`: Vercel Python entrypoint
- `backend/vercel.json`: explicit Vercel Python function routing
- `backend/tests/`: backend tests
- `images/`: source images supplied by the project owner; copy production assets into `frontend/public/images/`

## Local Development

Run commands from the repository root unless noted otherwise.

Backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8001 --reload
```

Frontend:

```powershell
cd frontend
cmd /c npm install
cmd /c npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8001`
- Health check: `http://localhost:8001/api/health`

## Verification

For backend changes:

```powershell
$env:PYTHONPATH='backend'
.\.venv\Scripts\python.exe -m pytest backend\tests -q -p no:cacheprovider
```

Also verify the Vercel entrypoint:

```powershell
cd backend
..\.venv\Scripts\python.exe -B -c "from index import app; print(app.title, len(app.routes))"
```

For frontend changes:

```powershell
cd frontend
cmd /c npm run build
```

After meaningful frontend changes, inspect desktop and mobile layouts. Verify direct navigation and refresh for `/`, `/about`, `/book`, `/login`, and `/admin`.

## Environment Variables

Never commit `.env` files, credentials, API keys, database connection strings, or admin passwords.

Backend variables:

- `MONGO_URL`
- `DB_NAME`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `RESEND_API_KEY`
- `SENDER_EMAIL`
- `NOTIFY_EMAIL`
- `CORS_ORIGINS`
- `STUDIO_TIMEZONE`

Frontend variable:

- `REACT_APP_BACKEND_URL`

The settings code expects `MONGO_URL`, not `MONGODB_URL`.

## Deployment

Both Vercel projects use the same GitHub repository and the `master` branch.

- Frontend project root: `frontend`
- Backend project root: `backend`
- Frontend URL: `https://reach-fitness-one.vercel.app`
- Backend URL: `https://reach-fitness-backend.vercel.app`

The frontend Vercel project requires its SPA rewrite in `frontend/vercel.json`. The backend uses `backend/index.py` and `backend/vercel.json`; do not remove these without replacing the deployment configuration.

Environment-variable changes require a fresh Vercel deployment. Backend production CORS must include the frontend origin.

## Backend Rules

- All API routes remain under `/api`, except the root status route.
- Enforce appointment slot rules on the server even when the frontend validates them.
- Preserve the unique active-slot database constraint to prevent duplicate bookings.
- Cancelled appointments release their active slot.
- Confirmation email sends only on the first transition into `confirmed`.
- Await Resend delivery before returning from Vercel requests. The email service already uses `asyncio.to_thread`, catches delivery failures, and logs them without crashing the API.
- Do not rely on in-memory state or long-running background tasks in Vercel serverless functions.

## Frontend and Design Rules

Preserve the editorial visual system:

- Cormorant Garamond for headings
- Outfit for body text
- JetBrains Mono for labels and time metadata
- Background `#F7F7F5`
- Text `#0D0D0C`
- Rust accent `#A63D22`
- Divider `#D9D9D6`
- Square corners, no card shadows, no neon or purple gradients

Keep interactive elements accessible and retain `data-testid` attributes. Maintain responsive desktop navigation and the mobile hamburger menu.

Use `/images/rose-profile.jpg` for Rose's About portrait and `/images/home-page.jpg` for the homepage hero unless the owner requests replacements.

## Git Safety

- Do not commit `.env` files or generated dependency/build directories.
- Do not revert unrelated user changes in a dirty worktree.
- Keep commits scoped to the requested task.
- Run `git diff --check` before committing.
- Push completed production changes to `origin/master` only after verification.