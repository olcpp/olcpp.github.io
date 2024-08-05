import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Markdown from 'unplugin-vue-markdown/vite';
import MarkdownItAnchor from 'markdown-it-anchor';
import { katex as MarkdownItKatex } from '@mdit/plugin-katex';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
      },
      markdownItSetup(md) {
        md.use(MarkdownItAnchor, { permalink: MarkdownItAnchor.permalink.ariaHidden() });
        md.use(MarkdownItKatex);
      }
    })
  ],
  build: {
    rollupOptions: {
      external: './apps/*'
    }
  }
});
