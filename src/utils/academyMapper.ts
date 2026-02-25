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
 * Find academy by department code
 * Looks up which academy contains the given department
 */
export const getAcademyByDepartment = (departmentCode: string): Academy | null => {
  return ACADEMIES.find((academy) =>
    academy.departments.includes(departmentCode)
  ) || null;
};

/**
 * Get department code from GPS coordinates using the French government API
 * Uses the Géoplateforme reverse geocoding (replaces deprecated api-adresse.data.gouv.fr)
 */
const getDepartmentFromCoords = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://data.geopf.fr/geocodage/reverse?lon=${longitude}&lat=${latitude}&index=address&limit=1`
    );
    if (!response.ok) return null;

    const data = await response.json();
    const properties = data?.features?.[0]?.properties;
    if (!properties) return null;

    // The API returns a "citycode" (code INSEE) — the first 2 chars are the department
    // Exception: Corsica (2A, 2B) and overseas (3-digit codes like 971)
    const cityCode: string = properties.citycode || '';
    if (!cityCode) return null;

    // Overseas territories have 3-digit department codes (971, 972, 973, 974)
    if (cityCode.startsWith('97')) {
      return cityCode.substring(0, 3);
    }
    // Corsica: 2A or 2B
    if (cityCode.startsWith('2A') || cityCode.startsWith('2B')) {
      return cityCode.substring(0, 2);
    }
    // Metropolitan France: first 2 digits
    return cityCode.substring(0, 2);
  } catch {
    return null;
  }
};

/**
 * Get the closest academy from GPS coordinates (fallback: Haversine distance)
 * Used as synchronous fallback when the API-based lookup fails
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
 * Get academy from GPS coordinates — async version
 * First tries department-based lookup via the French government reverse geocoding API,
 * then falls back to Haversine distance if the API call fails.
 * This fixes the bug where cities near academy borders (e.g. Tours) were
 * mapped to the wrong academy (Poitiers instead of Orléans-Tours).
 */
export const getAcademyFromCoordsAsync = async (
  latitude: number,
  longitude: number
): Promise<Academy | null> => {
  // Try department-based lookup first (accurate)
  const department = await getDepartmentFromCoords(latitude, longitude);
  if (department) {
    const academy = getAcademyByDepartment(department);
    if (academy) return academy;
  }

  // Fallback to Haversine distance (less accurate for border cities)
  return getAcademyFromCoords(latitude, longitude);
};

/**
 * Get academy zone from GPS coordinates (async, accurate)
 */
export const getZoneFromCoordsAsync = async (
  latitude: number,
  longitude: number
): Promise<'A' | 'B' | 'C' | null> => {
  const academy = await getAcademyFromCoordsAsync(latitude, longitude);
  return academy ? academy.zone : null;
};

/**
 * Get academy zone from GPS coordinates (sync fallback)
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
