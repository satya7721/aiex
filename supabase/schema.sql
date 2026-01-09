-- Create users table (public profile)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  role text check (role in ('admin', 'student')),
  class_grade text,
  division text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Create exams table
create table public.exams (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subject text not null,
  class_grade text,
  division text,
  duration_minutes integer,
  total_marks integer,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  created_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.exams enable row level security;

-- Create questions table
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams(id) on delete cascade not null,
  text text not null,
  type text check (type in ('mcq', 'subjective')) not null,
  marks integer not null,
  options jsonb, -- Array of strings or objects {id, text}
  correct_option_id text,
  model_answer text,
  order_index integer
);

-- Enable RLS
alter table public.questions enable row level security;

-- Create submissions table
create table public.submissions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams(id) not null,
  student_id uuid references public.users(id) not null,
  status text check (status in ('pending', 'completed')) default 'pending',
  score integer,
  total_marks integer,
  feedback_summary jsonb,
  started_at timestamp with time zone default timezone('utc'::text, now()),
  submitted_at timestamp with time zone
);

-- Enable RLS
alter table public.submissions enable row level security;

-- Create submission_answers table
create table public.submission_answers (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid references public.submissions(id) on delete cascade not null,
  question_id uuid references public.questions(id) not null,
  student_answer text,
  marks_awarded integer,
  feedback text
);

-- Enable RLS
alter table public.submission_answers enable row level security;

-- POLICIES (Basic Setup)

-- Users: Public read, Self update
create policy "Public profiles are viewable by everyone" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Exams: Admin full access, Students read published
create policy "Admins have full access to exams" on public.exams for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "Students see published exams" on public.exams for select using (
  status = 'published'
);

-- Submissions: Students create/read own, Admins read all
create policy "Students can create submissions" on public.submissions for insert with check (auth.uid() = student_id);
create policy "Students can view own submissions" on public.submissions for select using (auth.uid() = student_id);
create policy "Admins can view all submissions" on public.submissions for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Initial Admin Seed (Replace ID with actual auth.uid after sign up)
-- insert into public.users (id, role) values ('YOUR_UUID', 'admin');
