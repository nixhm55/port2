import React, { Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { poseFor, type Pose } from './poses';
import { useMediaQuery, useReduced } from '../lib/hooks';
import type { Theme } from '../data/portfolioData';
import type { SceneTier } from './Scene';

const Scene = lazy(() => import('./Scene'));

type Tier = SceneTier | 'none';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Decide how much rendering this device should be asked to do. */
function detectTier(): Tier {
  if (typeof window === 'undefined' || !hasWebGL()) return 'none';
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return 'none';
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (memory <= 1 || cores <= 2) return 'none';
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (memory <= 4 || cores <= 4 || coarse || window.innerWidth < 760) return 'low';
  return 'high';
}

class SceneBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('3D scene unavailable, using the still drawing instead.', error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** A still line drawing of the sculpture for devices that cannot, or should not, run WebGL. */
const StillSculpture: React.FC<{ pose: Pose; narrow: boolean }> = ({ pose, narrow }) => (
  <div
    className="stage__still"
    style={{
      transform: `translate(calc(-50% + ${pose.x * 100}vw), calc(-50% + ${-pose.y * 100}vh)) scale(${pose.scale * (narrow ? 1.1 : 1)})`
    }}
  >
    <svg viewBox="-200 -170 400 340" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M -85 110 V 0 A 85 85 0 0 1 85 0 V 110" />
        <path d="M -41 110 V 0 A 41 41 0 0 1 41 0 V 110" opacity="0.5" />
        <rect x="-26" y="-70" width="52" height="180" fill="currentColor" fillOpacity="0.9" stroke="none" transform="rotate(4 0 40)" />
        <circle cx="140" cy="88" r="22" />
        <ellipse cx="0" cy="-10" rx="165" ry="44" opacity="0.5" transform="rotate(-10)" />
        <ellipse cx="0" cy="114" rx="150" ry="9" opacity="0.18" fill="currentColor" stroke="none" />
      </g>
    </svg>
  </div>
);

interface SceneHostProps {
  theme: Theme;
}

/** The persistent 3D layer behind every page. Poses itself from the current route. */
export const SceneHost: React.FC<SceneHostProps> = ({ theme }) => {
  const { route } = useRouter();
  const reduced = useReduced();
  const narrow = useMediaQuery('(max-width: 820px)');
  const tier = useMemo<Tier>(() => detectTier(), []);
  const [ready, setReady] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const onReady = useCallback(() => setReady(true), []);

  // The scene recedes as the visitor scrolls, so text always has priority over it.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const fade = Math.max(0.18, 1 - (window.scrollY / window.innerHeight) * 0.85);
      layerRef.current?.style.setProperty('--fade', fade.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const pose = poseFor(route.pageType, route.slug, narrow);
  const still = <StillSculpture pose={pose} narrow={narrow} />;

  return (
    <div
      className={`stage${ready || tier === 'none' ? ' is-ready' : ''}`}
      style={{ ['--presence' as string]: pose.presence }}
      aria-hidden="true"
    >
      <div ref={layerRef} className="stage__layer">
        {tier === 'none' ? (
          still
        ) : (
          <SceneBoundary fallback={still}>
            <Suspense fallback={null}>
              <Scene
                pose={pose}
                theme={theme}
                tier={tier}
                reduced={reduced}
                narrow={narrow}
                onReady={onReady}
              />
            </Suspense>
          </SceneBoundary>
        )}
      </div>
    </div>
  );
};
