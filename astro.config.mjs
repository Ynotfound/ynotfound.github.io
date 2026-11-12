import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
  site: 'https://ynotfound.github.io',
  markdown: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] },
  build: { format: 'directory' }
});
