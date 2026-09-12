-- ============================================================================
-- LACTIVAE™ Rx Web — Row Level Security smoke test
--
-- Paste the whole file into the Supabase SQL editor and run it. Everything
-- happens inside a transaction that rolls back, so nothing is saved.
--
-- Every check reports into one result table, because the SQL editor only
-- displays the final statement's output.
--
-- PASS looks like this:
--   0  admin profile exists        one uuid           <your uuid>
--   1  admin reads proposals       no error           n rows
--   2  admin can insert            inserted           inserted
--   3  stranger reads proposals    0 rows             0 rows
--   4  stranger reads profiles     0 rows             0 rows
--   5  stranger insert refused     refused            REFUSED: ...
--   6  stranger reads audit        0 rows             0 rows
--   7  anon reads profiles         refused or 0 rows  ...
--
-- Anything in the "actual" column that disagrees with "expected" is a bug.
-- ============================================================================

begin;

create temp table rls_results (ord int, check_name text, expected text, actual text) on commit drop;

do $$
declare
  admin_id uuid;
  stranger uuid := '00000000-0000-0000-0000-000000000000';
  n        int;
  outcome  text;
begin
  select id into admin_id from public.profiles where role = 'admin' limit 1;
  insert into rls_results
    values (0, 'admin profile exists', 'one uuid',
            coalesce(admin_id::text, 'NONE — run the promote UPDATE first'));
  if admin_id is null then return; end if;

  -- ------------------------------------------------------------- as admin
  perform set_config('request.jwt.claims',
    json_build_object('sub', admin_id::text, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  select count(*) into n from public.proposals;
  execute 'reset role';
  insert into rls_results values (1, 'admin reads proposals', 'no error', n || ' rows');

  execute 'set local role authenticated';
  begin
    insert into public.proposals (object_kind, object_id, base_version, proposed_text, author)
    values ('claim', 'rls-smoke-test', 1, 'temporary row, rolled back', admin_id);
    outcome := 'inserted';
  exception when others then
    outcome := 'REFUSED: ' || sqlerrm;
  end;
  execute 'reset role';
  insert into rls_results values (2, 'admin can insert', 'inserted', outcome);

  -- ------------------------------------ as a stranger: session, no profile
  perform set_config('request.jwt.claims',
    json_build_object('sub', stranger::text, 'role', 'authenticated')::text, true);

  execute 'set local role authenticated';
  select count(*) into n from public.proposals;
  execute 'reset role';
  insert into rls_results values (3, 'stranger reads proposals', '0 rows', n || ' rows');

  execute 'set local role authenticated';
  select count(*) into n from public.profiles;
  execute 'reset role';
  insert into rls_results values (4, 'stranger reads profiles', '0 rows', n || ' rows');

  execute 'set local role authenticated';
  begin
    insert into public.proposals (object_kind, object_id, base_version, proposed_text, author)
    values ('claim', 'should-fail', 1, 'x', stranger);
    outcome := 'PROBLEM: insert SUCCEEDED';
  exception when others then
    outcome := 'REFUSED: ' || sqlerrm;
  end;
  execute 'reset role';
  insert into rls_results values (5, 'stranger insert refused', 'refused', outcome);

  execute 'set local role authenticated';
  select count(*) into n from public.audit_events;
  execute 'reset role';
  insert into rls_results values (6, 'stranger reads audit', '0 rows', n || ' rows');

  -- ------------------------------------------- as anon: no session at all
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  execute 'set local role anon';
  begin
    select count(*) into n from public.profiles;
    outcome := n || ' rows';
  exception when others then
    outcome := 'REFUSED: ' || sqlerrm;
  end;
  execute 'reset role';
  insert into rls_results values (7, 'anon reads profiles', 'refused or 0 rows', outcome);
end $$;

select ord,
       check_name,
       expected,
       actual,
       case
         when ord = 0 then case when actual like 'NONE%' then '✖ FAIL' else '✔ pass' end
         when ord = 1 then case when actual like '%rows'      then '✔ pass' else '✖ FAIL' end
         when ord = 2 then case when actual = 'inserted'      then '✔ pass' else '✖ FAIL' end
         when ord in (3, 4, 6) then case when actual = '0 rows' then '✔ pass' else '✖ FAIL' end
         when ord = 5 then case when actual like 'REFUSED%'   then '✔ pass' else '✖ FAIL' end
         when ord = 7 then case when actual like 'REFUSED%' or actual = '0 rows' then '✔ pass' else '✖ FAIL' end
       end as verdict
  from rls_results
 order by ord;

rollback;
