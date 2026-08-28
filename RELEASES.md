# Releases

## AskJosh — Phase A: Stabilization & Stakeholder Polish

Status: completed

Purpose: prepare the existing AskJosh application for a truthful stakeholder presentation before any WebMCP implementation begins.

Major verified improvements:

- Admin request access is protected by a server-side signed session cookie.
- Supabase service-role request reads and deletes require a valid admin session.
- Public quote requests now create a user-reviewed email draft instead of claiming an unsent or unstored submission.
- Chat is clearly labelled as catalogue-based guidance and no longer presents fake AI behavior.
- Homepage, search, mobile, modal, accessibility, image handling, and stakeholder-facing copy were polished.
- Provider matching is centralized in a reusable deterministic search module.
- Documentation now records the canonical repository, current functionality, environment needs, and working rules.

Validation results:

- Tests passed.
- ESLint passed.
- TypeScript passed.
- Production build passed.
- `git diff --check` passed.
- Browser QA covered desktop, mobile, modal search, catalogue chat, and quote-draft behavior.

Notes:

- WebMCP is not implemented in this checkpoint.
- Provider contact, provider permission, service coverage, service descriptions, and pricing information still require owner verification.
- Cleanup of the stale outer `C:\ask-josh` Git repository remains deferred.
