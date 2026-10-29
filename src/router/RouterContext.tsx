import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { findEntry, findProject, type RoutePath, type Theme } from '../data/portfolioData';

export type PageType =
  | 'home'
  | 'about'
  | 'projects'
  | 'project-detail'
  | 'journal'
  | 'journal-detail'
  | 'contact'
  | 'not-found';

export interface RouteMatch {
  path: string;
  pageType: PageType;
  slug?: string;
}

/** How the move between two routes is staged. */
export type TransitionKind = 'initial' | 'veil' | 'shared' | 'fade';

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** A project visual travelling from the index card to the detail hero. */
export interface Flight {
  id: number;
  slug: string;
  from: Rect;
  to?: Rect;
}

export interface NavigateOptions {
  replace?: boolean;
  kind?: TransitionKind;
  /** For kind "shared": where the visual currently sits on screen. */
  flightFrom?: Rect;
}

interface RouterContextValue {
  route: RouteMatch;
  transition: { id: number; kind: TransitionKind; direction: 'push' | 'pop' };
  flight: Flight | null;
  navigate: (to: RoutePath | string, options?: NavigateOptions) => void;
  goBack: () => void;
  setFlightTarget: (slug: string, rect: Rect) => void;
  endFlight: () => void;
  /** Returns where the next page should be scrolled to, once. */
  consumeScrollTarget: () => number;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function parsePathname(rawPath: string): RouteMatch {
  const clean = rawPath.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

  if (clean === '/' || clean === '/home') return { path: '/', pageType: 'home' };
  if (clean === '/about') return { path: clean, pageType: 'about' };
  if (clean === '/projects') return { path: clean, pageType: 'projects' };
  if (clean === '/journal') return { path: clean, pageType: 'journal' };
  if (clean === '/contact') return { path: clean, pageType: 'contact' };

  if (clean.startsWith('/projects/')) {
    const slug = safeDecode(clean.slice('/projects/'.length));
    return findProject(slug)
      ? { path: `/projects/${slug}`, pageType: 'project-detail', slug }
      : { path: clean, pageType: 'not-found' };
  }
  if (clean.startsWith('/journal/')) {
    const slug = safeDecode(clean.slice('/journal/'.length));
    return findEntry(slug)
      ? { path: `/journal/${slug}`, pageType: 'journal-detail', slug }
      : { path: clean, pageType: 'not-found' };
  }
  return { path: clean, pageType: 'not-found' };
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Which surface a page prefers when the visitor has not chosen one. */
export function defaultThemeFor(pageType: PageType): Theme {
  switch (pageType) {
    case 'projects':
    case 'project-detail':
    case 'contact':
      return 'charcoal';
    default:
      return 'ivory';
  }
}

function getInitialPath(): string {
  if (typeof window === 'undefined') return '/';
  // Deep links such as /#/projects/slug are normalised to real paths.
  if (window.location.hash.startsWith('#/')) {
    const fromHash = window.location.hash.slice(1);
    window.history.replaceState(null, '', fromHash);
    return fromHash;
  }
  return window.location.pathname || '/';
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteMatch>(() => parsePathname(getInitialPath()));
  const [transition, setTransition] = useState<RouterContextValue['transition']>({
    id: 0,
    kind: 'initial',
    direction: 'push'
  });
  const [flight, setFlight] = useState<Flight | null>(null);

  const routeRef = useRef(route);
  routeRef.current = route;
  const scrollPositions = useRef<Record<string, number>>({});
  const scrollTarget = useRef(0);
  const counter = useRef(0);

  useEffect(() => {
    // The router restores scroll itself so it can wait for the new page to exist.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    const onPop = () => {
      const next = parsePathname(window.location.pathname || '/');
      scrollPositions.current[routeRef.current.path] = window.scrollY;
      scrollTarget.current = scrollPositions.current[next.path] ?? 0;
      counter.current += 1;
      setFlight(null);
      setTransition({ id: counter.current, kind: 'veil', direction: 'pop' });
      setRoute(next);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: RoutePath | string, options?: NavigateOptions) => {
    const next = parsePathname(to);
    const current = routeRef.current;

    if (next.path === current.path) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }

    scrollPositions.current[current.path] = window.scrollY;
    scrollTarget.current = 0;
    counter.current += 1;
    const id = counter.current;

    const wantsFlight = options?.kind === 'shared' && options.flightFrom && next.slug;
    setFlight(wantsFlight ? { id, slug: next.slug as string, from: options!.flightFrom as Rect } : null);
    setTransition({ id, kind: options?.kind ?? 'veil', direction: 'push' });

    if (options?.replace) window.history.replaceState(null, '', next.path);
    else window.history.pushState(null, '', next.path);

    setRoute(next);
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) window.history.back();
    else navigate('/projects');
  }, [navigate]);

  const setFlightTarget = useCallback((slug: string, rect: Rect) => {
    setFlight((prev) => (prev && prev.slug === slug ? { ...prev, to: rect } : prev));
  }, []);

  const endFlight = useCallback(() => setFlight(null), []);

  const consumeScrollTarget = useCallback(() => {
    const y = scrollTarget.current;
    scrollTarget.current = 0;
    return y;
  }, []);

  const value = useMemo(
    () => ({
      route,
      transition,
      flight,
      navigate,
      goBack,
      setFlightTarget,
      endFlight,
      consumeScrollTarget
    }),
    [route, transition, flight, navigate, goBack, setFlightTarget, endFlight, consumeScrollTarget]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider');
  return ctx;
}

interface RouteLinkProps {
  to: RoutePath | string;
  className?: string;
  ariaLabel?: string;
  /** Marks the link as the current section even when the path differs (e.g. nested routes). */
  current?: boolean;
  kind?: TransitionKind;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
  'data-cursor'?: string;
}

/** A real anchor, so middle-click, copy-link and screen readers all behave. */
export const RouteLink = React.forwardRef<HTMLAnchorElement, RouteLinkProps>(
  ({ to, className, ariaLabel, current, kind, onClick, children, ...rest }, ref) => {
    const { navigate, route } = useRouter();
    const isCurrent = current ?? route.path === to;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to, { kind });
    };

    return (
      <a
        ref={ref}
        href={to}
        onClick={handleClick}
        className={className}
        aria-label={ariaLabel}
        aria-current={isCurrent ? 'page' : undefined}
        data-cursor={rest['data-cursor']}
      >
        {children}
      </a>
    );
  }
);
RouteLink.displayName = 'RouteLink';
