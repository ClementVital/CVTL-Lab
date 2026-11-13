// Vérifications post-build (utilisées par la CI) — zéro dépendance.
// - chaque page : <title>, meta description, canonical, un seul <h1>
// - aucun style="" ni <script> inline (CSP : script-src/style-src 'self')
// - tous les liens/ressources internes existent (y compris les ancres #id)
// - le sitemap ne référence que des pages existantes
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const pages = readdirSync(dist).filter((f) => f.endsWith('.html'));
const errors = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const idsOf = {};
const html = {};
for (const p of pages) {
  html[p] = readFileSync(join(dist, p), 'utf8');
  idsOf[p] = new Set([...html[p].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
}

for (const p of pages) {
  const h = html[p];
  if (!/<title>[^<]{5,}<\/title>/.test(h)) err(p, 'title manquant');
  if (!/<meta name="description" content="[^"]{20,}"/.test(h)) err(p, 'meta description manquante');
  if (!/<link rel="canonical" href="https:\/\/cvtllab\.fr\//.test(h)) err(p, 'canonical manquant');
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(p, `${h1} balise(s) <h1> (attendu : 1)`);
  if (/\sstyle="/.test(h)) err(p, 'attribut style="" inline interdit par la CSP');
  if (/<script(?![^>]*\ssrc=)(?![^>]*application\/ld\+json)[^>]*>/.test(h)) err(p, 'script inline interdit par la CSP');
  if (/\son(click|load|error|mouseover)=/.test(h)) err(p, 'gestionnaire inline interdit par la CSP');

  for (const m of h.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    const [path, hash] = ref.split('#');
    const file = path === '' ? p : path;
    if (!existsSync(resolve(dist, file))) { err(p, `lien cassé → ${ref}`); continue; }
    if (hash && file.endsWith('.html') && !idsOf[file]?.has(hash)) err(p, `ancre introuvable → ${ref}`);
  }
}

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
for (const m of sitemap.matchAll(/<loc>https:\/\/cvtllab\.fr\/([^<]*)<\/loc>/g)) {
  const f = m[1] || 'index.html';
  if (!existsSync(join(dist, f))) err('sitemap.xml', `URL inexistante → ${f}`);
}

if (errors.length) {
  console.error(`✘ ${errors.length} problème(s) :\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✔ Vérifications OK — ${pages.length} pages, liens/ancres/CSP valides.`);
