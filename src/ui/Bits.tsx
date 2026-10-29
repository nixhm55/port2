import React from 'react';
import type { Field } from '../data/portfolioData';

/** Renders a field, marking it when it is still a stand-in. */
export const Ph: React.FC<{ field: Field; className?: string }> = ({ field, className = '' }) =>
  field.placeholder ? (
    <span
      className={`ph ${className}`}
      title="Placeholder. Replace it in src/data/portfolioData.ts"
    >
      {field.value}
    </span>
  ) : (
    <span className={className}>{field.value}</span>
  );

export const SampleTag: React.FC<{ label?: string }> = ({ label = 'Sample' }) => (
  <span className="sample-tag" title="Demonstration content, not real work">
    {label}
  </span>
);

/** Small diagonal arrow that nudges on hover (see .arrow in CSS). */
export const Arrow: React.FC<{ className?: string; direction?: 'up-right' | 'right' | 'down' | 'left' }> = ({
  className = '',
  direction = 'up-right'
}) => {
  const paths = {
    'up-right': 'M3 11L11 3M5 3h6v6',
    right: 'M2 7h10M8 3l4 4-4 4',
    down: 'M7 2v10M3 8l4 4 4-4',
    left: 'M12 7H2M6 3L2 7l4 4'
  } as const;
  return (
    <svg
      className={`arrow ${className}`}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d={paths[direction]} />
    </svg>
  );
};
