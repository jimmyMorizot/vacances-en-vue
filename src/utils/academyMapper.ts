import type { Academy } from '@/types/academy.types';
import { ACADEMIES } from '@/constants/academies';

/**
 * Haversine Formula
 * Calculate the great-circle distance between two points on earth
 * using their latitude and longitude
 * Returns distance in kilometers
 */
const haversineDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Get the closest academy from GPS coordinates
 * Uses Haversine formula to calculate distances
 */
export const getAcademyFromCoords = (
  latitude: number,
  longitude: number
): Academy | null => {
  if (ACADEMIES.length === 0) {
    return null;
  }

  let closestAcademy = ACADEMIES[0];
  let minDistance = haversineDistance(
    latitude,
    longitude,
    closestAcademy.coords.lat,
    closestAcademy.coords.lng
  );

  for (let i = 1; i < ACADEMIES.length; i++) {
    const academy = ACADEMIES[i];
    const distance = haversineDistance(
      latitude,
      longitude,
      academy.coords.lat,
      academy.coords.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestAcademy = academy;
    }
  }

  return closestAcademy;
};

/**
 * Get academy zone from GPS coordinates
 * Returns 'A' | 'B' | 'C'
 */
export const getZoneFromCoords = (
  latitude: number,
  longitude: number
): 'A' | 'B' | 'C' | null => {
  const academy = getAcademyFromCoords(latitude, longitude);
  return academy ? academy.zone : null;
};

/**
 * Validate coordinates are within valid ranges
 */
export const isValidCoordinates = (
  latitude: number,
  longitude: number
): boolean => {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};
