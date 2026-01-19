import { useEffect, useState } from 'react';
import type { GeolocationState } from '@/types/academy.types';

const GEOLOCATION_TIMEOUT = 5000; // 5 seconds (optimized)

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coords: null,
        isLoading: false,
        error: 'Geolocation is not supported by your browser',
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        isLoading: false,
        error: null,
        timestamp: position.timestamp,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'An unknown error occurred';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permission to access geolocation was denied. Please enable it in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Position information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'The request to get user location timed out.';
          break;
      }

      setState({
        coords: null,
        isLoading: false,
        error: errorMessage,
      });
    };

    // Use getCurrentPosition instead of watchPosition (faster, one-shot)
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: false, // Faster
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, []);

  return state;
};
