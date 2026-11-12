# Yu Zhehao — Personal Observatory

A bilingual, multi-page academic website for **Yu Zhehao**, built with Astro and deployed to GitHub Pages.

**Live site:** https://ynotfound.github.io/

## Architecture

- **Astro static generation** — each section and article has its own URL; no long single-page scroll.
- **Markdown content collections** — notes and journal entries live under src/content/.
- **LaTeX mathematics** — remark-math and rehype-katex.
- **Code highlighting** — Astro's build-time Shiki integration.
- **Full-text search** — a generated JSON index searches notes, journal entries and a research entry.
- **Automatic metadata** — canonical URLs, sitemap, RSS and 404 page.
- **Responsive shared layout** — navigation, language and theme controls are shared across pages.
- **Interactive visuals** — orbital canvas on the homepage and a restrained Excalibur-inspired desktop cursor.

## Routes

- / — compact homepage / portal
- /research/ and /research/feynman-periods/ — research programme
- /publications/ — public manuscripts and publication status
- /notes/ and /notes/<slug>/ — Markdown knowledge base
- /reading/ — references and software documentation
- /journal/ and /journal/<slug>/ — essays and field notes
- /projects/ — code and research projects
- /about/ — profile
- /search/ — full-text search
- /rss.xml, /sitemap.xml — feeds and indexing

## Local development

Requires Node.js 22 or later.

~~~bash
npm install
npm run dev
npm run build
npm run preview
~~~

## Publishing content

See CONTRIBUTING.md. Add a Markdown file to src/content/notes/ or src/content/journal/, set its frontmatter, and push to main. GitHub Actions installs dependencies, builds dist/, and deploys the artifact to GitHub Pages.

## Design

Midnight blue, ivory and champagne gold; a Fangzheng Xiaobiaosong-style Chinese serif font stack with system fallbacks; subtle Avalon / Excalibur details. The site uses original vector geometry and code, not redistributed Fate artwork or other proprietary assets.

## Editorial policy

The Feynman-period long paper is identified as a public working manuscript, not as a published paper or arXiv preprint. Distinguish proved results, conditional conclusions, numerical checks, conjectures and open questions. Do not publish private manuscripts, credentials or confidential data.
