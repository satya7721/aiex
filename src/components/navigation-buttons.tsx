'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function NavigationButtons() {
    return (
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
    );
} 