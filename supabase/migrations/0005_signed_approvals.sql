-- ============================================================================
-- LACTIVAE™ Rx Web — schema v5: signed, tamper-evident approvals
--
-- Removes the terminal from the promotion path while keeping an approval
-- record that cannot be altered without leaving evidence. Modelled on the
-- 21 CFR Part 11 electronic signature properties:
--
--   unique signer      → signer is auth.uid(), never client-supplied
--   signature meaning  → `meaning` is stored with every record
--   bound to a record  → content_hash is computed in the database from the
--                        proposal itself, so a signature cannot be moved
--   tamper-evident     → each row carries the hash of the previous row, so
--                        altering any past entry breaks every later one
--   presence of signer → the insert policy requires an MFA-verified session
--                        (aal2), enforced by Postgres, not by the app
--
-- Run after 0004.
-- ============================================================================

-- ------------------------------------------------------- approval signatures
create table public.approval_signatures (
  seq          bigint generated always as identity primary key,
  proposal_id  uuid        not null references public.proposals (id),
  object_kind  public.governed_kind not null,
  object_id    text        not null,
  version      integer     not null,
  content_hash text        not null,     -- set by trigger, from the proposal
  prev_hash    text,                     -- set by trigger; null for the first row
  record_hash  text        not null,     -- set by trigger
  signer       uuid        not null references auth.users (id),
  signer_email text        not null,
  meaning      text        not null default 'Approved for publication',
  aal          text        not null,     -- assurance level of the signing session
  factor_type  text,                     -- totp | webauthn | phone
  signed_at    timestamptz not null default now()
);
create index approval_signatures_object_idx on public.approval_signatures (object_kind, object_id);
alter table public.approval_signatures enable row level security;

-- The chain, and the binding to content, are computed server-side. Nothing a
-- client sends can influence them.
create or replace function public.sign_approval()
returns trigger
language plpgsql
as $$
declare
  payload text;
  previous text;
begin
  select p.proposed_text || '|' || p.proposed_refs::text || '|' || p.proposed_safety::text
    into payload
    from public.proposals p
   where p.id = new.proposal_id;
  if payload is null then
    raise exception 'proposal % not found', new.proposal_id;
  end if;

  new.content_hash := encode(sha256(convert_to(payload, 'utf8')), 'hex');
  select record_hash into previous from public.approval_signatures order by seq desc limit 1;
  new.prev_hash := previous;
  new.signed_at := coalesce(new.signed_at, now());
  new.record_hash := encode(sha256(convert_to(
      coalesce(new.prev_hash, '') || '|' ||
      new.proposal_id::text       || '|' ||
      new.object_kind::text       || '|' ||
      new.object_id               || '|' ||
      new.version::text           || '|' ||
      new.content_hash            || '|' ||
      new.signer::text            || '|' ||
      new.meaning                 || '|' ||
      new.signed_at::text, 'utf8')), 'hex');
  return new;
end
$$;

create trigger approval_signatures_sign
  before insert on public.approval_signatures
  for each row execute function public.sign_approval();

-- Reviewers and admins may read the log; nobody may change it.
create policy "approvals: staff read"
  on public.approval_signatures for select
  using (public.current_user_role() in ('reviewer', 'admin'));

-- The MFA requirement lives here, in the database.
create policy "approvals: admin with mfa may sign"
  on public.approval_signatures for insert
  with check (
    public.current_user_role() = 'admin'
    and signer = auth.uid()
    and coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
  );

-- No update or delete policy exists, so the log is append-only even for admins.

-- --------------------------------------------------------- published content
-- The live wording of any claim that has been changed since the baseline in
-- src/data/governed. Public, because this is published site content.
create table public.published_claims (
  object_id    text primary key,
  version      integer     not null,
  text         text        not null,
  refs         jsonb       not null default '[]'::jsonb,
  safety       jsonb       not null default '[]'::jsonb,
  approval_seq bigint      not null references public.approval_signatures (seq),
  published_at timestamptz not null default now()
);
alter table public.published_claims enable row level security;

create policy "published: world readable"
  on public.published_claims for select
  using (true);

create policy "published: admin with mfa may publish"
  on public.published_claims for all
  using (public.current_user_role() = 'admin')
  with check (
    public.current_user_role() = 'admin'
    and coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
  );

-- ------------------------------------------------------------------- grants
grant select, insert on public.approval_signatures to authenticated;
grant select         on public.published_claims    to anon, authenticated;
grant insert, update on public.published_claims    to authenticated;
-- deliberately no update/delete on approval_signatures for anyone

-- --------------------------------------------------------- chain verification
-- Recomputes every record hash in order and reports the first break.
-- Returns no rows when the chain is intact.
create or replace function public.verify_approval_chain()
returns table (seq bigint, object_id text, problem text)
language plpgsql stable security definer
set search_path = public
as $$
declare
  r        record;
  expected text;
  previous text := null;
begin
  for r in select * from public.approval_signatures order by seq loop
    if coalesce(r.prev_hash, '') is distinct from coalesce(previous, '') then
      seq := r.seq; object_id := r.object_id;
      problem := 'prev_hash does not match the preceding record';
      return next;
    end if;
    expected := encode(sha256(convert_to(
        coalesce(r.prev_hash, '') || '|' || r.proposal_id::text || '|' || r.object_kind::text || '|' ||
        r.object_id || '|' || r.version::text || '|' || r.content_hash || '|' ||
        r.signer::text || '|' || r.meaning || '|' || r.signed_at::text, 'utf8')), 'hex');
    if expected is distinct from r.record_hash then
      seq := r.seq; object_id := r.object_id;
      problem := 'record_hash does not match its contents — this row was altered';
      return next;
    end if;
    previous := r.record_hash;
  end loop;
end
$$;
