import { Submission } from '@/types/submission';
import { User } from '@/types/user';

/**
 * Calculate student performance metrics
 */
export function calculateStudentPerformance(submissions: Submission[]) {
  if (submissions.length === 0) {
    return {
      totalExams: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      completionRate: 0,
      examsTaken: []
    };
  }

  const scores = submissions.map(sub => sub.score);
  const completedSubmissions = submissions.filter(sub => sub.status === 'completed');

  return {
    totalExams: submissions.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / submissions.length),
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    completionRate: (completedSubmissions.length / submissions.length) * 100,
    examsTaken: submissions.map(sub => ({
      examId: sub.examId,
      score: sub.score,
      submittedAt: sub.submittedAt
    }))
  };
}

/**
 * Calculate class performance metrics
 */
export function calculateClassPerformance(
  submissions: Submission[],
  students: User[]
) {
  const studentCount = students.length;
  if (studentCount === 0 || submissions.length === 0) {
    return {
      averageScore: 0,
      participationRate: 0,
      topPerformers: [],
      needsImprovement: []
    };
  }

  // Group submissions by student
  const submissionsByStudent = submissions.reduce((acc, sub) => {
    if (!acc[sub.studentId]) {
      acc[sub.studentId] = [];
    }
    acc[sub.studentId].push(sub);
    return acc;
  }, {} as { [key: string]: Submission[] });

  // Calculate average scores for each student
  const studentAverages = students.map(student => {
    const studentSubs = submissionsByStudent[student.id] || [];
    const avgScore = studentSubs.length > 0
      ? studentSubs.reduce((sum, sub) => sum + sub.score, 0) / studentSubs.length
      : 0;
    return { student, avgScore };
  });

  // Sort by average score
  studentAverages.sort((a, b) => b.avgScore - a.avgScore);

  return {
    averageScore: Math.round(
      studentAverages.reduce((sum, s) => sum + s.avgScore, 0) / studentCount
    ),
    participationRate: (Object.keys(submissionsByStudent).length / studentCount) * 100,
    topPerformers: studentAverages.slice(0, 5),
    needsImprovement: studentAverages
      .filter(s => s.avgScore < 60)
      .slice(0, 5)
  };
}

/**
 * Generate time-based analytics
 */
export function generateTimeAnalytics(submissions: Submission[], period: 'day' | 'week' | 'month') {
  const now = new Date();
  const timeRanges: { start: Date; end: Date }[] = [];

  // Create time ranges based on period
  switch (period) {
    case 'day':
      for (let i = 0; i < 24; i++) {
        const start = new Date(now);
        start.setHours(i, 0, 0, 0);
        const end = new Date(start);
        end.setHours(i + 1, 0, 0, 0);
        timeRanges.push({ start, end });
      }
      break;
    case 'week':
      for (let i = 6; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(start.getDate() - i);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        timeRanges.push({ start, end });
      }
      break;
    case 'month':
      for (let i = 29; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(start.getDate() - i);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        timeRanges.push({ start, end });
      }
      break;
  }

  // Count submissions in each time range
  return timeRanges.map(range => {
    const rangeSubmissions = submissions.filter(sub => {
      const subDate = new Date(sub.submittedAt || sub.startedAt);
      return subDate >= range.start && subDate <= range.end;
    });

    return {
      start: range.start,
      end: range.end,
      count: rangeSubmissions.length,
      averageScore: rangeSubmissions.length > 0
        ? Math.round(rangeSubmissions.reduce((sum, sub) => sum + sub.score, 0) / rangeSubmissions.length)
        : 0
    };
  });
}

/**
 * Calculate improvement metrics for a student
 */
export function calculateImprovementMetrics(submissions: Submission[]) {
  if (submissions.length < 2) {
    return {
      trend: 'neutral',
      improvement: 0,
      consistencyScore: 0
    };
  }

  // Sort submissions by date
  const sortedSubs = [...submissions].sort(
    (a, b) => new Date(a.submittedAt || a.startedAt).getTime() - 
              new Date(b.submittedAt || b.startedAt).getTime()
  );

  // Calculate score differences
  const scoreDiffs = [];
  for (let i = 1; i < sortedSubs.length; i++) {
    scoreDiffs.push(sortedSubs[i].score - sortedSubs[i-1].score);
  }

  const averageImprovement = scoreDiffs.reduce((sum, diff) => sum + diff, 0) / scoreDiffs.length;
  
  // Calculate consistency score (inverse of standard deviation)
  const meanScore = sortedSubs.reduce((sum, sub) => sum + sub.score, 0) / sortedSubs.length;
  const variance = sortedSubs.reduce((sum, sub) => sum + Math.pow(sub.score - meanScore, 2), 0) / sortedSubs.length;
  const consistencyScore = Math.max(0, 100 - Math.sqrt(variance));

  return {
    trend: averageImprovement > 1 ? 'improving' : averageImprovement < -1 ? 'declining' : 'stable',
    improvement: Math.round(averageImprovement * 10) / 10,
    consistencyScore: Math.round(consistencyScore)
  };
} 