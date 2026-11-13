/* fx.js — mouvement : révélations, texte découpé, compteurs, spotlight, magnétisme, parallaxe, scroll. */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Texte découpé en mots (masque + montée) ---------- */
export function splitText() {
  $$('[data-split]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const outer = document.createElement('span');
      outer.className = 'w';
      const inner = document.createElement('span');
      inner.className = 'wi';
      inner.style.setProperty('--wi', i);
      inner.textContent = w;
      outer.append(inner);
      el.append(outer);
      if (i < words.length - 1) el.append(' ');
    });
  });
}

/* ---------- Révélations au scroll (+ stagger automatique) ---------- */
export function reveals() {
  const items = $$('[data-reveal], [data-split]:not([data-hero])');
  if (reduce || !('IntersectionObserver' in window)) { items.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    vis.forEach((e, i) => {
      e.target.style.setProperty('--d', Math.min(i * 90, 450) + 'ms');
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach((e) => io.observe(e));
}

/* ---------- Hero : indices de stagger ---------- */
export function heroIndexes() {
  $$('[data-hero]').forEach((e, i) => e.style.setProperty('--hi', i));
}

/* ---------- Compteurs : décompte vers 0 (€) et comptage des stats ---------- */
export function counters() {
  const run = (el, from, to, dur = 1800) => {
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = (t) => {
      const p = clamp((t - t0) / dur);
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const targets = $$('[data-countdown], [data-count]');
  targets.forEach((el) => {
    if (el.dataset.countdown !== undefined) el.textContent = el.dataset.from; // départ visible avant l'animation
    else el.textContent = '0';
  });
  if (!('IntersectionObserver' in window)) { targets.forEach((el) => (el.textContent = el.dataset.countdown ?? el.dataset.count)); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el);
    const start = () => setTimeout(() => {
      if (el.dataset.countdown !== undefined) run(el, +el.dataset.from, +el.dataset.countdown, 2200);
      else run(el, 0, +el.dataset.count, 1600);
    }, el.closest('.hero') ? 1100 : 250);
    // Dans le hero : on attend la fin de l'intro (classe hero-go)
    const root = document.documentElement;
    if (!el.closest('.hero') || root.classList.contains('hero-go')) start();
    else new MutationObserver((_, mo) => { if (root.classList.contains('hero-go')) { mo.disconnect(); start(); } }).observe(root, { attributes: true, attributeFilter: ['class'] });
  }), { threshold: 0.6 });
  targets.forEach((el) => io.observe(el));
}

/* ---------- Spotlight des cartes + magnétisme des boutons ---------- */
export function pointerFx() {
  if (!fine || reduce) return;
  $$('[data-spot]').forEach((c) => {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--x', e.clientX - r.left + 'px');
      c.style.setProperty('--y', e.clientY - r.top + 'px');
    }, { passive: true });
  });
  $$('[data-magnetic]').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
      b.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }, { passive: true });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
}

/* ---------- Hero interactif : logo « éclaté » + spotlight qui suit le curseur ---------- */
export function heroPointer() {
  const heroes = $$('.hero, .sub-hero, .simple, .legal-hero');
  if (!heroes.length || reduce) return;
  heroes.forEach((hero) => {
    const st = { mx: 0, my: 0, sx: 70, sy: 40, tx: 70, ty: 40, running: false };
    const apply = () => {
      st.sx += (st.tx - st.sx) * 0.1; st.sy += (st.ty - st.sy) * 0.1;
      hero.style.setProperty('--sx', st.sx.toFixed(2) + '%');
      hero.style.setProperty('--sy', st.sy.toFixed(2) + '%');
      if (Math.abs(st.tx - st.sx) > 0.05 || Math.abs(st.ty - st.sy) > 0.05) requestAnimationFrame(apply);
      else st.running = false;
    };
    const move = (e) => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
      st.tx = nx * 100; st.ty = ny * 100;
      hero.style.setProperty('--mx', ((nx - 0.5) * 2).toFixed(3));
      hero.style.setProperty('--my', ((ny - 0.5) * 2).toFixed(3));
      if (!st.running) { st.running = true; requestAnimationFrame(apply); }
    };
    if (fine) {
      hero.addEventListener('pointermove', move, { passive: true });
      hero.addEventListener('pointerleave', () => { hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0); });
    } else if ('DeviceOrientationEvent' in window) {
      // Mobile : inclinaison douce si le capteur est disponible sans permission.
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma == null) return;
        hero.style.setProperty('--mx', clamp(e.gamma / 30, -1, 1).toFixed(3));
        hero.style.setProperty('--my', clamp((e.beta - 45) / 30, -1, 1).toFixed(3));
      }, { passive: true });
    }
  });
}

/* ---------- Scroll : progression, header (thème + état), nav active, méthode, parallaxe ---------- */
export function scrollFx() {
  const root = document.documentElement;
  const header = document.getElementById('siteHeader');
  const themed = $$('main [data-theme], footer[data-theme]');
  const navLinks = $$('.nav-links a[data-nav]');
  const secs = navLinks.map((a) => document.getElementById(a.dataset.nav)).filter(Boolean);
  const stepsWrap = document.getElementById('steps');
  const steps = $$('.step');
  const par = $$('[data-parallax]');
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    const max = Math.max(root.scrollHeight - vh, 1);
    document.querySelector('.progress')?.style.setProperty('--p', clamp(y / max).toFixed(4));
    header?.classList.toggle('is-scrolled', y > 40);

    // Thème du header = thème de la section sous la pilule
    if (header) {
      const probe = 44;
      let theme = 'dark';
      for (const s of themed) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) { theme = s.dataset.theme; break; }
      }
      if (header.dataset.theme !== theme) header.dataset.theme = theme;
    }

    // Lien actif (section qui occupe le centre de l'écran)
    secs.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      navLinks[i].classList.toggle('is-active', r.top < vh * 0.45 && r.bottom > vh * 0.45);
    });

    // Méthode : ligne qui se dessine + étapes actives
    if (stepsWrap) {
      const r = stepsWrap.getBoundingClientRect();
      const p = clamp((vh * 0.62 - r.top) / (r.height - 40));
      stepsWrap.style.setProperty('--sp', p.toFixed(4));
      steps.forEach((s) => s.classList.toggle('is-active', s.getBoundingClientRect().top < vh * 0.62));
    }

    // Parallaxe
    if (!reduce) par.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const k = parseFloat(el.dataset.parallax) || 0;
      el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * k).toFixed(1)}px, 0)`;
    });
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req, { passive: true });
  update();
}
