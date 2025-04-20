-- Table: conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid not null references profiles(id) on delete cascade,
  user2_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint unique_users unique (user1_id, user2_id)
);
