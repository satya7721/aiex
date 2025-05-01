import { Submission, Answer } from '@/types/submission';
import { Question } from '@/types/exam';

/**
 * Calculate total score for a submission based on answers
 */
export function calculateSubmissionScore(answers: Answer[], questions: Question[]): number {
  return answers.reduce((total, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return total;

    // For MCQ questions
    if (question.type === 'mcq') {
      return total + (Number(answer.answer) === Number(question.correctOption) ? question.marks : 0);
    }

    // For subjective questions, use marks if provided
    return total + (answer.marks || 0);
  }, 0);
}

/**
 * Validate submission answers against exam questions
 */
export function validateSubmissionAnswers(answers: Answer[], questions: Question[]): boolean {
  // Check if we have an answer for each question
  const answeredQuestionIds = new Set(answers.map(a => a.questionId));
  const allQuestionIds = new Set(questions.map(q => q.id));

  // All questions should be answered
  return questions.every(q => answeredQuestionIds.has(q.id)) &&
         answers.every(a => allQuestionIds.has(a.questionId));
}

/**
 * Generate feedback object based on submission performance
 */
export function generateSubmissionFeedback(score: number, totalMarks: number) {
  const percentage = (score / totalMarks) * 100;
  const comments = [];
  const actionItems = [];

  // Generate comments based on performance
  if (percentage >= 90) {
    comments.push('Excellent performance! You have demonstrated exceptional understanding of the subject matter.');
    actionItems.push('Focus on maintaining this high level of performance');
  } else if (percentage >= 75) {
    comments.push('Very good performance. You show strong grasp of most concepts.');
    actionItems.push('Review the few questions you missed to achieve excellence');
  } else if (percentage >= 60) {
    comments.push('Good effort. There is room for improvement in some areas.');
    actionItems.push('Focus on topics where you scored less');
    actionItems.push('Practice more questions in challenging areas');
  } else {
    comments.push('You need to work harder to improve your understanding of the subject.');
    actionItems.push('Review fundamental concepts thoroughly');
    actionItems.push('Seek additional help from teachers');
    actionItems.push('Practice regularly with more questions');
  }

  return {
    score: percentage,
    comments: comments.join(' '),
    actionItems
  };
}

/**
 * Check if submission time is within exam duration
 */
export function isSubmissionWithinDuration(
  startTime: Date,
  endTime: Date,
  durationMinutes: number
): boolean {
  const durationMs = durationMinutes * 60 * 1000;
  const actualDurationMs = endTime.getTime() - startTime.getTime();
  return actualDurationMs <= durationMs;
}

/**
 * Get submission status with time remaining
 */
export function getSubmissionStatus(
  startTime: Date,
  durationMinutes: number
): { status: 'in_progress' | 'time_up'; timeRemaining: number } {
  const now = new Date();
  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
  const timeRemaining = Math.max(0, endTime.getTime() - now.getTime()) / 1000; // in seconds

  return {
    status: timeRemaining > 0 ? 'in_progress' : 'time_up',
    timeRemaining: Math.floor(timeRemaining)
  };
} 