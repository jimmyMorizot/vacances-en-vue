import { useState, useEffect } from 'react';

/**
 * BeforeInstallPromptEvent type
 * Triggered when browser detects PWA is installable
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptState {
  canInstall: boolean;
  isInstalled: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  error: string | null;
  installApp: () => Promise<void>;
  dismissPrompt: () => void;
}

/**
 * Hook to manage PWA installation prompt
 * Detects if app is installable and manages the install flow
 */
export const useInstallPrompt = (): InstallPromptState => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if app is already installed (using display-mode: standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      // Prevent the mini-infobar from appearing
      event.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(event);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    const handleDisplayModeChange = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  // Register service worker on component mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          setError('Erreur lors de l\'enregistrement du Service Worker');
        });
    }
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      setError('L\'installation n\'est pas disponible');
      return;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user's choice
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('App installation accepted');
        setIsInstalled(true);
      } else {
        console.log('App installation dismissed');
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);
      setCanInstall(false);
    } catch (err) {
      console.error('Installation failed:', err);
      setError('Erreur lors de l\'installation de l\'application');
    }
  };

  const dismissPrompt = () => {
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  return {
    canInstall,
    isInstalled,
    deferredPrompt,
    error,
    installApp,
    dismissPrompt,
  };
};
