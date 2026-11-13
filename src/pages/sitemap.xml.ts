import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (char) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
})[char] || char);

export const GET: APIRoute = async () => {
  const staticPaths = [
    '', 'research/', 'research/observatory/', 'publications/', 'notes/', 'reading/', 'journal/', 'projects/', 'about/', 'search/',
    'en/', 'en/research/', 'en/research/observatory/', 'en/publications/', 'en/notes/', 'en/reading/', 'en/journal/', 'en/projects/', 'en/about/', 'en/search/'
  ];
  const [notes, journal, research, publications, projects, references] = await Promise.all([
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('journal', ({ data }) => !data.draft),
    getCollection('research', ({ data }) => !data.draft),
    getCollection('publications', ({ data }) => !data.draft),
    getCollection('projects', ({ data }) => !data.draft),
    getCollection('references', ({ data }) => !data.draft)
  ]);
  const dynamic = [
    ...notes.map((entry) => ({ lang: entry.data.lang, route: 'notes/' + entry.data.translationKey + '/' })),
    ...journal.map((entry) => ({ lang: entry.data.lang, route: 'journal/' + entry.data.translationKey + '/' })),
    ...research.map((entry) => ({ lang: entry.data.lang, route: 'research/' + entry.data.translationKey + '/' })),
    ...publications.map((entry) => ({ lang: entry.data.lang, route: 'publications/' + entry.data.translationKey + '/' })),
    ...projects.map((entry) => ({ lang: entry.data.lang, route: 'projects/' + entry.data.translationKey + '/' })),
    ...references.map((entry) => ({ lang: entry.data.lang, route: 'reading/' + entry.data.translationKey + '/' }))
  ];
  const allPaths = [...staticPaths, ...dynamic.map((item) => (item.lang === 'en' ? 'en/' : '') + item.route)];
  const urls = [...new Set(allPaths)].map((route) => '<url><loc>' + escapeXml('https://ynotfound.github.io/' + route) + '</loc></url>').join('');
  const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls + '</urlset>';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
