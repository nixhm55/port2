import React, { useState } from 'react';
import type { RemoteImage, VisualKind } from '../data/portfolioData';

/** Deterministic pseudo-random numbers, so a visual never changes between renders. */
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const W = 800;
const H = 500;

const Ledger: React.FC<{ seed: number }> = ({ seed }) => {
  const r = rng(seed);
  const rows = 11;
  const cols = [120, 330, 470, 610, 740];
  const highlight = 3 + Math.floor(r() * 4);
  const pts = Array.from({ length: 8 }, (_, i) => [
    130 + i * 86,
    380 - (i * 24 + r() * 46)
  ]);
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      {Array.from({ length: rows }, (_, i) => (
        <line key={i} x1="60" x2="760" y1={70 + i * 36} y2={70 + i * 36} opacity={i === 0 ? 0.9 : 0.28} />
      ))}
      {cols.map((x) => (
        <line key={x} x1={x} x2={x} y1="70" y2={70 + (rows - 1) * 36} opacity="0.16" />
      ))}
      <rect
        x="60"
        y={70 + highlight * 36}
        width="700"
        height="36"
        fill="currentColor"
        stroke="none"
        opacity="0.09"
      />
      {Array.from({ length: rows - 1 }, (_, i) =>
        cols.slice(1).map((x, j) => (
          <text
            key={`${i}-${j}`}
            x={x - 10}
            y={70 + i * 36 + 24}
            textAnchor="end"
            fontSize="11"
            fill="currentColor"
            stroke="none"
            opacity="0.5"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {(1000 + Math.floor(r() * 8999)).toLocaleString('en-US')}
          </text>
        ))
      )}
      <polyline points={pts.map((p) => p.join(',')).join(' ')} strokeWidth="1.6" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="5" fill="currentColor" stroke="none" />
    </g>
  );
};

const Specimen: React.FC<{ seed: number }> = ({ seed }) => {
  const r = rng(seed);
  const tilt = (r() - 0.5) * 3;
  return (
    <g>
      <g stroke="currentColor" strokeWidth="1" opacity="0.26" fill="none">
        {[110, 180, 340, 400].map((y) => (
          <line key={y} x1="40" x2="760" y1={y} y2={y} strokeDasharray={y === 340 ? undefined : '3 7'} />
        ))}
      </g>
      <text
        x="400"
        y="340"
        textAnchor="middle"
        fontSize="270"
        fill="currentColor"
        transform={`rotate(${tilt} 400 250)`}
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300 }}
      >
        Aa
      </text>
      <text
        x="60"
        y="440"
        fontSize="11"
        fill="currentColor"
        opacity="0.55"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        baseline, x-height, cap height
      </text>
      <text
        x="740"
        y="440"
        textAnchor="end"
        fontSize="11"
        fill="currentColor"
        opacity="0.55"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        0123456789
      </text>
    </g>
  );
};

const Plates: React.FC<{ seed: number }> = ({ seed }) => {
  const r = rng(seed);
  const j = () => (r() - 0.5) * 24;
  return (
    <g>
      <rect x={110 + j()} y={90} width="270" height="330" fill="currentColor" opacity="0.1" />
      <rect x={250 + j()} y={60} width="300" height="270" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x={430 + j()} y={140} width="250" height="290" fill="currentColor" opacity="0.88" />
      <g stroke="currentColor" strokeWidth="1" opacity="0.4">
        <line x1="60" x2="740" y1="455" y2="455" />
        <line x1="250" x2="250" y1="445" y2="465" />
        <line x1="430" x2="430" y1="445" y2="465" />
        <line x1="680" x2="680" y1="445" y2="465" />
      </g>
    </g>
  );
};

const Grid: React.FC<{ seed: number }> = ({ seed }) => {
  const r = rng(seed);
  const sizes = [16, 24, 32, 48, 64, 96];
  let x = 90;
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      {Array.from({ length: 21 }, (_, i) =>
        Array.from({ length: 11 }, (_, j) => (
          <circle key={`${i}-${j}`} cx={60 + i * 34} cy={50 + j * 38} r="1.3" fill="currentColor" stroke="none" opacity="0.3" />
        ))
      )}
      {sizes.map((s, i) => {
        const el = (
          <rect
            key={s}
            x={x}
            y={400 - s}
            width={s}
            height={s}
            fill={i === 3 + Math.floor(r() * 2) ? 'currentColor' : 'none'}
            opacity={0.9}
          />
        );
        x += s + 28;
        return el;
      })}
      <line x1="60" x2="760" y1="400" y2="400" opacity="0.5" />
    </g>
  );
};

const Arc: React.FC<{ seed: number }> = ({ seed }) => {
  const r = rng(seed);
  const shift = (r() - 0.5) * 40;
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.2">
      <line x1="60" x2="740" y1="400" y2="400" opacity="0.4" />
      {[200, 160, 120].map((rad, i) => (
        <path key={rad} d={`M ${400 - rad + shift} 400 A ${rad} ${rad} 0 0 1 ${400 + rad + shift} 400`} opacity={1 - i * 0.28} />
      ))}
      <rect x={372 + shift} y="230" width="56" height="170" fill="currentColor" stroke="none" opacity="0.9" />
      <circle cx={560 + shift} cy="372" r="28" fill="currentColor" stroke="none" opacity="0.2" />
      <ellipse cx={400 + shift} cy="404" rx="230" ry="10" fill="currentColor" stroke="none" opacity="0.07" />
    </g>
  );
};

const Contour: React.FC<{ seed: number }> = ({ seed }) => {
  const r = rng(seed);
  const bend = 60 + r() * 60;
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.1">
      {Array.from({ length: 9 }, (_, i) => {
        const o = i * 22;
        return (
          <path
            key={i}
            d={`M 60 ${420 - o * 0.5} C ${260 + bend} ${420 - o * 0.5}, ${300 - bend} ${80 + o}, 740 ${80 + o}`}
            opacity={0.18 + (i / 9) * 0.7}
          />
        );
      })}
      <circle cx="740" cy="80" r="4" fill="currentColor" stroke="none" />
      <circle cx="60" cy="420" r="4" fill="currentColor" stroke="none" />
    </g>
  );
};

const KINDS: Record<VisualKind, React.FC<{ seed: number }>> = {
  ledger: Ledger,
  specimen: Specimen,
  plates: Plates,
  grid: Grid,
  arc: Arc,
  contour: Contour
};

interface ProjectVisualProps {
  kind: VisualKind;
  seed?: number;
  className?: string;
}

/** Generated monochrome artwork used wherever a project has no photograph yet. */
export const ProjectVisual: React.FC<ProjectVisualProps> = ({ kind, seed = 1, className = '' }) => {
  const Kind = KINDS[kind];
  return (
    <svg
      className={`visual ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Abstract ${kind} study`}
    >
      <Kind seed={seed} />
    </svg>
  );
};

interface MediaProps {
  image?: RemoteImage;
  kind: VisualKind;
  seed?: number;
  className?: string;
}

/** A real image when one is supplied and loads; otherwise the generated visual. */
export const Media: React.FC<MediaProps> = ({ image, kind, seed, className = '' }) => {
  const [failed, setFailed] = useState(false);
  if (image && !failed) {
    return (
      <img
        className={`visual visual--photo ${className}`}
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }
  return <ProjectVisual kind={kind} seed={seed} className={className} />;
};
