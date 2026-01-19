import { useEffect, useState } from 'react';
import type { GeolocationState } from '@/types/academy.types';

const GEOLOCATION_TIMEOUT = 10000; // 10 seconds

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

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let watchId: number | null = null;

    const handleSuccess = (position: GeolocationPosition) => {
      if (timeoutId) clearTimeout(timeoutId);

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
      if (timeoutId) clearTimeout(timeoutId);

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

    const startGeolocation = () => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));

      timeoutId = setTimeout(() => {
        setState({
          coords: null,
          isLoading: false,
          error: 'Geolocation request timed out (10s). Please try again or select your academy manually.',
        });
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
      }, GEOLOCATION_TIMEOUT);

      watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: false,
          timeout: GEOLOCATION_TIMEOUT,
          maximumAge: 300000, // 5 minutes cache
        }
      );
    };

    startGeolocation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return state;
};
