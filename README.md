# Yu Zhehao — Personal Observatory

A bilingual academic homepage and research notebook for Yu Zhehao, designed around physics, mathematics and AI.

Live site: https://ynotfound.github.io/

The complete Astro project is bundled in `avalon-observatory-v1.zip`. The GitHub Pages workflow unpacks the bundle, installs dependencies, runs the Astro check/build, and deploys the generated static site.

## Design

- Midnight blue, ivory and champagne gold.
- Chinese display typography with a Fangzheng Xiaobiao Song-style serif fallback stack; no proprietary font files are redistributed.
- Subtle orbital geometry and restrained Avalon-inspired details.
- Chinese and English routes, dark/light themes, responsive navigation and quick search.

## Local development

Download and extract `avalon-observatory-v1.zip`, enter the `avalon-observatory` directory, then run:

```bash
npm install
npm run dev
npm run check
npm run build
```

## Publish

The repository is `Ynotfound/ynotfound.github.io`. Set repository Settings → Pages → Build and deployment → Source to **GitHub Actions** if it is not configured automatically. Pushes to `main` trigger deployment.

## Editorial policy

- Add only verified publications, preprints and public project URLs.
- Distinguish proved results, numerical checks, conjectures and work in progress.
- Keep private or unpublished research, credentials, API keys and personal contact details off the public site.
- If embedding a licensed Fangzheng font file, verify that its licence permits public web distribution.
