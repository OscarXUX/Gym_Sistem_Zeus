// src/utils/wakeLock.js
import { useEffect } from 'react';

/**
 * Solicita y mantiene activo el Screen Wake Lock API para evitar que la
 * Tablet de recepción o el Monitor de 21.5" entren en suspensión.
 */
export function initWakeLock() {
  let wakeLockSentinel = null;

  const requestWakeLock = async () => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return;
    }
    try {
      if (document.visibilityState === 'visible') {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinel.addEventListener('release', () => {
          wakeLockSentinel = null;
        });
      }
    } catch {
      // Silencioso si el navegador aún requiere interacción o no lo soporta
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && !wakeLockSentinel) {
      requestWakeLock();
    }
  };

  requestWakeLock();
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (wakeLockSentinel) {
      wakeLockSentinel.release().catch(() => {});
      wakeLockSentinel = null;
    }
  };
}

export function useWakeLock() {
  useEffect(() => {
    const cleanup = initWakeLock();
    return cleanup;
  }, []);
}

export default useWakeLock;

