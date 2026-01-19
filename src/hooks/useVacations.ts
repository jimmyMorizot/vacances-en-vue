import { useEffect, useState, useCallback } from 'react';
import { fetchVacations } from '@/services/api';
import type { VacationPeriod } from '@/types/vacation.types';

interface UseVacationsReturn {
  vacations: VacationPeriod[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for managing school vacation data
 * Automatically fetches vacations for the specified zone
 * Includes caching via the API service
 */
export const useVacations = (zone: 'A' | 'B' | 'C', year?: number): UseVacationsReturn => {
  const [vacations, setVacations] = useState<VacationPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchVacations(zone, year);
      setVacations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vacations';
      setError(errorMessage);
      setVacations([]);
    } finally {
      setIsLoading(false);
    }
  }, [zone, year]);

  // Fetch on mount or when zone/year changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    vacations,
    isLoading,
    error,
    refetch,
  };
};
