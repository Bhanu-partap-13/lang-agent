# Duolingo Clone

A full-stack language learning application cloning core Duolingo functionality.

## Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS, pnpm
* **Backend:** Python, FastAPI, uv
* **Database & ORM:** PostgreSQL (Render), Drizzle ORM (Frontend), SQLAlchemy (Backend)
* **Authentication:** Better Auth (Google OAuth & Email/Password)

## Architecture Overview
The application uses a decoupled client-server architecture:
* **Frontend Application:** Handles the user interface, server-side rendering, direct database interactions via Drizzle ORM, and user authentication.
* **Backend API:** Built with FastAPI to handle complex background processes, analytics, or external integrations. 
* **Shared Database:** Both the Next.js application and FastAPI backend connect to the same centralized Render PostgreSQL database.

## Database Schema
The schema is divided into three core domains:
1. **Authentication:** `user`, `session`, `account`, `verification` (managed by Better Auth).
2. **Content:** `courses` (languages), `units` (sections), `skills` (nodes), `lessons` (modules), and `exercises` (questions/prompts).
3. **User Progress:** `user_profile`, `user_stats` (xp, streak, hearts), `daily_activity`, `user_skill_progress`, `lesson_attempts`, and `achievements`.

## Setup Instructions

### Prerequisites
* Node.js v20+ and pnpm
* Python 3.12+ and uv
* PostgreSQL database instance

### Frontend Setup
1. Navigate to the client directory: `cd client`
2. Install dependencies: `pnpm install`
3. Configure environment variables in `client/.env`:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
   BETTER_AUTH_SECRET="your_secret_key"
   BETTER_AUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID="your_google_id"
   GOOGLE_CLIENT_SECRET="your_google_secret"
   ```
4. Push the database schema: `npx drizzle-kit push --force`
5. Seed initial data: `node scripts/seed.mjs`
6. Start development server: `pnpm dev`

### Backend Setup
1. Navigate to the server directory: `cd server`
2. Sync Python environment: `uv sync`
3. Configure environment variables in `server/.env`:
   ```
   DATABASE_URL="postgresql+psycopg2://<user>:<password>@<host>/<db>?sslmode=require"
   FRONTEND_URL=http://localhost:3000
   ```
4. Start FastAPI server: `uv run fastapi dev app/main.py`

## Assumptions Made
* The frontend and backend run on separate ports (3000 and 8000 respectively).
* The database schema expects a standard PostgreSQL environment without strict external firewall rules.
* User progression implies sequential completion of lessons to unlock subsequent skills.
* Hearts and XP regeneration logic relies on server-side validations and timestamps.
