import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
const xmlEscape = (value: string) => value.replace(/[<>&'"]/g, (char) => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' })[char] || char);
export const GET: APIRoute = async () => {
  const notes = await getCollection('notes', ({ data }) => !data.draft), posts = await getCollection('journal', ({ data }) => !data.draft);
  const entries = [...notes.map((entry) => ({ ...entry, url: 'notes/' + entry.slug + '/' })), ...posts.map((entry) => ({ ...entry, url: 'journal/' + entry.slug + '/' }))].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const items = entries.map((entry) => '<item><title>' + xmlEscape(entry.data.title) + '</title><link>https://ynotfound.github.io/' + entry.url + '</link><guid>https://ynotfound.github.io/' + entry.url + '</guid><pubDate>' + entry.data.date.toUTCString() + '</pubDate><description>' + xmlEscape(entry.data.description) + '</description></item>').join('');
  const xml = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Yu Zhehao — Personal Observatory</title><link>https://ynotfound.github.io/</link><description>Research notes and field notes on physics, mathematics and AI.</description>' + items + '</channel></rss>';
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
