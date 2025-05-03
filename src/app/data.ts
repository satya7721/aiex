import { Exam, Submission, User } from "@/types";

// Dummy Exam Data
export const exams: Exam[] = [
  {
    id: "exam-1",
    title: "Physics Midterm",
    subject: "Physics",
    class: "11",
    division: "A",
    questions: [
      {
        id: "q1",
        text: "What is Newton's First Law?",
        type: "subjective",
        marks: 10,
      },
      {
        id: "q2",
        text: "Calculate the force required to accelerate a 2kg mass at 5m/s²",
        type: "subjective",
        marks: 10,
      },
    ],
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
    duration: 60,
    totalMarks: 100,
  },
  {
    id: "exam-2",
    title: "Chemistry Final",
    subject: "Chemistry",
    class: "11",
    division: "B",
    questions: [
      {
        id: "q1",
        text: "What is the chemical formula for water?",
        type: "subjective",
        marks: 10,
      },
    ],
    createdAt: "2024-03-16T10:00:00Z",
    updatedAt: "2024-03-16T10:00:00Z",
    duration: 90,
    totalMarks: 50,
  },
  {
    id: "exam-3",
    title: "Mathematics Quiz",
    subject: "Mathematics",
    class: "12",
    division: "A",
    questions: [
      {
        id: "q1",
        text: "Solve the quadratic equation: x² + 5x + 6 = 0",
        type: "subjective",
        marks: 10,
      },
    ],
    createdAt: "2024-03-17T10:00:00Z",
    updatedAt: "2024-03-17T10:00:00Z",
    duration: 45,
    totalMarks: 25,
  },
  {
    id: "exam-4",
    title: "Biology Test",
    subject: "Biology",
    class: "12",
    division: "C",
    questions: [
      {
        id: "q1",
        text: "What is the powerhouse of the cell?",
        type: "subjective",
        marks: 10,
      },
    ],
    createdAt: "2024-03-18T10:00:00Z",
    updatedAt: "2024-03-18T10:00:00Z",
    duration: 30,
    totalMarks: 20,
  },
];

// Dummy User Data
export const users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    type: "student",
    class: "11",
    division: "A",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    type: "student",
    class: "11",
    division: "B",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    type: "admin",
  },
];

// Dummy Submission Data
export const submissions: Submission[] = [
  {
    id: "submission-1",
    studentId: "user-1",
    userName: "John Doe",
    examId: "exam-1",
    examTitle: "Physics Mid-Term",
    answers: [
      {
        questionId: "q1",
        answer:
          "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
      },
      { questionId: "q2", answer: "10N" },
    ],
    score: 85,
    totalMarks: 100,
    status: "completed",
    startedAt: "2024-03-15T10:45:30Z",
    submittedAt: "2024-03-15T11:45:30Z",
    feedback: {
      score: 85,
      comments:
        "Good understanding of fundamental physics concepts. Could improve explanations of Newton's laws with more specific details about force calculations.",
      actionItems: [
        "Review kinetic energy calculations",
        "Practice more problems on Newton's laws",
        "Focus on mathematical expressions of physical laws",
      ],
    },
  },
  {
    id: "submission-2",
    studentId: "user-2",
    userName: "Jane Smith",
    examId: "exam-2",
    examTitle: "Chemistry Final",
    answers: [{ questionId: "q1", answer: "H2O" }],
    score: 92,
    totalMarks: 50,
    status: "completed",
    startedAt: "2024-04-20T15:10:45Z",
    submittedAt: "2024-04-20T16:10:45Z",
    feedback: {
      score: 92,
      comments:
        "Excellent understanding of chemistry concepts. Your explanations are clear and demonstrate deep knowledge of the subject.",
      actionItems: [
        "Explore advanced topics in organic chemistry",
        "Consider studying reaction kinetics in more detail",
        "Practice more complex stoichiometry problems",
      ],
    },
  },
];
