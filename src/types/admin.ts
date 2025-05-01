import { Exam, Submission } from '@/app/types';

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
    type: 'multiple-choice' | 'text';
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