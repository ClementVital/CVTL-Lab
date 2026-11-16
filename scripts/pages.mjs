// Génération des pages — CVTL Lab (v3 : minimaliste, lecture à plusieurs niveaux)
// Principe : niveau 1 = l'essentiel, visible. Niveau 2 = détails, à la demande (onglets, volets repliables).
// Aucune information n'est supprimée : tout reste dans le HTML (donc indexable) mais replié.
import { SITE, SHORT, UI, esc, logo, icon, head, header, footer, tail, jsonLd, faqLd } from './templates.mjs';

const COMMUNES = ['Ambarès-et-Lagrave', 'Ambès', 'Artigues-près-Bordeaux', 'Bassens', 'Bègles', 'Blanquefort', 'Bordeaux', 'Bouliac', 'Bruges', 'Carbon-Blanc', 'Cenon', 'Eysines', 'Floirac', 'Gradignan', 'Le Bouscat', 'Le Haillan', 'Lormont', 'Martignas-sur-Jalle', 'Mérignac', 'Parempuyre', 'Pessac', 'Saint-Aubin-de-Médoc', 'Saint-Louis-de-Montferrand', 'Saint-Médard-en-Jalles', 'Saint-Vincent-de-Paul', 'Le Taillan-Médoc', 'Talence', 'Villenave-d’Ornon'];

const HOME_CARDS = {
  web: { type: 'Web', h: 'Sites web', p: 'Création ou amélioration d’un site clair, rapide et adapté aux mobiles.', tags: ['Site vitrine', 'Catalogue', 'Formulaire', 'Performance'], link: 'Création de site web à Bordeaux' },
  tool: { type: 'Métier', h: 'Outils sur mesure', p: 'Des outils simples construits autour de votre façon de travailler.', tags: ['Stock', 'Clients', 'Commandes', 'Tableaux de bord'], link: 'Outils métier sur mesure à Bordeaux' },
  auto: { type: 'Temps', h: 'Automatisation', p: 'Automatiser les tâches répétitives pour gagner du temps au quotidien.', tags: ['Excel', 'Documents', 'Données', 'Connexions d’outils'], link: 'Automatisation d’entreprise à Bordeaux' },
  ai: { type: 'IA', h: 'Intelligence artificielle', p: 'Ajouter de l’IA quand elle apporte un gain concret à votre activité.', tags: ['FAQ', 'SAV', 'Assistant interne', 'Aide au choix'], link: 'Solutions IA pour entreprises à Bordeaux' },
  domain: { type: 'Présence', h: 'Domaine et e-mail', p: 'Mettre en place proprement votre domaine et vos adresses professionnelles.', tags: ['Nom de domaine', 'E-mail pro', 'DNS', 'Sécurisation'], link: 'Domaine et e-mail professionnel à Bordeaux' },
  audit: { type: 'Optimisation', h: 'Amélioration et sécurité', p: 'Moderniser, corriger ou sécuriser un site existant sans repartir de zéro.', tags: ['Refonte', 'Vitesse', 'Corrections', 'Sécurité'], link: 'Refonte, performance et sécurité web à Bordeaux' },
};

const NEEDS = [
  ['need-web', 'Créer un site web', 'Créer un site web'],
  ['need-tool', 'Créer un outil sur mesure', 'Outil sur mesure'],
  ['need-auto', 'Automatiser une tâche', 'Automatiser une tâche'],
  ['need-existing', 'Améliorer un site ou un outil existant', 'Améliorer un existant'],
  ['need-ai', 'Ajouter une fonctionnalité IA', 'Ajouter de l’IA'],
  ['need-unknown', 'Je ne sais pas encore', 'Je ne sais pas encore'],
];

/** Volet repliable (niveau 2) — <details> natif, animé en JS. */
const more = (summary, inner, { cls = '', open = false, icon: ic = '' } = {}) =>
  `<details class="more ${cls}"${open ? ' open' : ''}><summary>${ic ? `<span class="more-ic">${ic}</span>` : ''}<span class="more-t">${summary}</span><span class="more-chev">${UI.chevron}</span></summary><div class="more-body"><div class="more-in">${inner}</div></div></details>`;

const secHead = (eyebrow, h2, { ic = '', lead = '' } = {}) =>
  `<div class="sec-head"><p class="eyebrow" data-reveal>${eyebrow}</p><h2 data-reveal>${h2}</h2>${lead ? `<p class="sec-lead" data-reveal>${lead}</p>` : ''}</div>`;

