# Wale Kindergarten - Lovable source snapshot

Source project: https://lovable.dev/projects/e6106ab5-b5a1-4898-9d53-07f8c47eafc2

This is a separate branch in an existing GitHub repository. The original main branch remains untouched. This is a SOURCE CODE snapshot, not a transfer of the Supabase database or student information.

## Excluded
- .env (environment values), .lovable/project.json (builder metadata), AGENTS.md (internal agent instructions)
- Original binary public/favicon.ico and src/assets/hero-school.jpg (not faithfully readable via text export); these are replaced by placeholder SVG assets. **Restore original school images before production.**

## Required environment variables (configure privately)
- SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY
- VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY only as a server-side secret, never in a browser bundle or GitHub.

## Current deployment state
The source uses TanStack Start and Lovable-specific Vite configuration. This branch is not yet a validated Cloudflare Workers build and it has not been deployed. Cloudflare migration requires adapting and testing the server build, runtime environment, authentication, admin access control, admission form and file uploads before use.

Do not merge this branch into main until functionality and credential handling have been reviewed.
