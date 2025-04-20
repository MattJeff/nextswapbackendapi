-- Table: messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('text', 'image', 'video')),
  content text,
  url text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
