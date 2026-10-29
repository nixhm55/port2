import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { findProject } from '../data/portfolioData';
import { useRouter, type Rect } from '../router/RouterContext';
import { getRouteLabel } from '../lib/routeMeta';
import { useSite } from '../lib/site';
import { useReduced } from '../lib/hooks';
import { duration, ease } from '../lib/motion';
import { Media } from '../ui/ProjectVisual';
import type { Theme } from '../data/portfolioData';

/**
 * A panel in the surface's own colours that rises, holds on the destination's name,
 * and lifts away. The old page leaves and the new one arrives while it is covered.
 */
export const TransitionVeil: React.FC<{ theme: Theme }> = ({ theme }) => {
  const { route, transition } = useRouter();
  const { settings } = useSite();
  const reduced = useReduced();
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    if (transition.kind === 'veil' && !reduced) setActiveId(transition.id);
  }, [transition.id, transition.kind, reduced]);

  if (activeId === null || activeId !== transition.id) return null;
  const label = getRouteLabel(route, settings.name);

  return (
    <motion.div
      key={activeId}
      className={`veil veil--${theme}`}
      aria-hidden="true"
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{
        clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0 0 100% 0)']
      }}
      transition={{ duration: duration.page, times: [0, 0.42, 0.52, 1], ease: ease.inOut }}
      onAnimationComplete={() => setActiveId(null)}
    >
      <motion.span
        className="veil__label"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: [0, 0, 1, 1, 0], y: [16, 16, 0, 0, -10] }}
        transition={{ duration: duration.page, times: [0, 0.3, 0.46, 0.6, 0.78], ease: ease.out }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

const px = (r: Rect) => ({ top: r.top, left: r.left, width: r.width, height: r.height });

/**
 * Carries a project's visual from its card on the index to the hero of its page.
 * It sits above everything, so it survives the page swapping underneath it.
 */
export const FlightLayer: React.FC = () => {
  const { flight, endFlight } = useRouter();

  useEffect(() => {
    if (!flight) return;
    // Safety net: never leave a visual stranded on screen.
    const timer = window.setTimeout(endFlight, 3500);
    return () => window.clearTimeout(timer);
  }, [flight, endFlight]);

  if (!flight) return null;
  const project = findProject(flight.slug);
  if (!project) return null;

  return (
    <motion.div
      key={flight.id}
      className="flight"
      aria-hidden="true"
      initial={px(flight.from)}
      animate={px(flight.to ?? flight.from)}
      transition={flight.to ? { duration: 0.95, ease: ease.inOut } : { duration: 0 }}
      onAnimationComplete={() => {
        if (flight.to) endFlight();
      }}
    >
      <Media image={project.image} kind={project.visual.kind} seed={project.visual.seed} />
    </motion.div>
  );
};
