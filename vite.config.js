import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],

  // './' emits RELATIVE asset URLs (./assets/index-abc.js) instead of
  // absolute ones (/assets/index-abc.js).
  //
  // This matters on GitHub Pages. A project site is served from
  // https://<user>.github.io/<repo>/, so an absolute /assets/... resolves to
  // https://<user>.github.io/assets/... — the wrong place, and you get a blank
  // white page with 404s in the console. That's the single most common
  // "my Vite app doesn't work on Pages" failure.
  //
  // A relative base sidesteps it entirely: the same dist/ folder works at a
  // repo sub-path, at a user/org root site, behind a custom domain, and from
  // a local file:// open. You never have to hard-code the repo name, and
  // renaming the repo doesn't break the deploy.
  //
  // The one thing relative base can't support is client-side routing on real
  // paths (/about, /services). This diagram uses no routing at all — and if
  // you add the deep-linking described in the README, that's hash-based
  // (#event-stream), which works fine here.
  base: './'
});
