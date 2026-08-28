# Releases

## AskJosh — Phase C: Service Details WebMCP Tool

Status: completed

Purpose: add grounded exact service lookup to the read-only AskJosh WebMCP workflow.

Major verified improvements:

- Implemented `get_maintenance_service_details` as a read-only WebMCP site tool.
- Grounded every lookup in an exact stable service ID from the current public AskJosh catalogue.
- Integrated the tool with service IDs returned by `find_maintenance_services`.
- Returned structured public catalogue details while preserving contact-verification warnings.
- Verified the localhost WebMCP search-to-details flow.
- Added focused behavior, privacy, and workflow tests; 25/25 tests passed.

Notes:

- No consequential or write WebMCP actions were added.
- No AI model/API calls were added.
- Post-deployment WebMCP verification is still required.

## AskJosh — Phase B: WebMCP Foundation

Status: completed

Purpose: establish a correct, maintainable WebMCP foundation before expanding the AskJosh tool surface.

Major verified improvements:

- Implemented `find_maintenance_services` as a read-only WebMCP site tool.
- Returned deterministic, catalogue-grounded service matches from the current public AskJosh data.
- Preserved the existing normal-browser homepage and service-search experience.
- Added graceful fallback for unsupported browsers with no visible failure state.
- Verified localhost WebMCP discovery and tool calls.
- Added focused WebMCP behavior tests; 17/17 tests passed.

Notes:

- No AI model/API calls were added.
- No consequential or write WebMCP actions were added.
- Production deployment verification is still required after deployment.

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
