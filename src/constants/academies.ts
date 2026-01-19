import type { Academy } from '@/types/academy.types';

/**
 * French School Academies Database
 * 30 academies with approximate GPS coordinates and zones (A, B, C)
 * Used for geolocation mapping
 */
export const ACADEMIES: Academy[] = [
  // Zone A (8 academies)
  {
    id: 'besancon',
    name: 'Besançon',
    zone: 'A',
    coords: { lat: 47.2505, lng: 6.0244 },
    departments: ['25', '39', '70', '90'],
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    zone: 'A',
    coords: { lat: 44.8378, lng: -0.5792 },
    departments: ['24', '33', '47', '64'],
  },
  {
    id: 'clermont-ferrand',
    name: 'Clermont-Ferrand',
    zone: 'A',
    coords: { lat: 45.7772, lng: 3.0862 },
    departments: ['03', '15', '43', '63'],
  },
  {
    id: 'dijon',
    name: 'Dijon',
    zone: 'A',
    coords: { lat: 47.322, lng: 5.0418 },
    departments: ['21', '58', '71', '89'],
  },
  {
    id: 'grenoble',
    name: 'Grenoble',
    zone: 'A',
    coords: { lat: 45.1885, lng: 5.7245 },
    departments: ['05', '38', '73', '74'],
  },
  {
    id: 'limoges',
    name: 'Limoges',
    zone: 'A',
    coords: { lat: 45.8336, lng: 1.2611 },
    departments: ['16', '19', '23', '87'],
  },
  {
    id: 'lyon',
    name: 'Lyon',
    zone: 'A',
    coords: { lat: 45.764, lng: 4.8357 },
    departments: ['01', '42', '69'],
  },
  {
    id: 'poitiers',
    name: 'Poitiers',
    zone: 'A',
    coords: { lat: 46.58, lng: 0.34 },
    departments: ['17', '79', '86'],
  },

  // Zone B (12 academies)
  {
    id: 'aix-marseille',
    name: 'Aix-Marseille',
    zone: 'B',
    coords: { lat: 43.2965, lng: 5.3698 },
    departments: ['04', '05', '13', '84'],
  },
  {
    id: 'amiens',
    name: 'Amiens',
    zone: 'B',
    coords: { lat: 49.8941, lng: 2.2959 },
    departments: ['02', '60', '80'],
  },
  {
    id: 'caen',
    name: 'Caen',
    zone: 'B',
    coords: { lat: 49.1829, lng: -0.366 },
    departments: ['14', '50', '61'],
  },
  {
    id: 'lille',
    name: 'Lille',
    zone: 'B',
    coords: { lat: 50.6292, lng: 3.0573 },
    departments: ['59', '62'],
  },
  {
    id: 'nancy-metz',
    name: 'Nancy-Metz',
    zone: 'B',
    coords: { lat: 48.6921, lng: 6.1844 },
    departments: ['54', '55', '57'],
  },
  {
    id: 'nantes',
    name: 'Nantes',
    zone: 'B',
    coords: { lat: 47.2184, lng: -1.5536 },
    departments: ['44', '49', '53', '72', '85'],
  },
  {
    id: 'nice',
    name: 'Nice',
    zone: 'B',
    coords: { lat: 43.7102, lng: 7.262 },
    departments: ['06', '83'],
  },
  {
    id: 'orleans-tours',
    name: 'Orléans-Tours',
    zone: 'B',
    coords: { lat: 47.9029, lng: 1.909 },
    departments: ['18', '28', '36', '37', '41', '45'],
  },
  {
    id: 'reims',
    name: 'Reims',
    zone: 'B',
    coords: { lat: 49.2583, lng: 4.0347 },
    departments: ['08', '10', '51', '52'],
  },
  {
    id: 'rennes',
    name: 'Rennes',
    zone: 'B',
    coords: { lat: 48.1113, lng: -1.68 },
    departments: ['22', '29', '35', '56'],
  },
  {
    id: 'rouen',
    name: 'Rouen',
    zone: 'B',
    coords: { lat: 49.4432, lng: 1.0993 },
    departments: ['27', '76'],
  },
  {
    id: 'strasbourg',
    name: 'Strasbourg',
    zone: 'B',
    coords: { lat: 48.5734, lng: 7.7521 },
    departments: ['67', '68'],
  },

  // Zone C (5 academies)
  {
    id: 'creteil',
    name: 'Créteil',
    zone: 'C',
    coords: { lat: 48.9789, lng: 2.4502 },
    departments: ['75', '77', '94'],
  },
  {
    id: 'montpellier',
    name: 'Montpellier',
    zone: 'C',
    coords: { lat: 43.6108, lng: 3.8767 },
    departments: ['11', '30', '34', '48'],
  },
  {
    id: 'paris',
    name: 'Paris',
    zone: 'C',
    coords: { lat: 48.8566, lng: 2.3522 },
    departments: ['75'],
  },
  {
    id: 'toulouse',
    name: 'Toulouse',
    zone: 'C',
    coords: { lat: 43.6047, lng: 1.4442 },
    departments: ['09', '12', '31', '32', '46', '65', '81', '82'],
  },
  {
    id: 'versailles',
    name: 'Versailles',
    zone: 'C',
    coords: { lat: 48.8055, lng: 2.1211 },
    departments: ['75', '78', '91', '92', '95'],
  },

  // Overseas academies
  {
    id: 'corse',
    name: 'Corse',
    zone: 'A',
    coords: { lat: 42.0896, lng: 8.563 },
    departments: ['2A', '2B'],
  },
  {
    id: 'guadeloupe',
    name: 'Guadeloupe',
    zone: 'A',
    coords: { lat: 16.2517, lng: -61.5347 },
    departments: ['971'],
  },
  {
    id: 'guyane',
    name: 'Guyane',
    zone: 'A',
    coords: { lat: 4.9371, lng: -52.1899 },
    departments: ['973'],
  },
  {
    id: 'martinique',
    name: 'Martinique',
    zone: 'A',
    coords: { lat: 14.6349, lng: -61.0242 },
    departments: ['972'],
  },
  {
    id: 'reunion',
    name: 'Réunion',
    zone: 'A',
    coords: { lat: -21.1151, lng: 55.5364 },
    departments: ['974'],
  },
];

/**
 * Get academy by ID
 */
export const getAcademyById = (id: string): Academy | undefined => {
  return ACADEMIES.find((academy) => academy.id === id);
};

/**
 * Get all academies for a specific zone
 */
export const getAcademiesByZone = (zone: 'A' | 'B' | 'C'): Academy[] => {
  return ACADEMIES.filter((academy) => academy.zone === zone);
};
