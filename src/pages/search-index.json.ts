import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
export const GET: APIRoute = async () => {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  const journal = await getCollection('journal', ({ data }) => !data.draft);
  const index = [
    ...notes.map((entry) => ({ kind: 'NOTE', title: entry.data.title, description: entry.data.description, tags: entry.data.tags.join(' '), body: entry.body, url: '/notes/' + entry.slug + '/' })),
    ...journal.map((entry) => ({ kind: 'JOURNAL', title: entry.data.title, description: entry.data.description, tags: entry.data.tags.join(' '), body: entry.body, url: '/journal/' + entry.slug + '/' })),
    { kind: 'RESEARCH', title: 'Feynman integrals and periods', description: 'Geometry, graph topology, differential equations and renormalization.', tags: 'Feynman periods QFT geometry Symanzik', body: 'banana graph Picard Fuchs monodromy UV forests', url: '/research/feynman-periods/' }
  ];
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
