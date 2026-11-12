import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const shared = {
  translationKey: z.string().min(1),
  lang: z.enum(['zh', 'en']).default('zh'),
  title: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  date: z.coerce.date(),
  draft: z.boolean().default(false)
};

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    ...shared, category: z.string(), updated: z.coerce.date().optional(), order: z.number().default(100)
  })
});
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({ ...shared })
});
const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    ...shared, category: z.string(),
    status: z.enum(['active', 'exploratory', 'paused', 'completed']),
    updated: z.coerce.date().optional(), featured: z.boolean().default(false)
  })
});
const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    ...shared,
    kind: z.enum(['journal-article', 'conference-paper', 'preprint', 'working-paper', 'thesis', 'other']),
    status: z.enum(['published', 'preprint', 'working-paper', 'draft', 'superseded']),
    authors: z.array(z.string()).default([]), year: z.number(),
    venue: z.string().optional(), doi: z.string().optional(), arxiv: z.string().optional(),
    pdf: z.string().optional(), supplementary: z.string().optional(), repository: z.string().url().optional()
  })
});
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    ...shared, category: z.string(),
    status: z.enum(['active', 'maintained', 'prototype', 'archived']),
    repository: z.string().url().optional(), homepage: z.string().url().optional(),
    featured: z.boolean().default(false)
  })
});
const references = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/references' }),
  schema: z.object({
    ...shared,
    kind: z.enum(['paper', 'book', 'software', 'repository', 'website', 'dataset', 'notes']),
    authors: z.array(z.string()).default([]), year: z.number().optional(),
    url: z.string().url(), doi: z.string().optional(), arxiv: z.string().optional()
  })
});
export const collections = { notes, journal, research, publications, projects, references };
