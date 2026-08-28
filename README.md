# AskJosh

AskJosh is a focused maintenance-service concierge for La Brea, Trinidad and Tobago. The current application helps a user match a property need to services listed for Laughlin Maintenance Services, review indicative cost ranges, and choose a direct contact option.

This is not yet a multi-provider marketplace. Availability, provider contact details, and final prices must be confirmed directly.

## Current functionality

- Catalogue-backed maintenance-service search
- Eight maintenance categories for the current La Brea service area
- Direct phone and email contact options
- A user-reviewed quote email draft; AskJosh does not send or store the draft
- A clearly labelled catalogue service guide with no paid AI calls
- A protected admin request viewer for historical Supabase request records

Public request insertion is intentionally disabled in Phase A. The existing request schema cannot store a useful contactable request cleanly, and the application must not claim receipt when nothing was stored.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

## Environment configuration

Environment files are ignored by Git. Never commit real values.

The public catalogue and search do not require environment variables. Historical admin request access requires:

- `ADMIN_PASSWORD` — shared Phase A administrator password
- `ADMIN_SESSION_SECRET` — a random secret of at least 32 characters used to sign HttpOnly sessions
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — server-only key used only after admin-session validation

`SUPABASE_SERVICE_ROLE_KEY` must never be exposed through client code or an unauthenticated endpoint.

The OpenAI and Hugging Face packages are not used by the Phase A application. No AI API key is required.

## Architecture

- Next.js App Router and TypeScript
- Static public provider catalogue in `src/data/providers.ts`
- Reusable deterministic matching in `src/lib/providerSearch.ts`
- Signed admin sessions in `src/lib/adminSession.ts`
- Vercel deployment configuration linked locally through `.vercel/`

## Repository note

The canonical application checkout is currently `C:\ask-josh\ask-josh`. The parent `C:\ask-josh` repository contains a stale gitlink and must not be restructured or deleted without a separate verified cleanup procedure.
