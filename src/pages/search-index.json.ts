import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const [notes, journal, research, publications, projects, references] = await Promise.all([
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('journal', ({ data }) => !data.draft),
    getCollection('research', ({ data }) => !data.draft),
    getCollection('publications', ({ data }) => !data.draft),
    getCollection('projects', ({ data }) => !data.draft),
    getCollection('references', ({ data }) => !data.draft)
  ]);

  const index = [
    ...notes.map((entry) => ({ kind: 'NOTE', lang: entry.data.lang, title: entry.data.title, description: entry.data.description, tags: entry.data.tags.join(' '), body: entry.body, url: (entry.data.lang === 'en' ? '/en' : '') + '/notes/' + entry.data.translationKey + '/' })),
    ...journal.map((entry) => ({ kind: 'JOURNAL', lang: entry.data.lang, title: entry.data.title, description: entry.data.description, tags: entry.data.tags.join(' '), body: entry.body, url: (entry.data.lang === 'en' ? '/en' : '') + '/journal/' + entry.data.translationKey + '/' })),
    ...research.map((entry) => ({ kind: 'RESEARCH', lang: entry.data.lang, title: entry.data.title, description: entry.data.description, tags: entry.data.tags.join(' '), body: entry.body, url: (entry.data.lang === 'en' ? '/en' : '') + '/research/' + entry.data.translationKey + '/' })),
    ...publications.map((entry) => ({ kind: 'PUBLICATION', lang: entry.data.lang, title: entry.data.title, description: entry.data.description, tags: entry.data.tags.join(' '), body: entry.body, url: (entry.data.lang === 'en' ? '/en' : '') + '/publications/' + entry.data.translationKey + '/' })),
    ...projects.map((entry) => ({ kind: 'PROJECT', lang: entry.data.lang, title: entry.data.title, description: entry.data.description, tags: entry.data.tags.join(' '), body: entry.body, url: (entry.data.lang === 'en' ? '/en' : '') + '/projects/' + entry.data.translationKey + '/' })),
    ...references.map((entry) => ({ kind: 'REFERENCE', lang: entry.data.lang, title: entry.data.title, description: entry.data.description, tags: entry.data.tags.join(' '), body: entry.body, url: (entry.data.lang === 'en' ? '/en' : '') + '/reading/' + entry.data.translationKey + '/' }))
  ];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300' }
  });
};
