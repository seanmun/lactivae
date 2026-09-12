-- ============================================================================
-- Did a proposal saved in the browser actually reach Postgres?
--
-- Run this AFTER saving a draft at /admin/claims/<id>/propose.
-- A row here with your email as author proves the whole path: browser session
-- → Supabase auth → RLS insert policy → proposals table, plus the audit entry
-- the app writes alongside it.
-- ============================================================================

select p.created_at,
       p.object_id,
       p.status,
       p.base_version,
       p.is_new,
       p.ai_assisted,
       u.email as author,
       p.proposed_text,
       p.rationale
  from public.proposals p
  join auth.users u on u.id = p.author
 order by p.created_at desc
 limit 5;
