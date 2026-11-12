# Yu Zhehao — Personal Observatory

A bilingual personal academic website for **Yu Zhehao**, bringing together theoretical physics, mathematics, AI, research manuscripts, notes, reading references and software projects.

**Live site:** https://ynotfound.github.io/  
**Repository:** https://github.com/Ynotfound/ynotfound.github.io

## Design

- Midnight blue, ivory and champagne gold.
- Chinese display typography prioritizes a Fangzheng Xiaobiaosong-style serif stack with system fallbacks. No proprietary font files are redistributed.
- Restrained Excalibur-inspired sword mark and custom desktop pointer, with a short gold/blue particle trail.
- Interactive orbital field, bilingual content, persistent light/dark preference and responsive navigation.

## Sections

- About
- Research directions
- Publications and research manuscripts
- Notes and knowledge archive
- Reading and references
- Research journal
- Projects and code
- Contact

## Implementation

The current live version is a dependency-free static site:

- `index.html` — page structure, styling and client-side interactions
- `404.html` — custom not-found page
- `robots.txt` and `sitemap.xml` — basic indexing metadata
- `.github/workflows/deploy.yml` — GitHub Pages deployment

There is no build step or package installation required. The site is currently a single-page experience with anchored sections; the Markdown-driven multi-article publishing system is a future enhancement, not something this version claims to provide.

## Local preview

Clone the repository and run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deployment

Pushes to `main` trigger GitHub Actions. The workflow copies the static files into the Pages artifact and deploys them to GitHub Pages.

If Pages is not configured yet, open repository Settings → Pages and set the source to **GitHub Actions**.

## Editorial policy

- Distinguish published papers, preprints and working manuscripts.
- Add only verified public project links and document states.
- Distinguish proved results, numerical checks, conjectures and work in progress.
- Do not expose private manuscripts, credentials, API keys or personal contact details.
- The listed Feynman-period manuscript is labelled as a working manuscript, not as a published paper or arXiv preprint.
- The Fate-Palimpsest entry describes a non-commercial prototype using original placeholder assets; it does not redistribute official Fate artwork, music, models or voice assets.
