# Author Studio

The site has two distinct interfaces backed by one Git repository:

- **Pages CMS** is the GitHub-backed authoring interface for creating and editing content.
- **Author Preview** is a browser-local writing laboratory for testing Markdown, LaTeX, theorem environments, cross-references, BibTeX citations and exports.
- **Public Observatory** is the reader-facing website. Only entries committed to the content collections and marked as published appear there.

## Open the authoring tools

1. Visit https://app.pagescms.org/ and sign in with GitHub.
2. Open the repository Ynotfound/ynotfound.github.io.
3. Use Writing, Notes, Research, Publications, Projects or References to edit repository content.
4. Open https://ynotfound.github.io/author-preview/ for the separate split-pane academic preview.

Pages CMS writes Markdown and media files to GitHub. A successful GitHub Actions build republishes the public site.

## Article preview workspace

The Author Preview workspace runs in the browser. It auto-saves edited drafts to this browser's local storage, and lets you list, restore and delete up to 30 local drafts. It does not save drafts to a server, write to GitHub or publish content. It is marked noindex, but noindex is not access control; do not paste confidential material into a shared or public computer.

Features:

- Live Markdown and KaTeX preview.
- Debounced local autosave, a local draft list, restore and delete controls, plus Ctrl+S / Cmd+S to save immediately. Drafts remain in this browser only; export a source Markdown backup before switching browsers or devices.
- Automatic numbering for display equations and supported theorem-like environments.
- Cross-references using @ref{label}.
- BibTeX entries and citations using [@key] or [@key1; @key2].
- Download a reader-ready Markdown draft with frontmatter. The export resolves theorem labels, equation numbers, cross-references and citations into ordinary Markdown / KaTeX-compatible content for the public site.
- Download a separate source Markdown file that preserves the authoring directives for later editing in this preview workspace.
- Import an existing Markdown file (including exported frontmatter) or a separate BibTeX `.bib` file to continue editing.
- Export a XeLaTeX .tex source and a separate .bib file.
- Print the reader view and choose “Save as PDF” in the browser print dialog.

### Theorem-like environments

Write an environment as a fenced container:

~~~text
::: theorem id=thm:main title="Main theorem"
Statement of the theorem.

The body may contain Markdown and display mathematics.
:::
~~~

Supported names: theorem, lemma, proposition, corollary, definition, example, remark, and proof.

The theorem-family environments share a running counter in the preview. Definitions, examples and remarks have their own counters. Proofs are unnumbered.

### Equation labels and cross-references

Put a label inside a display equation:

~~~latex
$$
a^2+b^2=c^2.
\label{eq:pythagoras}
$$
~~~

Refer to it in prose with @ref{eq:pythagoras}. For a theorem or definition, use its declared ID, such as @ref{thm:main}.

### BibTeX citations

Paste real BibTeX records into the BibTeX Library panel. Cite them in the article body:

~~~text
The method is discussed in [@sample-key].
A comparison appears in [@key-one; @key-two].
~~~

The preview numbers citations in order of first appearance and builds a reference list. Missing keys are shown as warnings. Replace the example placeholder with verified bibliographic data before exporting or publishing.

### Export

- **Reader Markdown**: creates a draft file with draft: true and converts custom theorem / reference syntax into content the public Astro reader can render.
- **Source Markdown**: preserves the authoring directives and is intended for re-opening in this preview workspace, not direct publication.
- **Import**: load an existing `.md` / `.markdown` file into the editor, or import a `.bib` file into the BibTeX Library. Imported edits are also saved to the local draft vault.
- **LaTeX**: creates a .tex source using the ctexart class, suitable for XeLaTeX. It supports common headings, paragraphs, lists, block quotes, code fences, display equations, theorem containers, cross-references and citations. Review complex tables, figures, custom macros and advanced environments manually before submission.
- **BibTeX**: exports the contents of the BibTeX Library to a separate .bib file.
- **PDF**: use the browser print dialog and choose “Save as PDF”. This prints the reader preview; it is not a TeX compilation.

For a TeX document with citations, put the exported .tex and .bib files in the same directory and run:

~~~bash
xelatex article.tex
bibtex article
xelatex article.tex
xelatex article.tex
~~~

## Publishing an article

1. In Pages CMS, open **Writing → Articles & Journal** or **Notes**.
2. Create a Chinese entry with a stable translationKey, for example my-first-essay, and choose zh.
3. Keep **Keep as draft** enabled while writing.
4. Create the matching English entry using the exact same translationKey and choose en.
5. Download the reader-ready Markdown export and paste it into the CMS Source editor. Keep the separate source Markdown file as your editable working copy. The Author Preview workspace is a preview/export helper; it does not directly write into Pages CMS.
6. When both language versions are ready, turn off **Keep as draft** for both entries.
7. Wait for GitHub Actions to validate and deploy the site.

The public content validator requires every public entry to have both language versions. If one language is published before its pair exists, validation fails and deployment is blocked until the pair is complete.

## Mathematics, code and images

- Use the CMS **Source** mode for mathematical writing. The visual/WYSIWYG mode may normalize backslashes and damage LaTeX commands.
- Inline mathematics uses single-dollar delimiters: $...$.
- Display mathematics uses double-dollar delimiters on separate lines: $$...$$.
- Use fenced code blocks for source code.
- Upload images through the CMS media control. They are stored under public/uploads/images/ and served from /uploads/images/.
- PDFs and other documents can be uploaded under public/uploads/documents/. Add the resulting public path or external URL to the relevant publication field.

## Editorial safety

- Draft entries are excluded from public pages, search, RSS and sitemap.
- Do not mark a manuscript as published unless it has actually been published.
- Distinguish proofs, symbolic checks, numerical checks, conjectures and open problems.
- Keep credentials, private correspondence and confidential collaborator material out of this public Git repository.
- Never put GitHub tokens or private keys in the repository.
