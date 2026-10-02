import { useEffect } from 'react';

interface ShortcutHandlers {
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  regenerate: () => void;
  enabled: boolean;
}

/** Global keyboard shortcuts: Space / ← / → / R / G. */
export function useKeyboardShortcuts({ enabled, ...handlers }: ShortcutHandlers): void {
  useEffect(() => {
    if (!enabled) return;
    function onKey(e: KeyboardEvent): void {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;
      // Let focused buttons handle Space natively (as a click) to avoid double-toggling.
      if (e.key === ' ' && tag === 'BUTTON') return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlers.togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlers.next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlers.prev();
          break;
        case 'r':
        case 'R':
          handlers.reset();
          break;
        case 'g':
        case 'G':
          handlers.regenerate();
          break;
        default:
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, handlers.togglePlay, handlers.next, handlers.prev, handlers.reset, handlers.regenerate]);
}
