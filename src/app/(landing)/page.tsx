import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
          AI Enhanced Examination Platform
        </h1>
        
        <p className="mb-8 text-xl text-muted-foreground max-w-2xl">
          Take exams with real-time AI feedback, personalized insights, and actionable learning recommendations.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-16 text-lg">
              Start Exam
            </Button>
          </Link>
          
          <Link href="/admin" className="w-full">
            <Button variant="outline" className="w-full h-16 text-lg">
              Admin Login
            </Button>
          </Link>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-center">
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M12 2v1" /><path d="M12 7v1" /><path d="M12 13v1" /><path d="M12 19v1" />
                <path d="M4.93 4.93l.7.7" /><path d="M17.37 4.93l-.7.7" />
                <path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /><path d="M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Smart Assessment</h3>
            <p className="text-muted-foreground">
              AI-powered grading system for both multiple choice and subjective answers.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M2 3h20" /><path d="M2 7h20" /><path d="M12 11h10" />
                <path d="M12 15h10" /><path d="M12 19h10" /><path d="M2 15V3" />
                <path d="M6 15V3" /><path d="M2 19h6" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Detailed Feedback</h3>
            <p className="text-muted-foreground">
              Get personalized insights on your performance with specific improvement areas.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M2 9V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3" />
                <path d="M2 12v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Action Items</h3>
            <p className="text-muted-foreground">
              Receive concrete action items and resources to improve your understanding.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-6 border-t">
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AI Enhanced Examination Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
