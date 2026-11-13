// Génération des pages — CVTL Lab
import { SITE, SHORT, esc, logo, icon, head, header, footer, tail, jsonLd, faqLd } from './templates.mjs';

const arrow = '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const COMMUNES = ['Ambarès-et-Lagrave', 'Ambès', 'Artigues-près-Bordeaux', 'Bassens', 'Bègles', 'Blanquefort', 'Bordeaux', 'Bouliac', 'Bruges', 'Carbon-Blanc', 'Cenon', 'Eysines', 'Floirac', 'Gradignan', 'Le Bouscat', 'Le Haillan', 'Lormont', 'Martignas-sur-Jalle', 'Mérignac', 'Parempuyre', 'Pessac', 'Saint-Aubin-de-Médoc', 'Saint-Louis-de-Montferrand', 'Saint-Médard-en-Jalles', 'Saint-Vincent-de-Paul', 'Le Taillan-Médoc', 'Talence', 'Villenave-d’Ornon'];

const HOME_CARDS = {
  web: { n: '01', type: 'Web', h: 'Sites web', p: 'Création ou amélioration d’un site clair, rapide et adapté aux mobiles.', tags: ['Site vitrine', 'Catalogue', 'Formulaire', 'Performance'], link: 'Création de site web à Bordeaux', span: 'span-4' },
  tool: { n: '02', type: 'Métier', h: 'Outils sur mesure', p: 'Des outils simples construits autour de votre façon de travailler.', tags: ['Stock', 'Clients', 'Commandes', 'Tableaux de bord'], link: 'Outils métier sur mesure à Bordeaux', span: 'span-2' },
  auto: { n: '03', type: 'Temps', h: 'Automatisation', p: 'Automatiser les tâches répétitives pour gagner du temps au quotidien.', tags: ['Excel', 'Documents', 'Données', 'Connexions d’outils'], link: 'Automatisation d’entreprise à Bordeaux', span: 'span-2' },
  ai: { n: '04', type: 'IA', h: 'Intelligence artificielle', p: 'Ajouter de l’IA quand elle apporte un gain concret à votre activité.', tags: ['FAQ', 'SAV', 'Assistant interne', 'Aide au choix'], link: 'Solutions IA pour entreprises à Bordeaux', span: 'span-2' },
  domain: { n: '05', type: 'Présence', h: 'Domaine et e-mail', p: 'Mettre en place proprement votre domaine et vos adresses professionnelles.', tags: ['Nom de domaine', 'E-mail pro', 'DNS', 'Sécurisation'], link: 'Domaine et e-mail professionnel à Bordeaux', span: 'span-2' },
  audit: { n: '06', type: 'Optimisation', h: 'Amélioration et sécurité', p: 'Moderniser, corriger ou sécuriser un site existant sans repartir de zéro.', tags: ['Refonte', 'Vitesse', 'Corrections', 'Sécurité'], link: 'Refonte, performance et sécurité web à Bordeaux', span: 'span-6' },
};

const checkboxNeeds = [
  ['need-web', 'Créer un site web', 'Créer un site web'],
  ['need-tool', 'Créer un outil sur mesure', 'Créer un outil sur mesure'],
  ['need-auto', 'Automatiser une tâche', 'Automatiser une tâche'],
  ['need-existing', 'Améliorer un site ou un outil existant', 'Améliorer un existant'],
  ['need-ai', 'Ajouter une fonctionnalité IA', 'Ajouter une fonctionnalité IA'],
  ['need-unknown', 'Je ne sais pas encore', 'Je ne sais pas encore'],
];

function marquee(items, cls = '') {
  const row = items.map((t) => `<li>${esc(t)}</li>`).join('');
  return `<div class="marquee ${cls}" data-theme="${cls.includes('dark') ? 'dark' : 'light'}" aria-hidden="true"><ul class="marquee-track">${row}${row}</ul></div>`;
}

