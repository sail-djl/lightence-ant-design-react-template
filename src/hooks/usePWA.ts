import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { markPromptReady, clearPrompt } from '@app/store/slices/pwaSlice';

type PWAInstallPromptEvent = Event & {
  platforms?: string[];
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt: () => Promise<void>;
};

let deferredPrompt: PWAInstallPromptEvent | null = null;

export const getDeferredPrompt = (): PWAInstallPromptEvent | null => deferredPrompt;

export const usePWA = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      deferredPrompt = event as PWAInstallPromptEvent;
      dispatch(markPromptReady());
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      deferredPrompt = null;
      dispatch(clearPrompt());
    };
  }, [dispatch]);
};
