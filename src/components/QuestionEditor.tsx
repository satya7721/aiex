'use client';

import { Question } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface QuestionEditorProps {
  question?: Question; // Optional - if provided, we're editing an existing question
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export default function QuestionEditor({ question, onSave, onCancel }: QuestionEditorProps) {
  const isEditing = !!question;
  const [questionType, setQuestionType] = useState<'mcq' | 'subjective'>(question?.type || 'mcq');
  const [questionText, setQuestionText] = useState(question?.text || '');
  const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<number>(Number(question?.correctOption) || 0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // Need at least 2 options

    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    // Adjust correctOption if needed
    if (correctOption === index) {
      setCorrectOption(0);
    } else if (correctOption > index) {
      setCorrectOption(correctOption - 1);
    }
  };

  const handleSave = () => {
    const newQuestion: Question = {
      id: question?.id || `q-${Date.now()}`,
      type: questionType,
      text: questionText,
      marks: question?.marks || 10,
      ...(questionType === 'mcq' && {
        options,
        correctOption
      })
    };

    onSave(newQuestion);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{isEditing ? 'Edit Question' : 'Add New Question'}</CardTitle>
          {isEditing && (
            <Badge variant={questionType === 'mcq' ? 'default' : 'outline'}>
              {questionType === 'mcq' ? 'Multiple Choice' : 'Subjective'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isEditing && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Type</label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={questionType === 'mcq' ? 'default' : 'outline'}
                onClick={() => setQuestionType('mcq')}
                className="flex-1"
              >
                Multiple Choice
              </Button>
              <Button
                type="button"
                variant={questionType === 'subjective' ? 'default' : 'outline'}
                onClick={() => setQuestionType('subjective')}
                className="flex-1"
              >
                Subjective
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="questionText" className="text-sm font-medium">
            Question Text
          </label>
          <Textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter the question here..."
            rows={3}
            required
          />
        </div>

        {questionType === 'mcq' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Answer Options</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
              >
                Add Option
              </Button>
            </div>

            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="radio"
                  className="w-4 h-4"
                  checked={correctOption === index}
                  onChange={() => setCorrectOption(index)}
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-grow"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Select the radio button next to the correct answer.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>

          {isEditing && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="ml-2"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Question</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this question? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onCancel}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <Button
          type="button"
          onClick={handleSave}
          disabled={!questionText || (questionType === 'mcq' && options.some(opt => !opt))}
        >
          Save Question
        </Button>
      </CardFooter>
    </Card>
  );
}
