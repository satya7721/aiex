# Data Entities – AI Exam Platform (Mongo/NoSQL Oriented)

Conventions
- IDs: UUID v4 strings; store as `_id`.
- Timestamps: UTC ISO strings; `createdAt`, `updatedAt`; `deletedAt` for soft delete.
- Status enums: keep as lowercase strings; prefer closed sets.
- Indexes: explicitly listed; include partial filters where helpful.

## users
- Purpose: store admins and students.
- Fields
  - `_id` (string, PK)
  - `name` (string, 2-100)
  - `email` (string, unique, lowercase) — required for admins; optional for students if ID-based login
  - `type` (enum: `admin`, `student`)
  - `studentId` (string, 4–12 chars) — required for students; unique scoped to org
  - `class` (enum: `11`, `12`) — students only
  - `division` (enum: `A`, `B`, `C`) — students only
  - `active` (bool, default true)
  - `passwordHash` (string, admins) — bcrypt/argon2; null for student-ID auth if no password
  - `lastLoginAt` (date)
  - `roles` (array<string>) — future multi-role support
  - `metadata` (object) — arbitrary settings (e.g., locale)
  - `createdAt`, `updatedAt`, `deletedAt`
- Indexes
  - `email` unique sparse
  - `studentId` unique sparse
  - `{ type: 1, class: 1, division: 1 }`

## authSessions
- Purpose: track issued JWT/refresh pairs.
- Fields: `_id`, `userId`, `refreshTokenHash`, `expiresAt`, `createdAt`, `revokedAt`, `userAgent`, `ip`
- Indexes: `{ userId: 1, expiresAt: 1 }`, `{ refreshTokenHash: 1 }`

## passwordResets
- Purpose: password reset tokens for admins.
- Fields: `_id`, `userId`, `tokenHash`, `expiresAt`, `usedAt`, `createdAt`
- Indexes: `{ userId: 1, expiresAt: 1 }`, `{ tokenHash: 1 }`

## exams
- Purpose: define exams and their lifecycle.
- Fields
  - `_id`
  - `title` (string, 1-200)
  - `subject` (string, 1-100)
  - `class` (enum: `11`, `12`)
  - `division` (enum: `A`, `B`, `C`)
  - `durationMinutes` (int, 5–180)
  - `totalMarks` (int, >=1) — validate matches sum of questions
  - `status` (enum: `draft`, `published`, `archived`)
  - `liveWindow` (object?) — `startAt`, `endAt` (dates) optional
  - `createdBy` (userId)
  - `questions` (array<Question>) — denormalized
  - `tags` (array<string>) optional
  - `createdAt`, `updatedAt`, `deletedAt`
- Indexes: `{ class: 1, division: 1, status: 1, createdAt: -1 }`, `{ status: 1, liveWindow.startAt: 1 }`

### Question (embedded in exams or separate collection if banking)
- Fields
  - `id` (string) — question ID unique within exam
  - `type` (enum: `mcq`, `subjective`)
  - `text` (string)
  - `marks` (int, >=0)
  - `options` (array<{ id: string; text: string }>) — MCQ only
  - `correctOption` (string) — option.id for MCQ
  - `modelAnswer` (string) — subjective guidance
  - `metadata` (object) — difficulty, topic, etc.

## submissions
- Purpose: student attempts.
- Fields
  - `_id`
  - `examId`
  - `studentId` (user)
  - `status` (enum: `in_progress`, `submitted`, `graded`)
  - `startedAt`, `submittedAt`, `gradedAt`
  - `durationSeconds` (int) — actual time taken
  - `answers` (array<Answer>)
  - `score` (number) — raw points obtained
  - `totalMarks` (number) — snapshot from exam
  - `feedback` (Feedback) — optional
  - `autoSavedAt` (date) — last autosave timestamp
  - `flags` (object) — e.g., `late: bool`, `expired: bool`
  - `createdAt`, `updatedAt`
- Constraints: one active submission per (examId, studentId); enforce in code/db.
- Indexes: `{ examId: 1, studentId: 1, status: 1 }`, `{ studentId: 1, submittedAt: -1 }`

### Answer (embedded)
- Fields: `questionId`, `response` (string|number), `marksAwarded` (number, optional), `feedback` (string, optional)
- MCQ: store option id/index in `response`; Subjective: free text.

