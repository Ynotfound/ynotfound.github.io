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

English frontmatter uses the same key and lang: en. Write the complete article body in the language of that file. Inline mathematics uses $...$; display mathematics uses $$...$$. Code fences are syntax highlighted at build time.

## Add a research programme

Create paired files under src/content/research/ with the same translationKey and lang: zh / lang: en. The status field is one of active, exploratory, paused or completed.

## Add a research log entry

Create paired Markdown files under src/content/updates/, for example my-update.zh.md and my-update.en.md:

~~~yaml
---
translationKey: my-update-2026-11
lang: zh
projectKey: feynman-periods
title: 一条可核查的研究记录
description: 简要说明这条记录的内容和边界。
date: 2026-11-13
recordType: verification
evidence: symbolic-check
tags: [Feynman periods]
draft: false
---
~~~

The projectKey must match a research programme's translationKey. Supported recordType values:

- snapshot: a dated record of scope or current status; not a result claim.
- result: a result with its proof status explained in the entry.
- verification: a symbolic or numerical verification with its exact scope stated.
- conjecture: a conjectural statement.
- open-problem: an unresolved question.
- failed-attempt: a documented approach that did not work.

Supported evidence values: proof, symbolic-check, numerical-check, literature, proposal, none. The label describes the evidence type, not an automatic endorsement of correctness. A numerical check never becomes a general proof by being added here.

## Other collections

- publications/: published papers, preprints and working manuscripts.
- projects/: software, research tools and prototypes.
- references/: papers, books, software and other source material.
- journal/: dated research reflections and field notes.

Each collection has a typed schema in src/content.config.ts. Keep paired translations aligned. Set draft: true to exclude an entry from public pages, feeds, search and sitemap.

Distinguish theorem-level proofs, conditional results, numerical evidence, conjectures and open questions. A public working manuscript is not automatically a published paper or an arXiv preprint. Never put credentials, private correspondence, unpublished collaborator material or confidential data in this public repository.

## Local validation

~~~bash
npm ci
npm run check
npm run validate
~~~

GitHub Actions runs the same validation before deployment.
