import type { VacationPeriod, ApiResponse } from '@/types/vacation.types';

const API_BASE_URL =
  'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_PREFIX = 'vacation_cache_';

interface CacheEntry {
  data: VacationPeriod[];
  timestamp: number;
}

/**
 * Get cache key for a zone and year combination
 */
const getCacheKey = (zone: string, year: number): string => {
  return `${CACHE_PREFIX}${zone}_${year}`;
};

/**
 * Check if cache is still valid
 */
const isCacheValid = (entry: CacheEntry): boolean => {
  const now = Date.now();
  return now - entry.timestamp < CACHE_DURATION;
};

/**
 * Get cached data if available and valid
 */
const getFromCache = (zone: string, year: number): VacationPeriod[] | null => {
  try {
    const key = getCacheKey(zone, year);
    const cached = localStorage.getItem(key);

    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    if (isCacheValid(entry)) {
      return entry.data;
    }

    // Remove expired cache
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
};

/**
 * Save data to cache
 */
const saveToCache = (zone: string, year: number, data: VacationPeriod[]): void => {
  try {
    const key = getCacheKey(zone, year);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
};

/**
 * Fetch vacations from API with caching
 * @param zone - School zone ('A', 'B', or 'C')
 * @param year - Year for vacations (default: current year)
 * @returns Array of VacationPeriod objects
 * @throws Error if API call fails
 */
export const fetchVacations = async (
  zone: 'A' | 'B' | 'C',
  year: number = new Date().getFullYear()
): Promise<VacationPeriod[]> => {
  // Check cache first
  const cached = getFromCache(zone, year);
  if (cached) {
    return cached;
  }

  try {
    // Get current school year (changes in September)
    const now = new Date();
    const currentYear = now.getFullYear();
    const schoolYear = now.getMonth() >= 8 ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;

    // Build query parameters
    const params = new URLSearchParams({
      where: `zones="Zone ${zone}" AND annee_scolaire="${schoolYear}"`,
      limit: '100',
      order_by: 'start_date',
    });

    const url = `${API_BASE_URL}?${params.toString()}`;

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    // Handle HTTP errors
    if (!response.ok) {
      const errorMessage = `API error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data: ApiResponse<VacationPeriod> = await response.json();

    // Ensure we have results array
    const vacations = data.results || [];

    // Save to cache
    saveToCache(zone, year, vacations);

    return vacations;
  } catch (error) {
    // Handle different error types
    if (error instanceof TypeError) {
      throw new Error('Network error: Unable to reach the API server');
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout: The API took too long to respond');
    }
    throw error;
  }
};

/**
 * Clear all cached vacation data
 */
export const clearVacationCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

/**
 * Get current year's vacations for all zones
 */
export const fetchAllZoneVacations = async (
  year: number = new Date().getFullYear()
): Promise<Record<'A' | 'B' | 'C', VacationPeriod[]>> => {
  const [zoneA, zoneB, zoneC] = await Promise.all([
    fetchVacations('A', year),
    fetchVacations('B', year),
    fetchVacations('C', year),
  ]);

  return {
    A: zoneA,
    B: zoneB,
    C: zoneC,
  };
};
