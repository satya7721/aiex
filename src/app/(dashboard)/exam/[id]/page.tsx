'use client';

import { exams } from '@/app/data';
import ExamForm from '@/components/ExamForm';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Exam } from '@/types';

export default function ExamPage() {
  const { id } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchExam = async () => {
      try {
        // In a real app, this would be an API call
        const foundExam = exams.find(e => e.id === id);

        if (foundExam) {
          setExam(foundExam);
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
      fetchExam();
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-muted rounded animate-pulse w-64"></div>
            <div className="h-8 bg-muted rounded animate-pulse w-32"></div>
          </div>

          <div className="h-4 bg-muted rounded animate-pulse w-48"></div>

          <div className="border rounded-lg p-8 space-y-6">
            <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>

            <div className="space-y-4 mt-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse flex-grow"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="h-10 bg-muted rounded animate-pulse w-28"></div>
            <div className="h-10 bg-muted rounded animate-pulse w-28"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Exam Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The exam you're looking for doesn't exist or has been removed.
        </p>
        <a href="/dashboard" className="text-primary hover:underline">
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <ExamForm exam={exam} />
    </div>
  );
} 