/**
 * Content for the whole site. Everything a visitor reads lives here.
 *
 * Nothing in this file is a statement of fact about Nisam. Entries marked
 * `placeholder: true` (or belonging to a project/essay marked `sample: true`)
 * are stand-ins; the interface labels them as such until they are replaced.
 */

export type Theme = 'ivory' | 'charcoal';

export type RoutePath =
  | '/'
  | '/about'
  | '/projects'
  | `/projects/${string}`
  | '/journal'
  | `/journal/${string}`
  | '/contact';

export interface NavItem {
  id: string;
  label: string;
  path: RoutePath;
  /** Short line shown beside the wordmark while this section is open. */
  note: string;
}

/** A line of text that may still be a stand-in. */
export interface Field {
  value: string;
  placeholder?: boolean;
}

export type VisualKind = 'ledger' | 'specimen' | 'plates' | 'grid' | 'arc' | 'contour';

export interface RemoteImage {
  src: string;
  alt: string;
}

export interface VisualBlock {
  id: string;
  layout: 'full' | 'pair' | 'offset-left' | 'offset-right';
  ratio: '21/9' | '16/9' | '16/10' | '4/5';
  kind: VisualKind;
  caption: string;
  image?: RemoteImage;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  overview: string[];
  category: string;
  year: Field;
  role: Field;
  client: Field;
  duration: Field;
  deliverables: string[];
  tools: string[];
  /** Proportion used on the project index. */
  format: 'wide' | 'portrait' | 'panoramic';
  visual: { kind: VisualKind; seed: number };
  image?: RemoteImage;
  process: Array<{ title: string; body: string }>;
  blocks: VisualBlock[];
  /** Pose of the 3D sculpture while this project is open. */
  scenePose: { rotation: [number, number, number]; scale: number; morph: number; ring: number };
  sample: boolean;
}

export interface JournalEntry {
  id: string;
  slug: string;
  title: string;
  dek: string;
  /** ISO date; shown formatted. */
  date: string;
  category: string;
  minutes: number;
  excerpt: string;
  pullQuote: string;
  paragraphs: string[];
  featured?: boolean;
  sample: boolean;
}

export interface SocialLink {
  id: string;
  label: string;
  handle: Field;
  url: string;
}

