import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** True when the visitor asked the system for less motion. */
export function useReduced(): boolean {
  return useReducedMotion() ?? false;
}

export function useMediaQuery(query: string): boolean {
  const get = () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches);
  const [matches, setMatches] = useState<boolean>(get);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Fine pointer with hover: mouse or trackpad, not touch. */
export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}
