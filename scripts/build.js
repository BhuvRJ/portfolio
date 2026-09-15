#!/usr/bin/env node
// Generates machine-readable views of the site from the HTML source:
//   llms.txt        short index for AI agents (https://llmstxt.org)
//   llms-full.txt   whole site flattened to markdown in one file
//   data.json       same content as structured JSON
//   sitemap.xml     for search engines
// Run `node scripts/build.js` before committing content changes.
// No dependencies. Uses regex on the site's own markup conventions.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://bhuvanrj.me/portfolio/';
const ROOT_SITE = path.resolve(ROOT, '..', 'BhuvRJ.github.io'); // domain root repo, gets a copy of llms.txt

const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const abs = (href) => /^(https?:|mailto:)/.test(href) ? href : new URL(href, BASE).href;

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&middot;': '·', '&nbsp;': ' ', '&copy;': '©' };
function decode(s) {
  return s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).replace(/&[a-z]+;/g, (m) => ENT[m] || m);
}
function text(html) {
  return decode(html.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '')).replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim();
}
// inline html -> markdown (links, code, em/strong)
function md(html) {
  return decode(
    html
      .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, h, t) => `[${t.replace(/<[^>]+>/g, '')}](${abs(h)})`)
      .replace(/<code>([\s\S]*?)<\/code>/g, '`$1`')
      .replace(/<(em|i)>([\s\S]*?)<\/\1>/g, '*$2*')
      .replace(/<(strong|b)>([\s\S]*?)<\/\1>/g, '**$2**')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]+>/g, '')
  ).replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim();
}
function all(html, re) { const out = []; let m; while ((m = re.exec(html))) out.push(m); return out; }
function block(html, cls, tag = '[a-z0-9]+') {
  const m = html.match(new RegExp(`<(${tag}) class="${cls}"[^>]*>([\\s\\S]*?)<\\/\\1>`));
  return m ? m[2] : '';
}
function blocks(html, cls, tag = '[a-z0-9]+') {
  return all(html, new RegExp(`<(${tag}) class="${cls}"[^>]*>([\\s\\S]*?)<\\/\\1>`, 'g')).map((m) => m[2]);
}
function links(html) {
  return all(html, /<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g).map((m) => ({ label: text(m[2]), url: abs(m[1]) }));
}
function paragraphs(html) { return all(html, /<p[^>]*>([\s\S]*?)<\/p>/g).map((m) => md(m[1])).filter(Boolean); }
function lastmod(f) {
  try { return execSync(`git log -1 --format=%cs -- "${f}"`, { cwd: ROOT }).toString().trim() || today(); } catch { return today(); }
}
function today() { return new Date().toISOString().slice(0, 10); }

// ---------- Now (index.html) ----------
const indexHtml = read('index.html');
const nowBlurb = block(indexHtml, 'now-blurb', 'section');
const now = {
  asOf: text(block(nowBlurb, 'now-label', 'div')),
  text: paragraphs(nowBlurb).join('\n\n'),
  links: links(nowBlurb),
};
function parseItem(li) {
  const techRaw = text(block(li, 'project-tech', 'p'));
  // trailing date: "Feb 2026", "Aug–Nov 2025", "Summer 2025", or bare "2023"
  const dateMatch = techRaw.match(/(?:^|\s)((?:[A-Z][a-z]{2,8}(?:–[A-Z][a-z]{2,8})? )?\d{4})$/);
  return {
    name: text(block(li, 'project-name', 'h3')),
    tagline: md(block(li, 'project-tagline', 'p')),
    description: paragraphs(block(li, 'project-desc', 'div') || block(li, 'project-desc', 'p')).join('\n\n'),
    tech: dateMatch ? techRaw.slice(0, dateMatch.index).trim() : techRaw,
    date: dateMatch ? dateMatch[1] : undefined,
    install: text(block(li, 'project-install-cmd', 'span')).replace(/Copy$/, '').trim() || undefined,
    links: links(block(li, 'project-links-header', 'p') + block(li, 'project-links', 'p')),
  };
}
const recent = blocks(indexHtml, 'recent-item', 'li').map(parseItem);

// ---------- About ----------
const aboutHtml = read('about.html');
const about = {
  intro: paragraphs(block(aboutHtml, 'about-intro', 'section')).join('\n\n'),
  work: blocks(aboutHtml, 'about-work-entry', 'div').map((w) => ({
    company: text(block(w, 'about-work-company', 'strong')),
    role: text(block(w, 'essay-date', 'span')),
    description: md(block(w, 'about-work-desc', 'p')),
  })),
  influences: all(block(aboutHtml, 'reading-list', 'ul'), /<li>([\s\S]*?)<\/li>/g).map((m) => text(m[1])),
  contact: links(block(aboutHtml, 'contact-section', 'section')),
};

// ---------- Projects ----------
const projectsHtml = read('projects.html');
const projectsIntro = md(block(projectsHtml, 'projects-intro', 'p'));
const projects = blocks(projectsHtml, 'project-item', 'li').map(parseItem);

