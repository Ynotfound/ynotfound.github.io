import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const required = [
  'index.html', 'en/index.html',
  'research/index.html', 'research/observatory/index.html', 'en/research/index.html', 'en/research/observatory/index.html',
  'publications/index.html', 'en/publications/index.html',
  'notes/index.html', 'en/notes/index.html',
  'notes/feynman-periods/index.html', 'en/notes/feynman-periods/index.html',
  'notes/complex-analysis/index.html', 'en/notes/complex-analysis/index.html',
  'notes/qft-renormalization/index.html', 'en/notes/qft-renormalization/index.html',
  'journal/index.html', 'en/journal/index.html',
  'projects/index.html', 'en/projects/index.html',
  'reading/index.html', 'en/reading/index.html',
  'about/index.html', 'en/about/index.html',
  'search/index.html', 'en/search/index.html',
  'search-index.json', 'sitemap.xml', 'rss.xml', 'cursor.png'
];

const failures = [];
for (const file of required) {
  try { await access(path.join(root, file)); }
  catch { failures.push('Missing generated output: ' + file); }
}

const mathPages = [
  'notes/feynman-periods/index.html', 'en/notes/feynman-periods/index.html',
  'notes/complex-analysis/index.html', 'en/notes/complex-analysis/index.html',
  'notes/qft-renormalization/index.html', 'en/notes/qft-renormalization/index.html'
];
for (const file of mathPages) {
  try {
    const html = await readFile(path.join(root, file), 'utf8');
    if (!html.includes('katex-display') || !html.includes('class="katex"')) {
      failures.push(file + ': expected KaTeX-rendered display mathematics was not found');
    }
  } catch {
    failures.push('Could not inspect rendered mathematics in ' + file);
  }
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

for (const file of await htmlFiles(root)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/href=["']([^"'#]+)["']/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(href) || href.startsWith('//')) continue;
    const pathname = decodeURIComponent(href.split(/[?#]/)[0]);
    if (!pathname.startsWith('/')) continue;
    const target = path.join(root, pathname.replace(/^\/+/, ''));
    const candidates = pathname.endsWith('/')
      ? [path.join(target, 'index.html')]
      : [target, path.join(target, 'index.html'), target + '.html'];
    let found = false;
    for (const candidate of candidates) {
      try { await access(candidate); found = true; break; } catch {}
    }
    if (!found) failures.push(path.relative(root, file) + ': broken internal link ' + href);
  }
}

if (failures.length) {
  console.error('Build validation failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('Build validation passed: routes, feeds, cursor asset, KaTeX-rendered mathematics and internal links exist.');