/* ------------------------------------------------------------------ ACCUEIL */
export function home(services, ld) {
  const byKey = Object.fromEntries(services.map((s) => [s.key, s]));
  const keys = Object.keys(HOME_CARDS);

  const tabs = keys
    .map((k, i) => {
      const c = HOME_CARDS[k];
      return `<button class="tab" type="button" role="tab" id="tab-${k}" aria-controls="panel-${k}" aria-selected="${i === 0}"><span class="tab-ic">${icon(k)}</span><span class="tab-t"><b>${c.h}</b><small>${c.type}</small></span><span class="tab-n">0${i + 1}</span></button>`;
    })
    .join('');
  const panels = keys
    .map((k, i) => {
      const c = HOME_CARDS[k];
      return `<article class="panel" role="tabpanel" id="panel-${k}" aria-labelledby="tab-${k}"${i ? ' hidden' : ''}>
<div class="panel-top"><span class="panel-ic">${icon(k)}</span><span class="pill">${c.type}</span></div>
<h3>${c.h}</h3>
<p>${c.p}</p>
<ul class="tags">${c.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
<a class="panel-link" href="${byKey[k].slug}.html"><span>Découvrir : ${c.link}</span>${UI.arrow}</a>
</article>`;
    })
    .join('\n');

  const needs = NEEDS.map(([id, value, label], i) => `<div class="choice-option"><input id="${id}" name="Besoin principal" type="radio" value="${value}"${i === 0 ? ' required' : ''}><label for="${id}"><span class="choice-mark" aria-hidden="true"></span>${label}</label></div>`).join('\n');

  const steps = [
    ['01', 'Échange', 'Vous m’expliquez le besoin', 'Ce que vous faites aujourd’hui, ce qui bloque et ce que vous voulez améliorer.'],
    ['02', 'Proposition', 'Je vous propose une solution', 'Vous savez ce qui sera réalisé, pourquoi et quels coûts externes peuvent exister.'],
    ['03', 'Livraison', 'Je réalise et je vous livre', 'La solution est mise en place, expliquée et prête à être utilisée.'],
  ];

  return `${head({
    page: 'home',
    title: 'Création de sites web & automatisation à Bordeaux | CVTL Lab',
    description: 'CVTL Lab crée des sites web rapides, outils sur mesure, automatisations et solutions IA pour indépendants, commerces et TPE/PME à Bordeaux et en Gironde.',
    ogDescription: 'Sites web, outils métier, automatisations et IA utile pour les entreprises à Bordeaux et en Gironde.',
    path: '',
    ld: jsonLd(ld),
  })}
<body class="page-home">
<div class="intro" id="intro" role="dialog" aria-label="Introduction CVTL Lab" aria-modal="true">
<div class="intro-panel intro-panel-top"></div>
<div class="intro-panel intro-panel-bottom"></div>
<div class="intro-fx" aria-hidden="true"><div class="intro-grid"></div><div class="intro-glow"></div><div class="intro-scan"></div></div>
<div class="intro-meta" aria-hidden="true"><span>Studio numérique indépendant</span><span>Bordeaux · Gironde</span></div>
<div class="intro-center">
<div class="intro-logo-wrap">${logo('intro-logo')}<span class="intro-ring" aria-hidden="true"></span></div>
<div class="intro-word" aria-hidden="true"><span class="intro-letters">${[...'CVTL Lab'].map((ch) => (ch === ' ' ? '<span class="sp"></span>' : `<span class="ch"><span>${ch}</span></span>`)).join('')}</span><span class="intro-dot"></span></div>
<p class="intro-tag" aria-hidden="true">Des solutions numériques utiles, pensées pour votre activité.</p>
</div>
<div class="intro-foot">
<span class="intro-count" aria-hidden="true"><b id="introCount">000</b> / 100</span>
<button class="intro-skip" id="introSkip" type="button">Passer l’intro <kbd>↵</kbd></button>
</div>
</div>
${header({ home: true })}
<main id="contenu">

<section class="hero" id="accueil" data-theme="dark">
<div class="hero-bg" aria-hidden="true"><div class="hero-lines"></div><div class="hero-glow"></div><div class="hero-spot"></div></div>
<div class="container hero-inner">
<div class="hero-copy">
<p class="eyebrow" data-hero>Bordeaux · Gironde</p>
<h1 data-split data-hero>Sites web, automatisations et outils sur mesure à Bordeaux.</h1>
<p class="lead" data-hero>CVTL Lab conçoit des solutions numériques rapides, claires et utiles pour les indépendants, commerces, associations et TPE/PME de Bordeaux et de la Gironde.</p>
<div class="hero-actions" data-hero>
<a class="button button-primary" href="#contact" data-magnetic><span>Parler de mon projet</span>${UI.arrow}</a>
<a class="button button-ghost" href="#services" data-magnetic><span>Voir les services</span></a>
</div>
</div>
<div class="hero-visual" data-hero aria-hidden="true"><div class="hero-logo" id="heroLogo">${logo('hero-logo-svg')}</div></div>
</div>
<div class="container kpis-wrap" data-hero>
<dl class="kpis" aria-label="L’essentiel">
<div class="kpi"><dt>Après la livraison</dt><dd><b><span data-countdown="0" data-from="149">0</span> €</b><span>d’abonnement CVTL Lab</span></dd></div>
<div class="kpi"><dt>Bordeaux Métropole</dt><dd><b data-count="28">28</b><span>communes couvertes</span></dd></div>
<div class="kpi"><dt>Du début à la fin</dt><dd><b data-count="1">1</b><span>interlocuteur unique</span></dd></div>
</dl>
</div>
</section>

<section class="sec" id="services" data-theme="light">
<div class="container">
${secHead('Services', 'Création web, outils métier, automatisation et IA.', { lead: 'Chaque service répond à un besoin concret : être visible, gagner du temps, fiabiliser un processus ou mieux exploiter vos outils numériques.' })}
<div class="svc" data-tabs data-reveal>
<div class="svc-tabs" role="tablist" aria-label="Services" aria-orientation="vertical">${tabs}</div>
<div class="svc-panels">
${panels}
</div>
</div>
</div>
</section>

<section class="sec sec-soft" id="gironde" data-theme="light">
<div class="container">
${secHead('Bordeaux · Gironde', 'Un studio numérique local pour vos projets en Gironde.', { lead: 'CVTL Lab est basé au Taillan-Médoc et accompagne les projets numériques à Bordeaux, dans les 28 communes de Bordeaux Métropole et plus largement en Gironde.' })}
<ul class="tiles" data-reveal>
<li class="tile"><span class="tile-ic">${UI.pin}</span><b>Le Taillan-Médoc</b><span>Base du studio</span></li>
<li class="tile"><span class="tile-ic">${UI.map}</span><b>28 communes</b><span>Bordeaux Métropole</span></li>
<li class="tile"><span class="tile-ic">${UI.globe}</span><b>Toute la Gironde</b><span>À distance</span></li>
<li class="tile"><span class="tile-ic">${UI.people}</span><b>En personne</b><span>Autour de Bordeaux</span></li>
</ul>
<div data-reveal>
${more('Détails et zones d’intervention', `<p>Les échanges peuvent se faire à distance et, lorsque c’est utile au projet, en personne autour de Bordeaux.</p>
<p>Création de site internet, automatisation, outil métier, intégration d’IA, domaine, e-mail professionnel, refonte, performance ou sécurité : l’objectif reste le même, construire une solution adaptée à l’activité plutôt qu’empiler des outils.</p>
<p class="more-sub">Les 28 communes de Bordeaux Métropole</p>
<ul class="chips">${COMMUNES.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
<a class="button button-outline" href="services-numeriques-bordeaux-gironde.html"><span>Voir les zones d’intervention</span>${UI.arrow}</a>`, { icon: UI.info })}
</div>
</div>
</section>

<section class="sec" id="tarifs" data-theme="light">
<div class="container">
${secHead('Après la livraison', 'Vous payez le projet, pas un abonnement.', { lead: 'CVTL Lab n’ajoute pas ensuite de forfait mensuel obligatoire. Les éventuels services externes sont identifiés avant le lancement.' })}
<ul class="metrics" aria-label="Frais récurrents CVTL Lab" data-reveal>
<li class="metric"><b><span data-countdown="0" data-from="99">0</span> €</b><span>Abonnement CVTL Lab</span></li>
<li class="metric"><b><span data-countdown="0" data-from="99">0</span> €</b><span>Frais de service récurrents</span></li>
<li class="metric"><b><span data-countdown="0" data-from="99">0</span> €</b><span>Garantie corrective</span></li>
</ul>
<div data-reveal>
${more('Détails et conditions', `<ul class="rows">
<li>${UI.check}<div><b>Abonnement CVTL Lab</b><span>Aucun abonnement mensuel après la livraison. Pas de forfait mensuel obligatoire ajouté par CVTL Lab.</span></div></li>
<li>${UI.check}<div><b>Frais de service récurrents</b><span>Pas de commission ni de frais mensuels ajoutés par CVTL Lab.</span></div></li>
<li>${UI.check}<div><b>Garantie corrective</b><span>Les anomalies directement liées à la solution livrée sont corrigées selon les conditions et la durée prévues au devis.</span></div></li>
</ul>
<p class="note">Les évolutions fonctionnelles, ajouts de contenu et interventions liées à des services tiers sont chiffrés séparément si nécessaire. Un nom de domaine, un hébergement, une API ou un logiciel tiers peut avoir son propre coût, annoncé avant le lancement.</p>`, { icon: UI.info })}
</div>
</div>
</section>

<section class="sec sec-soft" id="methode" data-theme="light">
<div class="container">
${secHead('Méthode', 'Simple du début à la livraison.', { lead: 'Échange autour de Bordeaux quand c’est possible, sinon en visioconférence.' })}
<div class="stepper" data-tabs data-stepper data-reveal>
<div class="stepper-nav" role="tablist" aria-label="Étapes du projet">
<span class="stepper-line" aria-hidden="true"><i></i></span>
${steps.map(([n, tag, , ], i) => `<button class="step-btn" type="button" role="tab" id="step-${i}" aria-controls="steppanel-${i}" aria-selected="${i === 0}"><span class="step-n">${n}</span><span class="step-l">${tag}</span></button>`).join('')}
</div>
<div class="stepper-panels">
${steps.map(([n, tag, h, p], i) => `<div class="step-panel" role="tabpanel" id="steppanel-${i}" aria-labelledby="step-${i}"${i ? ' hidden' : ''}><span class="step-tag">${n} · ${tag}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}
</div>
</div>
</div>
</section>

<section class="sec" id="apropos" data-theme="light">
<div class="container narrow">
${secHead('À propos', 'Un interlocuteur unique, basé au Taillan-Médoc en Gironde.')}
<p class="about-note" data-reveal>Vous gardez un seul interlocuteur du premier échange jusqu’à la livraison.</p>
<div data-reveal>
${more('Qui je suis', `<p>Je suis étudiant ingénieur et passionné par l’informatique, le développement et l’intelligence artificielle. J’ai créé CVTL Lab pour mettre ces outils au service d’entreprises locales avec une approche directe, compréhensible et adaptée à leur quotidien.</p>
<p>Quand c’est pertinent, je privilégie les échanges en personne autour de Bordeaux afin de mieux comprendre le besoin et de garder une relation simple tout au long du projet.</p>`, { icon: UI.user })}
</div>
</div>
</section>

<section class="sec sec-soft" id="contact" data-theme="light">
<div class="container contact-shell">
<div class="contact-side">
<p class="eyebrow" data-reveal>Contact</p>
<h2 data-reveal>Parlez-moi de votre projet.</h2>
<p class="sec-lead" data-reveal>Commencez par l’essentiel. Les précisions de délai, budget ou entreprise restent facultatives.</p>
<a class="mail-pill" href="mailto:${SITE.email}" data-reveal><span>${SITE.email}</span>${UI.arrow}</a>
<div data-reveal>
${more('Bon à savoir', `<ul class="ticks"><li>${UI.check}<span>Pas besoin de connaître la solution technique.</span></li><li>${UI.check}<span>Les champs marqués d’un astérisque sont les seuls obligatoires.</span></li><li>${UI.check}<span>Vous pouvez aussi simplement décrire votre problème dans le message.</span></li></ul>`, { icon: UI.info })}
</div>
</div>
<div class="form-card" data-reveal>
<h3>Votre demande</h3>
<p class="form-intro">Remplissez le formulaire et je recevrai les informations directement par e-mail.</p>
<form id="contactForm" accept-charset="UTF-8" action="${SITE.formAction}" method="POST">
<input name="_subject" type="hidden" value="Nouvelle demande depuis CVTL Lab"><input name="_next" type="hidden" value="${SITE.formNext}">
<input name="_template" type="hidden" value="table">
<div aria-hidden="true" class="hp-field"><label for="website">Ne pas remplir ce champ</label><input autocomplete="off" id="website" name="_honey" tabindex="-1" type="text"></div>
<div class="form-grid">
<div class="form-field"><label class="form-label" for="name">Nom et prénom *</label><input autocomplete="name" class="form-control" id="name" maxlength="100" name="Nom" placeholder="Votre nom" required type="text"></div>
<div class="form-field"><label class="form-label" for="email">E-mail *</label><input autocomplete="email" class="form-control" id="email" maxlength="160" name="email" placeholder="vous@entreprise.fr" required type="email"></div>
</div>
<fieldset class="choice-fieldset"><legend class="choice-title">Quel est votre besoin principal ? *</legend><div class="choice-grid">
${needs}
</div></fieldset>
<div class="form-field full form-message"><label class="form-label" for="message">Votre message *</label><textarea class="form-control" id="message" maxlength="3000" name="Message" placeholder="Décrivez ce que vous souhaitez créer, améliorer ou automatiser. Quelques phrases suffisent." required></textarea></div>
<details class="more form-optional-details"><summary><span class="more-t">Ajouter des précisions (facultatif)</span><span class="more-chev">${UI.chevron}</span></summary><div class="more-body"><div class="more-in"><div class="form-grid optional-grid">
<div class="form-field"><label class="form-label" for="phone">Téléphone <span class="form-optional">facultatif</span></label><input autocomplete="tel" class="form-control" id="phone" inputmode="tel" maxlength="40" name="Téléphone" placeholder="06 00 00 00 00" type="tel"></div>
<div class="form-field"><label class="form-label" for="company">Entreprise <span class="form-optional">facultatif</span></label><input autocomplete="organization" class="form-control" id="company" maxlength="120" name="Entreprise" placeholder="Nom de l’entreprise" type="text"></div>
<div class="form-field"><label class="form-label" for="profile">Votre activité</label><select class="form-control" id="profile" name="Activité"><option disabled selected value="">Sélectionnez si utile</option><option value="Indépendant">Indépendant</option><option value="Commerce">Commerce</option><option value="TPE ou PME">TPE ou PME</option><option value="Association">Association</option><option value="Projet en création">Projet en création</option><option value="Autre">Autre</option></select></div>
<div class="form-field"><label class="form-label" for="timeline">Démarrage souhaité</label><select class="form-control" id="timeline" name="Démarrage souhaité"><option selected value="À définir">À définir</option><option value="Dès que possible">Dès que possible</option><option value="Dans le mois">Dans le mois</option><option value="Dans 1 à 3 mois">Dans 1 à 3 mois</option><option value="Plus tard">Plus tard</option></select></div>
<div class="form-field full"><label class="form-label" for="budget">Budget envisagé <span class="form-optional">facultatif</span></label><select class="form-control" id="budget" name="Budget envisagé"><option selected value="À définir">À définir</option><option value="Moins de 1 000 €">Moins de 1 000 €</option><option value="1 000 à 2 500 €">1 000 à 2 500 €</option><option value="2 500 à 5 000 €">2 500 à 5 000 €</option><option value="5 000 € et plus">5 000 € et plus</option></select></div>
</div></div></div></details>
<div class="form-footer"><button class="button button-primary form-submit" type="submit"><span class="label">Envoyer ma demande</span><span class="spinner" aria-hidden="true"></span></button>
<p class="form-note">Envoi sécurisé via FormSubmit. Un contrôle anti-spam peut s’afficher avant l’envoi.</p></div>
<p class="privacy-note">Les informations envoyées sont utilisées pour répondre à votre demande. <a href="confidentialite.html">En savoir plus sur vos données et vos droits.</a></p>
</form>
</div>
</div>
</section>

</main>
${footer(services)}
${tail()}`;
}

/* ------------------------------------------------------------------ SERVICE */
export function servicePage(s, services) {
  const url = `${SITE.url}/${s.slug}.html`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', '@id': `${url}#service`, name: s.crumb, url, description: s.description, provider: { '@id': `${SITE.url}/#business` }, areaServed: [{ '@type': 'City', name: 'Bordeaux' }, { '@type': 'AdministrativeArea', name: 'Bordeaux Métropole' }, { '@type': 'AdministrativeArea', name: 'Gironde' }] },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE.url}/` }, { '@type': 'ListItem', position: 2, name: s.crumb, item: url }] },
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: s.title, description: s.description, inLanguage: 'fr-FR', about: { '@id': `${url}#service` } },
      faqLd(s.faq.items),
    ],
  };
  const others = services.filter((o) => o.slug !== s.slug);
  const [p1, ...rest] = s.approach.p;
  const scope = s.scope.items;
  const SHOWN = 4;

  return `${head({ title: s.title, description: s.description, path: `${s.slug}.html`, ld: jsonLd(ld) })}
<body class="page-sub">
${header({ home: false })}
<main id="contenu">
<section class="sub-hero" data-theme="dark">
<div class="hero-bg" aria-hidden="true"><div class="hero-lines"></div><div class="hero-glow"></div></div>
<div class="container sub-hero-inner">
<nav class="breadcrumbs" aria-label="Fil d’Ariane" data-hero><a href="index.html">Accueil</a><span aria-hidden="true">/</span><span>${esc(s.crumb)}</span></nav>
<p class="eyebrow" data-hero>${esc(s.eyebrow)}</p>
<h1 data-split data-hero>${esc(s.h1)}</h1>
<p class="lead" data-hero>${esc(s.lead)}</p>
<div class="hero-actions" data-hero><a class="button button-primary" href="index.html#contact" data-magnetic><span>Parler de mon projet</span>${UI.arrow}</a><a class="button button-ghost" href="services-numeriques-bordeaux-gironde.html" data-magnetic><span>Zone d’intervention</span></a></div>
<div class="hero-meta" data-hero><span class="hero-meta-ic">${icon(s.key)}</span><div><b>${esc(s.sideTitle)}</b><span>${esc(s.sideText)}</span></div></div>
</div>
</section>

<nav class="subnav" aria-label="Sections de la page" data-theme="light"><div class="container subnav-in">
<a href="#approche" data-nav="approche">Approche</a><a href="#perimetre" data-nav="perimetre">Périmètre</a><a href="#cas" data-nav="cas">Cas d’usage</a><a href="#faq" data-nav="faq">Questions</a><a href="#autres" data-nav="autres">Autres services</a>
</div></nav>

<section class="sec" id="approche" data-theme="light"><div class="container narrow">
${secHead(esc(s.approach.eyebrow), esc(s.approach.h2))}
<p class="sec-text" data-reveal>${esc(p1)}</p>
${rest.length ? `<div data-reveal>${more('En savoir plus', rest.map((p) => `<p>${esc(p)}</p>`).join(''), { icon: UI.info })}</div>` : ''}
</div></section>

<section class="sec sec-soft" id="perimetre" data-theme="light"><div class="container narrow">
${secHead(esc(s.scope.eyebrow), esc(s.scope.h2))}
<ul class="checks" id="scope-list" data-reveal>${scope.map((i, n) => `<li${n >= SHOWN ? ' class="extra"' : ''}>${UI.check}<span>${esc(i)}</span></li>`).join('')}</ul>
<button class="more-btn" type="button" data-more aria-controls="scope-list" aria-expanded="false" data-more-label="Voir les ${scope.length - SHOWN} autres" data-less-label="Réduire"><span>Voir les ${scope.length - SHOWN} autres</span>${UI.chevron}</button>
</div></section>

<section class="sec" id="cas" data-theme="light"><div class="container narrow">
${secHead(esc(s.cases.eyebrow), esc(s.cases.h2))}
<div class="cases">${s.cases.cards.map((c, i) => `<article class="case" data-reveal><span class="case-n">0${i + 1}</span><div><h3>${esc(c.t)}</h3><p>${esc(c.p)}</p></div></article>`).join('')}</div>
</div></section>

<section class="sec sec-soft sec-tight" id="local" data-theme="light"><div class="container narrow" data-reveal>
${more('Bordeaux Métropole et toute la Gironde.', `<p>CVTL Lab est basé au Taillan-Médoc. Les projets peuvent être menés avec des entreprises de Bordeaux, Mérignac, Pessac, Talence, Bègles, Le Bouscat, Saint-Médard-en-Jalles et des autres communes de la métropole, ainsi que dans le reste de la Gironde.</p><a class="text-link" href="services-numeriques-bordeaux-gironde.html">Voir toutes les zones couvertes →</a>`, { cls: 'more-lg', icon: UI.pin })}
</div></section>

<section class="sec" id="faq" data-theme="light"><div class="container narrow">
${secHead(esc(s.faq.eyebrow), esc(s.faq.h2))}
<div class="faq-list" data-reveal>${s.faq.items.map((f) => `<details class="faq"><summary><span>${esc(f.q)}</span><i aria-hidden="true"></i></summary><div class="faq-body"><p>${esc(f.a)}</p></div></details>`).join('')}</div>
</div></section>

<section class="sec sec-soft" id="autres" data-theme="light"><div class="container narrow">
${secHead('Poursuivre', 'Les autres services.')}
<div class="chips-row" data-reveal>${others.map((o) => `<a class="chip-link" href="${o.slug}.html"><span class="chip-ic">${icon(o.key)}</span>${esc(SHORT[o.key] || o.crumb)}${UI.arrow}</a>`).join('')}</div>
</div></section>

<section class="cta" data-theme="dark"><div class="cta-glow" aria-hidden="true"></div><div class="container cta-inner">
<div><p class="eyebrow" data-reveal>Projet</p><h2 data-reveal>Un besoin précis suffit pour commencer.</h2><p data-reveal>Expliquez la situation actuelle, le problème à résoudre et ce que vous aimeriez obtenir. La solution technique peut être définie ensuite.</p></div>
<a class="button button-primary button-lg" href="index.html#contact" data-magnetic><span>Parler de mon projet</span>${UI.arrow}</a>
</div></section>
</main>
${footer(services)}
${tail()}`;
}

