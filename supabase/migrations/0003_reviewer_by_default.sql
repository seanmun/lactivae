-- ============================================================================
-- LACTIVAE™ Rx Web — schema v3: anyone who signs in becomes a reviewer
--
-- This is a showcase. The regulatory graph IS the product, so a visitor who
-- signs in should be able to open X-ray, explode the board, inspect claims and
-- trace evidence. Those are read-only views of published research.
--
-- Writing stays admin-only: proposing, staging and approving changes are
-- governance actions, and an open write path would let anyone fill the change
-- log with noise.
--
-- Run after 0002.
-- ============================================================================

-- New sign-ups get reviewer instead of consumer.
alter table public.profiles alter column role set default 'reviewer';

-- Existing consumer accounts are lifted to reviewer. `user_type` (consumer/hcp)
-- is the marketing persona and is untouched; `role` is the access level.
update public.profiles set role = 'reviewer' where role = 'consumer';

-- ---------------------------------------------------------------- privacy
-- Reviewers previously inherited "staff read all", which would have exposed
-- every signed-up user's email address to anyone who logged in. Reading other
-- people's profiles is now admin-only. Everyone still reads their own row via
-- the "profiles: read own" policy.
drop policy if exists "profiles: staff read all" on public.profiles;

create policy "profiles: admin read all"
  on public.profiles for select
  using (public.current_user_role() = 'admin');
