# GA Task List – AI Exam Platform (Table View)

## UI Flow Design & Frontend Delivery
| Area | Tasks to GA |
| --- | --- |
| Auth & Nav | Admin email/password, student ID login, password reset UI, logout and session-expired handling, blocked-access screens, role-aware nav/header (desktop/mobile), breadcrumbs/backlinks for nested admin routes |
| Exam Lifecycle (Admin) | Create/edit/duplicate/delete, publish/archive toggle, scheduling window selector, question editor (MCQ/subjective, marks, options, correct answer), total marks validation, draft save, confirmations |
| Student Exam Flow | Class/division filtered list, start exam, timer with warning/expiry UX, question navigation, answer persistence UI, autosave indicator, submit/timeout auto-submit |
| Grading UX | Manual scoring for subjective, bulk publish grades, processing state for AI grading, error retries, override scores |
| Reports & Analytics UI | Exam report charts (score distribution, completion time, participation), filters (month/date), class/division dashboards, export buttons (PDF/CSV), empty/error/loading states |
| Student Reports | Past attempts list, per-attempt detail with feedback/action items, download/share options |
| Student Management | List/search/filter/sort, add/edit validation, activate/deactivate, bulk import entry point, performance linkouts |
| Notifications UX | Preference toggles, banners/toasts for published exam, upcoming deadlines, graded submission |
| Accessibility/Perf | WCAG AA audit, keyboard/focus/ARIA, mobile responsiveness, skeletons/spinners, lazy-load heavy widgets (charts), content polish (landing/error/empty/help), localization hooks ready |
| QA/E2E | Cypress/Playwright for auth, exam creation, take/submit, report view, admin analytics, student management |

## Backend & Middleware Logic
| Area | Tasks to GA |
| --- | --- |
| AuthN/AuthZ | JWT issue/refresh/revoke, HttpOnly cookies, password hashing, student ID verification, password reset tokens, logout, idle/absolute timeouts |
| Middleware/Guards | Role checks on routes/APIs, CSRF, input validation (zod) at edges, rate limits (auth, exam start, submission) |
| Exams API | CRUD, duplicate, publish/archive, scheduling enforcement, status validation, total marks calc/validation, soft delete, optimistic concurrency |
| Questions | MCQ/subjective structure, correct answer, model answer optional, bulk import/export support, question bank endpoints (if needed) |
| Student Management API | CRUD, activate/deactivate, search/filter, bulk import/export, audit logging |
| Submission Lifecycle | Start exam (creates submission), autosave endpoint (idempotent), submit (locks answers), prevent duplicate submissions, enforce time window/attempt limit |
| Grading | MCQ auto-grade, subjective grading (manual + AI pipeline), regrade endpoint, override with audit trail |
| AI Feedback | Generate comments/action items, timeout/fallback, queue long calls, retry/backoff, safety checks |
| Reports/Analytics APIs | Exam aggregates, score distribution, completion rates/times, class/division metrics, student trends; pagination |
| Notifications | Email jobs for published exams/reminders/graded submissions; templates; opt-out |
| File/Export | PDF generation, CSV exports (exams/submissions/students), signed URLs if stored |
| Observability/Reliability | Structured logging (PII-safe), metrics (auth success/fail, exam starts, autosave errors, submission success, grading latency), health checks, background worker for grading/notifications |
| Security/Compliance | Sanitization, dependency scanning, secrets management, audit logs, GDPR-ready delete/export, CORS config |
| Performance | Autosave and grading latency targets, caching where safe, queue/backpressure handling |
| Testing/DevOps | API unit/integration, contract tests, load tests on submission/grading, CI lint/test/build, preview envs, feature flags, migration/seed jobs in pipeline |

## Data Storage & Infrastructure
| Area | Tasks to GA |
| --- | --- |
| Schemas | Mongo/NoSQL for users, exams, questions, submissions, feedback, analytics, activity logs, settings; status fields; timestamps |
| Indexing | Users (email,type), exams (class,division,status,createdAt), submissions (examId,studentId,status,submittedAt), analytics (examId,type,period.start), logs (userId,timestamp); verify via explain |
| Data Integrity | Validation at persistence, soft delete flags, uniques (email, exam id), referential checks (exam exists for submission), guard partial writes |
| Storage for Exports | Bucket config for PDFs/CSVs, signed URL policies, cleanup/retention jobs |
| Backups & Retention | Automated backups, restore drills, retention by data class, GDPR/CCPA delete workflows |
| Seeding & Migration | Seed scripts for dev/stage, migrate from mock to live schema, data versioning, rollforward/rollback |
| Analytics Storage | Time-series/aggregated collections, cron/queue jobs to compute aggregates, recalculation on regrade |
| Secrets & Config | Env management per env, secret rotation, env var validation on boot |
| Performance & Capacity | Sizing for peak exam windows, pooling, query budgeting, cache strategy (if added) |
| Monitoring & Alerts | DB health dashboards, storage thresholds, slow query alerts, job failure alerts |
| Compliance/Privacy | PII minimization, prod data access control, audit trails, encryption at rest/in transit confirmation |

## Definition of GA Ready
| Criteria | Description |
| --- | --- |
| Functional Coverage | Auth, exams, submissions, grading, reports, exports fully working on live DB; all above tasks closed |
| Quality | Zero critical/blocker bugs; accessibility/privacy/security checks passed |
| Reliability | Performance SLOs met; backups/restores verified; autosave/submission/grading error rates within targets |
| Delivery | CI/CD green; staging mirrors prod; rollout plan with feature flags for risky changes |
