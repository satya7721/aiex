# Authorization & Database Implementation Plan for AiEx

## 1. Overview
The goal is to replace the current dummy data with a real PostgreSQL database (Supabase) and implement secure authentication for Admins and Students.

**Tech Stack:**
*   **Database:** Supabase (PostgreSQL)
*   **Auth:** Supabase Auth (Email/Password for Admins, potential Email/Class access for Students)
*   **ORM/Query Builder:** Supabase JS Client (Direct, secure access with RLS)
*   **API:** Next.js Server Actions & Route Handlers

## 2. Table Schema Implementation (Supabase)

We will map the NoSQL-like schema from `db-schemas.md` to structured SQL tables.

### Tables

1.  **`users`**
    *   `id` (UUID, PK) - Links to `auth.users`
    *   `email` (Text, Unique)
    *   `full_name` (Text)
    *   `role` (Enum: 'admin', 'student')
    *   `class` (Text, optional)
    *   `division` (Text, optional)
    *   `created_at` (Timestamp)

2.  **`exams`**
    *   `id` (UUID, PK)
    *   `title` (Text)
    *   `subject` (Text)
    *   `class` (Text)
    *   `division` (Text)
    *   `duration_minutes` (Int)
    *   `total_marks` (Int)
    *   `status` (Enum: 'draft', 'published', 'archived')
    *   `created_by` (UUID, FK -> users.id)
    *   `created_at` (Timestamp)
    *   `live_date` (Timestamp)

3.  **`questions`** (Normalized for SQL)
    *   `id` (UUID, PK)
    *   `exam_id` (UUID, FK -> exams.id)
    *   `text` (Text)
    *   `type` (Enum: 'mcq', 'subjective')
    *   `marks` (Int)
    *   `options` (JSONB) - Stores MCQ options array `[{text: "A", id: "1"}]`
    *   `correct_answer` (Text) - For MCQ (option ID) or Subjective (model answer)
    *   `order_index` (Int)

4.  **`submissions`**
    *   `id` (UUID, PK)
    *   `exam_id` (UUID, FK -> exams.id)
    *   `student_id` (UUID, FK -> users.id)
    *   `status` (Enum: 'pending', 'completed')
    *   `score` (Int)
    *   `started_at` (Timestamp)
    *   `submitted_at` (Timestamp)

5.  **`answers`**
    *   `id` (UUID, PK)
    *   `submission_id` (UUID, FK -> submissions.id)
    *   `question_id` (UUID, FK -> questions.id)
    *   `student_answer` (Text)
    *   `marks_awarded` (Int)
    *   `feedback` (Text)

## 3. Authentication Implementation

### Setup
1.  **Install Supabase SSR**: `npm install @supabase/ssr @supabase/supabase-js`
2.  **Environment Variables**:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3.  **Client Helpers**: Create `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`.

### Logic
*   **Middleware**: Intercept requests to `/admin/*`, `/dashboard/*`. Check for valid session. Redirect unauthenticated users to `/login`.
*   **Role Setup**: Use a `role` column in the `public.users` table. Middleware must verify `user.role === 'admin'` for `/admin` routes.

## 4. Phase-by-Phase Execution

### Phase A: Database Setup
1.  Run Supabase migration to create tables (enumerated in Section 2).
2.  Enable RLS (Row Level Security).
    *   *Admins*: Full access to all tables.
    *   *Students*: Read `exams` (where class matches), Create `submissions`, Read own `submissions`.

### Phase B: Authentication UI Wire-up
1.  Connect `src/app/(auth)/login/page.tsx` to `supabase.auth.signInWithPassword`.
2.  Create `signup` flow (or seed script) for initial Admin.

### Phase C: Dashboard Integration (Admin)
1.  **Fetch Exams**: Update Admin Dashboard to select from `exams`.
2.  **Create Exam**: Connect `CreateExamForm` submit handler to insert into `exams` and `questions` tables (transactional).

### Phase D: Student Experience
1.  **List Exams**: Fetch `published` exams matching Student's Class/Division.
2.  **Take Exam**: Save answers to `answers` table.

## 5. Immediate Next Steps
1.  **Helper Setup**: Create Supabase client utility files.
2.  **Migration**: Create the database tables. (I can do this via the `execute_sql` tool).
