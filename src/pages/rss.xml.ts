import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const xmlEscape = (value: string) => value.replace(/[<>&'"]/g, (char) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
})[char] || char);

export const GET: APIRoute = async () => {
  const [notes, journal, research, researchUpdates, publications, projects] = await Promise.all([
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('journal', ({ data }) => !data.draft),
    getCollection('research', ({ data }) => !data.draft),
    getCollection('researchUpdates', ({ data }) => !data.draft),
    getCollection('publications', ({ data }) => !data.draft),
    getCollection('projects', ({ data }) => !data.draft)
  ]);
  const entries = [
    ...notes.map((entry) => ({ ...entry.data, route: 'notes/' + entry.data.translationKey + '/', kind: 'NOTE' })),
    ...journal.map((entry) => ({ ...entry.data, route: 'journal/' + entry.data.translationKey + '/', kind: 'JOURNAL' })),
    ...research.map((entry) => ({ ...entry.data, route: 'research/' + entry.data.translationKey + '/', kind: 'RESEARCH' })),
    ...researchUpdates.map((entry) => ({ ...entry.data, route: 'research/' + entry.data.projectKey + '/#update-' + entry.data.translationKey, kind: 'RESEARCH UPDATE' })),
    ...publications.map((entry) => ({ ...entry.data, route: 'publications/' + entry.data.translationKey + '/', kind: 'PUBLICATION' })),
    ...projects.map((entry) => ({ ...entry.data, route: 'projects/' + entry.data.translationKey + '/', kind: 'PROJECT' }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const items = entries.map((entry) => {
    const prefix = entry.lang === 'en' ? 'en/' : '';
    const url = 'https://ynotfound.github.io/' + prefix + entry.route;
    return '<item><title>' + xmlEscape(entry.title) + '</title><link>' + xmlEscape(url) + '</link><guid>' + xmlEscape(url) + '</guid><pubDate>' + entry.date.toUTCString() + '</pubDate><description>' + xmlEscape(entry.description) + '</description><category>' + xmlEscape(entry.kind) + '</category></item>';
  }).join('');
  const xml = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Yu Zhehao — Personal Observatory</title><link>https://ynotfound.github.io/</link><description>Research notes and field notes on physics, mathematics and AI.</description>' + items + '</channel></rss>';
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
