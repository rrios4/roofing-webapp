import { useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * Use only where behavior (not just styling) must change — prefer Tailwind
 * responsive classes for layout.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined') return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches),
    () => false
  );
}

/** True on touch-first devices (phones, tablets) where hover and HTML5 drag-and-drop are unavailable. */
export const useIsTouchDevice = () => useMediaQuery('(pointer: coarse)');

/** True below Tailwind's `md` breakpoint (< 768px). */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
