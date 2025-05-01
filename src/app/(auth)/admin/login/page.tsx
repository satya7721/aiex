import LoginForm from '@/components/auth/LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/10">
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          AI Enhanced Examination Platform
        </h1>
        <LoginForm userType="admin" />
      </div>
    </div>
  );
} 