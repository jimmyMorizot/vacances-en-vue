import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

/**
 * InstallPrompt Component
 * Shows a prompt to install the PWA when available
 * Uses Summer theme colors with proper dark mode support
 */
export default function InstallPrompt() {
  const { canInstall, isInstalled, error, installApp, dismissPrompt } = useInstallPrompt();

  // Don't show if already installed or not installable
  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-50 animate-in slide-in-from-bottom-2 duration-300 px-4 sm:px-0">
      {/* Main popup card - Summer theme colors */}
      <div className="bg-amber-50 dark:bg-slate-800 border-2 border-orange-500 dark:border-orange-500 rounded-lg shadow-xl p-4 space-y-3">

        {/* Header with icon */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <Download className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-orange-900 dark:text-orange-100">
                Installer VacancesEnVue
              </h3>
              <p className="text-xs text-orange-700 dark:text-amber-100">
                Accédez rapidement à votre compte à rebours depuis votre écran d'accueil
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={dismissPrompt}
            className="text-orange-600 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex-shrink-0 p-0.5"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error message if any */}
        {error && (
          <p className="text-xs text-red-900 dark:text-red-100 bg-red-100 dark:bg-red-900/30 rounded px-2 py-1 border border-red-300 dark:border-red-700">
            ⚠️ {error}
          </p>
        )}

        {/* Action buttons - Summer theme */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={installApp}
            className="flex-1 h-8 text-xs px-3 py-1.5 rounded-md font-bold transition-colors
              bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
              dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700
              text-white dark:text-white shadow-md hover:shadow-lg"
          >
            ✓ Installer
          </button>
          <button
            onClick={dismissPrompt}
            className="flex-1 h-8 text-xs px-3 py-1.5 rounded-md font-bold transition-colors
              bg-white dark:bg-slate-700 border-2 border-orange-500 dark:border-orange-400
              text-orange-700 dark:text-orange-100 hover:bg-orange-50 dark:hover:bg-slate-600"
          >
            Plus tard
          </button>
        </div>

        {/* Subtle brand message */}
        <div className="text-center">
          <p className="text-xs text-orange-600 dark:text-amber-200">
            ☀️ Parfait pour la rentrée!
          </p>
        </div>
      </div>
    </div>
  );
}
