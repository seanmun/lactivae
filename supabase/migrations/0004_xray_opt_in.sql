-- ============================================================================
-- LACTIVAE™ Rx Web — schema v4: X-ray becomes an opt-in
--
-- 0003 gave X-ray to everyone who signed in. In practice most people signing
-- up want the newsletter, not a regulatory-graph inspector, so X-ray is now a
-- preference the visitor chooses: at registration, or later from /account.
--
--   consumer  → public site only (the default)
--   reviewer  → X-ray, the exploded board, inspect, trace, read change sets
--   admin     → all of the above plus propose / stage / approve
--
-- Run after 0003.
-- ============================================================================

-- Back to consumer by default; the toggle is what grants reviewer.
alter table public.profiles alter column role set default 'consumer';

-- ------------------------------------------------------- self-service opt-in
-- Visitors may move themselves between consumer and reviewer, and nothing
-- else. Admins may still set any role. The dashboard and service role
-- (auth.uid() is null) are unaffected.
create or replace function public.protect_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    -- admins may set any role
    if public.current_user_role() = 'admin' then
      return new;
    end if;
    -- everyone else may only opt themselves in or out of X-ray
    if auth.uid() = new.id
       and old.role in ('consumer', 'reviewer')
       and new.role in ('consumer', 'reviewer') then
      return new;
    end if;
    raise exception 'role can only be changed by an admin';
  end if;
  return new;
end
$$;

-- --------------------------------------------------- honour the sign-up choice
-- The register form passes xray_opt_in in the sign-up metadata; the profile
-- trigger reads it so the choice applies from the very first session.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, zip_code, interest, user_type, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'zip_code',
    new.raw_user_meta_data ->> 'interest',
    coalesce(new.raw_user_meta_data ->> 'user_type', 'consumer'),
    case when coalesce(new.raw_user_meta_data ->> 'xray_opt_in', 'false') = 'true'
         then 'reviewer'::public.user_role
         else 'consumer'::public.user_role
    end
  )
  on conflict (id) do nothing;
  return new;
end
$$;
