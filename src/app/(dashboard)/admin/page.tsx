'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Plus,
  Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { ExamTimelineCard } from '@/components/common/ExamTimelineCard';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type TimelineDay = {
  date: string;
  exams: {
    id: string;
    className: string;
    title: string;
    grade: string;
    status: string;
    participants: number;
    color: string;
    time: string;
    duration: string;
  }[]
};

export default function AdminPage() {
  const [timelineData, setTimelineData] = useState<TimelineDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false }); // Using created_at as proxy for scheduled/upcoming since no explicit date field in schema yet

      if (error) {
        console.error("Error fetching exams:", error);
      } else if (data) {
        // Simple grouping by date (using created_at for now)
        const grouped: Record<string, any[]> = {};

        data.forEach((exam: any) => {
          const date = new Date(exam.created_at).toLocaleDateString(undefined, {
            weekday: 'short', month: 'short', day: 'numeric'
          });
          if (!grouped[date]) grouped[date] = [];

          grouped[date].push({
            id: exam.id,
            className: `Division ${exam.division || 'A'}`,
            title: exam.title,
            grade: `Grade ${exam.class_grade}`,
            status: exam.status === 'published' ? 'Confirmed' : 'Draft',
            participants: 0, // Need to count submissions separately if needed
            color: 'indigo', // Random or based on subject
            time: new Date(exam.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
            duration: `${Math.floor((exam.duration_minutes || 60) / 60)}h ${(exam.duration_minutes || 60) % 60}m`
          });
        });

        const formatted = Object.keys(grouped).map(date => ({
          date,
          exams: grouped[date]
        }));

        setTimelineData(formatted);
      }
      setIsLoading(false);
    };

    fetchExams();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading exam timeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto">
      {/* Header */}
      <PageHeader
        title="Exams Timeline"
        description="View upcoming exams in a chronological timeline."
        breadcrumbs={[
          { label: "Maham", href: "#" },
          { label: "Exams", active: true }
        ]}
        actions={
          <Link href="/admin/exam/new">
            <Button className="rounded-full gap-2">
              <Plus className="h-4 w-4" /> Create Exam
            </Button>
          </Link>
        }
      />

      {/* Timeline View */}
      <div className="space-y-8 relative">
        {/* Continuous vertical line for the timeline */}
        <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-200" />

        {timelineData.length > 0 ? (
          timelineData.map((day, dayIndex) => (
            <div key={dayIndex} className="relative">
              {/* Date Header */}
              <div className="flex items-center gap-4 mb-6 relative">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-primary z-10 flex items-center justify-center shadow-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground/80 bg-background/50 backdrop-blur-sm px-2 py-1 rounded-md">
                  {day.date}
                </h3>
              </div>

              {/* Exams Lists */}
              <div className="pl-12 space-y-4">
                {day.exams.map((exam) => (
                  <ExamTimelineCard
                    key={exam.id}
                    id={exam.id}
                    className={exam.className}
                    title={exam.title}
                    grade={exam.grade}
                    participants={exam.participants}
                    status={exam.status}
                    time={exam.time}
                    duration={exam.duration}
                    color={exam.color}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="pl-12 py-8 text-muted-foreground">
            No exams scheduled. Click "Create Exam" to get started.
          </div>
        )}

        {/* End of Timeline Indicator */}
        <div className="flex items-center gap-4 relative pl-0.5">
          <div className="w-8 h-8 rounded-full bg-gray-100 z-10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
          <p className="text-sm text-muted-foreground">End of scheduled exams</p>
        </div>
      </div>
    </div>
  );
}