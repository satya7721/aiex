'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  const isAdmin = pathname.startsWith('/admin');
  
  return (
    <header className="border-b">
      <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold">
            AiEx
          </Link>
          
          <nav className="ml-6 hidden md:flex space-x-4">
            {isAdmin ? (
              <>
                <Link href="/admin" className={`text-sm ${isActive('/admin') && !isActive('/admin/submissions') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}>
                  Exams
                </Link>
                <Link href="/admin/submissions" className={`text-sm ${isActive('/admin/submissions') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}>
                  Submissions
                </Link>
                <Link href="/admin/manage" className={`text-sm ${isActive('/admin/manage') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}>
                  Manage
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className={`text-sm ${isActive('/dashboard') && !isActive('/dashboard/exams') && !isActive('/dashboard/reports') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}>
                  Dashboard
                </Link>
                <Link href="/dashboard/exams" className={`text-sm ${isActive('/dashboard/exams') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}>
                  Exams
                </Link>
                {pathname !== '/' && (
                  <Link href="/dashboard/reports" className={`text-sm ${isActive('/dashboard/reports') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}>
                    My Reports
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            {isAdmin && (
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Exit Admin
              </Link>
            )}
          </div>
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden px-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-3 px-4 border-t">
          <nav className="flex flex-col space-y-3">
            {isAdmin ? (
              <>
                <Link 
                  href="/admin" 
                  className={`text-sm ${isActive('/admin') && !isActive('/admin/submissions') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Exams
                </Link>
                <Link 
                  href="/admin/submissions" 
                  className={`text-sm ${isActive('/admin/submissions') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Submissions
                </Link>
                <Link 
                  href="/admin/manage" 
                  className={`text-sm ${isActive('/admin/manage') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Manage
                </Link>
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-foreground mt-2 pt-2 border-t"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Exit Admin
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm ${isActive('/dashboard') && !isActive('/dashboard/exams') && !isActive('/dashboard/reports') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/exams" 
                  className={`text-sm ${isActive('/dashboard/exams') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Exams
                </Link>
                {pathname !== '/' && (
                  <Link 
                    href="/dashboard/reports" 
                    className={`text-sm ${isActive('/dashboard/reports') ? 'text-primary font-medium' : 'text-muted-foreground'} hover:text-foreground`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Reports
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
} 