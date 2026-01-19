import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export type ErrorType = 'geolocation' | 'api' | 'academy_not_detected';

interface ErrorMessageProps {
  errorType: ErrorType;
  onRetry?: () => void;
  customMessage?: string;
}

/**
 * Error message mapping with specific messages for each error type
 */
const ERROR_MESSAGES: Record<ErrorType, { title: string; description: string }> = {
  geolocation: {
    title: '📍 Géolocalisation indisponible',
    description:
      'Activez la géolocalisation dans les paramètres de votre navigateur ou sélectionnez manuellement votre académie.',
  },
  api: {
    title: '🔌 Erreur de connexion',
    description:
      'Impossible de récupérer les vacances scolaires en ce moment. Vérifiez votre connexion Internet et réessayez plus tard.',
  },
  academy_not_detected: {
    title: '🔍 Académie non détectée',
    description:
      'Votre position n\'a pas pu être reconnue. Veuillez sélectionner manuellement votre académie pour continuer.',
  },
};

/**
 * ErrorMessage Component
 * Displays specific error messages with retry functionality
 */
export default function ErrorMessage({
  errorType,
  onRetry,
  customMessage,
}: ErrorMessageProps) {
  const error = ERROR_MESSAGES[errorType];
  const title = customMessage || error.title;
  const description = error.description;

  return (
    <Alert className="border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20 shadow-md">
      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
      <div className="flex-1 ml-3">
        <AlertTitle className="text-lg font-semibold text-red-900 dark:text-red-100">
          {title}
        </AlertTitle>
        <AlertDescription className="text-red-800 dark:text-red-200 mt-2">
          {description}
        </AlertDescription>
      </div>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          aria-label="Retry"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Réessayer</span>
          <span className="sm:hidden">⟲</span>
        </button>
      )}
    </Alert>
  );
}