/* ------------------------------------------------------------------ ZONE */
export function zonePage(services) {
  const title = 'Services numériques à Bordeaux et en Gironde | CVTL Lab';
  const description = 'CVTL Lab accompagne les projets de sites web, automatisations, outils sur mesure et IA à Bordeaux Métropole et dans toute la Gironde.';
  const url = `${SITE.url}/services-numeriques-bordeaux-gironde.html`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE.url}/` }, { '@type': 'ListItem', position: 2, name: 'Bordeaux & Gironde', item: url }] },
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'fr-FR', about: { '@id': `${SITE.url}/#business` } },
    ],
  };
  const regions = [
    ['Bassin d’Arcachon', 'Arcachon, La Teste-de-Buch, Gujan-Mestras, Andernos-les-Bains et les communes du Bassin.'],
    ['Libournais', 'Libourne, Saint-Émilion et les communes du secteur, avec suivi possible à distance.'],
    ['Médoc', 'Du nord de la métropole jusqu’au Médoc et à ses communes, selon la nature du projet.'],
    ['Sud Gironde & Entre-deux-Mers', 'Langon, Cadillac-sur-Garonne, Créon et les autres communes girondines peuvent être accompagnées à distance.'],
  ];
  return `${head({ title, description, path: 'services-numeriques-bordeaux-gironde.html', ld: jsonLd(ld) })}
<body class="page-sub">
${header({ home: false })}
<main id="contenu">
<section class="sub-hero" data-theme="dark">
<div class="hero-bg" aria-hidden="true"><div class="hero-lines"></div><div class="hero-glow"></div></div>
<div class="container sub-hero-inner">
<nav class="breadcrumbs" aria-label="Fil d’Ariane" data-hero><a href="index.html">Accueil</a><span aria-hidden="true">/</span><span>Bordeaux &amp; Gironde</span></nav>
<p class="eyebrow" data-hero>Zone d’intervention</p>
<h1 data-split data-hero>Services numériques à Bordeaux Métropole et en Gironde.</h1>
<p class="lead" data-hero>CVTL Lab est basé au Taillan-Médoc et accompagne les indépendants, commerces, associations et TPE/PME sur leurs projets de sites web, automatisations, outils métier et intégrations d’IA.</p>
<div class="hero-actions" data-hero><a class="button button-primary" href="index.html#contact" data-magnetic><span>Parler de mon projet</span>${UI.arrow}</a><a class="button button-ghost" href="index.html#services" data-magnetic><span>Voir les services</span></a></div>
<div class="hero-meta" data-hero><span class="hero-meta-ic">${UI.pin}</span><div><b>Le Taillan-Médoc</b><span>Échanges à distance dans toute la Gironde et rendez-vous en personne autour de Bordeaux lorsque le projet le justifie.</span></div></div>
</div>
</section>

<nav class="subnav" aria-label="Sections de la page" data-theme="light"><div class="container subnav-in">
<a href="#metropole" data-nav="metropole">Bordeaux Métropole</a><a href="#gironde" data-nav="gironde">Gironde</a><a href="#services" data-nav="services">Services</a>
</div></nav>

<section class="sec" id="metropole" data-theme="light"><div class="container narrow">
${secHead('Bordeaux Métropole', 'Les 28 communes de la métropole.')}
<p class="sec-text" data-reveal>La proximité permet d’organiser un échange en personne lorsqu’il apporte une vraie valeur : cadrage d’un besoin métier, compréhension d’un processus ou lancement d’un projet. Le reste du travail peut être réalisé à distance.</p>
<div data-reveal>${more('CVTL Lab intervient sur l’ensemble de Bordeaux Métropole', `<ul class="chips">${COMMUNES.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`, { cls: 'more-lg', icon: UI.map })}</div>
</div></section>

<section class="sec sec-soft" id="gironde" data-theme="light"><div class="container narrow">
${secHead('Gironde', 'Au-delà de la métropole : toute la Gironde.')}
<div class="faq-list" data-reveal>${regions.map(([t, p]) => `<details class="faq"><summary><span>${esc(t)}</span><i aria-hidden="true"></i></summary><div class="faq-body"><p>${esc(p)}</p></div></details>`).join('')}</div>
</div></section>

<section class="sec" id="services" data-theme="light"><div class="container narrow">
${secHead('Services locaux', 'Un même interlocuteur pour le web et les outils numériques.')}
<div class="chips-row" data-reveal>${services.map((o) => `<a class="chip-link" href="${o.slug}.html"><span class="chip-ic">${icon(o.key)}</span>${esc(o.sideTitle)}<em>Bordeaux &amp; Gironde</em>${UI.arrow}</a>`).join('')}</div>
</div></section>

<section class="cta" data-theme="dark"><div class="cta-glow" aria-hidden="true"></div><div class="container cta-inner">
<div><p class="eyebrow" data-reveal>Projet en Gironde</p><h2 data-reveal>Expliquez simplement le besoin.</h2><p data-reveal>Le premier échange sert à comprendre votre activité, le problème à résoudre et le niveau de solution réellement nécessaire.</p></div>
<a class="button button-primary button-lg" href="index.html#contact" data-magnetic><span>Parler de mon projet</span>${UI.arrow}</a>
</div></section>
</main>
${footer(services)}
${tail()}`;
}

