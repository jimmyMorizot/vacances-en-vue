import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

/**
 * InstallPrompt Component
 * Shows a prompt to install the PWA when available
 */
export default function InstallPrompt() {
  const { canInstall, isInstalled, error, installApp, dismissPrompt } = useInstallPrompt();

  // Don't show if already installed or not installable
  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground text-sm">
                Installer VacancesEnVue
              </h3>
              <p className="text-xs text-muted-foreground">
                Accédez rapidement à votre compte à rebours depuis l'écran d'accueil
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={dismissPrompt}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error message if any */}
        {error && (
          <p className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1">
            {error}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={installApp}
            className="flex-1 h-8 text-xs px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Installer
          </button>
          <button
            onClick={dismissPrompt}
            className="flex-1 h-8 text-xs px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors font-medium"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
