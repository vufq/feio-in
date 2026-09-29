# feio.in — portfolio

Personal site for **https://feio.in**. Plain HTML, CSS and vanilla JavaScript —
**no framework, no build step, no dependencies, no trackers**. Deploying is
uploading files.

## The design in one paragraph

A printed catalogue with counted figures. The page is an asymmetric two-column
grid: a fixed narrow margin carries small monospace section labels, and the main
column carries continuous text. Body copy is **Fraunces**, a variable serif, at a
real reading measure. There is exactly **one theme** — warm paper, near-black ink,
one rust accent, one green for licence marks — because the content is prose and a
catalogue prints on paper. No dashboard widgets, no cards, no pills, no badges,
no gradients, no animation beyond a 120–200ms underline and colour transition on
hover.

The graphics are the honest kind: horizontal bars drawn in CSS from figures read
out of the GitHub API. They are not decorative sparklines, and there is
deliberately no commit-activity chart — the `pushed_at` dates for these accounts
only span five months, so a sparkline would imply a history that does not exist.

## Structure

```
index.html                    the whole site
404.html                      not-found page (shares the design system)
robots.txt
sitemap.xml
site.webmanifest
assets/
  css/styles.css              tokens + every component
  js/main.js                  sticky header + copy button (~2 kB)
  fonts/fraunces.woff2        self-hosted variable serif, 66 kB
  fonts/fraunces-italic.woff2 self-hosted variable italic, 80 kB
  fonts/jetbrains-mono.woff2  self-hosted variable mono, 31 kB
  img/favicon.svg
  img/og.svg                  1200x630 social card source
  img/og.png                  1200x630 social preview
  img/icon-192.png            PWA icon
  img/icon-512.png            PWA icon
```

Total font payload **176 kB** across three self-hosted files.

### A note on the fonts

Fraunces is a variable font, so one file covers every weight and both the roman
and italic cuts. It also exposes a real **optical-size** axis, which is why
`styles.css` sets `font-variation-settings: "opsz" …` on display sizes: the ledo
is drawn at display proportions rather than being a scaled-up text size, which is
what makes a variable serif look intentional at 4rem.

Newsreader was dropped in this revision. It was 273 kB of the previous 358 kB
budget, and Fraunces does the reading with more character. Dropping it was a
payload win and a design win at the same time.

## Design system

Tokens live at the top of `styles.css`; every component consumes them.

| Group | Tokens |
|---|---|
| Type | `--step--1` … `--step-4` (fluid `clamp()`), `--serif`, `--mono` |
| Leading | `--leading-tight` `-snug` `-normal` `-relaxed` |
| Tracking | `--tracking-tight` `-wide` `-wider` |
| Motion | `--ease-out`, `--dur-fast`/`--dur` |
| Geometry | `--shell` (74rem), `--measure` (33rem), `--margin-col` (10.5rem), `--gutter` |
| Colour | `--paper`, `--paper-2`, `--ink`, `--ink-2`/`-3`/`-4`, `--line`, `--line-soft`, `--accent`, `--accent-2`, `--fill` |

**One theme.** `color-scheme: light` and that is the whole story. There is no
`data-theme` attribute, no toggle, no `localStorage`, and no
`prefers-color-scheme` script — which also means no flash of the wrong palette
to guard against. Every ink value clears WCAG AA against **both** paper tones,
including `--ink-4` on the darker footer.

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
heading, so the document outline stays one `h1` plus five `h2`s — each band
carries an `.sr-only` `h2` for screen readers and a visible margin label for
everyone else.

### The counted figures

`#shape` is a band of CSS-drawn bars. Each `<li class="bar-row">` is a
three-track grid: label, track, value.

```html
<li class="bar-row">
  <span class="bar-name">Python</span>
  <span class="bar-track"><i style="width:37.84%"></i></span>
  <span class="bar-val">14</span>
</li>
```

`<i>` carries a hard `width` percentage because the width *is* the data — it is
not a decorative percentage that happens to look plausible. The validation
harness asserts that the eight language counts sum to 37, that all fourteen
widths fall in 0–100%, and that the language bars are sorted descending, so a
hand-edited figure that drifts from reality fails the build rather than shipping.

