'use client';

import { exams } from '@/app/data';
import ExamCard from '@/components/ExamCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
      
      <h2 className="text-2xl font-medium mb-6">Available Exams</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="h-7 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
      
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-medium mb-6">Recent Activity</h2>
        
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No recent activity found. Start an exam to see your progress here.
          </div>
        )}
      </div>
    </div>
  );
} 