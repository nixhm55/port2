import React from 'react';
import { motion } from 'framer-motion';
import { findEntry, portfolioData, formatDate } from '../data/portfolioData';
import { RouteLink } from '../router/RouterContext';
import { useSite } from '../lib/site';
import { useReduced } from '../lib/hooks';
import { PAGE_ENTER_DELAY, duration, ease } from '../lib/motion';
import { DrawLine, Fade, MaskLines } from '../ui/Reveal';
import { Arrow, Ph, SampleTag } from '../ui/Bits';

const HERO_DELAY = PAGE_ENTER_DELAY + 0.1;

export const HomePage: React.FC = () => {
  const { settings, isEdited } = useSite();
  const reduced = useReduced();
  const projects = portfolioData.projects.items;
  const featured =
    portfolioData.journal.entries.find((e) => e.featured) ?? portfolioData.journal.entries[0];
  const featuredEntry = findEntry(featured.slug) ?? featured;

  const scrollToWork = () => {
    document
      .getElementById('work')
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="page page--home">
      {/* Opening: the name is the headline; everything else is small and precise. */}
      <section className="hero" aria-labelledby="hero-name">
        <div className="wrap hero__grid">
          <div className="hero__meta">
            <Fade delay={HERO_DELAY + 0.05} y={8}>
              <span>{portfolioData.identity.edition}</span>
            </Fade>
            <Fade delay={HERO_DELAY + 0.12} y={8}>
              <span>
                <Ph field={{ value: settings.location, placeholder: !isEdited('location') }} />
              </span>
            </Fade>
            <Fade delay={HERO_DELAY + 0.19} y={8} className="hero__status">
              <span className="dot" aria-hidden="true" />
              <span>
                <Ph field={{ value: settings.availability, placeholder: !isEdited('availability') }} />
              </span>
            </Fade>
          </div>

          <div className="hero__copy">
            <Fade delay={HERO_DELAY + 0.35}>
              <p className="hero__statement">{settings.statement}</p>
            </Fade>
            <Fade delay={HERO_DELAY + 0.5}>
              <p className="hero__intro">{settings.intro}</p>
            </Fade>
          </div>

          <h1 id="hero-name" className="hero__name-wrap">
            <MaskLines
              as="div"
              lines={[settings.name]}
              className="hero__name"
              delay={HERO_DELAY}
            />
          </h1>

          <Fade delay={HERO_DELAY + 0.9} y={0} className="hero__cue">
            <button type="button" className="cue" onClick={scrollToWork}>
              <span className="cue__text">Selected work</span>
              <span className="cue__line" aria-hidden="true" />
            </button>
          </Fade>
        </div>
      </section>

      {/* Work index: type only, so it reads differently from the gallery page. */}
      <section id="work" className="section" aria-labelledby="home-work-title">
        <div className="wrap">
          <div className="section__head">
            <h2 id="home-work-title" className="section__title">
              Selected work
            </h2>
            <RouteLink to="/projects" className="link-line">
              <span>All work</span>
              <Arrow />
            </RouteLink>
          </div>
          <DrawLine />
          <ul className="index">
            {projects.map((project, i) => (
              <motion.li
                key={project.id}
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: duration.reveal * 0.8, delay: i * 0.06, ease: ease.out }}
              >
                <RouteLink to={`/projects/${project.slug}`} className="index__row">
                  <span className="index__title">{project.title}</span>
                  <span className="index__meta">
                    <span>{project.category}</span>
                    <Ph field={project.year} />
                  </span>
                  <Arrow className="index__arrow" />
                </RouteLink>
                <DrawLine delay={0.1 + i * 0.08} />
              </motion.li>
            ))}
          </ul>
          <p className="section__note">
            <SampleTag /> Demonstration projects, shown to illustrate the layout.
          </p>
        </div>
      </section>

      {/* Two quiet doors: About and the latest note. */}
      <section className="section section--doors" aria-label="More">
        <div className="wrap doors">
          <Fade inView className="door">
            <h2 className="door__label">About</h2>
            <p className="door__lead">{settings.aboutLead}</p>
            <RouteLink to="/about" className="link-line">
              <span>Read the introduction</span>
              <Arrow />
            </RouteLink>
          </Fade>
          <Fade inView delay={0.1} className="door">
            <h2 className="door__label">Latest note</h2>
            <p className="door__title">{featuredEntry.title}</p>
            <p className="door__meta">
              {formatDate(featuredEntry.date)}, {featuredEntry.minutes} min read {featuredEntry.sample && <SampleTag />}
            </p>
            <p className="door__excerpt">{featuredEntry.excerpt}</p>
            <RouteLink to={`/journal/${featuredEntry.slug}`} className="link-line">
              <span>Read the note</span>
              <Arrow />
            </RouteLink>
          </Fade>
        </div>
      </section>

      <section className="section section--closing" aria-label="Contact">
        <div className="wrap">
          <RouteLink to="/contact" className="closing" data-cursor="Write">
            <span className="closing__text">Start a conversation</span>
            <Arrow className="closing__arrow" />
          </RouteLink>
        </div>
      </section>
    </div>
  );
};
