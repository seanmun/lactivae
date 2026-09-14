-- ============================================================================
-- LACTIVAE™ Rx Web — schema v6: name the actor in the audit trail
--
-- audit_events recorded only the actor's uuid, so the console showed a raw id
-- where a person's name belongs.
--
-- The email is stored on the row rather than joined at read time, on purpose.
-- An audit trail should say who someone was when they acted. If it joined to
-- the live profile, changing an email address would silently rewrite history,
-- and reading it would depend on being allowed to see other people's profiles
-- — which reviewers deliberately are not.
--
-- Run after 0005.
-- ============================================================================

alter table public.audit_events add column if not exists actor_email text;

comment on column public.audit_events.actor_email is
  'The actor''s email as it was when the event happened. Never back-fill from the live profile.';

-- Fill in what can be recovered for rows written before this column existed.
update public.audit_events e
   set actor_email = u.email
  from auth.users u
 where e.actor = u.id
   and e.actor_email is null;

-- approval_signatures already carries signer_email for the same reason.
