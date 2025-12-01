# AI Exam Platform – Product Requirements

## 1) Context & Vision
- Deliver a modern exam platform for schools/coaching centers with AI-powered creation, grading, feedback, and analytics.
- Current app is a Next.js 13 App Router front end with mocked data and route protection. No real auth/back end yet.
- Target devices: mobile-first responsive web; must work on desktop and modern mobile browsers.

## 2) Goals & Non-Goals
- Goals
  - Enable admins to create, publish, duplicate, edit, and archive exams with MCQ and subjective questions.
  - Allow students to take timed exams, auto-save answers, submit, and receive AI-generated feedback and reports.
  - Provide admins with analytics (exam-level performance, class/division breakdowns, student performance tracking).
  - Provide secure authentication/authorization for admins and students (JWT-based, cookie + local state).
  - Prepare for MongoDB/NoSQL back end with clear schemas and API contracts.
- Non-Goals (current phase)
  - Real-time collaboration or proctoring.
  - Payment/billing flows.
  - Native mobile apps.

## 3) Personas
- Admin/Teacher: creates exams, manages students, reviews submissions, exports reports, monitors performance.
- Student: logs in with ID, takes exams within time limits, reviews results and feedback.
- School Owner (future): oversees multiple admins, monitors adoption, exports data for compliance.

## 4) Information Architecture & Routes (current UI)
- Public: `/` landing, `/login?type=student|admin`, `/admin/login`.
- Student: `/dashboard`, `/dashboard/exams`, `/exam/[id]`, `/report/[submissionId]`, `/dashboard/reports`.
- Admin: `/admin`, `/admin/exam/new`, `/admin/exam/[id]`, `/admin/submissions`, `/admin/manage`, `/admin/manage/add`, `/admin/students/[id]/performance`, `/admin/reports/[examId]`.
- Shared layout + header navigation; theme toggle; mobile menu.

## 5) Core User Stories
- Authentication
  - As a student, I can sign in with a 4-digit ID to access my dashboard.
  - As an admin, I can sign in with email/password to reach the admin console.
  - As any user, I am redirected to the correct login if I hit a protected route while unauthenticated.
- Admin Exam Lifecycle
  - Create: define title, subject, class, division, duration, total marks, questions (MCQ + subjective), live date (optional).
  - Edit/Duplicate/Delete exams with confirmation and draft/publish states (status placeholder exists).
  - Manage questions: add/edit/remove MCQ options, correct answer, subjective prompts, marks.
  - View analytics per exam: submissions count, average/high/low score, score distribution (planned), completion times.
  - View submissions list and individual reports; download/share as PDF (currently stubbed).
  - Manage students: add/edit students (name, email, class, division), activate/deactivate, view performance history.
- Student Exam Flow
  - View available exams filtered by class/division.
  - Start an exam, see timer, navigate questions, persist answers per question.
  - Submit exam manually or auto-submit on timeout.
  - After submission, view report with score, AI feedback, and action items; revisit past reports.

## 6) Functional Requirements
- Authentication & Authorization
  - Middleware enforces role-based routes via cookie `userType`; transition to JWT with refresh/rotation.
  - Session persistence across tabs; logout clears tokens and sensitive storage.
  - Password reset for admins; ID verification flow for students (future).
- Exam Management (Admin)
  - CRUD exams; duplicate action creates a new ID with “(Copy)” suffix.
  - Question bank structure supports MCQ (options, correct index) and subjective (free text); marks per question; total marks auto-calculated/validated.
  - Status: draft/published/archived; only published visible to students.
  - Scheduling: optional live date/time windows (future enforcement).
  - Bulk actions: delete multiple, export CSV/PDF (future).
- Student Management
  - Create/edit student profiles with validation (name, email, class 11/12, division A/B/C, active flag).
  - Search/filter by name/email/status; sort by name/class/division/status.
  - Performance view per student with aggregate stats and recent exams.
- Exam Delivery
  - Timer with warning at <5 minutes and auto-submit on zero.
  - Question navigation, answer state retention, and required validation before submit.
  - Auto-save every N seconds and on navigation (to be implemented with API).
  - Prevent multiple submissions per exam per student; track start/submit timestamps.
- Grading & Feedback
  - MCQ auto-grading by correct option; subjective marking via manual input or AI scoring (future).
  - Generate AI feedback: overall comments, action items, per-question feedback (future API).
  - Score percentage, grade mapping, and action items shown in reports.
