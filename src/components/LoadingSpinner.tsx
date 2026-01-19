import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface LoadingSpinnerProps {
  stage?: 'geolocation' | 'api' | 'all';
}

/**
 * SkeletonTimeCard Component
 * Displays a skeleton loader for a single countdown time unit
 */
const SkeletonTimeCard = () => {
  return (
    <Card className="flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
      <Skeleton className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 rounded-lg mb-3 bg-gray-300 dark:bg-gray-600 animate-pulse" />
      <Skeleton className="w-12 h-5 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
    </Card>
  );
};

/**
 * LoadingSpinner Component
 * Displays skeleton loaders with contextual loading messages
 */
export default function LoadingSpinner({ stage = 'all' }: LoadingSpinnerProps) {
  const showGeolocation = stage === 'geolocation' || stage === 'all';
  const showApi = stage === 'api' || stage === 'all';

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header with spinner */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-gray-300 dark:border-gray-600 border-t-amber-500 dark:border-t-amber-400 rounded-full animate-spin" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Chargement...
          </h2>
        </div>
        <p className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400 min-h-6">
          {showGeolocation && !showApi && '📍 Détection de votre académie...'}
          {!showGeolocation && showApi && '📚 Récupération des vacances scolaires...'}
          {showGeolocation && showApi && '⏳ Initialisation de l\'application...'}
        </p>
      </div>

      {/* Skeleton Countdown Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <SkeletonTimeCard />
        <SkeletonTimeCard />
        <SkeletonTimeCard />
        <SkeletonTimeCard />
      </div>

      {/* Skeleton Info Card */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4 rounded-lg bg-gray-300 dark:bg-gray-600 animate-pulse" />
          <Skeleton className="h-5 w-1/2 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
          <Skeleton className="h-4 w-5/6 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
        </div>
      </Card>

      {/* Loading Tips */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse" />
          Veuillez patienter...
        </p>
      </div>
    </div>
  );
}
