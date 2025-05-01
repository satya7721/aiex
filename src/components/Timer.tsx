'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface TimerProps {
  durationMinutes: number;
  onTimeEnd?: () => void;
}

export default function Timer({ durationMinutes, onTimeEnd }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeEnd && onTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeEnd]);

  useEffect(() => {
    // Set warning when less than 5 minutes remain
    if (timeRemaining <= 300 && !isWarning) {
      setIsWarning(true);
    }
  }, [timeRemaining, isWarning]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <Badge variant={isWarning ? "destructive" : "outline"} className="text-lg py-2 px-3">
      Time Remaining: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </Badge>
  );
}