/* ------------------------------------------------------------------ ACCUEIL */
export function home(services, ld) {
  const bySlug = Object.fromEntries(services.map((s) => [s.key, s]));
  const cards = Object.entries(HOME_CARDS)
    .map(([key, c]) => {
      const s = bySlug[key];
      return `<article class="card ${c.span}" data-spot data-reveal>
<div class="card-top"><span class="card-num">${c.n}</span><span class="card-type">${c.type}</span></div>
<div class="card-icon">${icon(key)}</div>
<h3>${c.h}</h3>
<p>${c.p}</p>
<ul class="tags">${c.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
<a class="card-link" href="${s.slug}.html"><span>Découvrir : ${c.link}</span>${arrow}</a>
</article>`;
    })
    .join('\n');

  const needs = checkboxNeeds
    .map(([id, value, label], i) => `<div class="choice-option"><input id="${id}" name="Besoin principal" type="radio" value="${value}"${i === 0 ? ' required' : ''}><label for="${id}"><span class="choice-mark" aria-hidden="true"></span>${label}</label></div>`)
    .join('\n');

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
<div class="hero-bg" aria-hidden="true"><div class="hero-lines"></div><div class="hero-glow"></div><div class="hero-spot"></div><div class="hero-noise"></div></div>
<div class="container hero-inner">
<div class="hero-copy">
<p class="eyebrow" data-hero>Bordeaux · Gironde</p>
<h1 data-split data-hero>Sites web, automatisations et outils sur mesure à Bordeaux.</h1>
<p class="lead" data-hero>CVTL Lab conçoit des solutions numériques rapides, claires et utiles pour les indépendants, commerces, associations et TPE/PME de Bordeaux et de la Gironde.</p>
<div class="hero-actions" data-hero>
<a class="button button-primary" href="#contact" data-magnetic><span>Parler de mon projet</span>${arrow}</a>
<a class="button button-ghost" href="#services" data-magnetic><span>Voir les services</span></a>
</div>
</div>
<div class="hero-visual" data-hero aria-hidden="true">
<div class="orbit orbit-1"></div><div class="orbit orbit-2"></div>
<div class="hero-logo" id="heroLogo">${logo('hero-logo-svg')}</div>
<span class="float-chip chip-1">Sites web</span>
<span class="float-chip chip-2">Outils métier</span>
<span class="float-chip chip-3">Automatisation</span>
<span class="float-chip chip-4">IA utile</span>
</div>
<aside class="promise" aria-label="Frais récurrents CVTL Lab" data-hero>
<p class="promise-label">Après la livraison</p>
<div class="promise-row"><div class="promise-value"><span data-countdown="0" data-from="149">0</span> €</div>
<div><strong>d’abonnement CVTL Lab</strong><p>Pas de forfait mensuel obligatoire ajouté par CVTL Lab.</p></div></div>
</aside>
</div>
<a class="scroll-cue" href="#services" aria-label="Faire défiler vers les services"><span>Défiler</span><i></i></a>
</section>

${marquee(['Sites web', 'Outils sur mesure', 'Automatisation', 'Intelligence artificielle', 'Domaine & e-mail', 'Amélioration & sécurité'], 'marquee-dark')}

<section class="services" id="services" data-theme="light">
<div class="container">
<div class="section-head">
<div>
<p class="eyebrow" data-reveal>Services</p>
<h2 data-split>Création web, outils métier, automatisation et IA.</h2>
</div>
<p data-reveal>Chaque service répond à un besoin concret : être visible, gagner du temps, fiabiliser un processus ou mieux exploiter vos outils numériques.</p>
</div>
<div class="bento">
${cards}
</div>
</div>
</section>

<section class="local" id="gironde" data-theme="light">
<div class="container local-grid">
<div>
<p class="eyebrow" data-reveal>Bordeaux · Gironde</p>
<h2 data-split>Un studio numérique local pour vos projets en Gironde.</h2>
</div>
<div class="local-copy" data-reveal>
<p>CVTL Lab est basé au Taillan-Médoc et accompagne les projets numériques à Bordeaux, dans les 28 communes de Bordeaux Métropole et plus largement en Gironde. Les échanges peuvent se faire à distance et, lorsque c’est utile au projet, en personne autour de Bordeaux.</p>
<p>Création de site internet, automatisation, outil métier, intégration d’IA, domaine, e-mail professionnel, refonte, performance ou sécurité : l’objectif reste le même, construire une solution adaptée à l’activité plutôt qu’empiler des outils.</p>
<a class="button button-outline" href="services-numeriques-bordeaux-gironde.html" data-magnetic><span>Voir les zones d’intervention</span>${arrow}</a>
</div>
</div>
<div class="container stats">
<div class="stat" data-reveal><b data-count="28">28</b><span>communes de Bordeaux Métropole</span></div>
<div class="stat" data-reveal><b data-count="1">1</b><span>interlocuteur, du premier échange à la livraison</span></div>
<div class="stat" data-reveal><b>33</b><span>La Gironde, à distance et en personne autour de Bordeaux</span></div>
</div>
${marquee(COMMUNES, 'marquee-light')}
</section>

<section class="pricing" id="tarifs" data-theme="dark">
<div class="pricing-glow" aria-hidden="true"></div>
<div class="container">
<div class="pricing-head">
<p class="eyebrow" data-reveal>Après la livraison</p>
<h2 data-split>Vous payez le projet, pas un abonnement.</h2>
<p class="lead" data-reveal>CVTL Lab n’ajoute pas ensuite de forfait mensuel obligatoire. Les éventuels services externes sont identifiés avant le lancement.</p>
</div>
<div class="zero-list" aria-label="Frais récurrents CVTL Lab">
<article class="zero-item" data-reveal><span class="zero-value"><span data-countdown="0" data-from="99">0</span> €</span><h3>Abonnement CVTL Lab</h3><p>Aucun abonnement mensuel après la livraison.</p></article>
<article class="zero-item" data-reveal><span class="zero-value"><span data-countdown="0" data-from="99">0</span> €</span><h3>Frais de service récurrents</h3><p>Pas de commission ni de frais mensuels ajoutés par CVTL Lab.</p></article>
<article class="zero-item" data-reveal><span class="zero-value"><span data-countdown="0" data-from="99">0</span> €</span><h3>Garantie corrective</h3><p>Les anomalies directement liées à la solution livrée sont corrigées selon les conditions et la durée prévues au devis.</p></article>
</div>
<p class="pricing-note" data-reveal>Les évolutions fonctionnelles, ajouts de contenu et interventions liées à des services tiers sont chiffrés séparément si nécessaire. Un nom de domaine, un hébergement, une API ou un logiciel tiers peut avoir son propre coût, annoncé avant le lancement.</p>
</div>
</section>

<section class="method" id="methode" data-theme="light">
<div class="container method-grid">
<div class="method-head">
<p class="eyebrow" data-reveal>Méthode</p>
<h2 data-split>Simple du début à la livraison.</h2>
<p data-reveal>Échange autour de Bordeaux quand c’est possible, sinon en visioconférence.</p>
</div>
<div class="steps-wrap" id="steps"><span class="steps-line" aria-hidden="true"><i></i></span>
<ol class="steps">
<li class="step" data-reveal><span class="step-dot" aria-hidden="true"></span><span class="step-tag">01 · Échange</span><h3>Vous m’expliquez le besoin</h3><p>Ce que vous faites aujourd’hui, ce qui bloque et ce que vous voulez améliorer.</p></li>
<li class="step" data-reveal><span class="step-dot" aria-hidden="true"></span><span class="step-tag">02 · Proposition</span><h3>Je vous propose une solution</h3><p>Vous savez ce qui sera réalisé, pourquoi et quels coûts externes peuvent exister.</p></li>
<li class="step" data-reveal><span class="step-dot" aria-hidden="true"></span><span class="step-tag">03 · Livraison</span><h3>Je réalise et je vous livre</h3><p>La solution est mise en place, expliquée et prête à être utilisée.</p></li>
</ol></div>
</div>
</section>

<section class="about" id="apropos" data-theme="light">
<div class="about-mark" aria-hidden="true" data-parallax="-0.12">${logo('about-logo')}</div>
<div class="container about-grid">
<div class="about-title">
<p class="eyebrow" data-reveal>À propos</p>
<h2 data-split>Un interlocuteur unique, basé au Taillan-Médoc en Gironde.</h2>
</div>
<div class="about-copy">
<p data-reveal>Je suis étudiant ingénieur et passionné par l’informatique, le développement et l’intelligence artificielle. J’ai créé CVTL Lab pour mettre ces outils au service d’entreprises locales avec une approche directe, compréhensible et adaptée à leur quotidien.</p>
<p data-reveal>Quand c’est pertinent, je privilégie les échanges en personne autour de Bordeaux afin de mieux comprendre le besoin et de garder une relation simple tout au long du projet.</p>
<p class="about-note" data-reveal>Vous gardez un seul interlocuteur du premier échange jusqu’à la livraison.</p>
</div>
</div>
</section>

<section class="contact" id="contact" data-theme="light">
<div class="container contact-shell">
<div class="contact-intro" data-reveal>
<div class="contact-intro-bg" aria-hidden="true"></div>
<p class="eyebrow">Contact</p>
<h2>Parlez-moi de votre projet.</h2>
<p>Commencez par l’essentiel. Les précisions de délai, budget ou entreprise restent facultatives.</p>
<ul class="contact-points">
<li><span class="contact-dot" aria-hidden="true"></span><span>Pas besoin de connaître la solution technique.</span></li>
<li><span class="contact-dot" aria-hidden="true"></span><span>Les champs marqués d’un astérisque sont les seuls obligatoires.</span></li>
<li><span class="contact-dot" aria-hidden="true"></span><span>Vous pouvez aussi simplement décrire votre problème dans le message.</span></li>
</ul>
<a class="contact-direct" href="mailto:${SITE.email}">${SITE.email}</a>
</div>
<div class="contact-form-card" data-reveal>
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
<details class="form-optional-details"><summary>Ajouter des précisions (facultatif)</summary><div class="form-grid optional-grid">
<div class="form-field"><label class="form-label" for="phone">Téléphone <span class="form-optional">facultatif</span></label><input autocomplete="tel" class="form-control" id="phone" inputmode="tel" maxlength="40" name="Téléphone" placeholder="06 00 00 00 00" type="tel"></div>
<div class="form-field"><label class="form-label" for="company">Entreprise <span class="form-optional">facultatif</span></label><input autocomplete="organization" class="form-control" id="company" maxlength="120" name="Entreprise" placeholder="Nom de l’entreprise" type="text"></div>
<div class="form-field"><label class="form-label" for="profile">Votre activité</label><select class="form-control" id="profile" name="Activité"><option disabled selected value="">Sélectionnez si utile</option><option value="Indépendant">Indépendant</option><option value="Commerce">Commerce</option><option value="TPE ou PME">TPE ou PME</option><option value="Association">Association</option><option value="Projet en création">Projet en création</option><option value="Autre">Autre</option></select></div>
<div class="form-field"><label class="form-label" for="timeline">Démarrage souhaité</label><select class="form-control" id="timeline" name="Démarrage souhaité"><option selected value="À définir">À définir</option><option value="Dès que possible">Dès que possible</option><option value="Dans le mois">Dans le mois</option><option value="Dans 1 à 3 mois">Dans 1 à 3 mois</option><option value="Plus tard">Plus tard</option></select></div>
<div class="form-field full"><label class="form-label" for="budget">Budget envisagé <span class="form-optional">facultatif</span></label><select class="form-control" id="budget" name="Budget envisagé"><option selected value="À définir">À définir</option><option value="Moins de 1 000 €">Moins de 1 000 €</option><option value="1 000 à 2 500 €">1 000 à 2 500 €</option><option value="2 500 à 5 000 €">2 500 à 5 000 €</option><option value="5 000 € et plus">5 000 € et plus</option></select></div>
</div></details>
<fieldset class="choice-fieldset"><legend class="choice-title">Quel est votre besoin principal ? *</legend><div class="choice-grid">
${needs}
</div></fieldset>
<div class="form-field full form-message"><label class="form-label" for="message">Votre message *</label><textarea class="form-control" id="message" maxlength="3000" name="Message" placeholder="Décrivez ce que vous souhaitez créer, améliorer ou automatiser. Quelques phrases suffisent." required></textarea></div>
<p class="privacy-note">Les informations envoyées sont utilisées pour répondre à votre demande. <a href="confidentialite.html">En savoir plus sur vos données et vos droits.</a></p>
<div class="form-footer"><button class="button button-primary form-submit" type="submit" data-magnetic><span class="label">Envoyer ma demande</span><span class="spinner" aria-hidden="true"></span></button><p class="form-note">Envoi sécurisé via FormSubmit. Un contrôle anti-spam peut s’afficher avant l’envoi.</p></div>
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
  return `${head({ title: s.title, description: s.description, path: `${s.slug}.html`, ld: jsonLd(ld) })}
<body class="page-sub">
${header({ home: false })}
<main id="contenu">
<section class="sub-hero" data-theme="dark">
<div class="hero-bg" aria-hidden="true"><div class="hero-lines"></div><div class="hero-glow"></div><div class="hero-spot"></div></div>
<div class="container sub-hero-grid">
<div>
<nav class="breadcrumbs" aria-label="Fil d’Ariane" data-hero><a href="index.html">Accueil</a><span aria-hidden="true">/</span><span>${esc(s.crumb)}</span></nav>
<p class="eyebrow" data-hero>${esc(s.eyebrow)}</p>
<h1 data-split data-hero>${esc(s.h1)}</h1>
<p class="lead" data-hero>${esc(s.lead)}</p>
<div class="hero-actions" data-hero><a class="button button-primary" href="index.html#contact" data-magnetic><span>Parler de mon projet</span>${arrow}</a><a class="button button-ghost" href="services-numeriques-bordeaux-gironde.html" data-magnetic><span>Zone d’intervention</span></a></div>
</div>
<aside class="side-card" data-hero><div class="side-icon">${icon(s.key)}</div><span class="side-label">${esc(s.sideLabel)}</span><strong>${esc(s.sideTitle)}</strong><p>${esc(s.sideText)}</p></aside>
</div>
</section>

<section class="block" data-theme="light"><div class="container two-col">
<div><p class="eyebrow" data-reveal>${esc(s.approach.eyebrow)}</p><h2 data-split>${esc(s.approach.h2)}</h2></div>
<div class="copy">${s.approach.p.map((p) => `<p data-reveal>${esc(p)}</p>`).join('')}</div>
</div></section>

<section class="block block-soft" data-theme="light"><div class="container">
<p class="eyebrow" data-reveal>${esc(s.scope.eyebrow)}</p><h2 data-split>${esc(s.scope.h2)}</h2>
<ul class="check-grid">${s.scope.items.map((i) => `<li data-reveal>${esc(i)}</li>`).join('')}</ul>
</div></section>

<section class="block" data-theme="light"><div class="container">
<p class="eyebrow" data-reveal>${esc(s.cases.eyebrow)}</p><h2 data-split>${esc(s.cases.h2)}</h2>
<div class="case-grid">${s.cases.cards.map((c, i) => `<article class="case" data-spot data-reveal><span class="case-n">0${i + 1}</span><h3>${esc(c.t)}</h3><p>${esc(c.p)}</p></article>`).join('')}</div>
</div></section>

<section class="local-band" data-theme="dark"><div class="container local-band-grid">
<div><p class="eyebrow" data-reveal>Local</p><h2 data-split>Bordeaux Métropole et toute la Gironde.</h2></div>
<div data-reveal><p>CVTL Lab est basé au Taillan-Médoc. Les projets peuvent être menés avec des entreprises de Bordeaux, Mérignac, Pessac, Talence, Bègles, Le Bouscat, Saint-Médard-en-Jalles et des autres communes de la métropole, ainsi que dans le reste de la Gironde.</p><a class="text-link" href="services-numeriques-bordeaux-gironde.html">Voir toutes les zones couvertes →</a></div>
</div></section>

<section class="block" data-theme="light"><div class="container faq-shell">
<p class="eyebrow" data-reveal>${esc(s.faq.eyebrow)}</p><h2 data-split>${esc(s.faq.h2)}</h2>
<div class="faq-list">${s.faq.items.map((f) => `<details class="faq" data-reveal><summary><span>${esc(f.q)}</span><i aria-hidden="true"></i></summary><div class="faq-body"><p>${esc(f.a)}</p></div></details>`).join('')}</div>
</div></section>

<section class="block block-soft" data-theme="light"><div class="container">
<p class="eyebrow" data-reveal>Poursuivre</p><h2 data-split>Les autres services.</h2>
<div class="next-grid">${others.map((o) => `<a class="next-card" data-spot data-reveal href="${o.slug}.html"><span class="next-ic">${icon(o.key)}</span><strong>${esc(SHORT[o.key] || o.crumb)}</strong>${arrow}</a>`).join('')}</div>
</div></section>

<section class="cta" data-theme="dark"><div class="cta-glow" aria-hidden="true"></div><div class="container cta-inner">
<div><p class="eyebrow" data-reveal>Projet</p><h2 data-split>Un besoin précis suffit pour commencer.</h2><p data-reveal>Expliquez la situation actuelle, le problème à résoudre et ce que vous aimeriez obtenir. La solution technique peut être définie ensuite.</p></div>
<a class="button button-primary button-lg" href="index.html#contact" data-magnetic><span>Parler de mon projet</span>${arrow}</a>
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
<div class="hero-bg" aria-hidden="true"><div class="hero-lines"></div><div class="hero-glow"></div><div class="hero-spot"></div></div>
<div class="container sub-hero-grid">
<div>
<nav class="breadcrumbs" aria-label="Fil d’Ariane" data-hero><a href="index.html">Accueil</a><span aria-hidden="true">/</span><span>Bordeaux &amp; Gironde</span></nav>
<p class="eyebrow" data-hero>Zone d’intervention</p>
<h1 data-split data-hero>Services numériques à Bordeaux Métropole et en Gironde.</h1>
<p class="lead" data-hero>CVTL Lab est basé au Taillan-Médoc et accompagne les indépendants, commerces, associations et TPE/PME sur leurs projets de sites web, automatisations, outils métier et intégrations d’IA.</p>
<div class="hero-actions" data-hero><a class="button button-primary" href="index.html#contact" data-magnetic><span>Parler de mon projet</span>${arrow}</a><a class="button button-ghost" href="index.html#services" data-magnetic><span>Voir les services</span></a></div>
</div>
<aside class="side-card" data-hero><div class="side-pin"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path pathLength="1" d="M24 43s13-11.5 13-22a13 13 0 1 0-26 0c0 10.5 13 22 13 22z"/><circle pathLength="1" cx="24" cy="21" r="4.5"/></svg></div><span class="side-label">Base locale</span><strong>Le Taillan-Médoc</strong><p>Échanges à distance dans toute la Gironde et rendez-vous en personne autour de Bordeaux lorsque le projet le justifie.</p></aside>
</div>
</section>

<section class="block" data-theme="light"><div class="container two-col">
<div><p class="eyebrow" data-reveal>Bordeaux Métropole</p><h2 data-split>Les 28 communes de la métropole.</h2></div>
<div class="copy"><p data-reveal>La proximité permet d’organiser un échange en personne lorsqu’il apporte une vraie valeur : cadrage d’un besoin métier, compréhension d’un processus ou lancement d’un projet. Le reste du travail peut être réalisé à distance.</p><p data-reveal>CVTL Lab intervient sur l’ensemble de Bordeaux Métropole :</p></div>
</div>
<div class="container"><ul class="commune-grid">${COMMUNES.map((c) => `<li data-reveal>${esc(c)}</li>`).join('')}</ul></div>
</section>

<section class="block block-soft" data-theme="light"><div class="container">
<p class="eyebrow" data-reveal>Gironde</p><h2 data-split>Au-delà de la métropole : toute la Gironde.</h2>
<div class="case-grid">${regions.map(([t, p], i) => `<article class="case" data-spot data-reveal><span class="case-n">0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`).join('')}</div>
</div></section>

<section class="block" data-theme="light"><div class="container">
<p class="eyebrow" data-reveal>Services locaux</p><h2 data-split>Un même interlocuteur pour le web et les outils numériques.</h2>
<div class="next-grid next-grid-lg">${services.map((o) => `<a class="next-card" data-spot data-reveal href="${o.slug}.html"><span class="next-ic">${icon(o.key)}</span><strong>${esc(o.sideTitle)}</strong><em>Bordeaux &amp; Gironde</em>${arrow}</a>`).join('')}</div>
</div></section>

<section class="cta" data-theme="dark"><div class="cta-glow" aria-hidden="true"></div><div class="container cta-inner">
<div><p class="eyebrow" data-reveal>Projet en Gironde</p><h2 data-split>Expliquez simplement le besoin.</h2><p data-reveal>Le premier échange sert à comprendre votre activité, le problème à résoudre et le niveau de solution réellement nécessaire.</p></div>
<a class="button button-primary button-lg" href="index.html#contact" data-magnetic><span>Parler de mon projet</span>${arrow}</a>
</div></section>
</main>
${footer(services)}
${tail()}`;
}

