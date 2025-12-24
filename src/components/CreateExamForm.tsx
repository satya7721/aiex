import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { LiveDateSelector } from './LiveDateSelector';
import { CreateExamFormProps, CreateExamFormData } from '@/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  class: z.coerce.number().min(1, 'Class is required'),
  division: z.string().min(1, 'Division is required'),
  duration: z.coerce.number().min(1, 'Duration is required'),
  totalMarks: z.coerce.number().min(1, 'Total marks is required'),
  liveDate: z.date().optional(),
  questions: z.array(z.object({
    text: z.string().min(1, 'Question text is required'),
    type: z.enum(['multiple-choice', 'text']),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().optional(),
  })).min(1, 'At least one question is required'),
});

export default function CreateExamForm({ onSubmit, isLoading }: CreateExamFormProps) {
  const [questions, setQuestions] = useState<CreateExamFormData['questions']>([
    { text: '', type: 'multiple-choice', options: [''] },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: '',
      subject: '',
      class: undefined,
      division: '',
      duration: 60,
      totalMarks: 100,
      questions: questions,
    },
  });

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'multiple-choice', options: [''] }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof CreateExamFormData['questions'][0], value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = [...(newQuestions[questionIndex].options || []), ''];
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options?.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options[optionIndex] = value;
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      questions: questions.map(q => ({
        ...q,
        options: q.type === 'multiple-choice' ? q.options : undefined,
      })),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter exam title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter class" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <FormControl>
                  <Input placeholder="Enter division" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter duration" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalMarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Marks</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter total marks" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="liveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live Date</FormLabel>
                <FormControl>
                  <LiveDateSelector
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Questions</h3>
            <Button type="button" onClick={addQuestion} disabled={isLoading}>
              Add Question
            </Button>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name={`questions.${index}.text`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question {index + 1}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter question"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateQuestion(index, 'text', e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`questions.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 border rounded-md"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateQuestion(index, 'type', e.target.value);
                            }}
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="text">Text</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {question.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      <FormLabel>Options</FormLabel>
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeOption(index, optionIndex)}
                            disabled={isLoading}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addOption(index)}
                        disabled={isLoading}
                      >
                        Add Option
                      </Button>
                    </div>
                  )}

                  {question.type === 'multiple-choice' && (
                    <FormField
                      control={form.control}
                      name={`questions.${index}.correctAnswer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correct Answer</FormLabel>
                          <FormControl>
                            <select
                              className="w-full p-2 border rounded-md"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                updateQuestion(index, 'correctAnswer', e.target.value);
                              }}
                            >
                              <option value="">Select correct answer</option>
                              {question.options?.map((option, optionIndex) => (
                                <option key={optionIndex} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeQuestion(index)}
                  disabled={isLoading}
                  className="ml-4"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Exam'}
        </Button>
      </form>
    </Form>
  );
} 