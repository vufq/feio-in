# feio.in — portfolio

Personal site for **https://feio.in**. Plain HTML, CSS and vanilla JavaScript —
**no framework, no build step, no dependencies, no trackers**. Deploying is
uploading files.

## The design in one paragraph

A printed catalogue. The page is an asymmetric two-column grid: a fixed narrow
margin carries small monospace section labels, and the main column carries
continuous text. Body copy is Newsreader, a serif, at a real reading measure.
There is exactly **one theme** — warm paper, near-black ink, one deep green
accent — because the content is prose and a catalogue prints on paper. No
dashboard widgets, no cards, no pills, no badges, no gradients, no animation
beyond a 120–200ms underline and colour transition on hover.

Two earlier directions were rejected: a midnight/aurora/glass "product" system,
and a centred hero with rounded buttons and numbered `01 ————` section rules.
Both are the visual grammar of every generated portfolio template. The margin
column and the serif are what break it.

## Structure

```
index.html                    the whole site
404.html                      not-found page (shares the design system)
robots.txt
sitemap.xml
site.webmanifest
assets/
  css/styles.css              tokens + every component
  js/main.js                  sticky header + copy button (~1.5 kB)
  fonts/newsreader.woff2      self-hosted, 129 kB
  fonts/newsreader-italic.woff2  self-hosted, 143 kB
  fonts/jetbrains-mono.woff2  self-hosted, 31 kB
  img/favicon.svg
  img/og.svg                  1200x630 social card source
  img/og.png                  1200x630 social preview
  img/icon-192.png            PWA icon
  img/icon-512.png            PWA icon
```

Total font payload ~303 kB across three self-hosted files. Inter was dropped:
with Newsreader doing the reading, a sans had no job left, and shipping an
unused 48 kB font to look "complete" is the kind of thing this design is
trying not to do.

## Design system

Tokens live at the top of `styles.css`; every component consumes them.

| Group | Tokens |
|---|---|
| Type | `--step--1` … `--step-4` (fluid `clamp()`) |
| Leading | `--leading-tight` `-snug` `-normal` `-relaxed` |
| Tracking | `--tracking-tight` `-wide` `-wider` |
| Motion | `--ease-out`, `--dur-fast`/`--dur` |
| Geometry | `--shell` (72rem), `--measure` (34rem), `--margin-col` (10.5rem), `--gutter` |
| Colour | `--paper`, `--paper-deep`, `--ink`, `--ink-2`/`-3`/`-4`, `--line`, `--line-soft`, `--accent` |

**One theme.** `color-scheme: light` and that is the whole story. There is no
`data-theme` attribute, no toggle, no `localStorage`, and no
`prefers-color-scheme` script — which also means no flash of the wrong palette
to guard against. Every ink value clears WCAG AA against **both** paper tones,
including `--ink-4` on the darker footer, which is the one that is easy to get
wrong (it measured 4.46:1 before being darkened to `#646a73`).

### The grid

```css
.grid {
  display: grid;
  grid-template-columns: var(--margin-col) minmax(0, 1fr);
}
.margin-label { grid-column: 1; }
.grid > *      { grid-column: 2; }
```

Below 820px the margin column stops being a column: the grid becomes one track
and the label sits above its content. The label is always `<p>`, never a
heading, so the document outline stays one `h1` plus four `h2`s — each band
carries an `.sr-only` `h2` for screen readers and a visible margin label for
everyone else.

## Content

Four bands, in order:

1. **Work** — 20 projects, each with a description and a tech line, grouped
   into four categories.
2. **Index** — the remaining 37 public repositories, two columns of
   name + detected language.
3. **About** — three paragraphs plus a four-row facts list.
4. **Contact** — email with a copy button.

Claims on the page are verified against the GitHub API, straight from the
accounts:

| Claim | Verified |
|---|---|
| `37` public repositories | 28 (`@RootBugs`) + 9 (`@vufq`), all non-fork |
| `MIT on 15 of 37` | 15 declare MIT, the rest declare no licence at all |
| Languages | Python, TypeScript, Rust, PowerShell, HTML, GDScript, Shell, CSS |

The site says "MIT on 15 of 37", never "all MIT" or just "open source", because
a repository with no licence is not open source. Eight automated badge-claim
repos on `@vufq` are deliberately excluded — they are not projects.

If the accounts change, update the counts in `index.html` (lede, band intro,
facts list) and the `<span class="sub-n">` on each account heading. The
validation harness fails if the prose and the row count disagree.

## Still to fill in

The page ships with no placeholder text and no `TODO` markers. If you want to
add personal background, a location, a résumé, or social links, add the section
yourself rather than reintroducing TODOs on the live page.

**Email** — `effestier@aol.com` appears in three places: the `mailto:`, the
visible text, and `data-email` on the copy button. Keep all three in sync.

## Adding a project

Copy an existing `<li>` inside `#work`'s `<ol class="entries">` and change the
`entry-n` number, name, description, tech line and `href`.

## Regenerating the social preview

`assets/img/og.png` and the PWA icons are rasterised from `og.svg` and
`favicon.svg` with headless Edge:

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --headless --disable-gpu --screenshot=out.png --window-size=1200,630 `
  ([uri]"C:\path\to\og.svg").AbsoluteUri
```

## Local preview

Any static server works:

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploying

Linked to Vercel, production branch `main`. Any push to `main` deploys
automatically. `feio.in` and `www.feio.in` are already attached.

## Verified

Checked in headless Chrome over the DevTools Protocol:

- **Structure** — 154 assertions. No duplicate IDs, exactly one `h1`, every
  in-page anchor resolves, every `target="_blank"` carries
  `rel="noopener noreferrer"`, one email, 37 repository rows, 20 described
  entries, 6 margin labels, 4 screen-reader `h2`s.
- **One theme** — asserted in both HTML and CSS: no `data-theme`, no
  `prefers-color-scheme` script, no toggle in markup or CSS, no `localStorage`
  in JS, exactly one `theme-color` meta, manifest matches the single palette.
- **No trendy scaffolding** — the harness asserts the absence of the ledger
  panel, language bar, stat strip, badges, matrix, timeline, wordmark, star
  counts, licence tags, grain field, cards, chips, rounded buttons, numbered
  section rules, scroll reveals, `row`/`index`/`sec-head` classes, and every
  `TODO`.
- **Render** — 72 assertions at 390 / 820 / 1440px: no console errors, no
  external requests, all 5 font faces load, no horizontal overflow, the margin
  column is left of the content when two-column and above it when stacked,
  body copy resolves to the serif, all 4 nav links on screen with no menu
  toggle, every work entry described, clipboard actually holds the address.
- **Contrast** — every visible text node passes WCAG AA on both paper tones.
- **Print** — chrome hides, the grid re-forms as two columns, external URLs
  are printed after their links.
- **Links** — all 41 unique external URLs return 2xx/3xx.
- **404** — 1 `h1`, no duplicate IDs, no theme control, clean at 390 / 768 /
  1440px, 0 console errors.

## Licence

MIT
