/**
 * Academy Types
 * Defines interfaces for French school academies and geolocation
 */

export interface Academy {
  id: string;
  name: string;
  zone: 'A' | 'B' | 'C';
  coords: { lat: number; lng: number };
  departments: string[];
}

export interface GeolocationState {
  coords: { latitude: number; longitude: number } | null;
  isLoading: boolean;
  error: string | null;
  timestamp?: number;
}

export interface GeolocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN';
  message: string;
}
