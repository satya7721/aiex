'use client';

import { Exam } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface AdminExamFormProps {
  exam?: Exam; // Optional - if provided, we're editing an existing exam
}

export default function AdminExamForm({ exam }: AdminExamFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: exam?.title || '',
    class: exam?.class || '11',
    subject: exam?.subject || '',
    duration: exam?.duration.toString() || '60',
    division: exam?.division || 'A',
    totalMarks: exam?.totalMarks?.toString() || '100'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // In a real app, this would send data to the backend

      // Navigate to admin dashboard
      if (exam) {
        router.push(`/admin/exam/${exam.id}`);
      } else {
        router.push('/admin');
      }
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{exam ? 'Edit Exam' : 'Create New Exam'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Exam Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Physics Mid-Term"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="class" className="text-sm font-medium">
                Class
              </label>
              <select
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Physics"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="division" className="text-sm font-medium">
                Division
              </label>
              <select
                id="division"
                name="division"
                value={formData.division}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="A">Division A</option>
                <option value="B">Division B</option>
                <option value="C">Division C</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="totalMarks" className="text-sm font-medium">
                Total Marks
              </label>
              <Input
                id="totalMarks"
                name="totalMarks"
                type="number"
                min="1"
                value={formData.totalMarks}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium">
              Duration (minutes)
            </label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="5"
              max="180"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : exam ? 'Update Exam' : 'Create Exam'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
