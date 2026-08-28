# Vercel environment setup

AskJosh is linked locally to the Vercel project named `ask-josh`. This document lists variable names only; never place secret values in documentation or Git.

## Public site

The Phase A homepage, service catalogue, search, service guide, and user-reviewed email draft require no API keys.

## Protected historical-request admin

Configure these variables only if the admin request viewer must be used:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` — random value with at least 32 characters
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The service-role key is server-only. The admin API validates a signed HttpOnly session before creating a Supabase client or reading/deleting request records.

After changing Vercel environment variables, a new deployment is required for those values to be available. Deployment is outside the scope of Phase A unless explicitly approved.

## AI services

No OpenAI or Hugging Face API key is required. Phase A does not make paid AI calls.
