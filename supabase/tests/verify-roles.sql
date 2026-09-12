-- ============================================================================
-- Did migration 0003 take effect?
--
-- PASS looks like:
--   role default            'reviewer'::user_role     ✔ pass
--   profiles read policies  read own + admin read all ✔ pass
--   no consumer roles left  0                         ✔ pass
--   admins                  1 (you)
-- ============================================================================

select 'role default' as check_name,
       coalesce(column_default, '(none)') as actual,
       case when column_default like '%reviewer%' then '✔ pass' else '✖ FAIL' end as verdict
  from information_schema.columns
 where table_schema = 'public' and table_name = 'profiles' and column_name = 'role'

union all

select 'profiles read policies',
       string_agg(policyname, ' + ' order by policyname),
       case
         when string_agg(policyname, ',') like '%admin read all%'
          and string_agg(policyname, ',') not like '%staff read all%' then '✔ pass'
         else '✖ FAIL — staff read all should be gone'
       end
  from pg_policies
 where schemaname = 'public' and tablename = 'profiles' and cmd = 'SELECT'

union all

select 'consumer roles remaining',
       count(*)::text,
       case when count(*) = 0 then '✔ pass' else '✖ FAIL' end
  from public.profiles where role = 'consumer'

union all

select 'role breakdown',
       coalesce(string_agg(role || ' × ' || n, ', '), 'no profiles'),
       '—'
  from (select role::text as role, count(*)::text as n from public.profiles group by role) t;
