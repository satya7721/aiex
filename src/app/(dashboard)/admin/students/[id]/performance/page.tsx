'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { users } from '@/app/data';
import { submissions } from '@/app/data';
import { User } from '@/types/user';

export default function StudentPerformancePage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const studentData = users.find(u => u.id === params.id && u.type === 'student');
    setStudent(studentData || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Student not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Get student's submissions
  const studentSubmissions = submissions.filter(sub => sub.studentId === student.id);
  
  // Calculate statistics
  const totalExams = studentSubmissions.length;
  const averageScore = totalExams > 0
    ? Math.round(studentSubmissions.reduce((acc, sub) => acc + (sub.score || 0), 0) / totalExams)
    : 0;
  const highestScore = totalExams > 0
    ? Math.max(...studentSubmissions.map(sub => sub.score || 0))
    : 0;
  const lowestScore = totalExams > 0
    ? Math.min(...studentSubmissions.map(sub => sub.score || 0))
    : 0;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{student.name}'s Performance</h1>
        <p className="text-muted-foreground">
          Class {student.class} Division {student.division}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Exams
            </CardTitle>
            <div className="text-2xl font-bold">{totalExams}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
            <div className="text-2xl font-bold">{averageScore}%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Highest Score
            </CardTitle>
            <div className="text-2xl font-bold">{highestScore}%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lowest Score
            </CardTitle>
            <div className="text-2xl font-bold">{lowestScore}%</div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exams</CardTitle>
          <CardDescription>
            List of all exams taken by {student.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentSubmissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{submission.examTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(submission.submittedAt || '').toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    submission.score >= 80 ? 'bg-green-100 text-green-700' :
                    submission.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Score: {submission.score}%
                  </div>
                </div>
              </div>
            ))}
            {studentSubmissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No exams taken yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 