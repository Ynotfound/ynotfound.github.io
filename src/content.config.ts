import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(), title_en: z.string(), description: z.string(), description_en: z.string(),
    category: z.string(), tags: z.array(z.string()).default([]), date: z.coerce.date(),
    updated: z.coerce.date().optional(), order: z.number().default(100), draft: z.boolean().default(false)
  })
});
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(), title_en: z.string(), description: z.string(), description_en: z.string(),
    date: z.coerce.date(), tags: z.array(z.string()).default([]), draft: z.boolean().default(false)
  })
});
export const collections = { notes, journal };
