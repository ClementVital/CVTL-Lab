// Build statique CVTL Lab — zéro dépendance.
// Usage : node scripts/build.mjs  →  dist/
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { home, servicePage, zonePage, legalPage, simplePage } from './pages.mjs';
import { SITE } from './templates.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const read = (p) => readFileSync(join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const write = (name, content) => {
  const f = join(dist, name);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, content);
};

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// 1. Assets statiques (public/ → dist/ racine)
cpSync(join(root, 'public'), dist, { recursive: true });

// 2. CSS / JS (copie ; minification légère sans dépendance)
const minCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/ ?([{};]) ?/g, '$1')
    .replace(/;}/g, '}')
    .trim();
write('css/main.css', minCss(read('src/css/main.css')));
for (const f of readdirSync(join(root, 'src/js'))) cpSync(join(root, 'src/js', f), join(dist, 'js', f));

// 3. Pages
const services = json('content/services.json');
const ld = json('content/home.jsonld.json');
const legal = json('content/legal.json');

write('index.html', home(services, ld));
for (const s of services) write(`${s.slug}.html`, servicePage(s, services));
write('services-numeriques-bordeaux-gironde.html', zonePage(services));
write('mentions-legales.html', legalPage('mentions-legales', legal['mentions-legales'], services));
write('confidentialite.html', legalPage('confidentialite', legal['confidentialite'], services));
write(
  'merci.html',
  simplePage({
    slug: 'merci', title: 'Merci | CVTL Lab', description: 'Confirmation d’envoi de votre demande à CVTL Lab.',
    eyebrow: 'Message envoyé', h1: 'Merci pour votre demande.',
    lead: 'Votre message a bien été transmis. Je pourrai revenir vers vous à partir des coordonnées indiquées dans le formulaire.',
    robots: 'noindex, nofollow', services,
  }),
);
write(
  '404.html',
  simplePage({
    slug: '404', title: 'Page introuvable | CVTL Lab', eyebrow: 'Erreur 404', h1: 'Cette page n’existe pas.',
    lead: 'Le contenu demandé a peut-être été déplacé ou l’adresse est incorrecte.', robots: 'noindex, follow', services, big: '404',
  }),
);

// 4. Sitemap (lastmod = date du build)
const today = new Date().toISOString().slice(0, 10);
const urls = ['', ...services.map((s) => `${s.slug}.html`), 'services-numeriques-bordeaux-gironde.html'];
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url>\n    <loc>${SITE.url}/${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
    .join('\n')}\n</urlset>\n`,
);

// 5. Rapport
let total = 0;
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : (total += statSync(p).size);
  }
})(dist);
console.log(`✔ Build OK — ${urls.length + 4} pages, ${(total / 1024).toFixed(0)} Ko → dist/`);
