import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, SlidersHorizontal, Sun } from 'lucide-react';
import { portfolioData, type Theme } from '../data/portfolioData';
import { RouteLink, useRouter } from '../router/RouterContext';
import { useSite } from '../lib/site';
import { useReduced } from '../lib/hooks';
import { duration, ease } from '../lib/motion';
import { Arrow } from '../ui/Bits';

interface NavbarProps {
  theme: Theme;
}

function isCurrent(itemPath: string, routePath: string): boolean {
  return itemPath === '/' ? routePath === '/' : routePath === itemPath || routePath.startsWith(`${itemPath}/`);
}

export const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const { route } = useRouter();
  const { settings, setThemeMode, setEditorOpen } = useSite();
  const reduced = useReduced();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const active =
    portfolioData.navigation.find((item) => isCurrent(item.path, route.path)) ??
    portfolioData.navigation[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [route.path]);

  // Menu: Escape closes, Tab stays inside, page behind does not scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const overlay = overlayRef.current;
    overlay?.querySelector<HTMLElement>('a, button')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !overlay) return;
      const focusable = Array.from(
        overlay.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
      const toggle = toggleRef.current;
      if (toggle) focusable.push(toggle);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const nextTheme: Theme = theme === 'ivory' ? 'charcoal' : 'ivory';

  return (
    <>
      <header className={`header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
        <div className="header__inner">
          <div className="header__brand">
            <RouteLink to="/" className="wordmark" ariaLabel={`${settings.name}, back to the index`}>
              {settings.name}
            </RouteLink>
            <div className="header__note" aria-hidden="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={active.id}
                  initial={reduced ? { opacity: 0 } : { y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { y: -10, opacity: 0 }}
                  transition={{ duration: duration.micro + 0.1, ease: ease.out }}
                >
                  {active.note}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <nav className="header__nav" aria-label="Primary">
            <ul>
              {portfolioData.navigation.map((item) => {
                const current = isCurrent(item.path, route.path);
                return (
                  <li key={item.id}>
                    <RouteLink
                      to={item.path}
                      current={current}
                      className={`navlink${current ? ' is-current' : ''}`}
                    >
                      <span>{item.label}</span>
                      {current && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="navlink__bar"
                          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                        />
                      )}
                    </RouteLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header__tools">
            <button
              type="button"
              className="tool"
              onClick={() => setThemeMode(nextTheme)}
              aria-label={`Switch to the ${nextTheme} surface`}
              title={`Switch to the ${nextTheme} surface`}
            >
              {theme === 'ivory' ? <Moon size={15} strokeWidth={1.5} /> : <Sun size={15} strokeWidth={1.5} />}
            </button>
            <button
              type="button"
              className="tool"
              onClick={() => setEditorOpen(true)}
              aria-label="Edit placeholder content"
              title="Edit placeholder content"
            >
              <SlidersHorizontal size={15} strokeWidth={1.5} />
            </button>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="menu-overlay"
            >
              <span className="menu-toggle__label">{menuOpen ? 'Close' : 'Menu'}</span>
              <span className="menu-toggle__icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={overlayRef}
            id="menu-overlay"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: duration.ui + 0.15, ease: ease.inOut }}
          >
            <ul className="menu__list">
              {portfolioData.navigation.map((item, i) => {
                const current = isCurrent(item.path, route.path);
                return (
                  <li key={item.id} className="menu__item">
                    <motion.div
                      initial={reduced ? { opacity: 0 } : { y: 36, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.14 + i * 0.05, ease: ease.out }}
                    >
                      <RouteLink
                        to={item.path}
                        current={current}
                        className={`menu__link${current ? ' is-current' : ''}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="menu__label">{item.label}</span>
                        <span className="menu__note">
                          {item.note}
                          <Arrow />
                        </span>
                      </RouteLink>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
            <p className="menu__foot">{settings.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
