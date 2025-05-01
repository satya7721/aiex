import AdminExamForm from '@/components/AdminExamForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewExamPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Exam</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Admin</Button>
        </Link>
      </div>
      
      <AdminExamForm />
    </div>
  );
} 