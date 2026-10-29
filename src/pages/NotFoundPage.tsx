import React from 'react';
import { RouteLink } from '../router/RouterContext';
import { PAGE_ENTER_DELAY } from '../lib/motion';
import { Fade, MaskLines } from '../ui/Reveal';
import { Arrow } from '../ui/Bits';

export const NotFoundPage: React.FC = () => (
  <div className="page page--not-found">
    <div className="wrap not-found">
      <MaskLines
        as="h1"
        lines={['This page', 'is not here.']}
        italic={[1]}
        className="page-title"
        delay={PAGE_ENTER_DELAY + 0.15}
      />
      <Fade delay={PAGE_ENTER_DELAY + 0.5} className="not-found__actions">
        <p>The address may be mistyped, or the entry may have been renamed.</p>
        <RouteLink to="/" className="link-line">
          <Arrow direction="left" />
          <span>Back to the index</span>
        </RouteLink>
        <RouteLink to="/projects" className="link-line">
          <span>See selected work</span>
          <Arrow />
        </RouteLink>
      </Fade>
    </div>
  </div>
);
