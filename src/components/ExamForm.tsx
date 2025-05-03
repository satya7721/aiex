'use client';

import { Exam, Question, Answer } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Timer from './Timer';
import { useRouter } from 'next/navigation';

interface ExamFormProps {
  exam: Exam;
}

export default function ExamForm({ exam }: ExamFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const handleMCQAnswer = (questionId: string, optionIndex: number) => {
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { questionId, answer: optionIndex };
        return newAnswers;
      } else {
        return [...prev, { questionId, answer: optionIndex }];
      }
    });
  };

  const handleSubjectiveAnswer = (questionId: string, text: string) => {
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { questionId, answer: text };
        return newAnswers;
      } else {
        return [...prev, { questionId, answer: text }];
      }
    });
  };

  const handleSubmit = () => {
    // Simulate API call to submit exam
    // In a real app, this would send data to the backend
    const submissionId = `sub-${Date.now()}`;

    // Navigate to the report page
    router.push(`/report/${submissionId}`);
  };

  const handleTimeEnd = () => {
    setIsTimeUp(true);
    setIsSubmitDialogOpen(true);
  };

  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;

  const getCurrentAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.answer;
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{exam.title}</h1>
        <Timer durationMinutes={exam.duration} onTimeEnd={handleTimeEnd} />
      </div>

      <div className="flex justify-between text-sm mb-4">
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        <span>{currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'Subjective'}</span>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-medium mb-6">{currentQuestion.text}</h2>

        {currentQuestion.type === 'mcq' && currentQuestion.options && (
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestion.id}`}
                  className="w-4 h-4"
                  checked={getCurrentAnswer(currentQuestion.id) === index}
                  onChange={() => handleMCQAnswer(currentQuestion.id, index)}
                />
                <label htmlFor={`option-${index}`} className="flex-grow">{option}</label>
              </div>
            ))}
          </div>
        )}

        {currentQuestion.type === 'subjective' && (
          <Textarea
            placeholder="Write your answer here..."
            className="min-h-32"
            value={getCurrentAnswer(currentQuestion.id) as string || ''}
            onChange={(e) => handleSubjectiveAnswer(currentQuestion.id, e.target.value)}
          />
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
          >
            Next
          </Button>
        ) : (
          <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button>Submit Exam</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isTimeUp ? "Time's up!" : "Submit Exam"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isTimeUp
                    ? "Your time is up. Your answers will be submitted now."
                    : "Are you sure you want to submit your exam? You won't be able to change your answers after submission."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                {!isTimeUp && (
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                )}
                <AlertDialogAction onClick={handleSubmit}>
                  {isTimeUp ? "Proceed" : "Submit"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const isAnswered = answers.some(a => a.questionId === exam.questions[index].id);
            return (
              <Button
                key={index}
                variant={currentQuestionIndex === index ? "default" : isAnswered ? "outline" : "ghost"}
                className="w-10 h-10 p-0"
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
