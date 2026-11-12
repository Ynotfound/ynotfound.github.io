import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const roots = ['notes', 'journal', 'research', 'publications', 'projects', 'references'];
const failures = [];

async function markdownFiles(directory) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch { return []; }
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

for (const collection of roots) {
  const files = await markdownFiles(path.join('src', 'content', collection));
  const translations = new Map();
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!frontmatter) { failures.push(file + ': missing YAML frontmatter'); continue; }
    const text = frontmatter[1];
    const value = (key) => text.match(new RegExp('^' + key + ':\\s*(.+)$', 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, '');
    if (value('draft') === 'true') continue;
    const key = value('translationKey');
    const lang = value('lang') || 'zh';
    if (!key) { failures.push(file + ': missing translationKey'); continue; }
    if (!['zh', 'en'].includes(lang)) { failures.push(file + ': lang must be zh or en'); continue; }
    const set = translations.get(key) || new Set();
    if (set.has(lang)) failures.push(collection + '/' + key + ': duplicate ' + lang + ' translation');
    set.add(lang);
    translations.set(key, set);
  }
  for (const [key, langs] of translations) {
    for (const lang of ['zh', 'en']) {
      if (!langs.has(lang)) failures.push(collection + '/' + key + ': missing ' + lang + ' translation');
    }
  }
}

if (failures.length) {
  console.error('Content validation failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('Content validation passed: every public entry has a zh/en pair.');
