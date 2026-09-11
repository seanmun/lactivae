-- ============================================================================
-- LACTIVAE™ Rx Web — schema v2: proposals for NEW claims
--
-- The "create claims" workflow proposes claims that do not exist yet. They
-- share the proposals table; `is_new` marks them, `base_version` is 0, and
-- `proposed_type` / `proposed_label` carry the fields a new registry object
-- needs. Promotion appends the object to src/data/governed/suggested.ts.
-- ============================================================================

alter table public.proposals
  add column if not exists is_new         boolean not null default false,
  add column if not exists proposed_type  text,
  add column if not exists proposed_label text,
  add column if not exists source_ref     text;   -- reference key the suggestion came from

comment on column public.proposals.is_new is 'true when object_id does not yet exist in the registry';