- Analytics & Reporting
  - Admin dashboard cards: total exams, total questions, submissions, avg score (filterable by month).
  - Exam reports: submission count, avg/high/low scores, completion rate/time, score distribution (future chart).
  - Class/division grouping of exams; participation and improvement metrics (util functions exist).
  - Downloadable reports (PDF/CSV) and share link (future).
- Notifications (future)
  - Email/push for published exams, upcoming deadlines, graded submissions.
- Accessibility & UX
  - Keyboard navigation, focus states, ARIA labels on form controls; high contrast themes.
  - Mobile-responsive layouts for all dashboard/admin screens.

## 7) Data Model (planned NoSQL)
- Users: id, name, email, type (`admin|student`), class (11/12), division (A/B/C), active, timestamps.
- Exams: id, title, subject, class, division, duration, totalMarks, status, questions[], created/updated, createdBy.
  - Questions: id, text, type (`mcq|subjective`), marks, options[{id,text}], correctOption, answer (model answer).
- Submissions: id, examId, studentId, startedAt, submittedAt, status, answers[], score, totalMarks, feedback{score,comments,actionItems}, evaluatedAt/by.
- Analytics: examId, type (`exam|class|student`), period, metrics (totals, averages, completion), distribution ranges.
- Activity Logs: userId, action, resourceType/id, timestamp, metadata.
- Settings: key/value, scope (global/exam/user), updatedBy/At.
- Indexing: users (email,type), exams (class,division,status,createdAt), submissions (examId,studentId,status,submittedAt), analytics (examId,type,period.start), logs (userId,timestamp).

## 8) API Surface (to be built)
- Auth: POST `/api/auth/login` (admin), `/api/auth/student-login`, `/api/auth/logout`, `/api/auth/refresh`, `/api/auth/password-reset`.
- Exams: CRUD `/api/exams`, duplicate, publish/archive, query by class/division/status/date.
- Questions: nested under exams or question bank endpoints (future).
- Submissions: POST create draft/start, PATCH answer updates (auto-save), POST submit, GET by exam/student, POST grade/feedback (AI/manual).
- Reports/Analytics: GET `/api/reports/exam/:id`, `/api/reports/student/:id`, `/api/analytics/overview`.
- Students: CRUD `/api/students`, batch import/export.
- Files: POST `/api/reports/:id/download` (generate PDF), export CSV.

## 9) AI & Scoring Requirements
- Auto-score MCQs deterministically.
- Subjective scoring via LLM: rubric-based prompt with exam metadata, bounded outputs (score 0–marks, feedback, action items).
- Hallucination safeguards: include model answer and rubric; require score justification.
- Latency targets: <5s for MCQ-only, <15s for mixed exams; async grading fallback with “processing” state.

## 10) Non-Functional Requirements
- Security: JWT with HttpOnly cookies, CSRF protection, role-based access in API and middleware, rate limiting on auth/exam start, input validation (zod).
- Privacy: store timestamps in UTC; redact PII in logs; GDPR-ready data export/delete.
- Reliability: auto-save every 15–30s with retry/backoff; idempotent submission; prevent duplicate grading.
- Performance: page TTFB < 1.5s on 3G for dashboard; bundle optimization (code-splitting, lazy charts); use streaming for large reports.
- Accessibility: WCAG 2.1 AA; screen-reader labels for controls and timers.
- Observability: structured logs, metrics for login success/fail, exam starts, submission success rate, grading latency; error boundary pages.

## 11) Success Metrics
- Activation: % of invited students who complete first login within 48h.
- Engagement: average exams taken per student per month; median completion time vs allotted.
- Quality: % submissions auto-graded without manual override; CSAT on feedback usefulness.
- Reliability: submission failure rate <0.5%; auto-save error rate <1%; P95 grading latency targets above.
- Admin efficiency: time to create/publish an exam; number of duplicated exams (reuse).

## 12) Milestones
- MVP (current): Static front end with protected routes, mock data, exam CRUD UI, timer, basic reports, student management UI.
- Phase 1: Real auth (JWT), MongoDB persistence, exam/submission APIs, auto-save, basic AI feedback via API, PDF export.
- Phase 2: Advanced analytics (charts, trends), role management, batch actions/export, password reset, improved loading/error states.
- Phase 3: AI-assisted exam generation, rubric-based subjective scoring, notifications, SSO (optional).

## 13) Risks & Open Questions
- AI feedback accuracy and consistency; need human override flows.
- Handling cheating/proctoring not in scope—will stakeholders require it?
- Performance on low-end mobile during long exams; need offline tolerance for transient drops.
- Data migration from mock to production schemas; seeding strategy and backward compatibility.
- Compliance: clarify data retention and parental consent requirements for minors.
