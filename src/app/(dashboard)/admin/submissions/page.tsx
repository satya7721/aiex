'use client';

import { submissions } from '@/app/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminSubmissionsPage() {
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
        <h1 className="text-3xl font-bold">Student Submissions</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Admin</Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <div className="h-6 bg-muted rounded animate-pulse w-48"></div>
                <div className="h-6 bg-muted rounded animate-pulse w-24"></div>
              </div>
              <div className="h-4 bg-muted rounded animate-pulse w-64"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">No submissions have been received yet.</p>
            </div>
          ) : (
            <>
              <div className="bg-muted p-4 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by student name or exam..."
                      className="w-full px-3 py-2 rounded-md border"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 rounded-md border bg-background">
                      <option value="">All Exams</option>
                      <option value="exam-1">Physics Mid-Term</option>
                      <option value="exam-2">Chemistry Final</option>
                      <option value="exam-3">Mathematics Quiz</option>
                    </select>
                    <select className="px-3 py-2 rounded-md border bg-background">
                      <option value="">Sort by Date</option>
                      <option value="score-high">Score (High to Low)</option>
                      <option value="score-low">Score (Low to High)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{submission.userName}</h3>
                        <p className="text-sm text-muted-foreground">{submission.examTitle}</p>
                      </div>
                      {submission.feedback && (
                        <div className={`text-sm font-medium px-2 py-1 rounded ${
                          submission.feedback.score >= 80 ? 'bg-green-100 text-green-700' : 
                          submission.feedback.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          Score: {submission.feedback.score}%
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs">
                      <span>Submitted: {new Date(submission.submittedAt).toLocaleString()}</span>
                      <div className="space-x-2">
                        <Link href={`/report/${submission.id}`} className="text-primary hover:underline">
                          View Report
                        </Link>
                        <span>•</span>
                        <button className="text-muted-foreground hover:text-foreground hover:underline">
                          Download
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="w-8">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 