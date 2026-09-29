# feio.in — portfolio

Personal site for **https://feio.in**. Plain HTML, CSS and vanilla JavaScript —
**no framework, no build step, no dependencies, no trackers**. Deploying is
uploading files.

## The design in one paragraph

A dark catalogue with counted figures, opened by a unit chart. The page is
an asymmetric two-column grid: a fixed narrow margin carries small monospace
metadata for each section, and the main column carries continuous text —
every band opening on a large display heading with a short rule under it.
Body copy is **Fraunces**, a variable serif, set much larger than a
conventional body face — the lede runs to 6.4rem on a display optical size
rather than being scaled-up paragraph text.

There is exactly **one theme** — near-black paper, warm white ink, signal
lime and orange — because the content is a dense reference and that is how
dense reference material is read now. The figures band inverts locally to a
light slab by re-declaring the same tokens inside the element: one large
field of warm paper on the whole site, which is where the counted numbers
sit. That is composition, not a second theme: `color-scheme` stays `dark`,
`body` stays near-black, and there is no toggle, no stored preference and no
alternate stylesheet. The render suite asserts exactly that on every width.

No dashboard widgets, no cards, no pills, no badges, no gradients, no
animation beyond a 120–200ms underline, lift and colour transition on hover.

### The graphics are the honest kind

The hero graphic is a **unit chart**: one square per repository, 37 squares,
colour-coded by language and grouped so the colour blocks read as a chart
instead of noise. Each square is a real link to that repository, with a title
and an `aria-label`. The count *is* the graphic — nothing is scaled, so the
picture cannot drift from the data.

Below it, the figures band draws the rest as CSS bars: six largest repositories
by source size, and three proportion bars for licensing, documentation and
topic coverage. Every width is a hardcoded percentage because the width is the
data.

There is deliberately no commit-activity sparkline. The `pushed_at` dates for
these accounts only span five months, so a chart of them would imply a history
that does not exist.

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

**One theme.** `color-scheme: dark` and that is the whole story. There is no
`data-theme` attribute, no toggle, no `localStorage`, and no
`prefers-color-scheme` script — which also means no flash of the wrong palette
to guard against. Every ink value clears WCAG AA against the near-black page,
and the light-slab tokens are checked separately against that slab.

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
heading, so the outline stays one `h1` plus five `h2`s — each band opens on a
visible `<h2 class="band-h">` in display type with a short accent rule under
it, while the margin `<p>` carries metadata instead ("20 projects", "37
repositories") so the two never say the same thing twice.

### The unit chart

```html
<a class="unit unit-python" href="https://github.com/RootBugs/KE3NZ"
   target="_blank" rel="noopener noreferrer"
   title="KE3NZ — Python" aria-label="KE3NZ, Python"></a>
```

`.units-grid` is `repeat(auto-fill, minmax(1.3rem, 1.8rem))`, so the blocks
wrap to whatever the column allows — about 25 per row on a desktop, 11 on a
phone — and each square keeps `aspect-ratio: 1`. The five language buckets are
declared once as colour tokens (`--l-python`, `--l-typescript`, `--l-html`,
`--l-other`, `--l-none`) and re-declared inside the inverted band, so the same
chart inverts cleanly if it is ever moved.

### The counted figures

`#shape` is the inverted band. Each `<li class="bar-row">` is a three-track
grid: label, track, value.

```html
<li class="bar-row">
  <a class="bar-name" href="...">k4rnportfolio</a>
  <span class="bar-track"><i style="width:100.00%"></i></span>
  <span class="bar-val">68.9 MB</span>
</li>
```

`<i>` carries a hard `width` percentage because the width *is* the data — it is
not a decorative percentage that happens to look plausible. The validation
harness asserts the bucket counts sum to 37, that each language sits in one
contiguous run, that all six bar widths fall in 0–100% and sort descending, and
that each proportion bar's width matches the ratio written in its own caption,
so a hand-edited figure that drifts from reality fails the build rather than
shipping.

## Content

A hero, then five bands, in order:

0. **Lede** — the headline, the intro paragraph, and the 37-block unit chart
   with its legend and four counted facts.
1. **Work** — 20 projects, each with a description, a tech line, and a
   language / licence / stars line read from the API. Grouped into four
   categories.
2. **Shape** — the inverted band: six largest repos by source size, plus
   licence, documentation and topic coverage as proportion bars.
3. **Index** — the remaining 37 public repositories in two columns, with
   detected language and an `MIT` mark on the 15 that carry one. The same 37
   blocks from the top, spelled out.
4. **About** — a pull quote, two paragraphs, and a four-row facts list.
5. **Contact** — the address set as display type, with a copy button.

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

- **Structure** — 227 assertions. No duplicate IDs, exactly one `h1`, every
  in-page anchor resolves, every `target="_blank"` carries
  `rel="noopener noreferrer"`, one email, 37 repository rows, 20 described
  entries, 7 margin labels, 5 visible `h2.band-h`s, 5 anchored sections.
- **Unit chart** — 37 blocks, each pointing at a distinct repository on one of
  the two accounts, none of them an excluded claim repo, each with a title and
  an `aria-label`; bucket counts 14/9/5/5/4 summing to 37; one contiguous run
  per language.
- **Figures** — 6 size bars with explicit widths sorted descending, 3
  proportion bars whose widths match the ratio printed in their own caption,
  the old `langbar` component gone, and no image-based charts anywhere.
- **One theme** — asserted in both HTML and CSS: no `data-theme`, no
  `prefers-color-scheme` script, no toggle in markup or CSS, no `localStorage`
  in JS, exactly one `theme-color` meta, manifest matches the single palette.
  The two inverted sections are asserted to be local token redeclarations
  carrying no theme machinery.
- **No trendy scaffolding** — the harness asserts the absence of the ledger
  panel, stat strip, badges, matrix, timeline, wordmark, star counts, grain
  field, cards, chips, rounded buttons, numbered section rules, scroll reveals,
  and every `TODO`.
- **Render** — 99 assertions at 390 / 820 / 1440px: no console errors, no
  external requests, all 5 font faces load, no horizontal overflow, the margin
  column is left of the content when two-column and above it when stacked, body
  copy resolves to Fraunces, 6 bars / 3 proportion bars / 37 unit blocks all
  rendered with non-zero size, `body` still dark while the band flips to its
  light slab and the colophon lifts, all 10 inverted text samples clearing AA,
  all 5 nav links on screen with no menu toggle, every work entry described,
  clipboard actually holds the address.
- **Contrast** — every visible text node passes WCAG AA, including every text
  node inside the inverted sections.
- **Print** — chrome hides, the grid re-forms as two columns, inverted sections
  print as light ink-on-white, unit blocks keep their outlines, and repository
  and unit links print without an appended URL.
- **Links** — all unique external URLs return 2xx/3xx.
- **404** — 1 `h1`, no duplicate IDs, no theme control, clean at 390 / 768 /
  1440px, 0 console errors.

## Licence

MIT
