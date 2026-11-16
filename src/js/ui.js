/* ui.js — menu mobile, FAQ animée, formulaire, préchargement des pages. */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const OUT = 'cubic-bezier(.16,1,.3,1)';

export function menu() {
  const toggle = $('#menuToggle'), panel = $('#mobileMenu');
  if (!toggle || !panel) return;
  const root = document.documentElement;
  const set = (open, { returnFocus = false } = {}) => {
    panel.classList.toggle('open', open);
    panel.inert = !open;
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (open) requestAnimationFrame(() => $('a', panel)?.focus({ preventScroll: true }));
    else if (returnFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', panel).forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { e.preventDefault(); set(false, { returnFocus: true }); }
  });
  matchMedia('(min-width: 901px)').addEventListener?.('change', (m) => m.matches && set(false));
}

/* Volets repliables (FAQ, « en savoir plus », légal) : animation de hauteur (WAAPI) */
export function faq() {
  $$('details.faq, details.more').forEach((d) => {
    const body = d.querySelector(':scope > .faq-body, :scope > .more-body');
    const sum = d.querySelector(':scope > summary');
    if (!body || !sum) return;
    let anim;
    sum.addEventListener('click', (e) => {
      if (reduce) return;
      e.preventDefault();
      anim?.cancel();
      if (!d.open) {
        d.open = true;
        const h = body.scrollHeight;
        anim = body.animate({ height: ['0px', h + 'px'], opacity: [0, 1] }, { duration: 550, easing: OUT });
        anim.onfinish = () => (anim = null);
      } else {
        const h = body.offsetHeight;
        anim = body.animate({ height: [h + 'px', '0px'], opacity: [1, 0] }, { duration: 400, easing: OUT });
        anim.onfinish = () => { d.open = false; anim = null; };
      }
    });
  });
}

/* Onglets accessibles (services, étapes) : flèches, Home/End, un seul panneau visible */
export function tabs() {
  $$('[data-tabs]').forEach((root) => {
    const list = $$('[role="tab"]', root);
    const panels = list.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const stepper = root.hasAttribute('data-stepper');
    const select = (i, { focus = false, animate = true } = {}) => {
      list.forEach((t, j) => {
        t.setAttribute('aria-selected', String(i === j));
        t.tabIndex = i === j ? 0 : -1;
        if (stepper) t.classList.toggle('is-done', j < i);
      });
      panels.forEach((p, j) => {
        if (!p) return;
        p.hidden = j !== i;
        if (j === i && animate && !reduce) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
      });
      if (stepper) root.style.setProperty('--tp', (i / Math.max(list.length - 1, 1)).toFixed(3));
      if (focus) list[i].focus();
    };
    list.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const n = list.length;
        const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (e.key in map) { e.preventDefault(); select((i + map[e.key] + n) % n, { focus: true }); }
        else if (e.key === 'Home') { e.preventDefault(); select(0, { focus: true }); }
        else if (e.key === 'End') { e.preventDefault(); select(n - 1, { focus: true }); }
      });
    });
    select(0, { animate: false });
  });
}

/* « Voir les N autres » et « Tout déplier » */
export function toggles() {
  $$('[data-more]').forEach((btn) => {
    const list = document.getElementById(btn.getAttribute('aria-controls'));
    const label = $('span', btn);
    btn.addEventListener('click', () => {
      const open = list.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      label.textContent = open ? btn.dataset.lessLabel : btn.dataset.moreLabel;
    });
  });
  $$('[data-expand-all]').forEach((btn) => {
    const box = document.getElementById(btn.dataset.expandAll);
    const label = $('span', btn);
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-pressed') !== 'true';
      $$('details', box).forEach((d) => (d.open = on));
      btn.setAttribute('aria-pressed', String(on));
      label.textContent = on ? btn.dataset.closeLabel : btn.dataset.openLabel;
    });
  });
}

/* Formulaire : validation visible, état de chargement, anti double-envoi */
export function form() {
  const f = $('#contactForm');
  if (!f) return;
  const btn = $('.form-submit', f);
  f.addEventListener('submit', (e) => {
    if (!f.checkValidity()) {
      e.preventDefault();
      f.classList.add('was-validated');
      const bad = $(':invalid', f);
      bad?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => bad?.focus({ preventScroll: true }), 350);
      return;
    }
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');
    $('.label', btn).textContent = 'Envoi en cours…';
  });
  // Page restaurée depuis le cache (bouton retour) : on ne reste pas « en envoi »
  addEventListener('pageshow', (e) => {
    if (e.persisted) { btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); $('.label', btn).textContent = 'Envoyer ma demande'; }
  });
}

/* Précharge les pages internes au survol / toucher : navigation quasi instantanée */
export function prefetch() {
  const done = new Set();
  const go = (a) => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || /^https?:/.test(href)) return;
    const url = new URL(href, location.href);
    url.hash = '';
    if (url.origin !== location.origin || url.pathname === location.pathname || done.has(url.href)) return;
    done.add(url.href);
    const l = document.createElement('link');
    l.rel = 'prefetch'; l.href = url.href;
    document.head.append(l);
  };
  const on = (e) => { const a = e.target.closest?.('a[href]'); if (a) go(a); };
  document.addEventListener('pointerover', on, { passive: true });
  document.addEventListener('touchstart', on, { passive: true });
}

export function year() {
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
}
