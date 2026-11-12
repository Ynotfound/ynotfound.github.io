# Writing and publishing

The site uses Astro Content Collections. Each public entry must have a Chinese and English Markdown file that share one translationKey.

## Add a note

Create two files under src/content/notes/, for example my-topic.zh.md and my-topic.en.md.

Chinese frontmatter:

~~~yaml
---
translationKey: my-topic
lang: zh
title: 中文标题
description: 中文摘要
category: MATHEMATICS
tags: [Complex analysis, Geometry]
date: 2026-11-12
order: 50
draft: false
---
~~~

English frontmatter uses the same key and lang: en:

~~~yaml
---
translationKey: my-topic
lang: en
title: English title
description: English summary
category: MATHEMATICS
tags: [Complex analysis, Geometry]
date: 2026-11-12
order: 50
draft: false
---
~~~

Write the complete article body in the language of that file. Inline mathematics uses $...$; display mathematics uses $$...$$. Code fences are syntax highlighted at build time.

## Other collections

- research/: research programmes; status is active, exploratory, paused or completed.
- publications/: published, preprint, working-paper, draft or superseded.
- projects/: software, research tools and prototypes.
- references/: papers, books, software and other source material.
- journal/: dated research reflections and field notes.

Each collection has a typed schema in src/content.config.ts. Follow the schema and keep paired translations aligned.

## Drafts and research status

Set draft: true to exclude an entry from public pages, feeds, search and sitemap. Distinguish theorem-level proofs, conditional results, numerical evidence, conjectures and open questions. A public working manuscript is not automatically a published paper or an arXiv preprint.

Never put credentials, private correspondence, unpublished collaborator material or confidential data in this public repository.

## Local validation

~~~bash
npm ci
npm run check
npm run validate
~~~

GitHub Actions runs the same validation before deployment.
