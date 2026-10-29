import React from 'react';
import { findEntry, formatDate, portfolioData } from '../data/portfolioData';
import { RouteLink } from '../router/RouterContext';
import { PAGE_ENTER_DELAY } from '../lib/motion';
import { DrawLine, Fade, MaskLines } from '../ui/Reveal';
import { Arrow, SampleTag } from '../ui/Bits';
import { NotFoundPage } from './NotFoundPage';

const START = PAGE_ENTER_DELAY + 0.15;

export const JournalDetailPage: React.FC<{ slug: string | undefined }> = ({ slug }) => {
  const entry = findEntry(slug);
  if (!entry) return <NotFoundPage />;

  const all = portfolioData.journal.entries;
  const i = all.findIndex((e) => e.id === entry.id);
  const next = all[(i + 1) % all.length];

  return (
    <div className="page page--article">
      <article className="wrap article">
        <Fade delay={START} y={8} className="article__top">
          <RouteLink to="/journal" className="link-line back">
            <Arrow direction="left" />
            <span>All notes</span>
          </RouteLink>
          {entry.sample && <SampleTag label="Sample note" />}
        </Fade>

        <header className="article__head">
          <Fade delay={START + 0.05} y={8} className="article__meta">
            <span>{formatDate(entry.date)}</span>
            <span>{entry.category}</span>
            <span>{entry.minutes} min read</span>
          </Fade>
          <MaskLines as="h1" lines={[entry.title]} className="article-title" delay={START + 0.1} />
          <Fade delay={START + 0.45}>
            <p className="article__dek">{entry.dek}</p>
          </Fade>
          <DrawLine delay={START + 0.5} inView={false} />
        </header>

        <div className="article__body">
          {entry.paragraphs.map((paragraph, idx) => (
            <React.Fragment key={idx}>
              <Fade inView={idx > 0} delay={idx === 0 ? START + 0.6 : 0}>
                <p>{paragraph}</p>
              </Fade>
              {idx === 0 && (
                <Fade inView>
                  <blockquote className="pull">{entry.pullQuote}</blockquote>
                </Fade>
              )}
            </React.Fragment>
          ))}
        </div>

        <RouteLink to={`/journal/${next.slug}`} className="next next--article" data-cursor="Next">
          <span className="next__label">Next note</span>
          <span className="next__title">{next.title}</span>
          <Arrow className="next__arrow" direction="right" />
        </RouteLink>
      </article>
    </div>
  );
};
