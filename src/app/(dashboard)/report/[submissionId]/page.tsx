'use client';

import { submissions } from '@/app/data';
import { Submission } from '@/types';
import ReportCard from '@/components/ReportCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ReportPage() {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchSubmission = async () => {
      try {
        // In a real app, this would be an API call
        // For demo, we'll either use existing submissions or create a fake one
        let foundSubmission = submissions.find(s => s.id === submissionId);

        // If using a dynamic ID from the exam page (like sub-timestamp)
        if (!foundSubmission && typeof submissionId === 'string' && submissionId.startsWith('sub-')) {
          // Create a fake submission with some default values
          foundSubmission = {
            id: submissionId as string,
            studentId: 'user-1',
            userName: 'John Doe',
            examId: 'exam-1',
            examTitle: 'Physics Mid-Term',
            answers: [],
            score: 78,
            totalMarks: 100,
            status: 'completed',
            startedAt: new Date().toISOString(),
            submittedAt: new Date().toISOString(),
            feedback: {
              score: 78,
              comments: 'Good attempt overall. You demonstrated solid understanding of core concepts, but some areas need improvement.',
              actionItems: [
                'Review Newton\'s laws of motion, particularly the third law',
                'Practice more problems related to kinetic energy calculations',
                'Study the relationship between force, mass, and acceleration'
              ]
            }
          };
        }

        if (foundSubmission) {
          setSubmission(foundSubmission);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSubmission();
    }, 1500);

    return () => clearTimeout(timer);
  }, [submissionId]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-7 bg-muted rounded animate-pulse w-48"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
            </div>
            <div className="h-6 bg-muted rounded animate-pulse w-20"></div>
          </div>

          <div className="space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse w-36"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
          </div>

          <div className="space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse w-36"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          <div className="h-12 bg-muted rounded animate-pulse w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Submission Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The submission you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <ReportCard submission={submission} />

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-medium mb-4">What's Next?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard" className="w-full">
            <Button variant="outline" className="w-full">
              Take Another Exam
            </Button>
          </Link>
          <Button variant="secondary" className="w-full">
            View All Attempts
          </Button>
        </div>
      </div>
    </div>
  );
} 