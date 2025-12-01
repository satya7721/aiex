'use client';

import { useState } from 'react';
import { exams } from '@/app/data';
import { Exam } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StudentExamsPage() {
  const [availableExams] = useState<Exam[]>(exams);
  const getDuration = (exam: Exam) => exam.durationMinutes ?? exam.duration;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Available Exams</h1>

      <div className="grid gap-4">
        {availableExams.length === 0 ? (
          <Card>
            <CardHeader className="text-center">
              <CardDescription>No exams available at the moment.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          availableExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {exam.subject} • Class {exam.class}
                      <div className="mt-1">
                        Duration: {getDuration(exam)} minutes • Questions: {exam.questions.length}
                      </div>
                    </CardDescription>
                  </div>
                  <Link href={`/exam/${exam.id}`}>
                    <Button>Start Exam</Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 