/* ------------------------------------------------------------------ LÉGAL / MERCI / 404 */
export function legalPage(slug, data, services) {
  return `${head({ title: data.title, description: data.description, path: `${slug}.html`, robots: 'noindex, follow', og: false })}
<body class="page-sub page-legal">
${header({ home: false })}
<main id="contenu" class="legal-main">
<section class="legal-hero" data-theme="dark"><div class="hero-bg" aria-hidden="true"><div class="hero-lines"></div><div class="hero-glow"></div></div><div class="container legal-shell"><a class="back-link" href="index.html" data-hero>← Retour au site</a><p class="eyebrow" data-hero>${data.eyebrow}</p><h1 data-hero>${data.h1}</h1></div></section>
<section class="legal-body" data-theme="light"><div class="container legal-shell legal-content">${data.body}</div></section>
</main>
${footer(services)}
${tail()}`;
}

export function simplePage({ slug, title, description, eyebrow, h1, lead, cta = 'Retour à l’accueil', robots, services, big }) {
  return `${head({ title, description: description || title, path: `${slug}.html`, robots, og: false })}
<body class="page-sub page-simple">
${header({ home: false })}
<main id="contenu" class="simple-main">
<section class="simple" data-theme="dark"><div class="hero-bg" aria-hidden="true"><div class="hero-lines"></div><div class="hero-glow"></div><div class="hero-spot"></div></div>
<div class="container simple-inner">
${big ? `<div class="simple-big" aria-hidden="true">${big}</div>` : `<div class="simple-logo" aria-hidden="true">${logo('simple-logo-svg')}</div>`}
<p class="eyebrow" data-hero>${eyebrow}</p><h1 data-hero>${h1}</h1><p class="lead" data-hero>${lead}</p>
<p data-hero><a class="button button-primary" href="index.html" data-magnetic><span>${cta}</span>${arrow}</a></p>
</div></section>
</main>
${footer(services)}
${tail()}`;
}
