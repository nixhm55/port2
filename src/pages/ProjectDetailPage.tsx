import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { findProject, portfolioData, type ProjectItem, type VisualBlock } from '../data/portfolioData';
import { RouteLink, useRouter } from '../router/RouterContext';
import { useReduced } from '../lib/hooks';
import { useParallax } from '../lib/parallax';
import { splitTitle } from '../lib/text';
import { PAGE_ENTER_DELAY, duration, ease } from '../lib/motion';
import { DrawLine, Fade, MaskLines } from '../ui/Reveal';
import { Arrow, Ph, SampleTag } from '../ui/Bits';
import { Media } from '../ui/ProjectVisual';
import { NotFoundPage } from './NotFoundPage';

/** A visual that drifts slightly inside its own frame as the page scrolls. */
const DriftFrame: React.FC<{
  ratio: string;
  children: React.ReactNode;
  className?: string;
  distance?: number;
}> = ({ ratio, children, className = '', distance = 36 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReduced();
  const y = useParallax(ref, distance);
  return (
    <motion.div
      ref={ref}
      className={`frame ${className}`}
      style={{ aspectRatio: ratio }}
      initial={reduced ? { opacity: 0 } : { clipPath: 'inset(8% 0 0 0)', opacity: 0 }}
      whileInView={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0.3 : 1.0, ease: ease.out }}
    >
      <motion.div className="frame__inner" style={{ y, scale: reduced ? 1 : 1.12 }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

const Block: React.FC<{ block: VisualBlock; project: ProjectItem; seed: number }> = ({
  block,
  project,
  seed
}) => {
  const media = (s: number) => <Media image={block.image} kind={block.kind} seed={s} />;

  switch (block.layout) {
    case 'full':
      return (
        <figure className="block block--full">
          <DriftFrame ratio={block.ratio} distance={50}>
            {media(seed)}
          </DriftFrame>
          <figcaption className="wrap">{block.caption}</figcaption>
        </figure>
      );
    case 'pair':
      return (
        <figure className="block block--pair wrap">
          <div className="block__a">
            <DriftFrame ratio={block.ratio}>{media(seed)}</DriftFrame>
          </div>
          <div className="block__b">
            <DriftFrame ratio={block.ratio} distance={70}>
              <Media kind={project.visual.kind} seed={seed + 11} />
            </DriftFrame>
          </div>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case 'offset-left':
      return (
        <figure className="block block--offset block--offset-left wrap">
          <div className="block__media">
            <DriftFrame ratio={block.ratio}>{media(seed)}</DriftFrame>
          </div>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    default:
      return (
        <figure className="block block--offset block--offset-right wrap">
          <figcaption>{block.caption}</figcaption>
          <div className="block__media">
            <DriftFrame ratio={block.ratio}>{media(seed)}</DriftFrame>
          </div>
        </figure>
      );
  }
};

export const ProjectDetailPage: React.FC<{ slug: string | undefined }> = ({ slug }) => {
  const project = findProject(slug);
  const reduced = useReduced();
  const { flight, setFlightTarget } = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroY = useParallax(heroRef, 40);

  const flying = Boolean(project && flight?.slug === project.slug);
  const hasTarget = Boolean(flight?.to);

  // Tell the flight layer where the hero will sit once the page is at the top.
  useLayoutEffect(() => {
    if (!project || !flying || hasTarget || !heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    setFlightTarget(project.slug, {
      top: r.top + window.scrollY,
      left: r.left,
      width: r.width,
      height: r.height
    });
  }, [project, flying, hasTarget, setFlightTarget]);

  if (!project) return <NotFoundPage />;

  const items = portfolioData.projects.items;
  const next = items[(items.findIndex((p) => p.id === project.id) + 1) % items.length];
  // The title waits for the shared visual to land when there is one.
  const base = PAGE_ENTER_DELAY + (flying ? 0.9 : 0.15);
  const lines = splitTitle(project.title);

  const meta: Array<[string, React.ReactNode]> = [
    ['Category', project.category],
    ['Year', <Ph key="y" field={project.year} />],
    ['Role', <Ph key="r" field={project.role} />],
    ['Client', <Ph key="c" field={project.client} />],
    ['Duration', <Ph key="d" field={project.duration} />]
  ];

  return (
    <div className="page page--detail">
      <header className="wrap detail-head">
        <Fade delay={base} y={8} className="detail-head__back">
          <RouteLink to="/projects" className="link-line back">
            <Arrow direction="left" />
            <span>All work</span>
          </RouteLink>
          {project.sample && <SampleTag label="Sample project" />}
        </Fade>
        <MaskLines
          as="h1"
          lines={lines}
          italic={lines.length > 1 ? [1] : []}
          className="detail-title"
          delay={base + 0.05}
        />
        <Fade delay={base + 0.4} className="detail-head__summary">
          <p>{project.summary}</p>
        </Fade>
        <Fade as="dl" delay={base + 0.55} className="meta-grid">
          {meta.map(([label, value]) => (
            <div key={label} className="meta-grid__item">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </Fade>
      </header>

      <div className="wrap">
        <div
          ref={heroRef}
          className="hero-visual"
          style={{ opacity: flying ? 0 : 1 }}
        >
          <motion.div className="hero-visual__inner" style={{ y: heroY, scale: reduced ? 1 : 1.1 }}>
            <Media image={project.image} kind={project.visual.kind} seed={project.visual.seed} />
          </motion.div>
        </div>
      </div>

      <section className="wrap overview" aria-labelledby="overview-title">
        <h2 id="overview-title" className="overview__label">
          Overview
        </h2>
        <div className="overview__text">
          {project.overview.map((paragraph, i) => (
            <Fade key={i} inView delay={i * 0.06}>
              <p className={i === 0 ? 'overview__first' : undefined}>{paragraph}</p>
            </Fade>
          ))}
        </div>
        <div className="overview__lists">
          <Fade inView>
            <h3>Deliverables</h3>
            <ul>
              {project.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </Fade>
          <Fade inView delay={0.08}>
            <h3>Tools</h3>
            <ul>
              {project.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Fade>
        </div>
      </section>

      <div className="detail-blocks">
        <Block block={project.blocks[0]} project={project} seed={project.visual.seed + 1} />

        <section className="wrap process" aria-labelledby="process-title">
          <h2 id="process-title" className="process__label">
            Approach
          </h2>
          <div className="process__steps">
            {project.process.map((step, i) => (
              <motion.div
                key={step.title}
                className={`process__step process__step--${i % 2}`}
                initial={{ opacity: 0, y: reduced ? 0 : 36 + i * 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: duration.reveal, delay: i * 0.08, ease: ease.out }}
              >
                <DrawLine />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {project.blocks.slice(1).map((block, i) => (
          <Block key={block.id} block={block} project={project} seed={project.visual.seed + i + 2} />
        ))}
      </div>

      <section className="wrap page-end">
        <RouteLink to={`/projects/${next.slug}`} className="next" data-cursor="Next">
          <span className="next__label">Next project</span>
          <span className="next__title">{next.title}</span>
          <Arrow className="next__arrow" direction="right" />
        </RouteLink>
        <RouteLink to="/projects" className="link-line back-all">
          <Arrow direction="left" />
          <span>Back to all work</span>
        </RouteLink>
      </section>
    </div>
  );
};
