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
        error: 'La géolocalisation n\'est pas supportée par votre navigateur',
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
      let errorMessage = 'Une erreur inconnue s\'est produite';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'L\'accès à la géolocalisation a été refusé. Veuillez l\'activer dans les paramètres de votre navigateur.';
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