### Feedback (embedded)
- Fields: `scorePercent` (0–100), `comments` (string), `actionItems` (array<string>), `perQuestion` (array<{ questionId, comments, scoreDelta? }>)

## grades (optional separate if complex workflows)
- Purpose: track grading operations and overrides.
- Fields: `_id`, `submissionId`, `graderId` (user/AI), `method` (`auto`, `manual`, `ai`), `changes` (diff), `createdAt`
- Indexes: `{ submissionId: 1, createdAt: -1 }`

## analytics
- Purpose: aggregated metrics for dashboards.
- Fields
  - `_id`
  - `scope` (enum: `exam`, `class`, `student`)
  - `examId` (optional by scope)
  - `class` / `division` (optional)
  - `studentId` (optional)
  - `period` { `start`: date, `end`: date }
  - `metrics` {
      `totalSubmissions`, `averageScore`, `highestScore`, `lowestScore`,
      `completionRate`, `averageCompletionTime`, `participationRate` (for class),
      `scoreDistribution` (array<{ min, max, count }>)
    }
  - `updatedAt`
- Indexes: `{ scope: 1, examId: 1, period.start: 1 }`, `{ scope: 1, class: 1, division: 1, period.start: 1 }`

## activityLogs
- Purpose: audit trail.
- Fields: `_id`, `userId`, `action` (create/update/delete/view/submit/evaluate/login), `resourceType` (exam/submission/user/settings), `resourceId`, `metadata` (object), `timestamp`, `ip`, `userAgent`
- Indexes: `{ userId: 1, timestamp: -1 }`, `{ resourceType: 1, resourceId: 1, timestamp: -1 }`

## settings
- Purpose: configurable flags/scopes.
- Fields: `_id`, `key`, `value` (any), `scope` (`global`, `exam`, `user`), `description`, `updatedBy`, `updatedAt`
- Indexes: `{ key: 1, scope: 1 }`

## notifications
- Purpose: notification preferences and outbox.
- Fields
  - `_id`
  - `userId`
  - `type` (enum: `exam_published`, `exam_reminder`, `graded`, etc.)
  - `channel` (`email`, `sms`, `push`)
  - `enabled` (bool)
  - `outbox`? (`status`, `payload`, `scheduledAt`, `sentAt`, `error`)
- Indexes: `{ userId: 1, type: 1 }`, `{ scheduledAt: 1, status: 1 }`

## exports
- Purpose: PDF/CSV generation jobs.
- Fields: `_id`, `type` (`report_pdf`, `submissions_csv`, etc.), `requestedBy`, `params` (object), `status` (`pending`, `processing`, `completed`, `failed`), `fileUrl`, `error`, `createdAt`, `completedAt`
- Indexes: `{ requestedBy: 1, createdAt: -1 }`, `{ status: 1, createdAt: -1 }`

## fileStorage (if storing metadata)
- Fields: `_id`, `ownerId`, `type`, `path`/`url`, `contentType`, `size`, `status`, `createdAt`
- Indexes: `{ ownerId: 1, createdAt: -1 }`

## derivedViews (optional materialized collections)
- `examSummaries`: {_id: examId, submissionCount, avgScore, highScore, lowScore, updatedAt}
- `studentPerformance`: {_id: studentId, examsTaken, avgScore, trends[], updatedAt}

## Validation & Integrity Rules (cross-entity)
- Enforce `totalMarks` equals sum of question marks at exam publish time.
- Prevent submission if exam not `published`, outside `liveWindow`, or student already submitted.
- On submit: lock answers; compute MCQ score; queue subjective grading; set status to `submitted`; after grading set `graded`.
- Soft delete: keep `deletedAt` on users/exams; exclude in queries; cascade prevention or safeguards.
- Audit: log create/update/delete for exams, students, submissions, settings; include actor.
- PII: minimize in logs/analytics; redact emails/names where not needed; store in `users` only.

## Recommended Relations (application-enforced)
- users 1—N exams (createdBy)
- exams 1—N submissions
- users (students) 1—N submissions
- submissions 1—1 feedback (embedded)
- submissions 1—N grades (if separated)

Use this as the authoritative map to implement Mongoose/Prisma schemas or raw Mongo collections. Keep indexes aligned with the query patterns in the app (exam lists by class/division/status; submissions by exam/student/status; analytics by scope/period).***
