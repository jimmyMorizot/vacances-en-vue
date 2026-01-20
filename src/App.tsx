import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Countdown from '@/components/Countdown';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import InstallPrompt from '@/components/InstallPrompt';
import { useVacations } from '@/hooks/useVacations';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getCurrentStatus } from '@/utils/dateUtils';
import { getZoneFromCoords, getAcademyFromCoords } from '@/utils/academyMapper';
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

  // Listen for academy changes from AcademySelector
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('selected_academy');
      setSelectedAcademy(saved || null);
      // Force re-initialization when academy changes
      setIsInitializing(true);
      setError(null);
    };

    // Listen to custom event dispatched by AcademySelector
    window.addEventListener('academyChanged', handleStorageChange);

    return () => {
      window.removeEventListener('academyChanged', handleStorageChange);
    };
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

    // Handle geolocation errors - don't block, just continue with default zone A
    // User can always manually select their academy
    if (geoLocation.error && !selectedAcademy && vacations.length > 0) {
      // Continue without error - zone A is already the default
      setError(null);
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

  // Auto-select academy from geolocation (only once, on first detection)
  useEffect(() => {
    if (geoLocation.coords && !selectedAcademy) {
      // Use Haversine formula to find the CLOSEST academy
      const closestAcademy = getAcademyFromCoords(
        geoLocation.coords.latitude,
        geoLocation.coords.longitude
      );
      if (closestAcademy) {
        localStorage.setItem('selected_academy', closestAcademy.id);
        setSelectedAcademy(closestAcademy.id);
        // Trigger re-initialization to update the UI immediately
        setIsInitializing(true);
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('academyChanged'));
      }
    }
  }, [geoLocation.coords, selectedAcademy]);

  // Render loading state - only show loading for API, not geolocation
  // This allows the app to show data immediately with default zone
  if (isInitializing || vacationsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          <LoadingSpinner stage={vacationsLoading ? 'api' : 'geolocation'} />
        </main>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
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
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Countdown Display */}
          <Countdown
            currentStatus={currentStatus}
            selectedAcademyName={selectedAcademy ? ACADEMIES.find(a => a.id === selectedAcademy)?.name : undefined}
          />

          {/* Footer Info */}
          <footer className="mt-12 sm:mt-16 space-y-4 text-center">
            {/* Academic Info */}
            <div className="text-xs sm:text-sm footer-text-primary space-y-2">
              <p className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  Académie : <strong>
                    {selectedAcademy
                      ? ACADEMIES.find((a) => a.id === selectedAcademy)?.name || 'Inconnue'
                      : ACADEMIES.find((a) => a.zone === zone)?.name || 'Zone ' + zone}
                  </strong>
                </span>
              </p>
              <p className="footer-text-secondary">
                Data source: <a href="https://data.gouv.fr" className="underline hover:opacity-70 transition-opacity">data.gouv.fr</a>
              </p>
            </div>

            {/* DevChallenges Footer */}
            <div className="pt-4 border-t border-border text-sm footer-text-secondary">
              <p>
                Créé avec{' '}
                <span className="text-red-500" aria-label="amour">
                  ♥
                </span>{' '}
                pour le challenge{' '}
                <a
                  href="https://devchallenges.yoandev.co/challenge/2026-week-03/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70 transition-opacity"
                >
                  DevChallenges 2026 Week 03
                </a>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
