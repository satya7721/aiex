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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Label } from './ui/label';
import {
  Wand2,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
  Layout,
  Settings2,
  ListChecks,
  FileCheck2,
  Plus,
  Trash2,
  GripVertical,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';

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

const steps = [
  { id: 1, title: "Exam Details", icon: Layout, description: "Basic info" },
  { id: 2, title: "Configuration", icon: Settings2, description: "Time & marks" },
  { id: 3, title: "Questions", icon: ListChecks, description: "Build content" },
  { id: 4, title: "Review", icon: FileCheck2, description: "Final check" },
];

export default function CreateExamForm({ onSubmit, isLoading }: CreateExamFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [questions, setQuestions] = useState<CreateExamFormData['questions']>([
    { text: '', type: 'multiple-choice', options: [''] },
  ]);

  // AI Generation State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    subject: '',
    topics: '',
    difficulty: 'medium',
    questionCount: 5,
    durationMinutes: 30
  });

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
    mode: "onChange"
  });

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ['title', 'subject', 'class', 'division'];
    if (currentStep === 2) fieldsToValidate = ['duration', 'totalMarks', 'liveDate'];
    if (currentStep === 3) fieldsToValidate = ['questions'];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

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
    form.setValue('questions', newQuestions); // Sync with form
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = [...(newQuestions[questionIndex].options || []), ''];
    setQuestions(newQuestions);
    form.setValue('questions', newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options?.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
    form.setValue('questions', newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options[optionIndex] = value;
      setQuestions(newQuestions);
      form.setValue('questions', newQuestions);
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

  const handleGenerateWithAI = async () => {
    if (!aiConfig.subject) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/exams/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: aiConfig.subject,
          topics: aiConfig.topics.split(',').map(t => t.trim()).filter(Boolean),
          difficulty: aiConfig.difficulty,
          questionCount: aiConfig.questionCount,
          durationMinutes: aiConfig.durationMinutes,
          class: form.getValues('class')?.toString() || "10",
          division: form.getValues('division') || "A"
        }),
      });

      const data = await response.json();

      if (!data.ok || !data.exam) {
        throw new Error(data.error || 'Failed to generate exam');
      }

      const generatedExam = data.exam;

      // Populate form with generated data
      form.setValue('title', generatedExam.title);
      form.setValue('subject', generatedExam.subject);
      form.setValue('duration', generatedExam.durationMinutes || aiConfig.durationMinutes);
      form.setValue('totalMarks', generatedExam.totalMarks || 100);

      // Update questions state
      const mappedQuestions = generatedExam.questions.map((q: any) => ({
        text: q.text,
        type: q.type === 'mcq' ? 'multiple-choice' as const : 'text' as const,
        options: q.options && q.options.length > 0 ? q.options : [''],
        correctAnswer: q.correctOption !== undefined && q.options ? q.options[q.correctOption] : undefined,
      }));

      setQuestions(mappedQuestions);
      form.setValue('questions', mappedQuestions);

      setIsAiModalOpen(false);

    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate exam using AI. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black transition-all duration-300 -z-10"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted ? "bg-black border-black text-white" :
                      isCurrent ? "bg-white border-black text-black ring-4 ring-black/5" : "bg-white border-gray-200 text-gray-400"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <div className="text-center">
                  <p className={cn("text-xs font-semibold uppercase tracking-wider", isCurrent ? "text-black" : "text-muted-foreground")}>
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm ring-1 ring-gray-200/50">
            <CardContent className="p-8">

              {/* Step 1: Exam Details */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-xl font-semibold">Exam Essentials</h2>
                    <Button type="button" variant="outline" className="gap-2" onClick={() => setIsAiModalOpen(true)}>
                      <Wand2 className="h-4 w-4 text-purple-600" /> Auto-Fill with AI
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Exam Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Mid-term Mathematics Assessment" className="h-12 bg-white" {...field} />
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
                            <Input placeholder="e.g. Mathematics" className="h-12 bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="10" className="h-12 bg-white" {...field} />
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
                              <Input placeholder="A" className="h-12 bg-white" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="pb-4 border-b">
                    <h2 className="text-xl font-semibold">Schedule & Scoring</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input type="number" className="h-12 bg-white text-lg font-medium" {...field} />
                                <span className="text-muted-foreground">mins</span>
                              </div>
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
                              <div className="flex items-center gap-2">
                                <Input type="number" className="h-12 bg-white text-lg font-medium" {...field} />
                                <span className="text-muted-foreground">pts</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
                </div>
              )}

              {/* Step 3: Questions */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                      <h2 className="text-xl font-semibold">Questions Builder</h2>
                      <p className="text-sm text-muted-foreground">Add questions manually or generate them.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAiModalOpen(true)} className="gap-2">
                        <Wand2 className="h-4 w-4 text-purple-600" /> AI Generator
                      </Button>
                      <Button type="button" onClick={addQuestion} className="gap-2">
                        <Plus className="h-4 w-4" /> Add Manual
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 min-h-[400px]">
                    {questions.map((question, index) => (
                      <div key={index} className="group relative bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="mt-2 text-muted-foreground cursor-grab active:cursor-grabbing">
                            <GripVertical className="h-5 w-5" />
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <FormField
                                  control={form.control}
                                  name={`questions.${index}.text`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder={`Question ${index + 1}`}
                                          className="font-medium text-lg border-0 border-b rounded-none px-0 focus-visible:ring-0 shadow-none bg-transparent"
                                          {...field}
                                          value={questions[index].text}
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
                              </div>
                              <div className="w-48">
                                <FormField
                                  control={form.control}
                                  name={`questions.${index}.type`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <select
                                          className="w-full p-2 bg-gray-50 border rounded-md text-sm font-medium"
                                          {...field}
                                          value={questions[index].type}
                                          onChange={(e) => {
                                            field.onChange(e);
                                            updateQuestion(index, 'type', e.target.value);
                                          }}
                                        >
                                          <option value="multiple-choice">Multiple Choice</option>
                                          <option value="text">Long Answer</option>
                                        </select>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            {question.type === 'multiple-choice' && (
                              <div className="pl-4 border-l-2 border-gray-100 space-y-3">
                                {question.options?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-3 items-center">
                                    <div className={`w-4 h-4 rounded-full border ${question.correctAnswer === option && option !== '' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
                                    <Input
                                      placeholder={`Option ${optionIndex + 1}`}
                                      value={option}
                                      onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                      className="flex-1 h-9 bg-gray-50/50"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                                      onClick={() => removeOption(index, optionIndex)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                                <div className="flex gap-4 pt-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addOption(index)}
                                    className="text-xs text-muted-foreground hover:text-black"
                                  >
                                    + Add Option
                                  </Button>

                                  <div className="flex-1 max-w-xs">
                                    <select
                                      className="w-full text-xs p-1.5 border rounded bg-white text-muted-foreground"
                                      value={questions[index].correctAnswer || ""}
                                      onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                                    >
                                      <option value="">Select correct answer</option>
                                      {question.options?.map((option, idx) => (
                                        <option key={idx} value={option}>{option || `Option ${idx + 1}`}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="pb-4 border-b">
                    <h2 className="text-xl font-semibold">Review & Publish</h2>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Exam Title</span>
                        <p className="font-semibold mt-1">{form.getValues('title')}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</span>
                        <p className="font-semibold mt-1">{form.getValues('subject')}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Class/Div</span>
                        <p className="font-semibold mt-1">{form.getValues('class')} - {form.getValues('division')}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Structure</span>
                        <p className="font-semibold mt-1">{questions.length} Questions • {form.getValues('totalMarks')} Pts</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-xl p-6">
                    <h3 className="font-medium mb-4">Questions Preview</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {questions.map((q, i) => (
                        <div key={i} className="flex gap-4 text-sm">
                          <span className="text-muted-foreground font-mono w-6 text-right">{i + 1}.</span>
                          <div>
                            <p className="font-medium">{q.text}</p>
                            <div className="mt-1 flex gap-2">
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{q.type === 'multiple-choice' ? 'MCQ' : 'Long Answer'}</span>
                              {q.correctAnswer && <span className="text-xs bg-green-50 px-2 py-0.5 rounded text-green-700">Ans: {q.correctAnswer}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex justify-between items-center mt-12 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1 || isLoading}
                  className="w-32"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-32 bg-black hover:bg-black/90 text-white"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-40 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                    Publish Exam
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>
        </form>
      </Form>

      {/* AI Dialog - Keeping existing logic but accessible from multiple steps */}
      <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-none shadow-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Wand2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl">Generate with AI</DialogTitle>
            </div>
            <DialogDescription className="text-base text-gray-500">
              Describe the exam topics and complexity. Our AI will craft relevant questions for you.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="ai-subject" className="text-sm font-medium text-gray-700">Subject</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <Input
                  id="ai-subject"
                  value={aiConfig.subject}
                  onChange={(e) => setAiConfig({ ...aiConfig, subject: e.target.value })}
                  className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                  placeholder="e.g. Physics, History, Calculus"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-topics" className="text-sm font-medium text-gray-700">Specific Topics</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <ListChecks className="h-4 w-4" />
                </div>
                <Input
                  id="ai-topics"
                  value={aiConfig.topics}
                  onChange={(e) => setAiConfig({ ...aiConfig, topics: e.target.value })}
                  className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                  placeholder="e.g. Newton's Laws, Thermodynamics (comma separated)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ai-difficulty" className="text-sm font-medium text-gray-700">Complexity</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <select
                    id="ai-difficulty"
                    className="flex h-11 w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 pl-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    value={aiConfig.difficulty}
                    onChange={(e) => setAiConfig({ ...aiConfig, difficulty: e.target.value })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-count" className="text-sm font-medium text-gray-700">Question Count</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <Input
                    id="ai-count"
                    type="number"
                    value={aiConfig.questionCount}
                    onChange={(e) => setAiConfig({ ...aiConfig, questionCount: parseInt(e.target.value) || 5 })}
                    className="pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-2 bg-gray-50/50 gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsAiModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleGenerateWithAI}
              disabled={isGenerating || !aiConfig.subject}
              className={cn(
                "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition-all",
                isGenerating && "opacity-80"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Exam
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}