// User Types
export type UserType = "admin" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  class?: string;
  division?: string;
  active?: boolean;
}

// Exam Types
export interface Question {
  id: string;
  text: string;
  type: "mcq" | "subjective";
  options?: string[];
  correctOption?: number;
  marks: number;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  class: string;
  division: string;
  duration: number;
  totalMarks: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

// Submission Types
export interface Answer {
  questionId: string;
  answer: string | number;
  marks?: number;
  feedback?: string;
}

export interface Submission {
  id: string;
  examId: string;
  examTitle?: string;
  studentId: string;
  userName: string;
  answers: Answer[];
  score: number;
  totalMarks: number;
  status: "pending" | "completed";
  startedAt: string;
  submittedAt?: string;
  feedback?: {
    score: number;
    comments: string;
    actionItems: string[];
  };
  actionItems?: string[];
}

// Admin Types
export interface AdminDashboardProps {
  exams: Exam[];
  submissions: Submission[];
}

export interface MonthOption {
  value: string;
  label: string;
}

export interface ExamStats {
  totalExams: number;
  totalSubmissions: number;
  totalQuestions: number;
  averageScore: number;
}

export interface ExamByBatchAndDivision {
  [batch: string]: {
    [division: string]: Exam[];
  };
}

export interface FilteredData<T> {
  data: T[];
  stats: ExamStats;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ExamListItemProps {
  exam: Exam;
  onViewReport: (examId: string) => void;
}

export interface DivisionSectionProps {
  division: string;
  exams: Exam[];
  onViewReport: (examId: string) => void;
}

export interface BatchSectionProps {
  batch: string;
  divisions: Record<string, Exam[]>;
  onViewReport: (examId: string) => void;
}

export interface StatsCardProps {
  title: string;
  value: number | string;
  suffix?: string;
}

export interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  monthOptions: MonthOption[];
}

export interface CreateExamFormData {
  title: string;
  subject: string;
  class: number;
  division: string;
  questions: {
    text: string;
    type: "multiple-choice" | "text";
    options?: string[];
    correctAnswer?: string;
  }[];
  liveDate?: Date;
  duration: number;
  totalMarks: number;
}

export interface CreateExamFormProps {
  onSubmit: (data: CreateExamFormData) => void;
  isLoading?: boolean;
}

export interface LiveDateSelectorProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}