// ---------- Essays ----------
const essaysHtml = read('essays.html');
const essays = blocks(essaysHtml, 'essay-item', 'li').map((li) => {
  const href = li.match(/href="([^"]+)"/)[1];
  const page = read(href);
  const body = block(page, 'essay-body', 'div');
  const bodyMd = body
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_, c) => `\n\`\`\`\n${decode(c)}\n\`\`\`\n`)
    .replace(/<h2>([\s\S]*?)<\/h2>/g, (_, t) => `\n### ${md(t)}\n`)
    .replace(/<hr\s*\/?>/g, '')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (_, p) => `\n${md(p)}\n`)
    .replace(/<[^>]+>/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n').trim();
  return {
    title: text(block(li, 'essay-title', 'span')),
    url: abs(href),
    date: text(block(li, 'essay-date', 'span')),
    tag: text(block(li, 'essay-tag', 'span')),
    summary: text(block(li, 'essay-meta', 'div').replace(/<span class="essay-tag">[\s\S]*?<\/span>/, '')),
    body: bodyMd,
  };
});

// ---------- Assemble ----------
const person = {
  name: 'Bhuvan Rajanahally Jayakumar',
  shortName: 'Bhuvan R J',
  role: 'Graduate Student, Computer Science, University of Southern California',
  email: 'rajanaha@usc.edu',
  url: BASE,
  github: 'https://github.com/BHUVAN-RJ',
  linkedin: 'https://www.linkedin.com/in/bhuvan-rajanahally-jayakumar',
  resume: abs('assets/Bhuvan_Rajanahally_Jayakumar_Resume.pdf'),
};
const pages = [
  { file: 'index.html', title: 'Now', summary: 'What I am working on right now, plus two recent projects.' },
  { file: 'about.html', title: 'About', summary: 'Bio, work history, and influences.' },
  { file: 'projects.html', title: 'Projects', summary: `All ${projects.length} projects with descriptions, tech, and links.` },
  { file: 'essays.html', title: 'Essays', summary: 'Index of essays.' },
  ...essays.map((e) => ({ file: new URL(e.url).pathname.split('/').pop(), title: e.title, summary: e.summary })),
];

const data = { generated: new Date().toISOString(), site: BASE, person, now, recent, about, projects, essays, pages: pages.map((p) => ({ title: p.title, url: abs(p.file), summary: p.summary })) };
fs.writeFileSync(path.join(ROOT, 'data.json'), JSON.stringify(data, null, 2) + '\n');

const fmtLinks = (ls) => ls.map((l) => `[${l.label}](${l.url})`).join(' · ');
const fmtProject = (p) => [
  `### ${p.name}${p.date ? ` (${p.date})` : ''}`,
  `*${p.tagline}*`,
  p.description,
  p.tech && `**Tech:** ${p.tech}`,
  p.install && `**Install:** \`${p.install}\``,
  p.links.length && `**Links:** ${fmtLinks(p.links)}`,
].filter(Boolean).join('\n\n');

const llms = `# ${person.shortName}

> Personal site of ${person.name}, ${person.role}. Builds things that run in the real world: on-device TTS in the browser, MCP tooling for AI agents, computer vision on real hardware.

Contact: ${person.email} · [GitHub](${person.github}) · [LinkedIn](${person.linkedin})

## Pages

${pages.map((p) => `- [${p.title}](${abs(p.file)}): ${p.summary}`).join('\n')}

## Machine-readable

- [llms-full.txt](${abs('llms-full.txt')}): entire site as one markdown file. Fetch this instead of the HTML pages.
- [data.json](${abs('data.json')}): same content as structured JSON (person, now, projects, essays, about).
- [Resume (PDF)](${person.resume})
`;
fs.writeFileSync(path.join(ROOT, 'llms.txt'), llms);
if (fs.existsSync(ROOT_SITE)) fs.writeFileSync(path.join(ROOT_SITE, 'llms.txt'), llms);

const full = `# ${person.shortName}

${person.name} · ${person.role}
Site: ${BASE} · Email: ${person.email} · GitHub: ${person.github} · LinkedIn: ${person.linkedin} · Resume: ${person.resume}

This file is the whole site flattened to markdown. Generated ${today()} from the HTML source. Structured version: ${abs('data.json')}

---

## Now (${now.asOf})

${now.text}

${fmtLinks(now.links)}

### Recent

${recent.map(fmtProject).join('\n\n')}

---

## About

${about.intro}

### Work

${about.work.map((w) => `**${w.company}**, ${w.role}\n\n${w.description}`).join('\n\n')}

### Things that shaped how I think

${about.influences.map((i) => `- ${i}`).join('\n')}

---

## Projects

${projectsIntro}

${projects.map(fmtProject).join('\n\n')}

---

## Essays

${essays.map((e) => `- [${e.title}](${e.url}) (${e.date}, ${e.tag}): ${e.summary}`).join('\n')}

${essays.map((e) => `### ${e.title}\n\n*${e.date} · ${e.tag}* · ${e.url}\n\n${e.body}`).join('\n\n---\n\n')}
`;
fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), full);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url>\n    <loc>${abs(p.file === 'index.html' ? '' : p.file)}</loc>\n    <lastmod>${lastmod(p.file)}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

console.log(`ok: ${projects.length} projects, ${essays.length} essays, ${pages.length} pages -> llms.txt, llms-full.txt, data.json, sitemap.xml${fs.existsSync(ROOT_SITE) ? ' (+ root llms.txt)' : ''}`);
