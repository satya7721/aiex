'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exams, submissions } from '@/app/data';
import { Exam, Submission } from '@/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ExamReportPage() {
  const params = useParams();
  const examId = params.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [examSubmissions, setExamSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundExam = exams.find(e => e.id === examId);
      const examSubs = submissions.filter(s => s.examId === examId);

      setExam(foundExam || null);
      setExamSubmissions(examSubs);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [examId]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Exam not found</h1>
          <Link href="/admin">
            <Button>Return to Admin Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalSubmissions = examSubmissions.length;
  const averageScore = examSubmissions.length > 0
    ? Math.round(examSubmissions.reduce((acc, sub) => acc + (sub.feedback?.score || 0), 0) / examSubmissions.length)
    : 0;
  const highestScore = examSubmissions.length > 0
    ? Math.max(...examSubmissions.map(sub => sub.feedback?.score || 0))
    : 0;
  const lowestScore = examSubmissions.length > 0
    ? Math.min(...examSubmissions.map(sub => sub.feedback?.score || 0))
    : 0;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin Dashboard
        </Link>
        <h1 className="text-2xl font-bold">{exam.title} - Report</h1>
        <p className="text-muted-foreground mt-1">
          {exam.subject} - Class {exam.class} Division {exam.division}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-xl sm:text-3xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-xl sm:text-3xl font-bold">{averageScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Highest Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-xl sm:text-3xl font-bold">{highestScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Lowest Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-xl sm:text-3xl font-bold">{lowestScore}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base sm:text-lg">Student Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="space-y-4">
            {examSubmissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Student {submission.studentId}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'Not submitted'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{submission.feedback?.score || 0}%</div>
                  </div>
                </div>
                {submission.feedback && (
                  <div className="mt-3 text-sm">
                    <p className="text-muted-foreground mb-2">{submission.feedback.comments}</p>
                    {submission.feedback.actionItems.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Action Items:</p>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {submission.feedback.actionItems.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {examSubmissions.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No submissions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 