# Writing and publishing

The site is built with Astro and GitHub Pages. Add Markdown files; the build generates article pages, navigation lists, a search index, sitemap and RSS feed.

## Add a note

Create a file under src/content/notes/, for example my-topic.md:

~~~yaml
---
title: 中文标题
title_en: English title
description: 中文摘要
description_en: English summary
category: MATHEMATICS
tags: [Complex analysis, Geometry]
date: 2026-11-12
order: 50
draft: false
---
~~~

Write the body in Markdown. Inline mathematics uses dollar delimiters; display mathematics uses double-dollar delimiters. Code fences are syntax highlighted at build time.

## Add a journal entry

Create a Markdown file under src/content/journal/ with:

~~~yaml
---
title: 中文标题
title_en: English title
description: 中文摘要
description_en: English summary
date: 2026-11-12
tags: [Reading, Research]
draft: false
---
~~~

Journal entries are intended for reading reflections, research logs and essays. Use Notes for material that has been organized into durable explanations or references.

## Drafts and publication state

Set draft to true to keep an entry out of the public site. Set it to false only when it is ready to publish. Never put credentials, private correspondence, unpublished collaborator material or confidential data in this public repository.

Distinguish theorem-level proofs, conditional results, numerical evidence, conjectures and open questions. A public manuscript is not automatically a published paper or an arXiv preprint.

## Local preview

~~~bash
npm install
npm run dev
~~~

Build the static site with npm run build; the output is in dist/.
