"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function StudentLoginForm() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate student ID format (4 digits)
    if (!studentId || !/^\d{4}$/.test(studentId)) {
      setError('Please enter a valid 4-digit student ID');
      setIsLoading(false);
      return;
    }

    try {
      // Auto-login as student1 for demo purposes to see RLS protected data
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: 'student1@test.com',
        password: 'password123',
      });

      if (authError) {
        console.error("Student demo login failed:", authError);
        // Fallback just in case
      }

      localStorage.setItem('userType', 'student');
      document.cookie = `userType=student; path=/`;
      router.push('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      // Fallback
      document.cookie = `userType=student; path=/`;
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back 👋</h1>
        <p className="text-sm text-gray-500">Sign in to start learning</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studentId" className="text-sm font-medium">Student ID</Label>
          <Input
            id="studentId"
            type="text"
            placeholder="Enter your 4-digit ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            maxLength={4}
            pattern="\d{4}"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-gray-900 text-white hover:bg-gray-800"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
} 