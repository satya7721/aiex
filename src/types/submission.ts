import { Question } from './exam';

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
  answers: Answer[];
  score: number;
  totalMarks: number;
  status: 'pending' | 'completed';
  startedAt: string;
  submittedAt?: string;
  feedback?: {
    score: number;
    comments: string;
    actionItems: string[];
  };
  actionItems?: string[];
} 