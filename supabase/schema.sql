create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  job_url text,
  status text not null default 'wishlist'
    check (status in ('wishlist','applied','interview','offer','rejected')),
  applied_on date,
  notes text,
  created_at timestamptz not null default now()
);

alter table applications enable row level security;

create policy "Users manage their own applications"
  on applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);