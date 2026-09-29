# feio.in — portfolio

Personal site for **https://feio.in**. Plain HTML, CSS and vanilla JavaScript —
**no framework, no build step, no dependencies, no trackers**. Deploying is
uploading files.

The design is a port of Karan's own open-source
[Kwen](https://kwen.in) / [Kwen-Design](https://github.com/RootBugs/kwendesign)
system: midnight blue, glass surfaces, aurora mesh, blueprint grid, and
Space Grotesk over Inter.

## Structure

```
index.html                    the whole site (44.6 kB)
404.html                      not-found page (shares the design system)
robots.txt
sitemap.xml
site.webmanifest
assets/
  css/styles.css              design system + every component (52.6 kB)
  js/main.js                  interactions (14.8 kB)
  fonts/Inter-latin.woff2     self-hosted, 48 kB
  fonts/SpaceGrotesk-latin.woff2  self-hosted, 22 kB
  img/og.png                  1200x630 social preview
  img/icon-192.png            PWA icon
  img/icon-512.png            PWA icon
  img/favicon.svg
resume/                       put a PDF here (see TODO below)
```

16 files, ~400 kB total. No `og.svg` — the preview card is a real raster PNG
generated from the design, because several social platforms will not render SVG.

## Design system

Tokens live at the top of `styles.css`; every component consumes them.

| Group | Tokens |
|---|---|
| Type | `--step--1` … `--step-6` (fluid `clamp()`) |
| Leading | `--leading-tight` `-snug` `-normal` `-relaxed` |
| Tracking | `--tracking-tighter` … `-widest` |
| Motion | `--ease`, `--ease-out`, `--ease-spring`, `--dur-fast`/`-normal`/`-slow` |
| Geometry | `--wrap` (1200px), `--measure` (34em), `--gutter`, `--section` |
| Colour | `--bg-primary/-secondary/-elevated`, `--text-primary/-muted/-subtle`, `--line`, `--glass-fill`, `--glass-stroke`, `--accent`, `--accent-2`, `--accent-deep`, `--gradient-start/-end`, `--success`/`--warning`/`--danger` |

**Eight themes**, each a pure token re-map under `[data-theme="…"]` — no
duplicated rules: `midnight` (default), `day`, `aurora`, `ocean`, `ember`,
`forest`, `neon`, `espresso`. The choice persists in `localStorage`
(`feio-theme`) and also updates `<meta name="theme-color">` and the SVG favicon.

Three subtleties worth not breaking:

1. **`--accent-deep` exists because `--accent` cannot do both jobs.** The bright
   accent is legible as *text* on the page background but only reaches ~2.4:1
   with white text. Anything that puts white type on a filled surface
   (`.btn-primary`, `.brand-mark`) must use `--btn-gradient`
   (`--gradient-start` → `--accent-deep`), whose stops were each checked to
   clear 4.5:1 on all eight themes.
2. **`--success` / `--warning` / `--danger` are theme-aware.** The obvious
   values (`#34d399`, `#fbbf24`) are unreadable on the light theme, where badges
   and the terminal block sit on near-white glass.
3. **`day` sets `--scheme: light`**, which is what makes form controls and
   scrollbars follow the theme instead of staying dark.

The inline `<head>` script applies the stored (or OS-preferred) theme before
first paint, so there is no flash of the wrong palette.

## Verified

Checked in headless Chrome over the DevTools Protocol.

- **Contrast** — every visible text node passes WCAG AA (4.5:1 body, 3:1 large)
  across **8 themes × 3 widths (390 / 768 / 1440) = 24 combinations**, 0
  failures. Gradient text and gradient-filled buttons are measured against the
  *worst* stop of the gradient, not a single sampled colour.
- **No horizontal overflow** in any of those 24 combinations (page-level
  `scrollWidth` is checked, and elements inside legitimate scrollers are not
  false-flagged).
- **Scroll reveal** — 0/54 visible at scroll-top, 54/54 after scrolling, and
  54/54 immediately under `prefers-reduced-motion: reduce`.
- **Ambient motion** — marquee, aurora blobs and star twinkle all animate under
  `prefers-reduced-motion: no-preference` and are all disabled under `reduce`.
  Headless Chrome defaults to `reduce`, so the test explicitly emulates
  `no-preference`.
- **Theme switching** — picker updates the attribute, `aria-checked`, the label,
  `<meta name="theme-color">` and `localStorage`.
- **Mobile nav** at 390px — toggle visible, panel fixed, opens on screen, closes.
- **Copy buttons** — verified against the *real* clipboard with a trusted
  `Input.dispatchMouseEvent` (a programmatic `.click()` carries no user
  activation, so the async path would be rejected). The email button puts
  `effestier@aol.com` on the clipboard and the config button puts the JSON
  snippet, both with a success toast; the `mailto:`, the visible text and
  `data-email` agree.
- **Structure** — exactly 1 `h1`, 5 `h2`, 18 project cards, 4 groups, 96 star
  dots, 13 constellation lines, 24 marquee spans, no duplicate IDs, no nested
  anchors, all 33 `target="_blank"` links carry `rel="noopener"`, both fonts
  load.
- **Counters** finish at `45`, `8`, `40+`, `7M+`.
- **Internal consistency** — the language figure is asserted in three places
  (counter, bar segments, chips) and the harness fails on disagreement.
- **Console clean** on both pages, 0 errors.
- `404.html` gets its own pass: 1 `h1`, no duplicate IDs, 24/24 contrast +
  overflow combinations clean, 0 console errors.

## Local preview

Any static server works:

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Still to fill in

Everything is marked with a `TODO` badge on the page itself (7 in
`index.html`):

1. **Bio** — the hero lede and the About section are drafts. Update `<title>`,
   the meta/OG tags, the JSON-LD block, and `site.webmanifest` to match.
2. **Location** — the About facts panel says "India"; confirm or change.
3. **Timeline** — `#background` has one real entry and a placeholder for
   roles / education.
4. **More links** — the "Elsewhere" cell in Contact is a placeholder (X,
   LinkedIn, Discord).
5. **Résumé** — drop a PDF at `resume/karan-resume.pdf` and link it from the
   Contact grid (the cell is already stubbed).
6. **Email** — `effestier@aol.com`, in three places: the `mailto:`, the visible
   text, and `data-email` on the copy button. Keep all three in sync.
7. **Claims** — the language figures are stated in three places (the counter,
   the bar segments and the chips) and the harness fails if they disagree, but
   re-check them if the accounts change. Current verified figures, straight from
   the GitHub API:

   | Claim | Verified |
   |---|---|
   | `45` public repositories | 28 (`RootBugs`) + 17 (`vufq`) = 45, all non-fork |
   | `8` languages | Python 14, TypeScript 9, HTML 4, PowerShell 2, Rust 1, GDScript 1, Shell 1, CSS 1 — 33 repos with a detected primary language, 12 with none |
   | `15` MIT-licensed | 15 declare MIT, **30 declare no licence at all** |
   | `40+` tests, `7M+` books | from the `consolebugs` and `grimoire` repo descriptions |

   Note the licence figure: the site deliberately says "15 MIT-licensed", not
   "open source" or "all MIT", because 30 of the 45 repositories carry no
   licence. A repository with no licence is not open source.

Find them all with:

```powershell
Select-String -Path index.html -Pattern TODO
```

## Adding a project

The work list is a flat `<ol class="index">` per group, wrapped in an `<li>`.
Copy an existing `<a class="row">` and change the name, description, tech line
and `href`. Row numbers are manual — renumber the group if it matters.

## Regenerating the social preview

`assets/img/og.png` and the PWA icons are captured from synthetic build pages
through CDP, not from a live screenshot of the hero. If you change the brand
mark or the accent ramp, rebuild them with a CDP capture at 1200×630 / 512×512 /
192×192 and overwrite those three files. Chrome's `--screenshot` CLI flag
produces zero-byte files on this machine; use `Page.captureScreenshot`.

## Deploying

Linked to Vercel, production branch `main`. Any push to `main` deploys
automatically. `feio.in` and `www.feio.in` are already attached.

## Licence

MIT
