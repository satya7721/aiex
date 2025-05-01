import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 w-full h-full" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(75, 85, 99, 0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(75, 85, 99, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: '2.5rem 2.5rem',
        transform: 'skew(-12deg) scale(1.5)',
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80"></div>
      </div>

      {/* Second layer of grid for more depth */}
      <div className="absolute inset-0 w-full h-full" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(55, 65, 81, 0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(55, 65, 81, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '5rem 5rem',
        transform: 'skew(-12deg) scale(1.2)',
      }}></div>

      <div className="relative flex-1">
        <nav className="flex justify-between items-center p-6 border-b border-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">AIEx</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hover:bg-gray-800/30 transition-colors duration-200"
              asChild
            >
              <Link href="/login?type=admin" className="text-gray-300 hover:text-white">Log in</Link>
            </Button>
            <Button 
              className="bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href="/login?type=student">Sign up</Link>
            </Button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center space-y-6 mb-12">
            <div className="relative">
              <div className="absolute -inset-1 blur-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20"></div>
              <h1 className="text-5xl md:text-6xl font-bold relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  AI Enhanced
                </span>
                <br />
                Examination Platform
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the next generation of examination platform powered by artificial intelligence
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20" 
                asChild
              >
                <Link href="/login?type=student">Start as Student</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800/30 hover:text-white transition-all duration-200 hover:scale-105 hover:border-purple-500/50" 
                asChild
              >
                <Link href="/login?type=admin">Login as Admin</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-2">AI-powered Creation</h3>
              <p className="text-gray-400">Automatically generate and grade exams using advanced AI algorithms</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-400">Track performance and progress with detailed analytics and insights</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-2">Smart Feedback</h3>
              <p className="text-gray-400">Get personalized feedback and recommendations for improvement</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-2">Mobile Ready</h3>
              <p className="text-gray-400">Access your exams and results from any device, anywhere</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">AIEx</h3>
              <p className="text-sm text-gray-400">
                Next generation examination platform powered by artificial intelligence
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">PLATFORM</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login?type=student" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Student Portal
                  </Link>
                </li>
                <li>
                  <Link href="/login?type=admin" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">LEGAL</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">CONTACT</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@aiex.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                    support@aiex.com
                  </a>
                </li>
                <li className="text-sm text-gray-400">
                  Mon - Fri, 9:00 - 18:00
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 AIEx. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 