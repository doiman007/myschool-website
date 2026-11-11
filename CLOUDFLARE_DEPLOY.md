# Cloudflare Workers deployment — Wale Kindergarten

## Current status
This branch is a migration candidate. **NOT YET DEPLOYED**. The Lovable original and Supabase data remain unchanged. The complete admin panel is not yet available. GitHub Actions is gated: builds on branch pushes; deploys only if `ENABLE_CLOUDFLARE_DEPLOY=true` and the required permissions are configured. No student data should be inserted until end-to-end security testing passes.

## Source
- Repository: `doiman007/myschool-website`
- Branch: `lovable-wale-kindergarten-2026` (**do not deploy `main`**)
- Target account ID: `5219b7b043312efd154a1b4477d99268`
- Expected Worker name: `wale-kindergarten` and domain `wale-kindergarten.doiman007.workers.dev` **only after successful deploy**.
- Supabase project remains the existing project. No database migration.
- This is a text-source export. Original hero JPEG and favicon ICO were unavailable through the export reader and have SVG placeholders; restore original assets when possible.

## Required GitHub variables and secrets
Open repository > Settings > Secrets and variables > Actions, or use environment `cloudflare-school` if appropriate.

**Repository variables** (or environment variables in environment `cloudflare-school`):
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID (not confidential)
- `SUPABASE_URL`: the existing Supabase project HTTPS URL
- `SUPABASE_PUBLISHABLE_KEY`: the existing *publishable* key, never the service role key
- `ENABLE_CLOUDFLARE_DEPLOY`: leave **unset** while validating; set to `true` only when ready

**Actions secret**:
- `CLOUDFLARE_API_TOKEN`: narrowly scoped Cloudflare token with permission to deploy Workers for the relevant account. Never paste it into a Git file or chat. A rejected Cloudflare connection must be reauthorized by its owner.

**Server-side Supabase secret**:
- If server-only features require `SUPABASE_SERVICE_ROLE_KEY`, provision this as a **Cloudflare Worker secret** through the Cloudflare dashboard. Never set it as a `VITE_*` variable. Avoid deploying privileged server functions until their authorization and runtime availability have been verified.
- Worker runtime environment may require separate bindings; `process.env` behavior and node compatibility must be tested.

## Build and deployment
1. Review code and preserve the original Lovable version as backup.
2. Configure variables (above) in GitHub.
3. Open Actions > **Wale Kindergarten - Cloudflare Workers** > Run workflow, selecting the kindergarten branch.
4. Verify the `Build Cloudflare Worker` step passes. A passing build does *not* guarantee the app works.
5. Validate server-side Supabase authentication, session refresh, CSRF protection, permissions, public and admin pages, student admissions/status, uploads and failures on a staging URL.
6. Only after permissions and a successful smoke test, set `ENABLE_CLOUDFLARE_DEPLOY=true` and rerun workflow. This step will deploy using `wrangler deploy`.
7. Confirm actual Cloudflare deployment URL and configure Supabase Auth URL allow-list for the new exact origin as necessary. Confirm CORS, cookies, SSR routes and any server functions.
8. Keep the original Lovable project and database running until verified. Never delete it as a deployment step.

## Important limitations
- Lovable-specific `vite.config.ts` remains untouched. Cloudflare build uses `vite.cloudflare.config.ts`, which is **unverified** against the exact locked versions.
- GitHub workflows may fail if repository/organization Actions permissions or vars are missing.
- The existing app uses TanStack Start and Lovable-generated Supabase integration; non-Lovable runtime is not verified. Verify Cloudflare dependencies, build output, secret binding and SSR compatibility.
- GitHub source does not include private student records, passwords, tokens or database contents.
- No production use until backend privileges and admissions are checked. The admin area may be incomplete.

Reference: https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/
