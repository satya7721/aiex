'use client';

import { Exam } from '@/types/exam';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ExamActionsProps {
  exam: Exam;
  onDelete: (examId: string) => void;
  onDuplicate: (exam: Exam) => void;
}

export default function ExamActions({ exam, onDelete, onDuplicate }: ExamActionsProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDelete = () => {
    onDelete(exam.id);
    setIsDeleteDialogOpen(false);
  };
  
  const handleDuplicate = () => {
    onDuplicate(exam);
  };
  
  const handleEdit = () => {
    router.push(`/admin/exam/${exam.id}`);
  };
  
  return (
    <div className="flex items-center">
      <div className="hidden sm:block mr-2">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          Edit
        </Button>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 sm:h-9 px-2 sm:px-3">
            <span className="sm:hidden">Actions</span>
            <span className="hidden sm:inline">•••</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuItem onClick={handleEdit} className="sm:hidden">
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[90%] sm:w-auto max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{exam.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-2 sm:mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 