export const portfolioData = {
  identity: {
    name: 'Nisam',
    edition: 'Portfolio, 2026',
    statement: 'A quiet place for selected work and notes.',
    intro:
      'This portfolio is a working draft. Every project, note and personal detail is placeholder content, ready to be replaced with Nisam’s own.',
    location: { value: 'City, Country', placeholder: true } as Field,
    availability: { value: 'Availability to be added', placeholder: true } as Field,
    email: 'hello@example.com',
    colophon:
      'Set in Newsreader, Hanken Grotesk and JetBrains Mono, all open-licensed (SIL OFL) and loaded from Google Fonts.'
  },

  navigation: [
    { id: 'home', label: 'Index', path: '/', note: 'Opening' },
    { id: 'projects', label: 'Work', path: '/projects', note: 'Selected work' },
    { id: 'about', label: 'About', path: '/about', note: 'Introduction' },
    { id: 'journal', label: 'Journal', path: '/journal', note: 'Notes' },
    { id: 'contact', label: 'Contact', path: '/contact', note: 'Get in touch' }
  ] as NavItem[],

  about: {
    headingLines: ['Work that', 'takes its', 'time.'],
    lead: 'Nisam is the person behind this portfolio. Replace this paragraph with a short introduction: who you are, what you make, and what you care about.',
    body: [
      'Use this second paragraph for the longer version. A few honest sentences about how you work and what a good collaboration looks like are enough.',
      'Everything on this page is placeholder text. Edit it in src/data/portfolioData.ts, or try changes live with the editor in the header.'
    ],
    portrait: undefined as RemoteImage | undefined,
    portraitCaption: 'Portrait placeholder. Add a photograph in the data file.',
    facts: [
      { label: 'Based in', field: { value: 'City, Country', placeholder: true } },
      { label: 'Practice', field: { value: 'Your discipline or role', placeholder: true } },
      { label: 'Currently', field: { value: 'What you are working on now', placeholder: true } },
      { label: 'Languages', field: { value: 'Languages you speak', placeholder: true } }
    ] as Array<{ label: string; field: Field }>,
    timeline: [
      {
        period: { value: '20XX to now', placeholder: true },
        title: { value: 'Current role or practice', placeholder: true },
        detail: { value: 'A sentence about what this chapter involves.', placeholder: true }
      },
      {
        period: { value: '20XX to 20XX', placeholder: true },
        title: { value: 'Previous role, studio or study', placeholder: true },
        detail: { value: 'A sentence about what you made or learned there.', placeholder: true }
      },
      {
        period: { value: '20XX', placeholder: true },
        title: { value: 'Where it began', placeholder: true },
        detail: { value: 'School, a first project, or a turning point.', placeholder: true }
      }
    ] as Array<{ period: Field; title: Field; detail: Field }>
  },

  projects: {
    heading: 'Selected work',
    note: 'Three demonstration projects. They show how an entry is laid out and are not Nisam’s real work. Replace them in the data file.',
    items: [
      {
        id: 'ledger',
        slug: 'ledger-quiet-analytics',
        title: 'Ledger, quiet analytics',
        shortTitle: 'Ledger',
        summary:
          'A calm approach to dense data software: paper-like surfaces, tabular numerals and very little chrome.',
        overview: [
          'Ledger is a demonstration project showing how a case study reads on this site. It imagines analytics software built like a printed ledger rather than a dashboard of cards.',
          'The idea: give every figure room, align numbers in columns, and reveal detail only when someone asks for it.'
        ],
        category: 'Interface concept',
        year: { value: '20XX', placeholder: true },
        role: { value: 'Your role', placeholder: true },
        client: { value: 'Concept, no client', placeholder: false },
        duration: { value: 'Weeks or months', placeholder: true },
        deliverables: ['Grid specification', 'Interaction model', 'Colour and type tokens'],
        tools: ['React', 'TypeScript', 'SVG'],
        format: 'wide',
        visual: { kind: 'ledger', seed: 3 },
        process: [
          {
            title: 'Start with the page',
            body: 'Borrow from printed ledgers: hairline rules, generous margins and numerals that line up. Structure does the work that shadows and cards usually do.'
          },
          {
            title: 'Reveal on request',
            body: 'Summaries sit on the surface. Detail opens in place, so the reader never loses their position in the document.'
          }
        ],
        blocks: [
          {
            id: 'ledger-1',
            layout: 'full',
            ratio: '21/9',
            kind: 'ledger',
            caption: 'Ruled grid with a single highlighted row.'
          },
          {
            id: 'ledger-2',
            layout: 'pair',
            ratio: '4/5',
            kind: 'specimen',
            caption: 'Tabular numerals and a serif for headings.'
          },
          {
            id: 'ledger-3',
            layout: 'offset-right',
            ratio: '16/10',
            kind: 'arc',
            caption: 'A detail view opening from its row.'
          }
        ],
        scenePose: { rotation: [0.3, 0.6, -0.1], scale: 1.0, morph: 0.2, ring: 0.45 },
        sample: true
      },
      {
        id: 'grammar',
        slug: 'grammar-design-tokens',
        title: 'Grammar, a system of tokens',
        shortTitle: 'Grammar',
        summary:
          'A small design language that treats type, spacing and motion as one set of decisions across light and dark surfaces.',
        overview: [
          'Grammar is a demonstration project. It sketches a design system where colour, type scale, spacing and easing curves are defined once and reused everywhere.',
          'The result is a product that can switch between a light and a dark surface without feeling like two different products.'
        ],
        category: 'Design system',
        year: { value: '20XX', placeholder: true },
        role: { value: 'Your role', placeholder: true },
        client: { value: 'Concept, no client', placeholder: false },
        duration: { value: 'Weeks or months', placeholder: true },
        deliverables: ['Token sheet', 'Type scale', 'Motion principles'],
        tools: ['CSS custom properties', 'TypeScript', 'Documentation'],
        format: 'portrait',
        visual: { kind: 'specimen', seed: 7 },
        process: [
          {
            title: 'Decide once',
            body: 'Every spacing step and every duration comes from a short list. Fewer choices make screens feel related.'
          },
          {
            title: 'Two surfaces, one voice',
            body: 'Light and dark are the same system with the values swapped, so contrast and hierarchy hold in both.'
          }
        ],
        blocks: [
          {
            id: 'grammar-1',
            layout: 'offset-left',
            ratio: '16/10',
            kind: 'grid',
            caption: 'Spacing steps on a shared baseline.'
          },
          {
            id: 'grammar-2',
            layout: 'full',
            ratio: '21/9',
            kind: 'contour',
            caption: 'One easing curve, shown as a contour.'
          },
          {
            id: 'grammar-3',
            layout: 'pair',
            ratio: '4/5',
            kind: 'specimen',
            caption: 'The same specimen on ivory and charcoal.'
          }
        ],
        scenePose: { rotation: [-0.2, 1.1, 0.25], scale: 0.95, morph: 0.65, ring: -0.35 },
        sample: true
      },
      {
        id: 'archive',
        slug: 'archive-reading-room',
        title: 'Archive, a reading room',
        shortTitle: 'Archive',
        summary:
          'A longform catalogue where text columns, plates and notes share one unhurried page.',
        overview: [
          'Archive is a demonstration project about reading. It imagines an exhibition catalogue for the web, with long essays, large plates and margin notes.',
          'The page avoids imitating a book. It uses the browser’s own scroll and keeps line lengths comfortable.'
        ],
        category: 'Editorial concept',
        year: { value: '20XX', placeholder: true },
        role: { value: 'Your role', placeholder: true },
        client: { value: 'Concept, no client', placeholder: false },
        duration: { value: 'Weeks or months', placeholder: true },
        deliverables: ['Reading layout', 'Plate viewer', 'Margin note pattern'],
        tools: ['React', 'Fluid type', 'Vite'],
        format: 'panoramic',
        visual: { kind: 'plates', seed: 5 },
        process: [
          {
            title: 'Protect the measure',
            body: 'Body text stays between sixty and seventy characters per line at every size, which does more for reading than any effect.'
          },
          {
            title: 'Let plates breathe',
            body: 'Images break out of the text column at different widths, giving the page a rhythm without extra decoration.'
          }
        ],
        blocks: [
          {
            id: 'archive-1',
            layout: 'full',
            ratio: '16/9',
            kind: 'plates',
            caption: 'An essay spread with a wide plate.'
          },
          {
            id: 'archive-2',
            layout: 'offset-right',
            ratio: '16/10',
            kind: 'ledger',
            caption: 'Margin notes anchored to their paragraph.'
          },
          {
            id: 'archive-3',
            layout: 'pair',
            ratio: '4/5',
            kind: 'arc',
            caption: 'Plates at two proportions.'
          }
        ],
        scenePose: { rotation: [0.5, -0.45, 0.2], scale: 1.05, morph: 0.9, ring: 0.7 },
        sample: true
      }
    ] as ProjectItem[]
  },

  journal: {
    heading: 'Notes',
    note: 'Sample entries that show how the journal reads. Replace them with your own writing.',
    entries: [
      {
        id: 'negative-space',
        slug: 'on-negative-space',
        title: 'On negative space',
        dek: 'Why the empty parts of a page are doing the most work.',
        date: '2026-09-14',
        category: 'Layout',
        minutes: 3,
        excerpt:
          'Margins are not leftovers. They set the tempo of a page and tell the eye where it can rest.',
        pullQuote: 'Empty space is part of the composition, not what remains after it.',
        paragraphs: [
          'In print, margins are planned before a word is set. They define the relationship between the text and the edge of the sheet, and they give the reader somewhere to hold the page.',
          'On screens the instinct is often to fill every corner. Resisting that makes the content that remains feel chosen. A single large headline with room around it says more than three smaller ones competing for attention.',
          'This is a sample entry. Replace it with your own thoughts, or delete it.'
        ],
        featured: true,
        sample: true
      },
      {
        id: 'route-transitions',
        slug: 'transitions-between-pages',
        title: 'Transitions between pages',
        dek: 'Moving from one page to the next without losing your place.',
        date: '2026-08-02',
        category: 'Motion',
        minutes: 4,
        excerpt:
          'A good transition keeps the visitor oriented. It should be quick, and it should say where they are going.',
        pullQuote: 'A transition should feel like turning your head, not changing buildings.',
        paragraphs: [
          'Most websites replace one page with another in a single frame. Even when that is fast, the sense of place resets, and the visitor has to find their bearings again.',
          'Keeping a few things constant helps: the name in the corner, the colour of the surface, one object that stays on screen and changes pose. The rest can change freely.',
          'This is a sample entry. Replace it with your own thoughts, or delete it.'
        ],
        sample: true
      },
      {
        id: 'one-object',
        slug: 'one-object-in-three-dimensions',
        title: 'One object in three dimensions',
        dek: 'Using 3D as a quiet counterpoint rather than a spectacle.',
        date: '2026-06-21',
        category: 'Craft',
        minutes: 3,
        excerpt:
          'A single, well-lit form can anchor an identity. Add more and it becomes decoration.',
        pullQuote: 'With colour removed, the eye learns to read light.',
        paragraphs: [
          'Restricting a scene to one material and one light makes every choice visible. The shape, the soft shadow and the way a surface turns away from the light carry the whole image.',
          'On phones and low-powered devices the scene can be simplified or replaced with a still drawing, so the page stays fast and readable.',
          'This is a sample entry. Replace it with your own thoughts, or delete it.'
        ],
        sample: true
      },
      {
        id: 'type-pairing',
        slug: 'pairing-serif-and-mono',
        title: 'Pairing a serif with a monospace',
        dek: 'Two voices for two jobs: expression and precision.',
        date: '2026-04-09',
        category: 'Type',
        minutes: 2,
        excerpt:
          'A serif carries tone. A monospace carries facts like dates and coordinates. Together they cover a lot.',
        pullQuote: 'Give each typeface one job and let it do that job well.',
        paragraphs: [
          'Using too many typefaces fragments an identity. Using one for everything can leave it flat. Three, each with a clear role, is usually enough.',
          'Here the serif is for headlines and quotations, the grotesk for reading, and the monospace for small facts: years, categories and reading times.',
          'This is a sample entry. Replace it with your own thoughts, or delete it.'
        ],
        sample: true
      }
    ] as JournalEntry[]
  },

  contact: {
    headingLines: ['Say hello.'],
    invitation:
      'Write to the address below, or use the form. The form opens your email app with the message filled in, because this site has no server of its own.',
    socials: [
      {
        id: 'github',
        label: 'GitHub',
        handle: { value: 'github.com/your-handle', placeholder: true },
        url: 'https://github.com'
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        handle: { value: 'linkedin.com/in/your-handle', placeholder: true },
        url: 'https://www.linkedin.com'
      },
      {
        id: 'instagram',
        label: 'Instagram',
        handle: { value: '@your-handle', placeholder: true },
        url: 'https://www.instagram.com'
      }
    ] as SocialLink[]
  }
};

export type PortfolioData = typeof portfolioData;

export function findProject(slug: string | undefined): ProjectItem | undefined {
  return portfolioData.projects.items.find((p) => p.slug === slug);
}

export function findEntry(slug: string | undefined): JournalEntry | undefined {
  return portfolioData.journal.entries.find((e) => e.slug === slug);
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
