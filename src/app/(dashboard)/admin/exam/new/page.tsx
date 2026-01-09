"use client";

import CreateExamForm from '@/components/CreateExamForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreateExamFormData } from '@/types';
import { Loader2 } from 'lucide-react';

export default function NewExamPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateExam = async (data: CreateExamFormData) => {
    setIsLoading(true);

    // Simulate API call to save exam
    // In a real application, you would POST to /api/exams
    console.log("Creating exam with data:", data);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a mock ID effectively or rely on backend response
      const newExamId = "exam-" + Math.random().toString(36).substr(2, 9);

      // Navigate to the detail page
      router.push(`/admin/exam/${newExamId}`);
    } catch (error) {
      console.error("Failed to create exam:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h2 className="mt-4 text-2xl font-semibold">Creating Exam...</h2>
        <p className="text-muted-foreground">Please wait while we set everything up</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Exam</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Admin</Button>
        </Link>
      </div>

      <CreateExamForm onSubmit={handleCreateExam} isLoading={isLoading} />
    </div>
  );
} 