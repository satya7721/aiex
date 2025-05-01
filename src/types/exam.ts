export interface Question {
  id: string;
  text: string;
  type: 'mcq' | 'subjective';
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