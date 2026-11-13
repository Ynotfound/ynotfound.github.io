# Author Studio

This repository uses Pages CMS as a private, GitHub-backed writing interface. The public site remains an Astro static site on GitHub Pages.

## Open the authoring interface

1. Visit https://app.pagescms.org/.
2. Sign in with your GitHub account.
3. Install the Pages CMS GitHub App for the Ynotfound/ynotfound.github.io repository only.
4. Open this repository. Pages CMS reads .pages.yml and shows the configured writing, research, publication, project and reference collections.

Pages CMS writes Markdown and media files back to this repository. A successful GitHub Actions build then republishes the public site.

## Publishing an article

1. Open Writing → Articles & Journal.
2. Create a Chinese entry with a stable translationKey, for example my-first-essay, and choose zh.
3. Keep Keep as draft enabled while writing. Drafts are excluded from public pages, search, RSS and sitemap.
4. Create the matching English entry using the exact same translationKey and choose en.
5. When both language versions are ready, turn off Keep as draft for both entries. The public content validator requires every published entry to have both language versions.
6. Wait for the GitHub Actions build and deployment to succeed.

The CMS saves files to GitHub; it does not bypass the site's content validation. If one language is published before its pair exists, the validation job will fail and the public deployment will not update until the pair is complete.

## Mathematics, code and images

- The article editor stores Markdown, not HTML.
- Use the editor's **Source** mode for all mathematical writing. The visual/WYSIWYG mode may normalize backslashes and damage LaTeX commands.
- Inline mathematics is enclosed by one dollar sign on each side.
- Display mathematics uses two dollar signs on each side. Put the opening and closing delimiters on separate lines, with the formula between them.
- Do not type a bare square bracket around equations. Use the dollar-sign math delimiters.
- After saving, check the preview. The build pipeline checks that KaTeX output exists on the core Chinese and English note pages.
- Use fenced code blocks for source code.
- Insert images through the editor's image/media control. Uploads are stored under public/uploads/images/ and served from /uploads/images/.
- PDFs and other documents can be uploaded through the media manager under public/uploads/documents/. For publication records, paste the resulting public path or an external URL into the PDF field.

## Editorial safety

- New entries default to draft.
- Do not mark a manuscript as published unless it has actually been published.
- Distinguish proofs, symbolic checks, numerical checks, conjectures and open problems.
- Keep private correspondence, credentials and confidential collaborator material out of this public Git repository.
- The CMS login is handled by Pages CMS and GitHub. Never put a GitHub token or private key in this repository.
