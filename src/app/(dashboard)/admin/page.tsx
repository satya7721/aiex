'use client';

import { exams, submissions } from '@/app/data';
import { Exam } from '@/types/exam';
import AdminDashboard from '@/components/AdminDashboard';
import ExamActions from '@/components/ExamActions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [localExams, setLocalExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalExams(exams);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleDeleteExam = (examId: string) => {
    setLocalExams(prevExams => prevExams.filter(exam => exam.id !== examId));
  };
  
  const handleDuplicateExam = (exam: Exam) => {
    const newExam: Exam = {
      ...exam,
      id: `exam-${Date.now()}`,
      title: `${exam.title} (Copy)`,
      createdAt: new Date().toISOString()
    };
    
    setLocalExams(prevExams => [...prevExams, newExam]);
  };
  
  const filteredExams = searchTerm
    ? localExams.filter(exam => 
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : localExams;
  
  const renderExamsTab = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <div className="h-6 bg-muted rounded animate-pulse w-48"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
              <div className="flex justify-end">
                <div className="h-8 bg-muted rounded animate-pulse w-20"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (filteredExams.length === 0) {
      return (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? 'No exams found matching your search.'
              : 'No exams have been created yet.'}
          </p>
          {!searchTerm && (
            <Link href="/admin/exam/new">
              <Button>Create Your First Exam</Button>
            </Link>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredExams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div className="mr-2">
                  <CardTitle className="text-base sm:text-lg break-words pr-2">{exam.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Class {exam.class} • {exam.subject} • {exam.questions.length} questions
                  </CardDescription>
                </div>
                <ExamActions 
                  exam={exam}
                  onDelete={handleDeleteExam}
                  onDuplicate={handleDuplicateExam}
                />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  };
  
  // Get completed exams with submission counts
  const completedExams = exams.map(exam => {
    const examSubmissions = submissions.filter(sub => sub.examId === exam.id);
    return {
      ...exam,
      submissionCount: examSubmissions.length,
      averageScore: examSubmissions.length > 0
        ? Math.round(examSubmissions.reduce((acc, sub) => acc + (sub.feedback?.score || 0), 0) / examSubmissions.length)
        : 0
    };
  }).sort((a, b) => b.submissionCount - a.submissionCount);
  
  return (
    <div className="container max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="grow sm:grow-0">
            <Button variant="outline" className="w-full sm:w-auto" size="sm" sm-size="default">Back to Home</Button>
          </Link>
          <Link href="/admin/exam/new" className="grow sm:grow-0">
            <Button className="w-full sm:w-auto" size="sm" sm-size="default">Create New Exam</Button>
          </Link>
        </div>
      </div>
      
      {!loading && (
        <div className="mb-8">
          <AdminDashboard exams={localExams} submissions={submissions} />
        </div>
      )}
      
      <Tabs defaultValue="exams" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="submissions">Completed Exams</TabsTrigger>
        </TabsList>
        <TabsContent value="exams">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg sm:text-xl font-medium">Available Exams</h2>
            <div className="flex w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Input
                  placeholder="Search exams..."
                  className="w-full sm:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </button>
                )}
              </div>
              <Link href="/admin/exam/new" className="ml-2">
                <Button size="sm">Add</Button>
              </Link>
            </div>
          </div>
          {renderExamsTab()}
        </TabsContent>
        
        <TabsContent value="submissions">
          <h2 className="text-lg sm:text-xl font-medium mb-4">Completed Exams</h2>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base sm:text-lg">Completed Exams</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-4">
                {completedExams.map((exam) => (
                  <div key={exam.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{exam.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exam.subject} - Class {exam.class} Division {exam.division}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{exam.averageScore}%</div>
                        <div className="text-sm text-muted-foreground">{exam.submissionCount} submissions</div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link href={`/admin/reports/${exam.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          View Report
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {completedExams.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No completed exams
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 