'use client';

import { exams } from '@/app/data';
import { Exam } from '@/types/exam';
import { Question } from '@/types/exam';
import AdminExamForm from '@/components/AdminExamForm';
import QuestionEditor from '@/components/QuestionEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchExam = async () => {
      try {
        // In a real app, this would be an API call
        const foundExam = exams.find(e => e.id === id);
        
        if (foundExam) {
          setExam(foundExam);
          setQuestions(foundExam.questions);
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
  
  const handleSaveQuestion = (question: Question) => {
    if (editingQuestion) {
      // Update existing question
      setQuestions(prevQuestions => 
        prevQuestions.map(q => q.id === question.id ? question : q)
      );
      setEditingQuestion(null);
    } else {
      // Add new question
      setQuestions(prevQuestions => [...prevQuestions, question]);
    }
    setIsAddingQuestion(false);
  };
  
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsAddingQuestion(true);
  };
  
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="h-10 bg-muted rounded animate-pulse w-64 mb-6"></div>
        
        <div className="border rounded-lg p-6 space-y-4 mb-8">
          <div className="h-6 bg-muted rounded animate-pulse w-48"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-muted rounded animate-pulse"></div>
            <div className="h-10 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-10 bg-muted rounded animate-pulse"></div>
        </div>
        
        <div className="h-8 bg-muted rounded animate-pulse w-48 mb-4"></div>
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <div className="h-6 bg-muted rounded animate-pulse w-full"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
            </div>
          ))}
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
        <Link href="/admin">
          <Button>Back to Admin</Button>
        </Link>
      </div>
    );
  }
  
  if (isAddingQuestion) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">
          {editingQuestion ? 'Edit Question' : 'Add New Question'}
        </h1>
        
        <QuestionEditor 
          question={editingQuestion || undefined}
          onSave={handleSaveQuestion}
          onCancel={() => {
            setIsAddingQuestion(false);
            setEditingQuestion(null);
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Exam</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Admin</Button>
        </Link>
      </div>
      
      <AdminExamForm exam={exam} />
      
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium">Questions ({questions.length})</h2>
          <Button onClick={() => setIsAddingQuestion(true)}>Add New Question</Button>
        </div>
        
        <div className="space-y-4">
          {questions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">No questions added yet.</p>
                <Button onClick={() => setIsAddingQuestion(true)}>Add Your First Question</Button>
              </CardContent>
            </Card>
          ) : (
            questions.map((question, index) => (
              <Card key={question.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {index + 1}. {question.text.length > 100 
                          ? `${question.text.slice(0, 100)}...` 
                          : question.text}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {question.type === 'mcq' 
                          ? `Multiple Choice • ${question.options?.length || 0} options` 
                          : 'Subjective Question'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                      Edit
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}