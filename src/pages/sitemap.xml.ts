import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
export const GET: APIRoute = async () => {
  const staticPaths = ['', 'research/', 'research/feynman-periods/', 'publications/', 'notes/', 'reading/', 'journal/', 'projects/', 'about/', 'search/'];
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  const posts = await getCollection('journal', ({ data }) => !data.draft);
  const dynamicPaths = [...notes.map((entry) => 'notes/' + entry.slug + '/'), ...posts.map((entry) => 'journal/' + entry.slug + '/')];
  const urls = [...staticPaths, ...dynamicPaths].map((path) => '<url><loc>https://ynotfound.github.io/' + path + '</loc></url>').join('');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls + '</urlset>', { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
