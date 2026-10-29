import type { PageType } from '../router/RouterContext';
import { findProject } from '../data/portfolioData';

/**
 * Where the sculpture sits for each route.
 * x / y are fractions of the viewport (0 is centre, +x right, +y up).
 */
export interface Pose {
  x: number;
  y: number;
  scale: number;
  rx: number;
  ry: number;
  rz: number;
  /** 0..1, slides the slab and sphere through their range. */
  morph: number;
  /** Tilt of the thin orbit ring, radians. */
  ring: number;
  /** Opacity of the whole scene layer. Kept low where text needs the room. */
  presence: number;
}

const desktop: Record<Exclude<PageType, 'project-detail'>, Pose> = {
  home: { x: 0.22, y: -0.02, scale: 0.92, rx: 0.06, ry: 0.55, rz: 0, morph: 0.2, ring: 0.45, presence: 1 },
  about: { x: -0.3, y: -0.3, scale: 0.55, rx: 0.1, ry: -0.55, rz: 0.02, morph: 0.55, ring: -0.5, presence: 0.55 },
  projects: { x: 0.38, y: -0.08, scale: 0.5, rx: 0.05, ry: 1.0, rz: -0.03, morph: 0.4, ring: 0.7, presence: 0.42 },
  journal: { x: -0.3, y: -0.2, scale: 0.55, rx: 0.12, ry: 0.2, rz: 0.04, morph: 0.8, ring: 0.2, presence: 0.6 },
  'journal-detail': { x: 0.36, y: 0.16, scale: 0.5, rx: 0.1, ry: 0.35, rz: 0.03, morph: 0.7, ring: 0.1, presence: 0.34 },
  contact: { x: 0.3, y: 0.24, scale: 0.55, rx: 0.04, ry: -0.85, rz: 0, morph: 0.5, ring: -0.3, presence: 0.6 },
  'not-found': { x: 0.0, y: 0.0, scale: 0.85, rx: 0.05, ry: 0.4, rz: 0, morph: 0.3, ring: 0.3, presence: 0.7 }
};

const mobile: Record<Exclude<PageType, 'project-detail'>, Pose> = {
  home: { x: 0.14, y: -0.12, scale: 1.0, rx: 0.06, ry: 0.5, rz: 0, morph: 0.2, ring: 0.45, presence: 1 },
  about: { x: 0.2, y: 0.28, scale: 0.55, rx: 0.1, ry: -0.5, rz: 0.02, morph: 0.55, ring: -0.5, presence: 0.5 },
  projects: { x: 0.25, y: 0.3, scale: 0.45, rx: 0.05, ry: 1.0, rz: 0, morph: 0.4, ring: 0.7, presence: 0.25 },
  journal: { x: 0.25, y: 0.3, scale: 0.45, rx: 0.12, ry: 0.2, rz: 0.04, morph: 0.8, ring: 0.2, presence: 0.25 },
  'journal-detail': { x: 0.25, y: 0.3, scale: 0.4, rx: 0.1, ry: 0.35, rz: 0.03, morph: 0.7, ring: 0.1, presence: 0.2 },
  contact: { x: 0.18, y: 0.3, scale: 0.55, rx: 0.04, ry: -0.85, rz: 0, morph: 0.5, ring: -0.3, presence: 0.45 },
  'not-found': { x: 0, y: 0.1, scale: 0.8, rx: 0.05, ry: 0.4, rz: 0, morph: 0.3, ring: 0.3, presence: 0.6 }
};

export function poseFor(pageType: PageType, slug: string | undefined, narrow: boolean): Pose {
  if (pageType === 'project-detail') {
    const preset = findProject(slug)?.scenePose;
    const base = narrow
      ? { x: 0.25, y: 0.3, scale: 0.42, presence: 0.25 }
      : { x: 0.37, y: 0.16, scale: 0.6 * (preset?.scale ?? 1), presence: 0.4 };
    return {
      ...base,
      rx: preset?.rotation[0] ?? 0.2,
      ry: preset?.rotation[1] ?? 0.6,
      rz: preset?.rotation[2] ?? 0,
      morph: preset?.morph ?? 0.3,
      ring: preset?.ring ?? 0.4
    };
  }
  return (narrow ? mobile : desktop)[pageType];
}
