# Nisam, portfolio

A minimal, editorial, multi-page portfolio with one persistent 3D sculpture.
React, TypeScript, Vite, React Three Fiber, Framer Motion. No router library: a small
History API router lives in `src/router/RouterContext.tsx`.

```bash
npm install     # only if node_modules is missing or was installed on another OS
npm run dev     # http://localhost:5173
npm run build   # type check + production build into dist/
npm run lint    # type check only
npm run preview
```

## Pages

| Route | Composition |
| --- | --- |
| `/` | Name as headline, asymmetric opening, typographic work index |
| `/about` | Stacked headline, portrait plate, parallax text columns, timeline |
| `/projects` | Exhibition of three proportions (wide, portrait, panoramic) |
| `/projects/:slug` | Case study template, with a shared-element flight from the index card |
| `/journal` and `/journal/:slug` | Quiet typographic index, reading layout |
| `/contact` | Large headline, email, links, form that opens your email app |

Unknown paths and unknown slugs show a not-found page. Deep links and refreshes work in
`npm run dev` and `npm run preview`. For static hosting, `public/_redirects` (Netlify) and
`vercel.json` send every path to `index.html`.

## Editing content

Everything a visitor reads is in `src/data/portfolioData.ts`. Anything marked
`placeholder: true`, and every project or note marked `sample: true`, is a stand-in and is
labelled as such on screen (dotted underline, or a "Sample" tag). Nothing in the file is a
claim about Nisam. Delete the markers as you replace the text.

- A project's `image` (`{ src, alt }`) replaces its generated visual. Put files in `public/`.
- `about.portrait` does the same for the portrait.
- The sliders icon in the header lets you try new wording and a surface live. Those edits stay
  in the browser (localStorage) and do not change the data file.

## Design system

- Tokens: `src/styles/tokens.css` (colour, type scale, spacing, easing, layers). Two surfaces,
  ivory and charcoal, share one system. Pages choose a default surface; the header toggle
  overrides it. There is no accent colour.
- Type: Newsreader (display), Hanken Grotesk (text), JetBrains Mono (small facts). All SIL OFL,
  loaded from Google Fonts with system fallbacks.
- Motion: `src/lib/motion.ts` mirrors the CSS easing and duration tokens. Reveals live in
  `src/ui/Reveal.tsx`. Page transitions are in `src/components/Transitions.tsx`.

## 3D

`src/scene/` holds one sculpture (arch, monolith, sphere, ring) that stays mounted across routes
and moves to a new pose per page (`poses.ts`). It is lit with procedural light panels, so no
HDR file is downloaded. `SceneHost.tsx` picks a tier from the device:

- high: full materials, reflections, gentle ambient sway, pointer response
- low: simpler materials, rendered only when something changes
- none (no WebGL, Save-Data, or very weak hardware): a still line drawing

Reduced-motion settings turn off ambient motion, the cursor, the veil and the flight.

## What was checked

Type check (`tsc`) is clean. The app was bundled and run in headless Chromium to check every
route by direct URL, no console errors, no horizontal overflow at 1440 and 390 px, routing with
back/forward and scroll restoration, the shared-element flight, the mobile menu, the editor,
form validation, reduced motion and the low 3D tier. `vite build` itself could not be run where
this was prepared (the bundled `node_modules` holds macOS binaries), so run `npm run build`
once on your machine. Performance scores were not measured.
