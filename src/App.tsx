import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Countdown from '@/components/Countdown';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useVacations } from '@/hooks/useVacations';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getCurrentStatus } from '@/utils/dateUtils';
import { getZoneFromCoords } from '@/utils/academyMapper';
import { ACADEMIES } from '@/constants/academies';
import type { CurrentStatus } from '@/types/vacation.types';

/**
 * Main App Component
 * Orchestrates geolocation, academy selection, and vacation data fetching
 */
export default function App() {
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus | null>(null);
  const [error, setError] = useState<'geolocation' | 'api' | 'academy_not_detected' | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Geolocation hook
  const geoLocation = useGeolocation();

  // Get selected academy from localStorage
  const [selectedAcademy, setSelectedAcademy] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('selected_academy');
    setSelectedAcademy(saved || null);
  }, []);

  // Determine zone and fetch vacations
  const zone = selectedAcademy
    ? (ACADEMIES.find((a) => a.id === selectedAcademy)?.zone || 'A')
    : geoLocation.coords
      ? getZoneFromCoords(geoLocation.coords.latitude, geoLocation.coords.longitude) || 'A'
      : 'A';

  const { vacations, isLoading: vacationsLoading, error: vacationsError } = useVacations(zone);

  // Initialize app and set current status
  useEffect(() => {
    // Check if we have necessary data
    if (!geoLocation.isLoading && !vacationsLoading && vacations.length > 0) {
      try {
        const status = getCurrentStatus(new Date(), vacations);
        setCurrentStatus(status);
        setError(null);
        setIsInitializing(false);
      } catch (err) {
        setError('api');
        setIsInitializing(false);
      }
    }

    // Handle errors
    if (geoLocation.error && !selectedAcademy) {
      setError('geolocation');
      setIsInitializing(false);
    }

    if (vacationsError) {
      setError('api');
      setIsInitializing(false);
    }

    // If no geolocation but academy selected, continue
    if (selectedAcademy && !vacationsLoading && vacations.length > 0) {
      try {
        const status = getCurrentStatus(new Date(), vacations);
        setCurrentStatus(status);
        setError(null);
        setIsInitializing(false);
      } catch (err) {
        setError('api');
        setIsInitializing(false);
      }
    }
  }, [geoLocation, vacations, vacationsLoading, vacationsError, selectedAcademy]);

  // Render loading state
  if (isInitializing || geoLocation.isLoading || vacationsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-950 dark:to-gray-900">
        <Header />
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          <LoadingSpinner stage={geoLocation.isLoading ? 'geolocation' : 'api'} />
        </main>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-950 dark:to-gray-900">
        <Header />
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <ErrorMessage
              errorType={error}
              onRetry={() => {
                setIsInitializing(true);
                window.location.reload();
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  // Render main app
  if (!currentStatus) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-950 dark:to-gray-900">
        <Header />
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Countdown Display */}
          <Countdown currentStatus={currentStatus} />

          {/* Footer Info */}
          <footer className="mt-12 sm:mt-16 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Académie : <strong>{ACADEMIES.find((a) => a.zone === zone)?.name || 'Zone ' + zone}</strong></span>
            </p>
            <p>
              Data source: <a href="https://data.gouv.fr" className="underline hover:text-gray-700 dark:hover:text-gray-300">data.gouv.fr</a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
