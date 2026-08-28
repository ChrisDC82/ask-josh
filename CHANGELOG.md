# Changelog

## 2026-08-28 - AskJosh Phase D Property Maintenance Plan Tool

Added a read-only WebMCP planning tool.

- Registered `build_property_maintenance_plan` beside the existing discovery and details tools.
- Added exact validation for one to five catalogue service IDs, duplicate handling, and structured partial results for invalid IDs.
- Added deterministic service sequencing using transparent category rules.
- Added safe aggregation of strictly parsed public catalogue cost ranges with non-binding estimate warnings and explicit exclusions.
- Kept project summary and priority as display context without treating either as a property, safety, emergency, or availability fact.
- Added a developer demo chain and focused planner behavior, privacy, grounding, cost, and regression tests.

No booking, quote submission, contact transmission, storage, AI/API call, or other write action is included.

## 2026-08-28 - AskJosh Phase C Details Tool

Added a read-only WebMCP service-details tool.

- Registered `get_maintenance_service_details` alongside `find_maintenance_services`.
- Reused the existing public AskJosh catalogue and service IDs returned by discovery.
- Added exact service-ID lookup with safe blank and not-found responses.
- Returned structured public service details, indicative estimate language, and public contact actions with verification notes.
- Added tests for valid details lookup, unknown IDs, blank IDs, exact matching, public fields, estimate language, privacy boundaries, and search-to-details flow.

No planning tool, quote submission tool, write action, AI call, or external MCP server is included.

## 2026-08-28 - AskJosh Phase B Foundation

Added the initial read-only WebMCP foundation without changing normal website behavior.

- Registered one WebMCP site tool, `find_maintenance_services`, from the homepage.
- Reused the existing public provider catalogue and deterministic provider-search logic.
- Added structured tool results for grounded La Brea maintenance-service matches.
- Added safe handling for blank queries, unsupported locations, no matches, result limits, and maximum limit capping.
- Added isolated local typings for the experimental `document.modelContext` browser API.
- Documented WebMCP fallback behavior and manual discovery testing.
- Added focused tests for WebMCP tool behavior and public-field output.

WebMCP remains read-only in Phase B. Detailed service lookup, maintenance planning, quote submission, and consequential write tools are deferred.

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
