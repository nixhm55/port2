import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { RouteLink } from '../router/RouterContext';
import { useSite } from '../lib/site';
import { useReduced } from '../lib/hooks';
import { Arrow } from '../ui/Bits';

export const Footer: React.FC = () => {
  const { settings } = useSite();
  const reduced = useReduced();

  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });

  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__lead">
          <p className="footer__name">{settings.name}</p>
          <p className="footer__line">
            <a className="link-line" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <ul>
            {portfolioData.navigation.map((item) => (
              <li key={item.id}>
                <RouteLink to={item.path} className="link-line">
                  {item.label}
                </RouteLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__meta">
          <p>{portfolioData.identity.colophon}</p>
          <button type="button" className="to-top" onClick={toTop}>
            <span>Back to top</span>
            <Arrow direction="down" className="arrow--up" />
          </button>
        </div>
      </div>
    </footer>
  );
};
