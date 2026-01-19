import type { VacationPeriod, CurrentStatus, TimeRemaining } from '@/types/vacation.types';

/**
 * Check if a date falls within a vacation period
 */
const isDateInVacation = (date: Date, vacation: VacationPeriod): boolean => {
  const startDate = new Date(vacation.start_date);
  const endDate = new Date(vacation.end_date);

  // Normalize times to compare only dates
  date.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return date >= startDate && date <= endDate;
};

/**
 * Get the current vacation period if user is in vacation
 */
const getCurrentVacation = (today: Date, vacations: VacationPeriod[]): VacationPeriod | undefined => {
  return vacations.find(vacation => isDateInVacation(today, vacation));
};

/**
 * Get the next vacation period after a given date
 */
const getNextVacation = (today: Date, vacations: VacationPeriod[]): VacationPeriod | null => {
  const searchDate = new Date(today);
  searchDate.setHours(0, 0, 0, 0);

  // Find first vacation that starts after today
  const upcoming = vacations
    .filter(vacation => {
      const startDate = new Date(vacation.start_date);
      startDate.setHours(0, 0, 0, 0);
      return startDate > searchDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();
      return dateA - dateB;
    });

  return upcoming.length > 0 ? upcoming[0] : null;
};

/**
 * Get the next vacation period including if user is currently in vacation
 * If in vacation, returns first vacation after current vacation
 * If not in vacation, returns first vacation after today
 */
const getNextVacationPeriod = (today: Date, vacations: VacationPeriod[]): VacationPeriod | null => {
  const currentVacation = getCurrentVacation(today, vacations);

  if (currentVacation) {
    // If in vacation, find vacation after current vacation ends
    const endDate = new Date(currentVacation.end_date);
    endDate.setHours(0, 0, 0, 0);
    endDate.setDate(endDate.getDate() + 1); // Start searching from day after vacation ends

    return vacations
      .filter(vacation => {
        const startDate = new Date(vacation.start_date);
        startDate.setHours(0, 0, 0, 0);
        return startDate >= endDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.start_date).getTime();
        const dateB = new Date(b.start_date).getTime();
        return dateA - dateB;
      })[0] || null;
  } else {
    // If not in vacation, find next vacation
    return getNextVacation(today, vacations);
  }
};

/**
 * Detect current status: vacation or school period
 * Returns detailed information about current and next vacation periods
 */
export const getCurrentStatus = (today: Date, vacations: VacationPeriod[]): CurrentStatus => {
  const currentVacation = getCurrentVacation(today, vacations);

  if (currentVacation) {
    // User is in vacation
    const nextVacation = getNextVacationPeriod(today, vacations);

    if (!nextVacation) {
      throw new Error('Aucune donnée de vacances disponible');
    }

    return {
      status: 'in_vacation',
      currentVacation,
      nextVacation,
      nextEvent: new Date(nextVacation.start_date),
      eventType: 'school_start',
    };
  } else {
    // User is in school period
    const nextVacation = getNextVacation(today, vacations);

    if (!nextVacation) {
      throw new Error('Aucune donnée de vacances disponible');
    }

    return {
      status: 'in_school',
      nextVacation,
      nextEvent: new Date(nextVacation.start_date),
      eventType: 'vacation_start',
    };
  }
};

/**
 * Calculate time remaining until target date
 * Returns days, hours, minutes, seconds and isExpired flag
 */
export const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const days = totalDays;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
};

/**
 * Format vacation name for display
 * Extracts the vacation type from description (e.g., "Vacances d'hiver")
 */
export const formatVacationName = (vacation: VacationPeriod): string => {
  // Extract vacation name from description if possible
  // Example: "Vacances d'hiver" or "Vacances de Noël"
  if (vacation.description) {
    return vacation.description;
  }

  // Fallback: use zones
  return `Vacances - ${vacation.zones}`;
};

/**
 * Parse ISO 8601 date string and normalize to start of day
 */
export const parseVacationDate = (dateString: string): Date => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Check if two vacation periods overlap
 */
export const doVacationsOverlap = (v1: VacationPeriod, v2: VacationPeriod): boolean => {
  const v1Start = new Date(v1.start_date).getTime();
  const v1End = new Date(v1.end_date).getTime();
  const v2Start = new Date(v2.start_date).getTime();
  const v2End = new Date(v2.end_date).getTime();

  return v1Start <= v2End && v2Start <= v1End;
};
