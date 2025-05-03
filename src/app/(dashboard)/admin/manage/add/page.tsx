'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/types';
import { users } from '@/app/data';

function AddStudentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';
  const studentId = searchParams.get('id');

  const [formData, setFormData] = useState<Partial<User>>({
    type: 'student',
    class: '11',
    division: 'A'
  });

  useEffect(() => {
    if (isEdit && studentId) {
      const student = users.find(u => u.id === studentId && u.type === 'student');
      if (student) {
        setFormData(student);
      }
    }
  }, [isEdit, studentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      // In a real app, this would be an API call
      console.log('Saving student:', formData);
      router.back();
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Student' : 'Add New Student'}</CardTitle>
            <CardDescription>
              {isEdit ? 'Update the student\'s details below.' : 'Enter the student\'s details below.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter student name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter student email"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select
                value={formData.class}
                onValueChange={(value) => setFormData({ ...formData, class: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11">Class 11</SelectItem>
                  <SelectItem value="12">Class 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Division</label>
              <Select
                value={formData.division}
                onValueChange={(value) => setFormData({ ...formData, division: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Division A</SelectItem>
                  <SelectItem value="B">Division B</SelectItem>
                  <SelectItem value="C">Division C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update Student' : 'Add Student'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function AddStudentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddStudentForm />
    </Suspense>
  );
} 