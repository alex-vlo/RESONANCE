-- Ejecutar en el SQL Editor de Supabase.
-- El backend usa la service_role key, que omite RLS.

create extension if not exists "pgcrypto";

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text not null,
  role_id uuid not null references public.roles (id) on delete restrict,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_role_id_idx on public.users (role_id);
create index if not exists users_email_idx on public.users (email);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

insert into public.roles (name, description)
values
  ('admin', 'Acceso total al sistema'),
  ('editor', 'Puede gestionar usuarios con restricciones'),
  ('viewer', 'Solo lectura')
on conflict (name) do nothing;

alter table public.roles enable row level security;
alter table public.users enable row level security;
