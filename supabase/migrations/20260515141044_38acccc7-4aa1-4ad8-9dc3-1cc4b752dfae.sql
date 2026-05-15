
create table public.threads (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index threads_device_id_idx on public.threads(device_id, updated_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  parts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index messages_thread_id_idx on public.messages(thread_id, created_at asc);

alter table public.threads enable row level security;
alter table public.messages enable row level security;

-- Permissive policies (device-scoped at app layer; no auth in this version)
create policy "threads public read" on public.threads for select using (true);
create policy "threads public insert" on public.threads for insert with check (true);
create policy "threads public update" on public.threads for update using (true) with check (true);
create policy "threads public delete" on public.threads for delete using (true);

create policy "messages public read" on public.messages for select using (true);
create policy "messages public insert" on public.messages for insert with check (true);
create policy "messages public update" on public.messages for update using (true) with check (true);
create policy "messages public delete" on public.messages for delete using (true);
