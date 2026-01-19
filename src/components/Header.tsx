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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 flex-1">
          <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 text-primary flex-shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              VacancesEnVue
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              Compte à rebours vers les vacances scolaires
            </p>
          </div>
        </div>

        {/* Academy Badge and Change Button */}
        <div className="flex items-center gap-2 ml-4">
          {selectedAcademy && (
            <Badge
              variant="secondary"
              className="hidden sm:flex bg-secondary text-secondary-foreground px-3 py-1 text-xs sm:text-sm font-medium"
            >
              Zone {selectedAcademy.zone}
            </Badge>
          )}

          {/* Change Academy Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-md border border-border bg-card text-foreground hover:bg-muted transition-colors duration-200 text-xs sm:text-sm font-medium"
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
        <div className="border-t border-border bg-muted px-4 sm:px-6 md:px-8 py-4 sm:py-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Sélectionnez votre académie
            </h3>
            <AcademySelector onSelect={handleAcademySelect} />
          </div>
        </div>
      )}
    </header>
  );
}
