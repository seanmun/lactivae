# LACTIVAE™ — Supabase, Resend and Vercel setup

The runbook for standing this project up from scratch, and the reference for
what is already configured. Steps marked **done** are live on the current
project; they are recorded so the setup can be reproduced.

---

## 1. Supabase project — done

Project settings when creating:

| Setting | Value | Why |
|---|---|---|
| Enable Data API | **on** | `supabase-js` talks to PostgREST |
| Automatically expose new tables | **off** | Migrations grant explicitly, so exposure is reviewable |
| Enable automatic RLS | **on** | Safety net: any table added later cannot ship wide open |

### Migrations

Run in order in the SQL editor:

1. `supabase/migrations/0001_rx_web.sql` — profiles with roles, proposals,
   audit events, email preferences, RLS policies, triggers, and explicit
   Data API grants
2. `supabase/migrations/0002_new_claim_proposals.sql` — columns for the
   create-claims workflow
3. `supabase/migrations/0003_reviewer_by_default.sql` — new sign-ups become
   reviewers; reading other people's profiles becomes admin-only

### Verify

| File | Checks |
|---|---|
| `supabase/tests/rls-smoke-test.sql` | Eight row-level security assertions; all must pass |
| `supabase/tests/verify-roles.sql` | Migration 0003 took effect |
| `supabase/tests/verify-proposal-roundtrip.sql` | A proposal saved in the browser reached Postgres |

---

## 2. Roles

| Role | Who | Can do |
|---|---|---|
| `admin` | set by hand in SQL | Propose, stage, approve, promote |
| `reviewer` | **anyone who signs in** | X-ray, exploded board, inspect, trace, read change sets |
| `anon` | not signed in | Public site only; no table access at all |

Promote someone:

```sql
update public.profiles set role = 'admin' where email = 'them@example.com';
```

`user_type` (consumer / hcp) is the marketing persona from the register form
and is unrelated to `role`, which is the access level.

---

## 3. Email — Resend as custom SMTP

Supabase's built-in sender allows only a handful of messages per hour and has
poor deliverability. Because any signed-in visitor becomes a reviewer, magic
links must actually arrive.

### 3a. Domain — done

`lactivae.com` is verified in Resend. Three records live at GoDaddy:

| Record | Host | Purpose |
|---|---|---|
| TXT | `send.lactivae.com` | SPF, chains to `amazonses.com` |
| MX | `send.lactivae.com` | Bounce handling |
| TXT | `resend._domainkey.lactivae.com` | DKIM |

DKIM sits on the apex, so mail sends from `noreply@lactivae.com`. The
`send.` subdomain is only the return path and is never shown to recipients.
DMARC already exists from GoDaddy at `p=quarantine` with relaxed alignment,
which this setup satisfies.

Leave GoDaddy's `_domainconnect` CNAME in place. It is a discovery record for
one-click DNS setup, grants nobody access, and removing it only creates manual
work later.

### 3b. Resend API key

Resend → **API Keys** → **Create API Key**, sending permission. Copy it once.

### 3c. Supabase SMTP

**Authentication → Emails → SMTP Settings** → enable custom SMTP:

| Field | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | the Resend API key |
| Sender email | `noreply@lactivae.com` |
| Sender name | `LACTIVAE` |

The sender address must be on the verified domain or Resend rejects the send.

### 3d. Rate limit

**Authentication → Rate Limits** → raise **Emails per hour** (100 is ample).
Custom SMTP does not lift this on its own, and it is the setting that actually
throttles a demo.

---

## 4. Auth URLs

**Authentication → URL Configuration**

- Site URL: `https://www.lactivae.com`
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://www.lactivae.com/auth/callback`
  - `https://lactivae.com/auth/callback`
  - `https://lactivae.vercel.app/auth/callback`

All four. The apex redirects to www, but a link generated against the bare
domain still has to be on the allowlist or sign-in dead-ends.

---

## 5. Environment variables

`.env.local` for development:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# optional: AI drafting, verification and claim suggestions
ANTHROPIC_API_KEY=sk-ant-...
```

The anon key is public by design; it ships in the browser bundle and RLS is
what protects data. The `service_role` key is not used anywhere in this app
and should never be added.

`NEXT_PUBLIC_XRAY_DEV_BYPASS=true` grants a local admin session without
Supabase. Useful before auth exists; remove it once auth is configured or it
will mask problems with the real flow. It has no effect in production builds.

Vercel production has the same three variables with
`NEXT_PUBLIC_APP_URL=https://www.lactivae.com`. Environment changes do not
trigger a rebuild; push a commit or redeploy.

---

## 6. Smoke test

1. `npm run dev`
2. Sign in at `/auth/signin`; the link should arrive from `noreply@lactivae.com`
   within seconds
3. The first sign-in creates a profile with role `reviewer`
4. Promote yourself with the SQL in section 2, then hard-refresh
5. The X-ray pill appears bottom-left; `/admin` opens
6. Save a draft at `/admin/claims/hero-asthma-42/propose`, then run
   `supabase/tests/verify-proposal-roundtrip.sql`
