/**
 * Vacation Types
 * Defines interfaces for school vacation periods and related data
 */

export interface VacationPeriod {
  description: string;
  start_date: string; // ISO 8601 format (e.g., "2025-02-10")
  end_date: string; // ISO 8601 format (e.g., "2025-02-24")
  zones: string; // "Zone A" | "Zone B" | "Zone C" | "Toutes zones"
  location: string;
  population?: string;
  year?: number;
}

export interface FetchVacationsParams {
  zone: 'A' | 'B' | 'C';
  year?: number;
}

export interface ApiResponse<T> {
  results: T[];
  total_count: number;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export interface CurrentStatus {
  status: 'in_vacation' | 'in_school';
  currentVacation?: VacationPeriod;
  nextVacation: VacationPeriod;
  nextEvent: Date;
  eventType: 'vacation_start' | 'school_start';
}
