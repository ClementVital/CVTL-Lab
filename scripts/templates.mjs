// Composants HTML partagés — CVTL Lab
// Aucune dépendance : de simples fonctions qui retournent des chaînes.

export const SITE = {
  url: 'https://cvtllab.fr',
  name: 'CVTL Lab',
  email: 'contact@cvtllab.fr',
  formAction: 'https://formsubmit.co/928df765256a9be5fb497d9061a75d21',
  formNext: 'https://cvtllab.fr/merci.html',
};

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Logo vectoriel : 3 faces + puce bleue (viewBox 390×500, géométrie d'origine). */
export const logo = (cls = '') => `<svg class="logo ${cls}" viewBox="0 0 390 500" aria-hidden="true" focusable="false">
<polygon class="lf lf-a" pathLength="1" points="312,91 199,25 45,118 157,182"/>
<polygon class="lf lf-b" pathLength="1" points="28,140 27,384 142,451 142,206"/>
<polygon class="lf lf-c" pathLength="1" points="339,405 259,359 163,415 163,465 201,486"/>
<polygon class="lc" pathLength="1" points="217,224 216,323 313,323 313,224"/>
</svg>`;

/** Icônes de service — tracés « line » animables (pathLength=1). */
export const ICONS = {
  web: '<rect x="6" y="9" width="36" height="30" rx="4" pathLength="1"/><path pathLength="1" d="M6 18h36M13 13.5h.01M18 13.5h.01M14 26h12M14 32h20"/>',
  tool: '<rect x="7" y="7" width="15" height="15" rx="3" pathLength="1"/><rect x="26" y="7" width="15" height="9" rx="3" pathLength="1"/><rect x="26" y="20" width="15" height="21" rx="3" pathLength="1"/><rect x="7" y="26" width="15" height="15" rx="3" pathLength="1"/>',
  auto: '<path pathLength="1" d="M27 5 11 27h11l-2 16 17-23H26z"/>',
  ai: '<path pathLength="1" d="m21 7 4.2 12.8L38 24l-12.8 4.2L21 41l-4.2-12.8L4 24l12.8-4.2z" transform="translate(2 -1)"/><path pathLength="1" d="m38 5 1.4 4.6L44 11l-4.6 1.4L38 17l-1.4-4.6L32 11l4.6-1.4z"/>',
  domain: '<rect x="5" y="11" width="38" height="26" rx="4" pathLength="1"/><path pathLength="1" d="m7 15 17 13 17-13"/>',
  audit: '<path pathLength="1" d="M24 5 39 10.5v11C39 31 33 38.5 24 43 15 38.5 9 31 9 21.5v-11z"/><path pathLength="1" d="m17 24 5 5 9-10"/>',
};
export const icon = (key) =>
  `<svg class="icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[key]}</svg>`;

export const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

const CSP =
  "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; form-action https://formsubmit.co; base-uri 'self'; object-src 'none'; upgrade-insecure-requests";

export function head({ page = '', title, description, path, robots = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1', ld = '', og = true, ogDescription }) {
  const url = `${SITE.url}/${path}`.replace(/\/index\.html$/, '/');
  const share = `${SITE.url}/share-card.png`;
  const ogd = ogDescription || description;
  return `<!DOCTYPE html>
<html class="no-js" lang="fr"${page ? ` data-page="${page}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#000000">
<meta name="color-scheme" content="light">
<meta name="robots" content="${robots}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<link rel="canonical" href="${url}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32x32.png" sizes="32x32" type="image/png">
<link rel="icon" href="favicon-16x16.png" sizes="16x16" type="image/png">
<link rel="shortcut icon" href="favicon.ico">
<link rel="apple-touch-icon" href="apple-touch-icon.png" sizes="180x180">
${og ? `<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(ogd)}">
<meta property="og:image" content="${share}">
<meta property="og:image:secure_url" content="${share}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="CVTL Lab, solutions numériques sur mesure à Bordeaux et en Gironde">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CVTL Lab">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(ogd)}">
<meta name="twitter:image" content="${share}">
<meta name="twitter:image:alt" content="CVTL Lab, solutions numériques sur mesure à Bordeaux et en Gironde">` : ''}
${ld}
<link rel="stylesheet" href="css/main.css">
<script src="js/boot.js"></script>
</head>`;
}

const NAV = [
  ['services', 'Services'],
  ['tarifs', 'Sans abonnement'],
  ['methode', 'Méthode'],
  ['apropos', 'À propos'],
];

export function header({ home }) {
  const base = home ? '' : 'index.html';
  const links = NAV.map(([id, label]) => `<a href="${base}#${id}" data-nav="${id}">${label}</a>`).join('');
  const cta = `<a class="nav-cta" href="${base}#contact" data-magnetic>Parler de mon projet</a>`;
  return `<a class="skip-link" href="#contenu">Aller au contenu</a>
<div class="progress" aria-hidden="true"><span></span></div>
<header class="site-header" id="siteHeader" data-theme="dark">
<div class="nav-pill">
<a class="brand" id="brand" href="${home ? '#accueil' : 'index.html'}" aria-label="CVTL Lab, accueil">${logo('brand-logo')}<span class="brand-name">CVTL Lab</span></a>
<nav class="nav-links" aria-label="Navigation principale">${links}</nav>
${cta}
<button class="menu-toggle" id="menuToggle" type="button" aria-controls="mobileMenu" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span></button>
</div>
</header>
<div class="mobile-menu" id="mobileMenu" inert>
<nav aria-label="Navigation mobile">
${NAV.map(([id, label], i) => `<a href="${base}#${id}"><small>0${i + 1}</small>${label}</a>`).join('')}
<a href="${base}#contact" class="mobile-cta">Parler de mon projet</a>
</nav>
<p class="mobile-meta">Studio numérique indépendant · Bordeaux, Gironde<br><a href="mailto:${SITE.email}">${SITE.email}</a></p>
</div>`;
}

export const SHORT = { web: 'Sites web', tool: 'Outils sur mesure', auto: 'Automatisation', ai: 'Intelligence artificielle', domain: 'Domaine & e-mail', audit: 'Amélioration & sécurité' };

export function footer(services) {
  const sv = services.map((s) => `<li><a href="${s.slug}.html">${esc(SHORT[s.key] || s.crumb)}</a></li>`).join('');
  return `<footer class="footer" data-theme="dark">
<div class="container">
<div class="footer-top">
<div class="footer-pitch">
<p class="eyebrow">Un projet en tête ?</p>
<a class="footer-mail" href="mailto:${SITE.email}">${SITE.email}</a>
</div>
<nav class="footer-cols" aria-label="Pied de page">
<div><h2>Services</h2><ul>${sv}</ul></div>
<div><h2>Studio</h2><ul><li><a href="services-numeriques-bordeaux-gironde.html">Bordeaux &amp; Gironde</a></li><li><a href="index.html#tarifs">Sans abonnement</a></li><li><a href="index.html#methode">Méthode</a></li><li><a href="index.html#apropos">À propos</a></li><li><a href="index.html#contact">Contact</a></li></ul></div>
<div><h2>Légal</h2><ul><li><a href="mentions-legales.html">Mentions légales</a></li><li><a href="confidentialite.html">Confidentialité</a></li></ul></div>
</nav>
</div>
<div class="footer-word" aria-hidden="true"><span>CVTL Lab</span><i>.</i></div>
<div class="footer-bottom"><div><strong>CVTL Lab</strong> · Bordeaux, Gironde</div><div>© <span id="year">2026</span> CVTL Lab</div></div>
</div>
</footer>`;
}

export const tail = (scripts = true) => `${scripts ? '<script type="module" src="js/main.js"></script>' : ''}
</body>
</html>`;

export const faqLd = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
});
