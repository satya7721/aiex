'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  BookOpen,
  BarChart3,
  Edit,
  Download,
  Share2,
  Trash2,
  MoreVertical,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Question } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { InfoCard } from '@/components/common/InfoCard';

// Mock Data for specific exam
const mockExamData = {
  id: "302",
  title: "Mid-term Mathematics Assessment",
  subject: "Mathematics",
  class: "10",
  division: "A",
  duration: 60,
  totalMarks: 100,
  status: "Published",
  participants: 45,
  date: "Feb 12, 2024",
  startTime: "09:00 AM",
  description: "Comprehensive assessment covering Algebra, Geometry, and Trigonometry units. Students are expected to demonstrate understanding of core concepts and problem-solving abilities.",
  questions: [
    {
      id: "q1",
      text: "What is the result of 2x + 5 = 15? Find x.",
      type: "multiple-choice",
      options: ["x = 5", "x = 10", "x = 2", "x = 7"],
      correctAnswer: "x = 5",
      marks: 5
    },
    {
      id: "q2",
      text: "Explain the Pythagorean theorem with a suitable example.",
      type: "text",
      marks: 10
    },
    {
      id: "q3",
      text: "Which of the following is an irrational number?",
      type: "multiple-choice",
      options: ["2.5", "√16", "π", "1/3"],
      correctAnswer: "π",
      marks: 5
    }
  ]
};

export default function ExamDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("questions");

  // In a real app, fetch exam data based on `id`
  const exam = mockExamData;

  const handleBack = () => {
    router.push('/admin');
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumbs & Actions */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-gray-900" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4" /> Back to Exams
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <Button size="sm" className="gap-2 bg-black hover:bg-black/90">
            <Edit className="h-4 w-4" /> Edit Exam
          </Button>
        </div>
      </div>

      {/* Header Info Card */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="h-2 bg-indigo-500 w-full" />
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 rounded-md px-2 py-0.5 pointer-events-none">
                  {exam.class}-{exam.division}
                </Badge>
                <StatusBadge status={exam.status} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{exam.title}</h1>
              <p className="text-muted-foreground max-w-2xl">{exam.description}</p>
            </div>

            <div className="flex gap-8 p-4 bg-gray-50 rounded-xl border border-gray-100 min-w-[300px]">
              <div className="space-y-4 flex-1">
                <InfoCard label="Subject" value={exam.subject} icon={BookOpen} color="indigo" />
                <InfoCard label="Students" value={`${exam.participants} assigned`} icon={Users} color="purple" />
              </div>
              <div className="space-y-4 flex-1">
                <InfoCard label="Date" value={exam.date} icon={Calendar} color="amber" />
                <InfoCard label="Duration" value={`${exam.duration} mins`} icon={Clock} color="emerald" />
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-8 border-b">
            {['questions', 'submissions', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 text-sm font-medium border-b-2 transition-colors capitalize",
                  activeTab === tab
                    ? "border-black text-black"
                    : "border-transparent text-muted-foreground hover:text-black hover:border-gray-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-indigo-500" />
                {exam.questions.length} Questions
              </h3>
              <div className="flex gap-2 w-full max-w-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search questions..." className="pl-9 bg-white" />
                </div>
                <Button variant="outline" size="icon" className="bg-white">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {exam.questions.map((q, i) => (
                <div key={q.id} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs font-medium text-gray-600">
                        {i + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide",
                            q.type === "multiple-choice" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                          )}>
                            {q.type === 'multiple-choice' ? "MCQ" : "Long Answer"}
                          </span>
                          <span className="text-xs text-muted-foreground">• {q.marks} marks</span>
                        </div>
                        <p className="font-medium text-base">{q.text}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>

                  {q.type === 'multiple-choice' && (
                    <div className="pl-9 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options?.map((opt, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "text-sm p-3 rounded-lg border flex items-center gap-3",
                            opt === q.correctAnswer
                              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                              : "bg-gray-50/50 border-gray-100 text-gray-600"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded-full border flex items-center justify-center",
                            opt === q.correctAnswer ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                          )}>
                            {opt === q.correctAnswer && <CheckCircle2 className="h-3 w-3 text-white" />}
                          </div>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <div className="pl-9">
                      <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-muted-foreground text-sm italic">
                        No auto-grading available for this question type.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Submissions Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Once students start taking this exam, their submissions and grades will appear here.
            </p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium mb-1">Analytics Unavailable</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Analytics will be generated after sufficient data is collected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}