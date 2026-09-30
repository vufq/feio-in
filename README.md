# feio.in — portfolio

Personal site for **https://feio.in**. Plain HTML, CSS and vanilla JavaScript —
**no framework, no build step, no dependencies, no trackers**. Deploying is
uploading files.

## The design in one paragraph

**"The sheet."** One full-width sheet of white paper, opened by a masthead,
then a single statement, then everything else. Three inks only: paper
(`#ffffff`), ink (`#111111`) and one crimson spot (`#d6003f`), with a few
greys that are tints of the ink and nothing else. There is no margin column,
no card grid, no colour bands between sections, no yellow, no rainbow —
structure is rules, type scale and one crimson. Sections are separated by
hairlines and black rules, never by filling the background with another
colour, so the whole page still reads as one printed sheet.

Body copy is **Fraunces**, a variable serif used at real display optical
sizes (`font-variation-settings: "opsz" …`), with **JetBrains Mono** for
labels, numbers and languages. The one loud field on the page is the contact
section, which floods edge to edge with the crimson spot; the colophon is the
one ink slab. Both are local to their element — `color-scheme` stays `light`,
`body` stays white, and there is no toggle, no stored preference and no
alternate stylesheet. The render suite asserts exactly that on every width.

No dashboard widgets, no cards, no pills, no badges, no gradients, no drop
shadows, no glass, no scroll-reveal machinery. Hover motion is a 130ms
underline, a colour flip and an arrow nudge, and all of it is disabled under
`prefers-reduced-motion`.

### The graphics are the honest kind

The hero graphic is **the tally**: one square per thing, 38 squares, drawn as
real `<i>` elements and split into the five groups the list below uses
(5 / 5 / 6 / 4 / 18). Squares for things without a description are hollow.
The count *is* the graphic — nothing is scaled, so the picture cannot drift
from the data, and a screen-reader summary states the same totals in words.

There is no bar chart, no size chart and no commit-activity sparkline. The
`pushed_at` dates for these accounts only span five months, so a chart of
them would imply a history that does not exist.

## Structure

```
index.html                    the whole site
404.html                      not-found page (shares the design system)
robots.txt
sitemap.xml
site.webmanifest
assets/
  css/styles.css              tokens + every component (~630 lines)
  js/main.js                  copy button only (~1 kB)
  fonts/fraunces.woff2        self-hosted variable serif, 66 kB
  fonts/fraunces-italic.woff2 self-hosted variable italic, 80 kB
  fonts/jetbrains-mono.woff2  self-hosted variable mono, 31 kB
  img/favicon.svg
  img/og.svg                  1200x630 social card source (the tally)
  img/og.png                  1200x630 social preview
  img/icon-192.png            PWA icon
  img/icon-512.png            PWA icon
```

Total font payload **176 kB** across three self-hosted files.

## Design system

Tokens live in `:root` at the top of `styles.css`; every component consumes
them. Nothing in the stylesheet carries a raw colour that is not one of these.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#ffffff` | the sheet |
| `--paper-2` | `#f4f4f1` | faintest tint |
| `--ink` | `#111111` | type, rules, tally squares |
| `--ink-2` / `-3` / `-4` | `#3d3d3d` / `#6b6b6b` / `#9a9a9a` | grey ramp (all clear AA on paper) |
| `--line` / `--line-soft` | `#111111` / `#dcdcd8` | rule, hairline |
| `--accent` | `#d6003f` | the one spot ink |
| `--on-accent` / `--on-ink` | `#ffffff` | reverse type |
| `--measure` / `--shell` / `--gutter` | `62ch` / `84rem` / `clamp(1.15rem, 4vw, 3.5rem)` | geometry |

**One theme.** `color-scheme: light` and that is the whole story. No
`data-theme`, no toggle, no `localStorage`, no `prefers-color-scheme` script —
which also means no flash of the wrong palette to guard against.

### Layout