/* ------------------------------------------------------------------ LÉGAL / MERCI / 404 */
export function legalPage(slug, data, services) {
  // Chaque <h2> devient un volet repliable ; le texte d'introduction reste visible.
  const parts = data.body.split(/(?=<h2>)/);
  const intro = parts[0].trim().startsWith('<h2>') ? '' : parts.shift();
  const secs = parts
    .map((part, i) => {
      const m = part.match(/^<h2>(.*?)<\/h2>([\s\S]*)$/);
      return m ? `<details class="faq legal-sec"${i === 0 ? ' open' : ''}><summary><span>${m[1]}</span><i aria-hidden="true"></i></summary><div class="faq-body"><div class="legal-text">${m[2]}</div></div></details>` : '';
    })
    .join('');
  return `${head({ title: data.title, description: data.description, path: `${slug}.html`, robots: 'noindex, follow', og: false })}
<body class="page-sub page-legal">
${header({ home: false })}
<main id="contenu">
<section class="sub-hero legal-hero" data-theme="dark"><div class="hero-bg" aria-hidden="true"><div class="hero-lines"></div><div class="hero-glow"></div></div><div class="container sub-hero-inner"><a class="back-link" href="index.html" data-hero>← Retour au site</a><p class="eyebrow" data-hero>${data.eyebrow}</p><h1 data-hero>${data.h1}</h1></div></section>
<section class="sec" data-theme="light"><div class="container narrow">
${intro ? `<div class="legal-intro">${intro}</div>` : ''}
<div class="legal-bar"><button class="more-btn" type="button" data-expand-all="legal-list" data-open-label="Tout déplier" data-close-label="Tout replier" aria-pressed="false"><span>Tout déplier</span>${UI.chevron}</button></div>
<div class="faq-list" id="legal-list">${secs}</div>
</div></section>
</main>
${footer(services)}
${tail()}`;
}

export function simplePage({ slug, title, description, eyebrow, h1, lead, cta = 'Retour à l’accueil', robots, services, big }) {
  return `${head({ title, description: description || title, path: `${slug}.html`, robots, og: false })}
<body class="page-sub page-simple">
${header({ home: false })}
<main id="contenu" class="simple-main">
<section class="simple" data-theme="dark"><div class="hero-bg" aria-hidden="true"><div class="hero-lines"></div><div class="hero-glow"></div></div>
<div class="container simple-inner">
${big ? `<div class="simple-big" aria-hidden="true">${big}</div>` : `<div class="simple-logo" aria-hidden="true">${logo('simple-logo-svg')}</div>`}
<p class="eyebrow" data-hero>${eyebrow}</p><h1 data-hero>${h1}</h1><p class="lead" data-hero>${lead}</p>
<p data-hero><a class="button button-primary" href="index.html" data-magnetic><span>${cta}</span>${UI.arrow}</a></p>
</div></section>
</main>
${footer(services)}
${tail()}`;
}
