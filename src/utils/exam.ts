import { Exam, Question, Submission } from "@/types";

/**
 * Calculate total marks for an exam based on its questions
 */
export function calculateTotalMarks(questions: Question[]): number {
  return questions.reduce((total, question) => total + question.marks, 0);
}

/**
 * Calculate exam statistics from submissions
 */
export function calculateExamStatistics(submissions: Submission[]) {
  const totalSubmissions = submissions.length;

  if (totalSubmissions === 0) {
    return {
      totalSubmissions: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      completionRate: 0,
      averageCompletionTime: 0,
    };
  }

  const scores = submissions.map((sub) => sub.score);
  const completedSubmissions = submissions.filter(
    (sub) => sub.status === "completed"
  );

  // Calculate completion times in minutes
  const completionTimes = submissions
    .filter((sub) => sub.submittedAt && sub.startedAt)
    .map((sub) => {
      const start = new Date(sub.startedAt);
      const end = new Date(sub.submittedAt!);
      return (end.getTime() - start.getTime()) / (1000 * 60); // Convert to minutes
    });

  return {
    totalSubmissions,
    averageScore: Math.round(
      scores.reduce((a, b) => a + b, 0) / totalSubmissions
    ),
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    completionRate: (completedSubmissions.length / totalSubmissions) * 100,
    averageCompletionTime:
      completionTimes.length > 0
        ? Math.round(
            completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
          )
        : 0,
  };
}

/**
 * Group exams by batch (class) and division
 */
export function groupExamsByBatchAndDivision(exams: Exam[]) {
  return exams.reduce((acc, exam) => {
    const batch = exam.class.toString();
    const division = exam.division || "A";

    if (!acc[batch]) {
      acc[batch] = {};
    }
    if (!acc[batch][division]) {
      acc[batch][division] = [];
    }
    acc[batch][division].push(exam);
    return acc;
  }, {} as { [key: string]: { [key: string]: Exam[] } });
}

/**
 * Filter exams by date range
 */
export function filterExamsByDateRange(
  exams: Exam[],
  startDate: Date,
  endDate: Date
): Exam[] {
  return exams.filter((exam) => {
    const examDate = new Date(exam.createdAt);
    return examDate >= startDate && examDate <= endDate;
  });
}

/**
 * Calculate score distribution ranges
 */
export function calculateScoreDistribution(
  submissions: Submission[],
  rangeSize: number = 10
) {
  const ranges: { min: number; max: number; count: number }[] = [];

  // Create ranges from 0 to 100 with specified size
  for (let i = 0; i < 100; i += rangeSize) {
    ranges.push({
      min: i,
      max: i + rangeSize,
      count: 0,
    });
  }

  // Count submissions in each range
  submissions.forEach((submission) => {
    const rangeIndex = Math.floor(submission.score / rangeSize);
    if (rangeIndex >= 0 && rangeIndex < ranges.length) {
      ranges[rangeIndex].count++;
    }
  });

  return ranges;
}
