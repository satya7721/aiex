import { Submission } from '@/types/submission';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface ReportCardProps {
  submission: Submission;
}

export default function ReportCard({ submission }: ReportCardProps) {
  if (!submission.feedback) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Submission Processing</CardTitle>
          <CardDescription>Your submission is being processed. Please check back later.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('In a real app, this would download a PDF report.');
  };

  // Calculate score percentage
  const scorePercentage = submission.feedback.score;
  let scoreColor = "text-green-500";
  
  if (scorePercentage < 60) {
    scoreColor = "text-red-500";
  } else if (scorePercentage < 80) {
    scoreColor = "text-yellow-500";
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{submission.examTitle} Results</CardTitle>
            <CardDescription>
              Submitted on {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Not submitted'}
            </CardDescription>
          </div>
          <Badge variant={scorePercentage >= 60 ? "default" : "destructive"}>
            Score: {submission.feedback.score}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-1">
          <h3 className="text-lg font-medium">AI Feedback</h3>
          <p className="text-muted-foreground">{submission.feedback.comments}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Action Items</h3>
          <Accordion type="single" collapsible className="w-full">
            {submission.feedback.actionItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{`Action Item ${index + 1}`}</AccordionTrigger>
                <AccordionContent>{item}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-medium mb-2">Performance Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>MCQs Correct:</span>
              <span className={scorePercentage >= 70 ? "text-green-500" : "text-yellow-500"}>
                {Math.round(scorePercentage * 0.05)} / 5
              </span>
            </div>
            <div className="flex justify-between">
              <span>Subjective Quality:</span>
              <span className="text-blue-500">
                {scorePercentage >= 80 ? "Excellent" : scorePercentage >= 60 ? "Good" : "Needs Improvement"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Overall Grade:</span>
              <span className={scoreColor}>
                {scorePercentage >= 90 ? "A" : 
                 scorePercentage >= 80 ? "B" :
                 scorePercentage >= 70 ? "C" :
                 scorePercentage >= 60 ? "D" : "F"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={handleDownloadPDF}>
          Download PDF Report
        </Button>
      </CardFooter>
    </Card>
  );
}
