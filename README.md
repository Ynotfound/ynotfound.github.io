# Yu Zhehao — Personal Observatory

A bilingual academic website for **Yu Zhehao**, built with Astro and deployed to GitHub Pages.

Live site: https://ynotfound.github.io/

## Architecture

- Astro static generation; every section and article has a stable URL.
- Six typed Markdown collections: notes, journal, research, publications, projects and references.
- Paired Chinese/English content entries with a shared translation key.
- KaTeX mathematics and build-time syntax highlighting.
- Generated search index, sitemap and RSS feed.
- Shared responsive layout, theme preference and language-aware navigation.
- Native Excalibur-inspired cursor with a separate Canvas particle trail.
- GitHub Actions runs type/content/build/link validation before deployment.

## Routes

- / and /en/ — bilingual home portals
- /research/ and /en/research/ — research programmes
- /publications/ and /en/publications/ — papers and working manuscripts
- /notes/ and /en/notes/ — mathematical and physics notes
- /reading/ and /en/reading/ — references and resources
- /journal/ and /en/journal/ — field notes
- /projects/ and /en/projects/ — research software and prototypes
- /about/ and /en/about/ — profile
- /search/ and /en/search/ — full-text search
- /rss.xml, /sitemap.xml — feeds and indexing

## Local development

Requires Node.js 22 or later.

~~~bash
npm ci
npm run dev
npm run validate
npm run preview
~~~

## Content model

Content lives in src/content/. Every public entry has a translationKey shared by its Chinese (lang: zh) and English (lang: en) Markdown files. Add a pair of files with the same translation key to publish a bilingual entry. Set draft: true to keep it private from the generated site.

See CONTRIBUTING.md for frontmatter examples and publishing rules.

## Editorial policy

Distinguish published papers, preprints and working manuscripts. For research notes, distinguish proved results, conditional conclusions, numerical checks, conjectures and open questions. Never publish credentials, private correspondence or confidential collaborator material.

## Design

Midnight blue, ivory and champagne gold; a Fangzheng Xiaobiaosong-style Chinese serif stack with system fallbacks; restrained Avalon / Excalibur details. All sword artwork is original vector artwork, not redistributed Fate assets.


## Author Studio

Use [Pages CMS](https://app.pagescms.org/) to create and edit content. See [AUTHORING.md](AUTHORING.md) for setup and publishing instructions.
