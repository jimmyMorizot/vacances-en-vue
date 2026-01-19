import { useCountdown } from '@/hooks/useCountdown';
import { Card } from '@/components/ui/card';
import { Clock, BookOpen, Zap } from 'lucide-react';
import type { CurrentStatus } from '@/types/vacation.types';

interface CountdownProps {
  currentStatus: CurrentStatus;
}

/**
 * TimeCard Component
 * Displays a single time unit (days, hours, minutes, seconds) with label
 */
const TimeCard: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const displayValue = String(value).padStart(2, '0');

  return (
    <Card className="flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-2 border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 tabular-nums transition-all duration-300">
        {displayValue}
      </div>
      <div className="text-sm sm:text-base font-semibold text-amber-700 dark:text-amber-300 mt-2 uppercase tracking-wide">
        {label}
      </div>
    </Card>
  );
};

/**
 * Countdown Component
 * Main countdown display showing time remaining until vacation or school
 */
export default function Countdown({ currentStatus }: CountdownProps) {
  const timeRemaining = useCountdown(currentStatus.nextEvent);

  const isInVacation = currentStatus.status === 'in_vacation';
  const eventLabel = isInVacation ? 'Fin des vacances' : 'Prochaines vacances';

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header Title */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-400" />
          <span>{eventLabel}</span>
        </h2>
        <p className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400">
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
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-2 border-emerald-200 dark:border-emerald-800">
        <div className="text-center space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-100 flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" />
            <span>{currentStatus.nextVacation.description}</span>
          </h3>
          <p className="text-sm sm:text-base text-emerald-700 dark:text-emerald-300">
            {currentStatus.nextVacation.zones} • {currentStatus.nextVacation.location}
          </p>
          <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
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
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border-2 border-red-200 dark:border-red-800">
          <p className="text-center text-red-900 dark:text-red-100 font-semibold flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span>L'événement est maintenant! Profitez du moment!</span>
          </p>
        </Card>
      )}
    </div>
  );
}
