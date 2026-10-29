import React from 'react';
import { motion } from 'framer-motion';
import { duration, ease, stagger as staggerTokens } from '../lib/motion';
import { useReduced } from '../lib/hooks';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'p' | 'div';

interface MaskLinesProps {
  lines: string[];
  as?: HeadingTag;
  className?: string;
  /** Seconds before the first line starts. */
  delay?: number;
  stagger?: number;
  /** Start when scrolled into view instead of on mount. */
  inView?: boolean;
  /** Lines (by index) set in the italic style. */
  italic?: number[];
}

/**
 * Headline that rises line by line out of an overflow mask.
 * The full text is exposed to assistive tech once, not per line.
 */
export const MaskLines: React.FC<MaskLinesProps> = ({
  lines,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  stagger = staggerTokens.lines,
  inView = false,
  italic = []
}) => {
  const reduced = useReduced();
  // The static clip box is what gets observed; the line inside slides up through variants.
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'shown', viewport: { once: true, amount: 'some' as const } }
    : { initial: 'hidden', animate: 'shown' };

  return (
    <Tag className={`mask-lines ${className}`}>
      <span className="sr-only">{lines.join(' ')}</span>
      <span aria-hidden="true" className="mask-lines__stack">
        {lines.map((line, i) => (
          <motion.span key={`${line}-${i}`} className="mask-lines__clip" {...trigger}>
            <motion.span
              className={`mask-lines__line${italic.includes(i) ? ' is-italic' : ''}`}
              variants={{
                hidden: reduced ? { opacity: 0 } : { y: '110%' },
                shown: {
                  y: '0%',
                  opacity: 1,
                  transition: {
                    duration: reduced ? 0.3 : duration.reveal,
                    delay: delay + i * stagger,
                    ease: ease.out
                  }
                }
              }}
            >
              {line}
            </motion.span>
          </motion.span>
        ))}
      </span>
    </Tag>
  );
};

type FadeTag = 'div' | 'p' | 'li' | 'span' | 'section' | 'dl' | 'ul' | 'figure';

interface FadeProps extends React.HTMLAttributes<HTMLElement> {
  as?: FadeTag;
  delay?: number;
  y?: number;
  inView?: boolean;
  children?: React.ReactNode;
}

/** Small, quiet entrance. Used for supporting text, never for headlines. */
export const Fade: React.FC<FadeProps> = ({
  as = 'div',
  delay = 0,
  y = 14,
  inView = false,
  children,
  ...rest
}) => {
  const reduced = useReduced();
  const Comp = motion[as] as typeof motion.div;
  const trigger = inView
    ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 } }
    : { animate: { opacity: 1, y: 0 } };

  return (
    <Comp
      {...(rest as object)}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      {...trigger}
      transition={{ duration: reduced ? 0.3 : duration.reveal * 0.8, delay, ease: ease.out }}
    >
      {children}
    </Comp>
  );
};

interface DrawLineProps {
  direction?: 'horizontal' | 'vertical';
  delay?: number;
  inView?: boolean;
  className?: string;
  /** Seconds the line takes to cross. */
  length?: number;
}

/** A hairline that extends from its origin. */
export const DrawLine: React.FC<DrawLineProps> = ({
  direction = 'horizontal',
  delay = 0,
  inView = true,
  className = '',
  length = 1.1
}) => {
  const reduced = useReduced();
  const horizontal = direction === 'horizontal';
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'shown', viewport: { once: true, amount: 'some' as const } }
    : { initial: 'hidden', animate: 'shown' };

  // The outer box never changes size, so it can always be observed.
  return (
    <motion.span aria-hidden="true" className={`draw-line draw-line--${direction} ${className}`} {...trigger}>
      <motion.span
        className="draw-line__stroke"
        style={{ transformOrigin: horizontal ? '0% 50%' : '50% 0%' }}
        variants={{
          hidden: reduced ? { opacity: 0 } : horizontal ? { scaleX: 0 } : { scaleY: 0 },
          shown: {
            ...(reduced ? { opacity: 1 } : horizontal ? { scaleX: 1 } : { scaleY: 1 }),
            transition: { duration: reduced ? 0.3 : length, delay, ease: ease.inOut }
          }
        }}
      />
    </motion.span>
  );
};
