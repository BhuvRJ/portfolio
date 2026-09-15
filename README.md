# bhuvanrj.me/portfolio

Static site, no build step for the HTML. Served by GitHub Pages at https://bhuvanrj.me/portfolio/.

## After editing content

```
node scripts/build.js
```

Regenerates `llms.txt`, `llms-full.txt`, `data.json`, `sitemap.xml` from the HTML, and copies `llms.txt` into `../BhuvRJ.github.io` (the domain-root repo) if it is checked out. Commit the generated files.

`robots.txt` lives in the domain-root repo, not here: search engines only read it at `https://bhuvanrj.me/robots.txt`.
