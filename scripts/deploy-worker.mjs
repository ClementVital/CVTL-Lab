// Génère un Worker autonome qui embarque dist/ (déploiement direct, sans l'API assets).
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
const dist = process.argv[2], out = process.argv[3];
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const files = {};
(function walk(d, base = '') {
  for (const f of readdirSync(d)) {
    const p = join(d, f), key = base + '/' + f;
    if (statSync(p).isDirectory()) { walk(p, key); continue; }
    const ext = extname(f), bin = ['.png', '.ico'].includes(ext);
    files[key] = { t: types[ext] || 'application/octet-stream', b: bin, d: readFileSync(p).toString(bin ? 'base64' : 'utf8') };
  }
})(dist);
const code = `const FILES = ${JSON.stringify(files)};
const dec = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const SEC = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'x-frame-options': 'SAMEORIGIN', 'permissions-policy': 'camera=(), microphone=(), geolocation=()', 'strict-transport-security': 'max-age=31536000' };
const respond = (k, status = 200, method = 'GET') => {
  const f = FILES[k];
  const h = new Headers({ 'content-type': f.t, 'cache-control': /\\.(png|ico|svg)$/.test(k) ? 'public, max-age=86400' : 'public, max-age=0, must-revalidate', ...SEC });
  const body = method === 'HEAD' ? null : f.b ? dec(f.d) : f.d;
  return new Response(body, { status, headers: h });
};
export default {
  async fetch(req) {
    if (!['GET', 'HEAD'].includes(req.method)) return new Response('Method Not Allowed', { status: 405 });
    let p = decodeURIComponent(new URL(req.url).pathname);
    if (p.endsWith('/')) p += 'index.html';
    if (FILES[p]) return respond(p, 200, req.method);
    if (FILES[p + '.html']) return respond(p + '.html', 200, req.method);
    return respond('/404.html', 404, req.method);
  },
};
`;
writeFileSync(out, code);
console.log('worker.js', (code.length / 1024).toFixed(0), 'Ko,', Object.keys(files).length, 'fichiers');
