# Yu Zhehao — Personal Observatory

A bilingual personal academic website for **Yu Zhehao**, bringing together physics, mathematics, AI, research notes and computational projects.

Live site: https://ynotfound.github.io/

## Design

- Midnight blue, ivory and champagne gold.
- Chinese display typography prioritizes a Fangzheng Xiaobiao Song-style serif stack, with system fallbacks. No proprietary font file is redistributed.
- Subtle orbital geometry and restrained Avalon-inspired details.
- Chinese/English switch, dark/light theme, responsive navigation and a Ctrl+K section search.

## Sections

- About
- Research directions
- Publications and preprints
- Notes and knowledge archive
- Research journal
- Projects and code
- Contact

Publication entries and contact details are intentionally conservative: add only verified public information. Distinguish proved results, numerical checks, conjectures and work in progress. Keep private manuscripts, credentials and API keys out of this public repository.

## Local preview

No build tool or package installation is required. Clone the repository and run a local static server:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deployment

GitHub Actions publishes the static site to GitHub Pages whenever a commit is pushed to `main`. The workflow is `.github/workflows/deploy.yml`.

Repository: https://github.com/Ynotfound/ynotfound.github.io
