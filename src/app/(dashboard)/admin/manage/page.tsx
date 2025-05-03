'use client';

import { useState, Suspense } from 'react';
import { users } from '@/app/data';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

function ManageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<User[]>(
    users.filter(user => user.type === 'student')
  );
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddClick = () => {
    router.push('/admin/manage/add');
  };

  const handleEditClick = (student: User) => {
    router.push(`/admin/manage/add?edit=true&id=${student.id}`);
  };

  const handleToggleActive = (student: User) => {
    // In a real app, this would be an API call
    const updatedStudents = students.map(s =>
      s.id === student.id ? { ...s, active: !s.active } : s
    );
    setStudents(updatedStudents);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Students</h1>
        <Button
          variant="default"
          className="bg-black text-white hover:bg-black/90"
          onClick={handleAddClick}
        >
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            Manage student information and access
          </CardDescription>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md bg-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>Class {student.class}</TableCell>
                  <TableCell>Division {student.division}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {student.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(student)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(student)}
                        className={student.active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {student.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Link href={`/admin/students/${student.id}/performance`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <BarChart3 className="w-4 h-4" />
                          Performance
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ManagePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManageContent />
    </Suspense>
  );
} 