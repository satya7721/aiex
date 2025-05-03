"use client";

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';
import { StudentLoginForm } from '@/components/auth/StudentLoginForm';
import { AdminLoginForm } from '@/components/auth/AdminLoginForm';

function LoginContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'student';

  return (
    <div className="flex min-h-screen">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        {type === 'admin' ? <AdminLoginForm /> : <StudentLoginForm />}
      </div>

      {/* Image Section - Hidden on mobile */}
      <div className="hidden lg:flex flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/20 z-10" />
        <Image
          src="/auth-bg.png"
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome to AI Exam Platform</h2>
          <p className="text-lg opacity-90">
            Empowering education through intelligent assessment and personalized learning.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
} 