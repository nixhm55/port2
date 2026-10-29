/**
 * Motion tokens. Mirrors the CSS custom properties in styles/tokens.css so
 * that CSS transitions and Framer Motion animations share one vocabulary.
 */
export type Bezier = [number, number, number, number];

export const ease = {
  /** Decelerating, for things arriving. */
  out: [0.22, 1, 0.36, 1] as Bezier,
  /** Symmetric, for things travelling across the screen. */
  inOut: [0.65, 0, 0.35, 1] as Bezier,
  /** Gentle, for ambient and hover movement. */
  soft: [0.33, 1, 0.68, 1] as Bezier
};

export const duration = {
  /** Hover and focus feedback. */
  micro: 0.2,
  /** Menus, small state changes. */
  ui: 0.4,
  /** Content reveals. */
  reveal: 0.9,
  /** Whole-page transitions. */
  page: 1.0
};

export const stagger = {
  lines: 0.09,
  items: 0.07
};

/** Seconds to wait before a page's own choreography starts, so it lands as the veil lifts. */
export const PAGE_ENTER_DELAY = 0.1;