There is no grid to collapse: every section is a `.shell` (a max-width,
centred, gutter'd block) on one column of paper. The tracklist row is the only
multi-column thing on the page:

```css
.item {
  display: grid;
  grid-template-columns: 3.4rem minmax(0, 1.05fr) minmax(0, 1.5fr) 7.5rem;
  align-items: baseline;
}
```

number · name · description · language. At 900px and below it becomes two
tracks — number, then name with description and language stacked under it —
so a phone reads a list of rows rather than a squeezed table. The outline is
one `h1` plus three `h2`s (`Stuff I made`, `About`, `Say hello`); group
headings are `h3.grp` and are black bars with the group name and its count.

## Content

Five sections, in order:

1. **Statement** — one `h1` and one paragraph, with the two account links.
2. **The tally** — 38 squares in five clusters, a caption per cluster, a
   legend for solid vs hollow, and the screen-reader summary.
3. **Stuff I made** (`#index`) — every thing as a numbered full-width row:
   `01`…`38`, name, description, language. Five groups: Security research 5,
   AI & LLM infrastructure 5, Developer tools 6, Products & side work 4,
   The rest 18.
4. **About** (`#about`) — a pull quote, three paragraphs, and a facts list
   (`Mainly`, `Live`).
5. **Say hello** (`#hello`) — the address as display type with a copy button,
   then the issue routes. The colophon follows as a black slab.

Claims on the page are verified against the GitHub API, straight from the
accounts:

| Claim | Verified |
|---|---|
| `37 repositories` | 28 (`@RootBugs`) + 9 (`@vufq`), all non-fork |
| `38 things` | the 37 repositories plus `kwen.in` |
| `35 have a description` | 3 have none and are listed by name alone |
| `4 no language` | previews and asset-only repos |
| Groups | 5 / 5 / 6 / 4 / 18, summing to 38 |

Eight automated badge-claim repos on `@vufq` are deliberately excluded —
they are not projects: `badge-hub`, `badge-hub-2`, `open-source-1`,
`open-source-2`, `pair-extraordinaire`, `pair-badge-repo`,
`pair-badge-repo-2`, `pair-badge-repo-3`.

If the accounts change, update the counts in `index.html` (the lede, each
`.grp` counter, each `.cluster-cap` count) and the tally. The validation
harness fails if the prose, the counters and the number of drawn rows ever
disagree.

## Still to fill in

The page ships with no placeholder text and no `TODO` markers. Nothing on the
page is invented: there is no bio, no location, no employment history, no
résumé and no timeline, because none of it is verified.

**Email** — `effestier@aol.com` appears in three places: the `mailto:`, the
visible text, and `data-email` on the copy button. Keep all three in sync.

## Adding a thing

Copy an existing `<li>` inside the right `<ol class="track">`, bump its
`.item-n` number, and set the name, description and language. Then fix the
group counter in the `<h3 class="grp">` above it, the matching
`.cluster-cap` count in the tally, and the `38` in the `sr-only` summary.
Re-run the harness; it checks all of it.

## Regenerating the social preview

`assets/img/og.png` and the PWA icons are rasterised from `og.svg` and
`favicon.svg`. The reliable route is a wrapper HTML page sized to the target
viewport, screenshotted with headless Chrome over the DevTools Protocol, then
deleted — rasterising the SVG directly is flaky across Chrome versions.

## Local preview

Any static server works:

```bash
python -m http.server 8811
# open http://127.0.0.1:8811
```

## Deploying

Linked to Vercel, production branch `main`. Any push to `main` deploys
automatically. `feio.in` and `www.feio.in` are already attached.

## Verified

Checked in headless Chrome over the DevTools Protocol:

- **Structure** — 297 assertions. No duplicate IDs, exactly one `h1` and three
  `h2`s, every in-page anchor resolves, every `target="_blank"` carries
  `rel="noopener noreferrer"`, one email, 38 numbered rows, group counters
  that match the rows drawn under them, 5 tally clusters whose squares match
  their captions, one `sr-only` element.
- **Rejections locked in** — the harness fails if megabyte figures, licence
  chips, star counts, topic chips, size bars, proportion bars, metrics panels,
  the entry registry, the row registry, a margin rail, a band, a colour
  strip, a theme toggle, a card/badge/chip/button component or any `TODO`
  reappears, and if any colour outside the declared palette is introduced.
- **Render** — 105 assertions at 390 / 820 / 1440px: no console errors, no
  external requests, all font faces load from this origin, no horizontal
  overflow, every key block laid out, the row number sits in its own track
  beside the name (or stacked on a narrow sheet), 5 clusters + 38 squares +
  38 rows all drawn with non-zero size, body copy resolves to Fraunces,
  `body` stays white while the contact field floods crimson and the colophon
  goes black, all 9 reversed text samples clearing AA, 3 nav links on screen
  with no menu toggle, clipboard actually holds the address.
- **Contrast** — every visible text node passes WCAG AA on both pages.
- **Print** — chrome hides, the crimson field and the black colophon print as
  ink on white, tally squares print solid with `print-color-adjust: exact`,
  the 38 rows do not append their URLs, ordinary links still do.
- **Links** — all unique external URLs return 2xx/3xx.
- **404** — 1 `h1`, no duplicate IDs, no theme control, clean at 390 / 768 /
  1440px, 0 console errors.

## Licence

MIT
