# AskJosh working rules

- Verify `C:\ask-josh\ask-josh` is the canonical AskJosh repository before editing. Do not work in alternate or stale copies.
- Use free-tier or existing services by default. Never enable, upgrade, or commit to a paid service without explicit approval.
- Preserve working functionality unless removal is explicitly required, and prefer small targeted fixes over broad rewrites.
- Inspect relevant files before editing and never expose environment secrets.
- Keep public provider data separate from private request and admin data.
- Never expose Supabase service-role functionality through unauthenticated public endpoints.
- WebMCP tools may expose only explicitly public data unless otherwise approved. Consequential actions require clear user review and confirmation.
- Do not represent prototype or mock functionality as operational functionality.
- Run lint, TypeScript, and production-build checks after meaningful changes.
- Report every changed file and maintain `CHANGELOG.md` once it exists.
- Do not commit, push, deploy, or restructure repositories unless explicitly instructed.
