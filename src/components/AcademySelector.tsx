import { useEffect, useState } from 'react';
import { ACADEMIES } from '@/constants/academies';
import type { Academy } from '@/types/academy.types';

const STORAGE_KEY = 'selected_academy';

interface AcademySelectorProps {
  onSelect?: (academy: Academy) => void;
  defaultValue?: string;
}

/**
 * AcademySelector Component
 * Allows users to manually select their school academy
 * Groups academies by zone (A, B, C) for better UX
 * Saves selection to localStorage
 */
export default function AcademySelector({
  onSelect,
  defaultValue,
}: AcademySelectorProps) {
  const [selectedId, setSelectedId] = useState<string>(defaultValue || '');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSelectedId(saved);
    }
  }, []);

  // Get selected academy
  const selectedAcademy = ACADEMIES.find((a) => a.id === selectedId);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedId(newId);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, newId);

    // Callback with academy object
    const academy = ACADEMIES.find((a) => a.id === newId);
    if (academy && onSelect) {
      onSelect(academy);
    }
  };

  // Group academies by zone
  const groupedAcademies = {
    A: ACADEMIES.filter((a) => a.zone === 'A'),
    B: ACADEMIES.filter((a) => a.zone === 'B'),
    C: ACADEMIES.filter((a) => a.zone === 'C'),
  };

  return (
    <div className="w-full space-y-2">
      <label
        htmlFor="academy-select"
        className="block text-sm font-medium text-foreground"
      >
        Sélectionnez votre académie
      </label>

      <select
        id="academy-select"
        value={selectedId}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      >
        <option value="">-- Choisir une académie --</option>

        {/* Zone A */}
        <optgroup label="Zone A (Vacances 2 fois)">
          {groupedAcademies.A.map((academy) => (
            <option key={academy.id} value={academy.id}>
              {academy.name}
            </option>
          ))}
        </optgroup>

        {/* Zone B */}
        <optgroup label="Zone B (Vacances 2 fois)">
          {groupedAcademies.B.map((academy) => (
            <option key={academy.id} value={academy.id}>
              {academy.name}
            </option>
          ))}
        </optgroup>

        {/* Zone C */}
        <optgroup label="Zone C (Vacances 2 fois)">
          {groupedAcademies.C.map((academy) => (
            <option key={academy.id} value={academy.id}>
              {academy.name}
            </option>
          ))}
        </optgroup>
      </select>

      {selectedAcademy && (
        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
          <p className="text-muted-foreground">
            Zone <span className="font-semibold">{selectedAcademy.zone}</span> -{' '}
            {selectedAcademy.name}
          </p>
        </div>
      )}
    </div>
  );
}
