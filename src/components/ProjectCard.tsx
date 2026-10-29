import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ProjectItem } from '../data/portfolioData';
import { RouteLink, useRouter } from '../router/RouterContext';
import { useFinePointer, useReduced } from '../lib/hooks';
import { duration, ease } from '../lib/motion';
import { splitTitle } from '../lib/text';
import { Media } from '../ui/ProjectVisual';
import { MaskLines } from '../ui/Reveal';
import { Arrow, Ph, SampleTag } from '../ui/Bits';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

/**
 * One exhibit on the project index. Image proportions and placement change with
 * `project.format` and the card's position, so the page reads as a hung exhibition.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { navigate } = useRouter();
  const reduced = useReduced();
  const fine = useFinePointer();
  const interactive = fine && !reduced;
  const linkRef = useRef<HTMLAnchorElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 18, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 110, damping: 18, mass: 0.5 });
  const innerX = useTransform(sx, [-1, 1], [14, -14]);
  const innerY = useTransform(sy, [-1, 1], [10, -10]);
  const rotateY = useTransform(sx, [-1, 1], [-1.4, 1.4]);
  const rotateX = useTransform(sy, [-1, 1], [1.2, -1.2]);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const openProject = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const el = linkRef.current;
    if (!el || reduced) {
      navigate(`/projects/${project.slug}`);
      return;
    }
    const r = el.getBoundingClientRect();
    navigate(`/projects/${project.slug}`, {
      kind: 'shared',
      flightFrom: { top: r.top, left: r.left, width: r.width, height: r.height }
    });
  };

  const href = `/projects/${project.slug}`;
  const lines = splitTitle(project.title);

  return (
    <article className={`exhibit exhibit--${project.format} exhibit--p${index % 3}`}>
      <a
        ref={linkRef}
        href={href}
        className="exhibit__media"
        data-cursor="View"
        aria-label={`Open the project ${project.title}`}
        onClick={openProject}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {/* The tilt layer is observed; the mask and image react to it through variants. */}
        <motion.div
          className="exhibit__tilt"
          style={interactive ? { rotateX, rotateY, transformPerspective: 1200 } : undefined}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className="exhibit__mask"
            variants={{
              hidden: reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' },
              shown: {
                ...(reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }),
                transition: { duration: reduced ? 0.3 : 1.1, ease: ease.inOut }
              }
            }}
          >
            <motion.div
              className="exhibit__inner"
              style={interactive ? { x: innerX, y: innerY } : undefined}
              variants={{
                hidden: { scale: reduced ? 1 : 1.22 },
                shown: { scale: 1, transition: { duration: 1.5, ease: ease.out } }
              }}
            >
              <Media image={project.image} kind={project.visual.kind} seed={project.visual.seed} />
            </motion.div>
          </motion.div>
        </motion.div>
      </a>

      <div className="exhibit__info">
        <div className="exhibit__meta">
          <span>{project.category}</span>
          <Ph field={project.year} />
          {project.sample && <SampleTag />}
        </div>
        <MaskLines
          as="h2"
          lines={lines}
          inView
          className="exhibit__title"
          italic={lines.length > 1 ? [1] : []}
        />
        <motion.p
          className="exhibit__summary"
          initial={{ opacity: 0, y: reduced ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: duration.reveal * 0.8, delay: 0.25, ease: ease.out }}
        >
          {project.summary}
        </motion.p>
        <RouteLink to={href} className="exhibit__cta link-line" onClick={openProject}>
          <span>Read the case study</span>
          <Arrow />
        </RouteLink>
      </div>
    </article>
  );
};
