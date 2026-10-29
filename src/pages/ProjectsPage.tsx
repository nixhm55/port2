import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { RouteLink } from '../router/RouterContext';
import { PAGE_ENTER_DELAY } from '../lib/motion';
import { ProjectCard } from '../components/ProjectCard';
import { Fade, MaskLines } from '../ui/Reveal';
import { Arrow } from '../ui/Bits';

const START = PAGE_ENTER_DELAY + 0.15;

export const ProjectsPage: React.FC = () => {
  const { projects } = portfolioData;

  return (
    <div className="page page--projects">
      <header className="wrap page-head">
        <MaskLines as="h1" lines={[projects.heading]} className="page-title" delay={START} />
        <Fade delay={START + 0.35} className="page-head__note">
          <p>{projects.note}</p>
        </Fade>
      </header>

      <div className="wrap exhibition">
        {projects.items.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      <section className="wrap page-end">
        <RouteLink to="/journal" className="next" data-cursor="Open">
          <span className="next__label">Continue</span>
          <span className="next__title">Notes</span>
          <Arrow className="next__arrow" direction="right" />
        </RouteLink>
      </section>
    </div>
  );
};
