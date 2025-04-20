-- Table: profiles
create table if not exists public.profiles (
  id uuid primary key,
  email text unique,
  username text,
  birth_date date,
  language text,
  nationality text,
  created_at timestamptz not null default now()
);
