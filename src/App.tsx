import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RouterProvider, defaultThemeFor, useRouter, type RouteMatch } from './router/RouterContext';
import { SiteProvider, useSite } from './lib/site';
import { useReduced } from './lib/hooks';
import { ease } from './lib/motion';
import { getRouteDescription, getRouteLabel, getRouteTitle } from './lib/routeMeta';
import type { Theme } from './data/portfolioData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { EditorDrawer } from './components/EditorDrawer';
import { FlightLayer, TransitionVeil } from './components/Transitions';
import { SceneHost } from './scene/SceneHost';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { JournalPage } from './pages/JournalPage';
import { JournalDetailPage } from './pages/JournalDetailPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

function renderPage(route: RouteMatch): React.ReactNode {
  switch (route.pageType) {
    case 'home':
      return <HomePage />;
    case 'about':
      return <AboutPage />;
    case 'projects':
      return <ProjectsPage />;
    case 'project-detail':
      return <ProjectDetailPage slug={route.slug} />;
    case 'journal':
      return <JournalPage />;
    case 'journal-detail':
      return <JournalDetailPage slug={route.slug} />;
    case 'contact':
      return <ContactPage />;
    default:
      return <NotFoundPage />;
  }
}

/** Mounts with each page: restores scroll, and moves focus so keyboard users start at the content. */
const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { consumeScrollTarget, transition } = useRouter();
  const reduced = useReduced();
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, consumeScrollTarget());
  }, [consumeScrollTarget]);

  useEffect(() => {
    if (transition.id > 0) ref.current?.focus({ preventScroll: true });
  }, [transition.id]);

  const exit =
    transition.kind === 'shared'
      ? { opacity: 0, transition: { duration: 0.3, ease: ease.out } }
      : reduced
      ? { opacity: 0, transition: { duration: 0.2 } }
      : { opacity: 0, y: -14, transition: { duration: 0.42, ease: ease.inOut } };

  return (
    <motion.main
      ref={ref}
      id="main-content"
      className="main"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={exit}
    >
      {children}
    </motion.main>
  );
};

const Shell: React.FC = () => {
  const { route } = useRouter();
  const { settings, themeMode } = useSite();
  const [announcement, setAnnouncement] = useState('');
  const first = useRef(true);

  const theme: Theme = themeMode === 'auto' ? defaultThemeFor(route.pageType) : themeMode;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'ivory' ? '#F1EEE7' : '#151513');
  }, [theme]);

  useEffect(() => {
    document.title = getRouteTitle(route, settings.name);
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', getRouteDescription(route, settings.name));
    if (first.current) {
      first.current = false;
      return;
    }
    setAnnouncement(`${getRouteLabel(route, settings.name)}, page loaded`);
  }, [route, settings.name]);

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SceneHost theme={theme} />
      <Navbar theme={theme} />

      <AnimatePresence mode="wait">
        <PageShell key={route.path}>{renderPage(route)}</PageShell>
      </AnimatePresence>

      <Footer />
      <TransitionVeil theme={theme} />
      <FlightLayer />
      <EditorDrawer />
      <CustomCursor />
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
};

export const App: React.FC = () => (
  <SiteProvider>
    <RouterProvider>
      <Shell />
    </RouterProvider>
  </SiteProvider>
);

export default App;
