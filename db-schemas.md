# Database Schemas (NoSQL)

## Users Collection
```typescript
{
  id: string;                 // Unique identifier
  name: string;              // Full name
  email: string;             // Email address (unique)
  type: 'admin' | 'student'; // User role
  class?: string;            // Class (for students only) - "11" or "12"
  division?: string;         // Division (for students only) - "A", "B", or "C"
  active: boolean;           // Account status
  createdAt: Date;          // Account creation timestamp
  updatedAt: Date;          // Last update timestamp
}
```

## Exams Collection
```typescript
{
  id: string;           // Unique identifier
  title: string;        // Exam title
  subject: string;      // Subject name
  class: string;        // Target class - "11" or "12"
  division: string;     // Target division - "A", "B", or "C"
  duration: number;     // Duration in minutes
  totalMarks: number;   // Total marks available
  questions: [
    {
      id: string;      // Question identifier
      text: string;    // Question text
      type: 'mcq' | 'subjective';  // Question type
      marks: number;   // Marks for this question
      options?: {      // For MCQ questions
        id: string;    // Option identifier
        text: string;  // Option text
      }[];
      correctOption?: string;  // For MCQ questions - correct option id
      answer?: string; // For subjective questions - model answer
    }
  ];
  createdAt: Date;     // Creation timestamp
  updatedAt: Date;     // Last update timestamp
  createdBy: string;   // Admin user ID who created the exam
  status: 'draft' | 'published' | 'archived';
}
```

## Submissions Collection
```typescript
{
  id: string;           // Unique identifier
  examId: string;       // Reference to exam
  studentId: string;    // Reference to student user
  startedAt: Date;      // When student started the exam
  submittedAt?: Date;   // When student submitted the exam
  status: 'pending' | 'completed';
  answers: [
    {
      questionId: string;     // Reference to exam question
      answer: string | number; // Student's answer
      marks?: number;         // Marks awarded
      feedback?: string;      // Feedback for this answer
    }
  ];
  score: number;        // Total score achieved
  totalMarks: number;   // Maximum possible score
  feedback: {
    score: number;      // Overall score percentage
    comments: string;   // General feedback
    actionItems: string[]; // Suggested improvements
  };
  evaluatedAt?: Date;   // When the submission was evaluated
  evaluatedBy?: string; // Admin user ID who evaluated (if manual)
}
```

## Analytics Collection
```typescript
{
  id: string;           // Unique identifier
  examId: string;       // Reference to exam
  type: 'exam' | 'class' | 'student';  // Analytics type
  period: {
    start: Date;       // Start of analysis period
    end: Date;         // End of analysis period
  };
  metrics: {
    totalSubmissions: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    completionRate: number;    // Percentage of students who completed
    averageCompletionTime: number;  // Average time taken in minutes
  };
  distribution: {
    ranges: {
      min: number;     // Range minimum
      max: number;     // Range maximum
      count: number;   // Number of submissions in this range
    }[];
  };
  updatedAt: Date;     // Last update timestamp
}
```

## Activity Logs Collection
```typescript
{
  id: string;           // Unique identifier
  userId: string;       // Reference to user
  action: 'create' | 'update' | 'delete' | 'view' | 'submit' | 'evaluate';
  resourceType: 'exam' | 'submission' | 'user';
  resourceId: string;   // Reference to the affected resource
  timestamp: Date;      // When the action occurred
  metadata: {           // Additional context-specific data
    [key: string]: any;
  };
}
```

## Settings Collection
```typescript
{
  id: string;           // Unique identifier
  key: string;         // Setting key
  value: any;          // Setting value
  scope: 'global' | 'exam' | 'user';
  description: string; // Setting description
  updatedAt: Date;    // Last update timestamp
  updatedBy: string;  // Admin user ID who last updated
}
```

## Notes:
1. All IDs should be generated as UUIDs or similar unique identifiers
2. Timestamps should be stored in UTC
3. Indexes should be created on:
   - Users: email, type
   - Exams: class, division, status, createdAt
   - Submissions: examId, studentId, status, submittedAt
   - Analytics: examId, type, period.start
   - Activity Logs: userId, timestamp
4. Consider implementing soft delete for all collections
5. Implement appropriate access control rules for each collection 