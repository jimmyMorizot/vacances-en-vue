import { useEffect, useState, useCallback } from 'react';
import type { GeolocationState } from '@/types/academy.types';

const GEOLOCATION_TIMEOUT = 10000; // 10 seconds for mobile

interface UseGeolocationReturn extends GeolocationState {
  requestPermission: () => void;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    isLoading: false, // Start with false - don't auto-load
    error: null,
  });
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [hasAttemptedAutoGeo, setHasAttemptedAutoGeo] = useState(false);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      isLoading: false,
      error: null,
      timestamp: position.timestamp,
    });
    setPermissionStatus('granted');
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Une erreur inconnue s\'est produite';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'L\'accès à la géolocalisation a été refusé.';
        setPermissionStatus('denied');
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Les informations de position ne sont pas disponibles.';
        break;
      case error.TIMEOUT:
        errorMessage = 'La demande de localisation a expiré.';
        break;
    }

    setState({
      coords: null,
      isLoading: false,
      error: errorMessage,
    });
  }, []);

  // Function to manually request geolocation (useful for PWA on mobile)
  // This should be triggered by a user interaction (button click)
  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        coords: null,
        isLoading: false,
        error: 'La géolocalisation n\'est pas supportée par votre navigateur',
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Use high accuracy for manual requests (user explicitly asked)
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true, // GPS on mobile
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 0, // Force fresh position
      }
    );
  }, [handleSuccess, handleError]);

  // Check permission status on mount (if Permissions API is available)
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');

        // Listen for permission changes
        result.onchange = () => {
          setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
          // If permission was just granted, auto-request position
          if (result.state === 'granted' && !state.coords) {
            requestPermission();
          }
        };
      }).catch(() => {
        // Permissions API not fully supported
        setPermissionStatus('unknown');
      });
    }
  }, []);

  // Auto-request geolocation ONLY if permission is already granted
  // This avoids the "popup" on first load which fails on PWA
  useEffect(() => {
    if (hasAttemptedAutoGeo) return;

    if (!navigator.geolocation) {
      setState({
        coords: null,
        isLoading: false,
        error: 'La géolocalisation n\'est pas supportée par votre navigateur',
      });
      setHasAttemptedAutoGeo(true);
      return;
    }

    // Only auto-request if permission is already granted
    if (permissionStatus === 'granted') {
      setHasAttemptedAutoGeo(true);
      setState(prev => ({ ...prev, isLoading: true }));

      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: GEOLOCATION_TIMEOUT,
          maximumAge: 300000, // 5 minutes cache OK for auto-request
        }
      );
    } else if (permissionStatus === 'denied') {
      // Permission denied, don't try
      setHasAttemptedAutoGeo(true);
      setState({
        coords: null,
        isLoading: false,
        error: 'L\'accès à la géolocalisation a été refusé.',
      });
    } else if (permissionStatus === 'prompt' || permissionStatus === 'unknown') {
      // Try once - this will trigger the browser permission prompt
      // On desktop this usually works, on mobile PWA it might fail
      setHasAttemptedAutoGeo(true);
      setState(prev => ({ ...prev, isLoading: true }));

      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: false, // Faster for initial attempt
          timeout: 5000, // Shorter timeout for initial attempt
          maximumAge: 300000,
        }
      );
    }
  }, [permissionStatus, hasAttemptedAutoGeo, handleSuccess, handleError]);

  return {
    ...state,
    requestPermission,
    permissionStatus,
  };
};
