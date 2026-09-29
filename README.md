# feio.in — portfolio

Personal site for **https://feio.in**. Plain HTML, CSS and vanilla JavaScript —
**no framework, no build step, no dependencies**. Deploying is uploading files.

## Structure

```
index.html              the whole site
404.html                not-found page (shares the design system)
robots.txt
sitemap.xml
site.webmanifest
assets/
  css/styles.css        the design system + every component
  js/main.js            ~2kB of interactions
  img/favicon.svg
  img/og.svg            social preview card
resume/                 put a PDF here (see TODO below)
```

## Design system

Tokens live at the top of `styles.css` and everything else consumes them.

| Group | Tokens |
|---|---|
| Type | `--step--1` … `--step-6` (fluid `clamp()`) |
| Leading | `--leading-tight` `-snug` `-normal` `-relaxed` |
| Tracking | `--tracking-tighter` `-tight` `-normal` `-wide` `-widest` |
| Motion | `--ease`, `--ease-out`, `--ease-spring`, `--dur-fast/-/-slow` |
| Geometry | `--wrap` (1200px), `--measure` (34em), `--gutter`, `--section` |
| Colour | `--paper`, `--surface-1..3`, `--ink`, `--ink-2..4`, `--line`, `--line-soft`, `--accent` |

Colour is `oklch()` and the dark theme is a token re-map under
`:root[data-theme="dark"]` — no duplicated rules. Hierarchy comes from an
**alpha-ramp neutral** rather than hand-picked greys, and elevation is done with
**hairline borders instead of shadows**.

Three themes to reason about: the site defaults to `data-theme="dark"`, the
inline `<head>` script flips to light on first visit if the OS prefers it, and
`.site-foot` **forces itself dark in both themes** on purpose.

## Verified

Checked in headless Chrome via the DevTools Protocol:

- **Contrast** — 30/30 text pairs pass WCAG AA (4.5:1 body, 3:1 large) in
  light *and* dark, at 390 / 768 / 1440.
- **No horizontal overflow** at any breakpoint.
- **Scroll reveal** staggers in (7/46 at scroll-top, 46/46 after scrolling) and
  degrades to fully-visible under `prefers-reduced-motion: reduce`.
- Zero console errors, zero broken custom properties, balanced markup,
  no nested anchors, every `target="_blank"` carries `rel="noopener"`.

## Local preview

Any static server works:

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Still to fill in

Everything is marked with a `TODO` badge on the page itself:

1. **Bio** — the hero lede and the About section are drafts. Update `<title>`,
   the meta/OG tags, the JSON-LD block, and `site.webmanifest` to match.
2. **Timeline** — `#background` has one real entry and one placeholder.
3. **Location** — the About facts panel says "India".
4. **More links** — the "Elsewhere" cell in Contact is a placeholder.
5. **Résumé** — drop a PDF at `resume/karan-resume.pdf` and link it from the
   Contact grid (the cell is already stubbed).
6. **Email** — `effestier@aol.com`, in three places: the `mailto:`, the visible
   text, and `data-email` on the copy button. Keep all three in sync.

Find them all with:

```bash
grep -n "TODO" index.html
```

## Adding a project

The work list is a flat `<ol class="index">` per group, wrapped in an `<li>`.
Copy an existing `<a class="row">` and change the name, description, tech line
and `href`. Row numbers are manual — renumber the group if it matters.

## Deploying

Linked to Vercel, production branch `main`. Any push to `main` deploys
automatically. `feio.in` and `www.feio.in` are already attached.

## Licence

MIT
