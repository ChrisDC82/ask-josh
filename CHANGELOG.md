# Changelog

## 2026-08-28 - AskJosh Phase A

Completed Phase A stabilization and stakeholder polish for the canonical AskJosh application.

- Secured admin request access behind server-side signed admin sessions.
- Replaced unauthenticated service-role request access with authenticated admin-only access.
- Reworked public quote/request flow into a truthful user-reviewed email draft.
- Replaced fake AI chat behavior with catalogue-grounded maintenance guidance.
- Improved homepage presentation for stakeholder review.
- Improved deterministic maintenance search with reusable provider-search foundations.
- Fixed mobile, accessibility, modal, image, and dark-mode presentation issues.
- Added project working guidance in `AGENTS.md`.
- Updated documentation for current functionality, environment needs, and no paid AI requirement.
- Added focused tests and verified tests, ESLint, TypeScript, production build, and diff hygiene.

Deferred items:

- Verify provider phone number.
- Verify provider email.
- Confirm permission to display provider and business information.
- Confirm La Brea service coverage.
- Approve indicative price ranges.
- Approve service descriptions.
- Resolve or archive the stale outer Git repository later.
- Implement WebMCP only in a later Phase B/C after approval.
