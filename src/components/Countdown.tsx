import { useCountdown } from '@/hooks/useCountdown';
import { Card } from '@/components/ui/card';
import { Clock, BookOpen, Zap } from 'lucide-react';
import type { CurrentStatus } from '@/types/vacation.types';

interface CountdownProps {
  currentStatus: CurrentStatus;
  selectedAcademyName?: string;
  selectedAcademyZone?: 'A' | 'B' | 'C';
}

/**
 * TimeCard Component
 * Displays a single time unit (days, hours, minutes, seconds) with label
 */
const TimeCard: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const displayValue = String(value).padStart(2, '0');

  return (
    <Card className="flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 bg-card border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="text-5xl sm:text-6xl md:text-7xl font-black text-primary tabular-nums transition-all duration-300">
        {displayValue}
      </div>
      <div className="text-sm sm:text-base font-semibold footer-text-primary mt-2 uppercase tracking-wide">
        {label}
      </div>
    </Card>
  );
};

/**
 * Countdown Component
 * Main countdown display showing time remaining until vacation or school
 */
export default function Countdown({ currentStatus, selectedAcademyName, selectedAcademyZone }: CountdownProps) {
  const timeRemaining = useCountdown(currentStatus.nextEvent);

  const isInVacation = currentStatus.status === 'in_vacation';
  const eventLabel = isInVacation ? 'Fin des vacances' : 'Prochaines vacances';

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header Title */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center gap-2">
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          <span>{eventLabel}</span>
        </h2>
        <p className="text-lg sm:text-xl font-semibold footer-text-secondary">
          {currentStatus.eventType === 'vacation_start' ? 'Compte à rebours' : 'Temps restant'}
        </p>
      </div>

      {/* Countdown Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <TimeCard value={timeRemaining.days} label="Jours" />
        <TimeCard value={timeRemaining.hours} label="Heures" />
        <TimeCard value={timeRemaining.minutes} label="Minutes" />
        <TimeCard value={timeRemaining.seconds} label="Secondes" />
      </div>

      {/* Vacation Name and Zone Info */}
      <Card className="p-4 sm:p-6 bg-secondary border-2 border-border">
        <div className="text-center space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-secondary-foreground flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            <span>{currentStatus.nextVacation.description}</span>
          </h3>
          <p className="text-sm sm:text-base vacation-card-text">
            {selectedAcademyZone ? `Zone ${selectedAcademyZone}` : currentStatus.nextVacation.zones} • {selectedAcademyName || currentStatus.nextVacation.location}
          </p>
          <p className="text-xs sm:text-sm vacation-card-text font-medium">
            Du {new Date(currentStatus.nextVacation.start_date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}{' '}
            au{' '}
            {new Date(currentStatus.nextVacation.end_date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </Card>

      {/* Expiration Message */}
      {timeRemaining.isExpired && (
        <Card className="p-4 sm:p-6 bg-destructive border-2 border-border">
          <p className="text-center text-destructive-foreground font-semibold flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            <span>L'événement est maintenant! Profitez du moment!</span>
          </p>
        </Card>
      )}
    </div>
  );
}
