import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { RouteLink } from '../router/RouterContext';
import { useSite } from '../lib/site';
import { useReduced } from '../lib/hooks';
import { useParallax } from '../lib/parallax';
import { PAGE_ENTER_DELAY, duration, ease } from '../lib/motion';
import { DrawLine, Fade, MaskLines } from '../ui/Reveal';
import { Arrow, Ph } from '../ui/Bits';

const START = PAGE_ENTER_DELAY + 0.15;

/** Stand-in for a portrait: a monogram on a ruled plate. */
const PortraitPlaceholder: React.FC<{ name: string }> = ({ name }) => (
  <svg className="visual" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Portrait placeholder">
    <g stroke="currentColor" fill="none" strokeWidth="1" opacity="0.28">
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1="0" x2="400" y1={60 + i * 32} y2={60 + i * 32} />
      ))}
      <line x1="200" x2="200" y1="0" y2="500" strokeDasharray="3 8" />
    </g>
    <text
      x="200"
      y="330"
      textAnchor="middle"
      fontSize="300"
      fill="currentColor"
      style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300 }}
    >
      {name.trim().charAt(0).toUpperCase() || 'Y'}
    </text>
  </svg>
);

export const AboutPage: React.FC = () => {
  const { settings } = useSite();
  const reduced = useReduced();
  const { about } = portfolioData;

  const portraitRef = useRef<HTMLElement>(null);
  const portraitInner = useParallax(portraitRef, 34);

  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyY = useParallax(bodyRef, 26);

  const asideRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: asideRef, offset: ['start end', 'end start'] });
  const asideY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-40, 40]);

  return (
    <div className="page page--about">
      <section className="about-hero wrap">
        <div className="about-hero__title">
          <MaskLines
            as="h1"
            lines={about.headingLines}
            italic={[1]}
            className="about-title"
            delay={START}
            stagger={0.14}
          />
          <DrawLine direction="vertical" delay={START + 0.2} inView={false} className="about-hero__rule" length={1.6} />
        </div>

        <motion.figure
          ref={portraitRef}
          className="portrait"
          initial={reduced ? { opacity: 0 } : { clipPath: 'inset(100% 0 0 0)' }}
          animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: reduced ? 0.3 : 1.3, delay: START + 0.35, ease: ease.inOut }}
        >
          <motion.div className="portrait__inner" style={{ y: portraitInner, scale: reduced ? 1 : 1.12 }}>
            {about.portrait ? (
              <img className="visual visual--photo" src={about.portrait.src} alt={about.portrait.alt} />
            ) : (
              <PortraitPlaceholder name={settings.name} />
            )}
          </motion.div>
          <figcaption className="portrait__caption">{about.portraitCaption}</figcaption>
        </motion.figure>
      </section>

      <section className="wrap about-body">
        <Fade inView className="about-lead">
          <p>{settings.aboutLead}</p>
        </Fade>

        <motion.div ref={bodyRef} className="about-text" style={{ y: bodyY }}>
          {about.body.map((paragraph, i) => (
            <Fade key={i} inView delay={i * 0.08}>
              <p>{paragraph}</p>
            </Fade>
          ))}
        </motion.div>

        <motion.div ref={asideRef} className="about-facts" style={{ y: asideY }}>
          <dl>
            {about.facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                className="fact"
                initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: duration.reveal * 0.7, delay: i * 0.07, ease: ease.out }}
              >
                <dt>{fact.label}</dt>
                <dd>
                  <Ph field={fact.field} />
                </dd>
                <DrawLine delay={0.1 + i * 0.07} />
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </section>

      <section className="wrap about-timeline" aria-labelledby="timeline-title">
        <h2 id="timeline-title" className="section__title">
          Path so far
        </h2>
        <DrawLine />
        <ol className="timeline">
          {about.timeline.map((item, i) => (
            <motion.li
              key={i}
              className="timeline__row"
              initial={{ opacity: 0, y: reduced ? 0 : 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: duration.reveal * 0.8, delay: i * 0.06, ease: ease.out }}
            >
              <span className="timeline__period">
                <Ph field={item.period} />
              </span>
              <span className="timeline__title">
                <Ph field={item.title} />
              </span>
              <span className="timeline__detail">
                <Ph field={item.detail} />
              </span>
              <DrawLine delay={0.1} />
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="wrap page-end">
        <RouteLink to="/projects" className="next" data-cursor="Open">
          <span className="next__label">Continue</span>
          <span className="next__title">Selected work</span>
          <Arrow className="next__arrow" direction="right" />
        </RouteLink>
      </section>
    </div>
  );
};
