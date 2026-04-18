-- PromptSure Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  building text,
  use_case text,
  main_risk text,
  onboarded boolean default false,
  created_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can read own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own data" on public.users
  for insert with check (auth.uid() = id);

-- Projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  description text,
  prompt_template text,
  api_endpoint text,
  input_mode text default 'prompt' check (input_mode in ('prompt', 'api')),
  last_run_at timestamptz,
  overall_score integer,
  created_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Users can CRUD own projects" on public.projects
  for all using (auth.uid() = user_id);

-- Scenarios table
create table public.scenarios (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  input_text text not null,
  type text not null,
  persona text,
  created_at timestamptz default now()
);

alter table public.scenarios enable row level security;

create policy "Users can CRUD scenarios via project" on public.scenarios
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = scenarios.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Simulations table
create table public.simulations (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  scenario_id uuid references public.scenarios(id) on delete set null,
  input text not null,
  output text,
  latency float,
  tokens integer,
  status text default 'queued' check (status in ('queued', 'running', 'completed', 'failed')),
  error text,
  created_at timestamptz default now()
);

alter table public.simulations enable row level security;

create policy "Users can CRUD simulations via project" on public.simulations
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = simulations.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Evaluations table
create table public.evaluations (
  id uuid default uuid_generate_v4() primary key,
  simulation_id uuid references public.simulations(id) on delete cascade not null,
  helpfulness_score integer not null check (helpfulness_score between 0 and 100),
  tone_score integer not null check (tone_score between 0 and 100),
  accuracy_score integer not null check (accuracy_score between 0 and 100),
  safety_score integer not null check (safety_score between 0 and 100),
  hallucination_score integer not null check (hallucination_score between 0 and 100),
  overall_score integer not null check (overall_score between 0 and 100),
  reasoning text,
  created_at timestamptz default now()
);

alter table public.evaluations enable row level security;

create policy "Users can CRUD evaluations via simulation" on public.evaluations
  for all using (
    exists (
      select 1 from public.simulations
      join public.projects on projects.id = simulations.project_id
      where simulations.id = evaluations.simulation_id
      and projects.user_id = auth.uid()
    )
  );

-- Jobs table
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  type text not null check (type in ('generate_scenarios', 'run_simulation', 'evaluate_output')),
  status text default 'queued' check (status in ('queued', 'running', 'completed', 'failed')),
  payload jsonb default '{}',
  result jsonb,
  progress integer default 0,
  total integer default 0,
  error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.jobs enable row level security;

create policy "Users can CRUD jobs via project" on public.jobs
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = jobs.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index idx_projects_user_id on public.projects(user_id);
create index idx_scenarios_project_id on public.scenarios(project_id);
create index idx_simulations_project_id on public.simulations(project_id);
create index idx_simulations_scenario_id on public.simulations(scenario_id);
create index idx_simulations_status on public.simulations(status);
create index idx_evaluations_simulation_id on public.evaluations(simulation_id);
create index idx_jobs_project_id on public.jobs(project_id);
create index idx_jobs_status on public.jobs(status);
