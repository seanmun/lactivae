-- ============================================================================
-- LACTIVAE™ Rx Web — Row Level Security smoke test
--
-- Paste the whole file into the Supabase SQL editor and run it.
-- Everything happens inside a transaction that rolls back, so nothing is saved.
--
-- Expected results:
--   admin reads proposals      → 0 rows, no error   (read policy admits you)
--   admin can insert           → returns rls-smoke-test (write policy admits admins)
--   stranger reads proposals   → 0                  (signed-in non-reviewer sees nothing)
--   stranger reads profiles    → 0                  (users cannot enumerate other users)
--   stranger insert            → NOTICE "OK: refused" (writes are admin-only)
--
-- Any stranger count above 0 is a policy bug.
-- ============================================================================

begin;

-- Who exists, and what role do they hold?
select id, email, role from public.profiles order by created_at;

-- ---------------------------------------------------------- 1. as YOU (admin)
select set_config('request.jwt.claims',
  json_build_object('sub',  (select id::text from public.profiles where role = 'admin' limit 1),
                    'role', 'authenticated')::text, true);
set local role authenticated;

select 'admin reads proposals' as test, count(*) as visible_rows from public.proposals;

insert into public.proposals (object_kind, object_id, base_version, proposed_text, author)
values ('claim', 'rls-smoke-test', 1, 'temporary row, rolled back',
        (select id from public.profiles where role = 'admin' limit 1))
returning 'admin can insert' as test, object_id;

-- ------------------------------------- 2. as a stranger: session, no profile
select set_config('request.jwt.claims',
  json_build_object('sub',  '00000000-0000-0000-0000-000000000000',
                    'role', 'authenticated')::text, true);

select 'stranger reads proposals' as test, count(*) as visible_rows from public.proposals;
select 'stranger reads profiles'  as test, count(*) as visible_rows from public.profiles;

-- The stranger's insert must be refused. Captured so the transaction survives
-- and the remaining checks still run.
do $$
begin
  insert into public.proposals (object_kind, object_id, base_version, proposed_text, author)
  values ('claim', 'should-fail', 1, 'x', '00000000-0000-0000-0000-000000000000');
  raise notice 'PROBLEM: stranger insert SUCCEEDED';
exception when others then
  raise notice 'OK: stranger insert refused (%)', sqlerrm;
end $$;

reset role;
rollback;
