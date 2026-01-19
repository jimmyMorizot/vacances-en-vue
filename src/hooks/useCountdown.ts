import { useEffect, useState } from 'react';
import { calculateTimeRemaining } from '@/utils/dateUtils';
import type { TimeRemaining } from '@/types/vacation.types';

/**
 * Hook for real-time countdown display
 * Automatically updates every second until target date is reached
 * Includes cleanup on component unmount
 */
export const useCountdown = (targetDate: Date): TimeRemaining => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetDate)
  );

  useEffect(() => {
    // Calculate immediately on mount
    setTimeRemaining(calculateTimeRemaining(targetDate));

    // Setup interval for updates every second
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    // Cleanup interval on unmount or when targetDate changes
    return () => {
      clearInterval(intervalId);
    };
  }, [targetDate]);

  return timeRemaining;
};
