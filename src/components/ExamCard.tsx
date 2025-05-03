import { Exam } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ExamCardProps {
  exam: Exam;
}

export default function ExamCard({ exam }: ExamCardProps) {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{exam.title}</CardTitle>
          <Badge>{exam.subject}</Badge>
        </div>
        <CardDescription>
          Class {exam.class} • {exam.duration} minutes • {exam.questions.length} questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-sm">
            <span className="font-medium">MCQs:</span> {exam.questions.filter(q => q.type === 'mcq').length}
          </div>
          <div className="text-sm">
            <span className="font-medium">Subjective:</span> {exam.questions.filter(q => q.type === 'subjective').length}
          </div>
          <div className="text-sm">
            <span className="font-medium">Created:</span> {new Date(exam.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/exam/${exam.id}`} className="w-full">
          <Button className="w-full">Start Exam</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
