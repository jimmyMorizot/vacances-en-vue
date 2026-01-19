import { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AcademySelector from '@/components/AcademySelector';
import { ACADEMIES } from '@/constants/academies';
import type { Academy } from '@/types/academy.types';

/**
 * Header Component
 * Displays app title and allows users to change their academy
 * Shows current academy in a badge
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null);

  // Load selected academy from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selected_academy');
    if (saved) {
      const academy = ACADEMIES.find((a) => a.id === saved);
      if (academy) {
        setSelectedAcademy(academy);
      }
    }
  }, []);

  // Handle academy selection
  const handleAcademySelect = (academy: Academy) => {
    setSelectedAcademy(academy);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 flex-1">
          <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              VacancesEnVue
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              Compte à rebours vers les vacances scolaires
            </p>
          </div>
        </div>

        {/* Academy Badge and Change Button */}
        <div className="flex items-center gap-2 ml-4">
          {selectedAcademy && (
            <Badge
              variant="secondary"
              className="hidden sm:flex bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-700 px-3 py-1 text-xs sm:text-sm font-medium"
            >
              Zone {selectedAcademy.zone}
            </Badge>
          )}

          {/* Change Academy Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 text-xs sm:text-sm font-medium"
            aria-label="Change academy"
            aria-expanded={isOpen}
          >
            <span className="hidden sm:inline">Changer d'académie</span>
            <Settings className="sm:hidden w-4 h-4" />
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Academy Selector Modal - Animated Dropdown */}
      {isOpen && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 md:px-8 py-4 sm:py-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Sélectionnez votre académie
            </h3>
            <AcademySelector onSelect={handleAcademySelect} />
          </div>
        </div>
      )}
    </header>
  );
}
