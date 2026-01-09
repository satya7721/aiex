# Supabase Migration Plan for Admin Flow

This document processes the migration of the current mock-data driven Admin Flow to a real-time, persistent Supabase (PostgreSQL) backend.

## 1. Database Schema Design (SQL)

We will translate the existing NoSQL-style conceptual schema into a normalized Relational Schema.

### Core Tables

#### `public.users` (Extends `auth.users`)
- `id`: UUID (Primary Key, references `auth.users.id`)
- `full_name`: Text
- `email`: Text
- `role`: Text ('admin' | 'student')
- `class_grade`: Text (Nullable, for students)
- `division`: Text (Nullable, for students)
- `is_active`: Boolean (Default: true)
- `created_at`: Timestamptz
- `updated_at`: Timestamptz

#### `public.exams`
- `id`: UUID (Primary Key)
- `title`: Text
- `subject`: Text
- `class_grade`: Text
- `division`: Text
- `duration_minutes`: Integer
- `total_marks`: Integer
- `status`: Text ('draft' | 'published' | 'archived')
- `created_by`: UUID (References `public.users.id`)
- `created_at`: Timestamptz

#### `public.questions`
- `id`: UUID (Primary Key)
- `exam_id`: UUID (References `public.exams.id`)
- `text`: Text
- `type`: Text ('mcq' | 'subjective')
- `marks`: Integer
- `options`: JSONB (Stores MCQ options: `[{ id, text }]`)
- `correct_option_id`: Text (Nullable)
- `model_answer`: Text (Nullable)
- `order_index`: Integer

#### `public.submissions`
- `id`: UUID (Primary Key)
- `exam_id`: UUID (References `public.exams.id`)
- `student_id`: UUID (References `public.users.id`)
- `status`: Text ('pending' | 'completed')
- `score`: Integer
- `total_marks`: Integer
- `feedback_summary`: JSONB (Overall comments)
- `started_at`: Timestamptz
- `submitted_at`: Timestamptz

#### `public.submission_answers`
- `id`: UUID (Primary Key)
- `submission_id`: UUID (References `public.submissions.id`)
- `question_id`: UUID (References `public.questions.id`)
- `student_answer`: Text
- `marks_awarded`: Integer
- `feedback`: Text

---

## 2. Authentication & Security (RLS)

- **Auth**: Use Supabase Auth for Sign Up / Log In.
- **Row Level Security (RLS)**:
  - **Exams**:
    - `Admins`: Full CRUD.
    - `Students`: Read-only (and only if `status` = 'published').
  - **Submissions**:
    - `Students`: Create/Read own.
    - `Admins`: Read all.
  - **User Profiles**:
    - `Public`: Read basic info (name/avatar).
    - `Self`: Update own.

---

## 3. Implementation Steps

### Phase 1: Infrastructure & Clients
1.  **Environment Setup**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
2.  **Supabase Client**: Create `src/lib/supabase/client.ts` and `server.ts` (using `@supabase/ssr`).
3.  **Database Migration**: Write and run the initial SQL migration to create tables.

### Phase 2: Data Migration (Mock -> Real)
1.  **Seed Script**: Create a script to populate `public.users` and `public.exams` with the data currently in `src/app/data.ts`.

### Phase 3: Admin Flow Integration
1.  **Student Management**:
    - Replace `src/app/(dashboard)/admin/students/page.tsx` with a server-side fetch or SWR hook querying `public.users`.
    - Update filters to use SQL `WHERE` clauses.
2.  **Student Reports**:
    - Update `src/app/(dashboard)/admin/students/report/[studentId]/page.tsx` to fetch `submissions` and `exams` via joins.
3.  **Exam Management**:
    - Connect `CreateExamForm` to `insert` into `exams` and `questions` tables.

### Phase 4: Verification
1.  Verify RLS policies (ensure students can't see other students' data).
2.  Check performance of Reports pages with SQL joins.

---

## 4. Dependencies
- `@supabase/supabase-js`
- `@supabase/ssr` (for Next.js 14+ Server Components)
