-- Création du système de fidélité avancé
-- Tables: loyalty_rules, loyalty_transactions
-- Fonctions: award_loyalty_points

-- 1) Table des règles de fidélité
create table if not exists public.loyalty_rules (
  id uuid primary key default gen_random_uuid(),
  action text unique not null,
  points integer not null default 0,
  daily_limit integer not null default 0, -- 0 = illimité
  per_object boolean not null default true, -- si true, on limite par objet/jour
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Règles par défaut
insert into public.loyalty_rules (action, points, daily_limit, per_object)
values
  ('like_product', 1, 200, true),
  ('comment_product', 3, 100, true),
  ('share_product', 5, 50, true),
  ('follow_user', 2, 50, true),
  ('create_product', 20, 20, false)
on conflict (action) do nothing;

-- 2) Table des transactions de fidélité
create table if not exists public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null references public.loyalty_rules(action) on delete restrict,
  object_id uuid null, -- ex: product_id ou user_id suivi
  points integer not null,
  tx_day date not null default (now()::date),
  created_at timestamptz not null default now()
);

-- Unicité par jour selon configuration: on impose au moins l'unicité par (user, action, object, jour)
create unique index if not exists loyalty_tx_user_action_object_day_idx
  on public.loyalty_transactions (user_id, action, coalesce(object_id::text, ''), tx_day);

-- 3) Maintien d'un solde dans users.loyalty_points (si la colonne existe déjà, on ne la recrée pas)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'loyalty_points'
  ) then
    alter table public.users add column loyalty_points integer not null default 0;
  end if;
end$$;

-- 4) Trigger pour mettre à jour le solde utilisateur
create or replace function public.loyalty_apply_balance()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.users set loyalty_points = coalesce(loyalty_points, 0) + NEW.points where id = NEW.user_id;
  elsif TG_OP = 'DELETE' then
    update public.users set loyalty_points = coalesce(loyalty_points, 0) - OLD.points where id = OLD.user_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists loyalty_apply_balance_trigger on public.loyalty_transactions;
create trigger loyalty_apply_balance_trigger
after insert or delete on public.loyalty_transactions
for each row execute function public.loyalty_apply_balance();

-- 5) RPC: award_loyalty_points
create or replace function public.award_loyalty_points(
  p_user_id uuid,
  p_action text,
  p_object_id uuid default null
) returns integer
language plpgsql
security definer
as $$
declare
  v_points integer;
  v_daily_limit integer;
  v_per_object boolean;
  v_existing_count integer;
begin
  -- Récupère la règle
  select points, daily_limit, per_object
  into v_points, v_daily_limit, v_per_object
  from public.loyalty_rules
  where action = p_action;

  if v_points is null then
    return 0; -- action non configurée
  end if;

  -- Vérifie la limite quotidienne
  select count(*) into v_existing_count
  from public.loyalty_transactions
  where user_id = p_user_id
    and action = p_action
    and tx_day = now()::date
    and (v_per_object is false or object_id is not distinct from p_object_id);

  if v_daily_limit > 0 and v_existing_count >= v_daily_limit then
    return 0; -- limite atteinte
  end if;

  -- Tente l'insertion (protégée par l'index unique jour)
  insert into public.loyalty_transactions (user_id, action, object_id, points)
  values (p_user_id, p_action, p_object_id, v_points)
  on conflict (user_id, action, coalesce(object_id::text, ''), tx_day) do nothing;

  if not found then
    return 0; -- doublon dans la même journée
  end if;

  return v_points;
end;
$$;

-- 6) RLS (optionnel) – autoriser l'utilisateur à voir ses transactions et à en créer via RPC
alter table public.loyalty_transactions enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'loyalty_transactions' and policyname = 'loyalty_select_own') then
    create policy loyalty_select_own on public.loyalty_transactions for select
      using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'loyalty_transactions' and policyname = 'loyalty_insert_own') then
    create policy loyalty_insert_own on public.loyalty_transactions for insert
      with check (auth.uid() = user_id);
  end if;
end$$;


