'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Plus
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { ExamTimelineCard } from '@/components/common/ExamTimelineCard';

// Mock Data for Timeline View
const timelineData = [
  {
    date: "Today, Feb 12",
    exams: [
      {
        id: "302",
        className: "Class 302",
        title: "Math Exam",
        grade: "Grade 12",
        status: "Confirmed",
        participants: 19,
        color: "indigo",
        time: "08:00 AM",
        duration: "1h 30m"
      },
      {
        id: "303",
        className: "Class 303",
        title: "Physics Exam",
        grade: "Grade 10",
        status: "Confirmed",
        participants: 18,
        color: "amber",
        time: "10:30 AM",
        duration: "1h 00m"
      }
    ]
  },
  {
    date: "Tomorrow, Feb 13",
    exams: [
      {
        id: "304",
        className: "Class 304",
        title: "Art Exam",
        grade: "Grade 9",
        status: "Confirmed",
        participants: 20,
        color: "rose",
        time: "09:00 AM",
        duration: "2h 00m"
      }
    ]
  },
  {
    date: "Mon, Feb 15",
    exams: [
      {
        id: "305",
        className: "Class 305",
        title: "English Exam",
        grade: "Grade 11",
        status: "Confirmed",
        participants: 18,
        color: "emerald",
        time: "08:00 AM",
        duration: "1h 15m"
      },
      {
        id: "302b",
        className: "Class 302",
        title: "Advanced Math",
        grade: "Grade 12",
        status: "Pending",
        participants: 19,
        color: "indigo",
        time: "02:00 PM",
        duration: "1h 30m"
      }
    ]
  }
];

export default function AdminPage() {
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

        {timelineData.map((day, dayIndex) => (
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
        ))}

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