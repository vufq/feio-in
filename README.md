# Portfolio — https://feio.in

Personal portfolio site. **Plain HTML, CSS and vanilla JavaScript — no framework, no build step.**
Deploying is just uploading files.

## Structure

```
index.html              the whole site
404.html                not-found page
robots.txt
sitemap.xml
site.webmanifest
assets/
  css/styles.css
  js/main.js
  img/favicon.svg
  img/og.svg
resume/                 put your PDF here (see TODO below)
```

## Local preview

Any static server works:

```bash
python -m http.server 8000
# then open http://localhost:3000
```

## What you still need to fill in

Everything below is marked with a `TODO` badge on the page itself, so you can
find them by looking. Grep for it:

```bash
grep -n "TODO" index.html
```

1. **Name and bio** — the site currently says "Karan". Change it in `index.html`:
   - `<title>`, `<meta name="description">`, OG/Twitter tags
   - the JSON-LD block (`"name"`, `"sameAs"`)
   - the hero `<h1>`, the lede paragraph, and the About section
   - `site.webmanifest` (`name`, `short_name`, `description`)

2. **Email** — currently `tarkarnisha13@gmail.com`, appears in the contact card and
   the `mailto:` link. Search for it in `index.html`.

3. **Résumé PDF** — drop your file at `resume/karan-resume.pdf` using exactly that
   filename, or change the `href` in the hero's "Download résumé" button.

4. **Experience / Education** — the three timeline items in the Experience section
   are placeholders. Replace with your real roles and dates.

5. **More contact links** — the "More" card in Contact is a placeholder. Add cards
   for X, LinkedIn, Instagram, Discord, Telegram, etc. in the same shape as the
   existing ones.

6. **Location** — the About facts panel says "India".

7. **Social preview image** — `assets/img/og.svg` is the card shown when the link
   is shared. Keep the same filename, or update the `og:image` URL.

## Projects

The eight project cards come from your real public repositories. To add, drop in
another GitHub URL and edit the description to match what the tool actually does —
hirers read the description, not the repo name.

## Deploying

Linked to Vercel, production branch `main`. Any push to `main` deploys
automatically. `feio.in` and `www.feio.in` are already attached.

## Licence

MIT
