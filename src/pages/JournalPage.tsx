import React from 'react';
import { motion } from 'framer-motion';
import { formatDate, portfolioData } from '../data/portfolioData';
import { RouteLink } from '../router/RouterContext';
import { useReduced } from '../lib/hooks';
import { PAGE_ENTER_DELAY, duration, ease } from '../lib/motion';
import { DrawLine, Fade, MaskLines } from '../ui/Reveal';
import { Arrow, SampleTag } from '../ui/Bits';

const START = PAGE_ENTER_DELAY + 0.15;

export const JournalPage: React.FC = () => {
  const reduced = useReduced();
  const { journal } = portfolioData;
  const featured = journal.entries.find((e) => e.featured) ?? journal.entries[0];
  const rest = journal.entries.filter((e) => e.id !== featured.id);

  return (
    <div className="page page--journal">
      <div className="wrap journal-layout">
        <header className="journal-head">
          <MaskLines as="h1" lines={[journal.heading]} className="page-title" delay={START} />
          <Fade delay={START + 0.3}>
            <p className="journal-head__note">{journal.note}</p>
          </Fade>
        </header>

        <div className="journal-main">
          <article className="feature">
            <DrawLine delay={START + 0.2} inView={false} />
            <Fade delay={START + 0.35} y={8} className="feature__meta">
              <span>{formatDate(featured.date)}</span>
              <span>{featured.category}</span>
              {featured.sample && <SampleTag />}
            </Fade>
            <RouteLink to={`/journal/${featured.slug}`} className="feature__link" data-cursor="Read">
              <MaskLines
                as="h2"
                lines={[featured.title]}
                className="feature__title"
                delay={START + 0.4}
              />
            </RouteLink>
            <Fade delay={START + 0.7}>
              <p className="feature__quote">{featured.pullQuote}</p>
              <p className="feature__excerpt">{featured.excerpt}</p>
              <RouteLink to={`/journal/${featured.slug}`} className="link-line">
                <span>Read the note</span>
                <Arrow />
              </RouteLink>
            </Fade>
          </article>

          <ol className="notes" aria-label="More notes">
            {rest.map((entry, i) => (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: duration.reveal * 0.8, delay: i * 0.05, ease: ease.out }}
              >
                <DrawLine delay={0.05} />
                <RouteLink to={`/journal/${entry.slug}`} className="note">
                  <span className="note__date">{formatDate(entry.date)}</span>
                  <span className="note__body">
                    <span className="note__title">{entry.title}</span>
                    <span className="note__dek">{entry.dek}</span>
                  </span>
                  <span className="note__tag">
                    {entry.category}, {entry.minutes} min
                  </span>
                  <Arrow className="note__arrow" />
                </RouteLink>
              </motion.li>
            ))}
            <li aria-hidden="true">
              <DrawLine />
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
