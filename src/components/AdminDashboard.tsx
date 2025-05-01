import { useState } from 'react';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminDashboardProps,
  MonthOption,
  ExamStats,
  ExamByBatchAndDivision,
  StatsCardProps,
  ExamListItemProps,
  DivisionSectionProps,
  BatchSectionProps,
  MonthSelectorProps
} from '@/types/admin';

// Stats Card Component
const StatsCard = ({ title, value, suffix = '' }: StatsCardProps) => (
  <Card>
    <CardHeader className="p-4 pb-2 sm:pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-1 sm:pt-2">
      <div className="text-xl sm:text-3xl font-bold">
        {value}{suffix}
      </div>
    </CardContent>
  </Card>
);

// Month Selector Component
const MonthSelector = ({ selectedMonth, onMonthChange, monthOptions }: MonthSelectorProps) => (
  <Select value={selectedMonth} onValueChange={onMonthChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select month" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Time</SelectItem>
      {monthOptions.map(option => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// Exam List Item Component
const ExamListItem = ({ exam, onViewReport }: ExamListItemProps) => (
  <div className="flex justify-between items-center text-sm">
    <span className="truncate mr-4">{exam.title}</span>
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{exam.questions.length} questions</span>
      <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onViewReport(exam.id)}>
        <BarChart3 className="h-4 w-4" />
        <span className="sr-only">View Report</span>
      </Button>
    </div>
  </div>
);

// Division Section Component
const DivisionSection = ({ division, exams, onViewReport }: DivisionSectionProps) => (
  <div className="border rounded-lg p-4">
    <h4 className="font-medium mb-3">Division {division}</h4>
    <div className="space-y-2">
      {exams.map((exam) => (
        <ExamListItem key={exam.id} exam={exam} onViewReport={onViewReport} />
      ))}
      {exams.length === 0 && (
        <div className="text-center text-muted-foreground text-sm">
          No exams for this division
        </div>
      )}
    </div>
  </div>
);

// Batch Section Component
const BatchSection = ({ batch, divisions, onViewReport }: BatchSectionProps) => (
  <AccordionItem value={batch}>
    <AccordionTrigger className="text-base font-medium">
      {batch}th Standard
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-4">
        {Object.entries(divisions).map(([division, exams]) => (
          <DivisionSection
            key={division}
            division={division}
            exams={exams}
            onViewReport={onViewReport}
          />
        ))}
      </div>
    </AccordionContent>
  </AccordionItem>
);

export default function AdminDashboard({ exams, submissions }: AdminDashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate month options for the last 6 months
  const monthOptions: MonthOption[] = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentYear, currentMonth - i, 1);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
    };
  });

  // Filter data based on selected month
  const filterDataByMonth = <T extends { [key: string]: any }>(data: T[], dateField: keyof T): T[] => {
    if (selectedMonth === 'all') return data;
    
    const [year, month] = selectedMonth.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField] as string);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const filteredExams = filterDataByMonth(exams, 'createdAt');
  const filteredSubmissions = filterDataByMonth(submissions, 'submittedAt');

  // Calculate statistics
  const stats: ExamStats = {
    totalExams: filteredExams.length,
    totalSubmissions: filteredSubmissions.length,
    totalQuestions: filteredExams.reduce((acc, exam) => acc + exam.questions.length, 0),
    averageScore: filteredSubmissions.length > 0
      ? Math.round(filteredSubmissions.reduce((acc, sub) => acc + (sub.feedback?.score || 0), 0) / filteredSubmissions.length)
      : 0
  };

  // Group exams by batch and division
  const examsByBatchAndDivision: ExamByBatchAndDivision = filteredExams.reduce((acc, exam) => {
    const batch = exam.class.toString();
    const division = exam.division || 'A';
    
    if (!acc[batch]) {
      acc[batch] = {};
    }
    if (!acc[batch][division]) {
      acc[batch][division] = [];
    }
    acc[batch][division].push(exam);
    return acc;
  }, {} as ExamByBatchAndDivision);

  const handleViewReport = (examId: string) => {
    window.location.href = `/admin/reports/${examId}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          monthOptions={monthOptions}
        />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatsCard title="Total Exams" value={stats.totalExams} />
        <StatsCard title="Total Questions" value={stats.totalQuestions} />
        <StatsCard title="Submissions" value={stats.totalSubmissions} />
        <StatsCard title="Avg. Score" value={stats.averageScore} suffix="%" />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-base sm:text-lg">Exams by Batch and Division</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(examsByBatchAndDivision).map(([batch, divisions]) => (
                <BatchSection
                  key={batch}
                  batch={batch}
                  divisions={divisions}
                  onViewReport={handleViewReport}
                />
              ))}
              {Object.keys(examsByBatchAndDivision).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No exams available
                </div>
              )}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 