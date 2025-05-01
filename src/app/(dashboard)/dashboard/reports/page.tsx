'use client';

import { useState } from 'react';
import { submissions } from '@/app/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Submission } from '@/types/submission';

export default function StudentReportsPage() {
  const [mySubmissions] = useState<Submission[]>(submissions);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Reports</h1>
      
      <div className="grid gap-4">
        {mySubmissions.length === 0 ? (
          <Card>
            <CardHeader className="text-center">
              <CardDescription>You haven't taken any exams yet.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          mySubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle>{submission.examTitle}</CardTitle>
                <CardDescription>
                  {submission.submittedAt && 
                    `Submitted on ${new Date(submission.submittedAt).toLocaleDateString()}`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {submission.feedback && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">Score</span>
                        <span className="font-medium">{submission.feedback.score}%</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Comments</h4>
                        <p className="text-sm text-muted-foreground">{submission.feedback.comments}</p>
                      </div>
                      {submission.feedback.actionItems && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Action Items</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {submission.feedback.actionItems.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 