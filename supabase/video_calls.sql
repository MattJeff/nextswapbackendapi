-- Table: video_calls
create table if not exists public.video_calls (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  caller_id uuid not null references profiles(id) on delete cascade,
  callee_id uuid not null references profiles(id) on delete cascade,
  status text not null check (status in ('started', 'ended', 'missed')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  room_url text not null
);
