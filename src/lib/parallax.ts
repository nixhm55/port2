import { type RefObject } from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useReduced } from './hooks';

/** Vertical drift of an element as it crosses the viewport. No movement for reduced motion. */
export function useParallax(ref: RefObject<HTMLElement>, distance = 60): MotionValue<number> {
  const reduced = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [distance, -distance]);
}