## Content

Five bands, in order:

1. **Work** — 20 projects, each with a description, a tech line, and a
   language / licence / stars line read from the API. Grouped into four
   categories.
2. **Shape** — the counted figures: language distribution, six largest repos by
   source size, licence split, documentation coverage.
3. **Index** — the remaining 37 public repositories in two columns, with
   detected language and an `MIT` mark on the 15 that carry one.
4. **About** — three paragraphs plus a four-row facts list.
5. **Contact** — email with a copy button.

Claims on the page are verified against the GitHub API, straight from the
accounts:

| Claim | Verified |
|---|---|
| `37` public repositories | 28 (`@RootBugs`) + 9 (`@vufq`), all non-fork |
| `MIT on 15 of 37` | 15 declare MIT, the rest declare no licence at all |
| `33` with a detected language | 4 are previews or asset-only repos |
| `34` with a description | 3 have none and are listed by name alone |
| Languages | Python 14, TypeScript 9, HTML 5, PowerShell 2, GDScript, Rust, Shell |

The site says "MIT on 15 of 37", never "all MIT" or just "open source", because
a repository with no licence is not open source. The `#shape` band says the same
thing in longer form, because that is the claim a visitor is most likely to get
wrong by inference. Eight automated badge-claim repos on `@vufq` are deliberately
excluded — they are not projects.

If the accounts change, update the counts in `index.html` (lede, band intro,
facts list) and the `<span class="sub-n">` on each account heading. The
validation harness fails if the prose and the row count disagree.

## Still to fill in

The page ships with no placeholder text and no `TODO` markers. If you want to
add personal background, a location, a résumé, or social links, add the section
yourself rather than reintroducing TODOs on the live page. Nothing on the page
is invented: there is no bio, no location, no employment history and no
timeline, because none of it is verified.

**Email** — `effestier@aol.com` appears in three places: the `mailto:`, the
visible text, and `data-email` on the copy button. Keep all three in sync.

## Adding a project

Copy an existing `<li>` inside `#work`'s `<ol class="entries">` and change the
`entry-n` number, name, description, tech line and `href`. The `entry-facts` span
is optional and should only be filled from the API response for that repo.

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

- **Structure** — 169 assertions. No duplicate IDs, exactly one `h1`, every
  in-page anchor resolves, every `target="_blank"` carries
  `rel="noopener noreferrer"`, one email, 37 repository rows, 20 described
  entries, 7 margin labels, 5 screen-reader `h2`s, 5 anchored sections.
- **Figures** — 14 bars with explicit widths, language counts summing to 37, bars
  sorted descending, all widths in range, the old `langbar` component gone, and
  no image-based charts anywhere.
- **One theme** — asserted in both HTML and CSS: no `data-theme`, no
  `prefers-color-scheme` script, no toggle in markup or CSS, no `localStorage`
  in JS, exactly one `theme-color` meta, manifest matches the single palette.
- **No trendy scaffolding** — the harness asserts the absence of the ledger
  panel, stat strip, badges, matrix, timeline, wordmark, star counts, grain
  field, cards, chips, rounded buttons, numbered section rules, scroll reveals,
  and every `TODO`.
- **Render** — 75 assertions at 390 / 820 / 1440px: no console errors, no
  external requests, all 5 font faces load, no horizontal overflow, the margin
  column is left of the content when two-column and above it when stacked, body
  copy resolves to Fraunces, all 14 bars have a non-zero rendered width, all 5
  nav links on screen with no menu toggle, every work entry described,
  clipboard actually holds the address.
- **Contrast** — every visible text node passes WCAG AA on both paper tones.
- **Print** — chrome hides, the grid re-forms as two columns, external URLs
  are printed after their links.
- **Links** — all unique external URLs return 2xx/3xx.
- **404** — 1 `h1`, no duplicate IDs, no theme control, clean at 390 / 768 /
  1440px, 0 console errors.

## Licence

MIT
