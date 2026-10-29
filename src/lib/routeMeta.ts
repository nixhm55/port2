import { findEntry, findProject } from '../data/portfolioData';
import type { RouteMatch } from '../router/RouterContext';

/** Short name of the page, used in the transition veil and screen-reader announcements. */
export function getRouteLabel(route: RouteMatch, name: string): string {
  switch (route.pageType) {
    case 'home':
      return name;
    case 'about':
      return 'About';
    case 'projects':
      return 'Work';
    case 'project-detail':
      return findProject(route.slug)?.shortTitle ?? 'Project';
    case 'journal':
      return 'Journal';
    case 'journal-detail':
      return findEntry(route.slug)?.title ?? 'Note';
    case 'contact':
      return 'Contact';
    default:
      return 'Not found';
  }
}

export function getRouteTitle(route: RouteMatch, name: string): string {
  const label = getRouteLabel(route, name);
  if (route.pageType === 'home') return `${name} — Portfolio`;
  return `${label} — ${name}`;
}

export function getRouteDescription(route: RouteMatch, name: string): string {
  switch (route.pageType) {
    case 'project-detail':
      return findProject(route.slug)?.summary ?? `A project by ${name}.`;
    case 'journal-detail':
      return findEntry(route.slug)?.excerpt ?? `A note by ${name}.`;
    case 'projects':
      return `Selected work by ${name}. Demonstration projects, ready to be replaced.`;
    case 'about':
      return `About ${name}.`;
    case 'journal':
      return `Notes and essays by ${name}.`;
    case 'contact':
      return `Get in touch with ${name}.`;
    case 'not-found':
      return 'This page could not be found.';
    default:
      return `Portfolio of ${name}: selected work, notes and contact.`;
  }
}
