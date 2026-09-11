-- ============================================================================
-- LACTIVAE™ Rx Web — schema v1
-- Run once in the Supabase SQL editor (or `supabase db push`).
--
-- After running, promote yourself:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- (The profile row is created automatically the first time you sign in.)
-- ============================================================================

-- ---------------------------------------------------------------- roles
create type public.user_role as enum ('consumer', 'hcp', 'reviewer', 'admin');

-- ------------------------------------------------------------- profiles
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  display_name text,
  zip_code     text,
  interest     text,
  user_type    text check (user_type in ('consumer', 'hcp')) default 'consumer',
  role         public.user_role not null default 'consumer',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Current user's role. SECURITY DEFINER so policies can call it without
-- recursing into profiles' own RLS.
create or replace function public.current_user_role()
returns public.user_role
language sql stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: staff read all"
  on public.profiles for select
  using (public.current_user_role() in ('reviewer', 'admin'));

create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Only an admin (or the dashboard / service role, where auth.uid() is null)
-- may change a role.
create or replace function public.protect_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and public.current_user_role() is distinct from 'admin' then
    raise exception 'role can only be changed by an admin';
  end if;
  return new;
end
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_role();

-- Create the profile row from sign-up metadata (register form → signInWithOtp data)
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, zip_code, interest, user_type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'zip_code',
    new.raw_user_meta_data ->> 'interest',
    coalesce(new.raw_user_meta_data ->> 'user_type', 'consumer')
  )
  on conflict (id) do nothing;
  return new;
end
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------- email preferences
create table public.email_preferences (
  user_id               uuid primary key references auth.users (id) on delete cascade,
  research_updates      boolean not null default true,
  educational_resources boolean not null default true,
  local_partnerships    boolean not null default true,
  community_news        boolean not null default true,
  updated_at            timestamptz not null default now()
);
alter table public.email_preferences enable row level security;

create policy "prefs: own"
  on public.email_preferences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------ proposals
-- A proposed version of a governed object (claim or safety statement).
-- Approved objects live in git (src/data/*.ts); proposals live here until
-- promoted. Used from milestone 3 onward.
create type public.governed_kind    as enum ('claim', 'safety');
create type public.proposal_status  as enum ('draft', 'staged', 'approved', 'rejected');

create table public.proposals (
  id               uuid primary key default gen_random_uuid(),
  object_kind      public.governed_kind not null,
  object_id        text not null,
  base_version     integer not null,
  proposed_text    text not null,
  proposed_refs    jsonb not null default '[]'::jsonb,
  proposed_safety  jsonb not null default '[]'::jsonb,
  rationale        text,
  ai_assisted      boolean not null default false,
  status           public.proposal_status not null default 'draft',
  author           uuid not null references auth.users (id),
  reviewed_by      uuid references auth.users (id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index proposals_object_idx on public.proposals (object_kind, object_id);
create index proposals_status_idx on public.proposals (status);
alter table public.proposals enable row level security;

create policy "proposals: staff read"
  on public.proposals for select
  using (public.current_user_role() in ('reviewer', 'admin'));

create policy "proposals: admin insert"
  on public.proposals for insert
  with check (public.current_user_role() = 'admin' and author = auth.uid());

create policy "proposals: admin update"
  on public.proposals for update
  using (public.current_user_role() = 'admin');

-- --------------------------------------------------------- audit events
create table public.audit_events (
  id           bigint generated always as identity primary key,
  actor        uuid references auth.users (id),
  action       text not null,                 -- 'proposal.created', 'proposal.staged', 'xray.opened', …
  object_kind  public.governed_kind,
  object_id    text,
  proposal_id  uuid references public.proposals (id),
  details      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index audit_events_object_idx on public.audit_events (object_kind, object_id);
alter table public.audit_events enable row level security;

create policy "audit: staff read"
  on public.audit_events for select
  using (public.current_user_role() in ('reviewer', 'admin'));

create policy "audit: staff insert"
  on public.audit_events for insert
  with check (public.current_user_role() in ('reviewer', 'admin') and actor = auth.uid());

-- ----------------------------------------------------------- updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

create trigger profiles_touch  before update on public.profiles  for each row execute function public.touch_updated_at();
create trigger proposals_touch before update on public.proposals for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------ API privileges
-- Explicit grants so this migration works whether or not the project has
-- "Automatically expose new tables" enabled. Row Level Security above is what
-- actually gates access; these grants only decide which tables the Data API
-- can see at all. `anon` gets nothing: every table here requires a session.
grant usage on schema public to anon, authenticated;

grant select, insert, update on public.profiles          to authenticated;
grant select, insert, update, delete on public.email_preferences to authenticated;
grant select, insert, update on public.proposals         to authenticated;
grant select, insert         on public.audit_events      to authenticated;
