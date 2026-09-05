# Client Experience Architecture

The published site for Connected Services BC's client experience architecture:
what CSBC has committed to, the principles behind it, and four architectural
models for delivering it.

Live at the GitHub Pages URL for this repository.

## This repository holds output, not source

Everything here is generated. `index.html` and `assets/` are the built site;
editing them by hand works until the next build overwrites it.

The source — the Svelte application, the content build, and the architecture
corpus it renders — lives in a separate repository. Changes go there, and the
built output is copied here.

## Deploying

`.github/workflows/deploy.yml` publishes on every push to `main`, and can be
run by hand from the Actions tab. There is no build step: the workflow uploads
the checkout as it stands.

`.nojekyll` is there to stop GitHub Pages running the files through Jekyll,
which would drop anything under a directory beginning with an underscore.
