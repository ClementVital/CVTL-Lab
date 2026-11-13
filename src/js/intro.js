/* intro.js — introduction cinématique du logo (Web Animations API, sans dépendance).
   Séquence : tracé vectoriel → assemblage des faces → puce bleue + onde →
   wordmark → compteur → sortie (le logo « vole » jusqu'au header, les rideaux s'ouvrent). */

const OUT = 'cubic-bezier(.16,1,.3,1)';
const IO = 'cubic-bezier(.65,0,.35,1)';
const BOUNCE = 'cubic-bezier(.34,1.56,.64,1)';

export function runIntro({ onExitStart } = {}) {
  const d = document.documentElement;
  const root = document.getElementById('intro');
  if (!root) { d.classList.remove('intro-on'); onExitStart?.(); return Promise.resolve(); }

  const $ = (s) => root.querySelector(s);
  const $$ = (s) => [...root.querySelectorAll(s)];
  const faces = $$('.lf'), chip = $('.lc'), ring = $('.intro-ring');
  const grid = $('.intro-grid'), glow = $('.intro-glow'), scan = $('.intro-scan');
  const meta = $('.intro-meta'), count = $('.intro-count'), skipBtn = $('#introSkip');
  const letters = $$('.intro-letters .ch > span'), dot = $('.intro-dot'), tag = $('.intro-tag');
  const word = $('.intro-word'), wrap = $('.intro-logo-wrap');
  const top = $('.intro-panel-top'), bottom = $('.intro-panel-bottom');
  const counter = document.getElementById('introCount');
  const locked = [...document.querySelectorAll('main, .site-header, footer')];
  locked.forEach((el) => (el.inert = true));

  const anims = [];
  const A = (el, kf, o) => { const a = el.animate(kf, { fill: 'both', ...o }); anims.push(a); return a; };

  let skipped = false, wake;
  const skipSignal = new Promise((r) => (wake = r));
  const sleep = (ms) => Promise.race([new Promise((r) => setTimeout(r, ms)), skipSignal]);
  const skip = () => { if (!skipped) { skipped = true; wake(); } };

  skipBtn?.addEventListener('click', skip);
  document.addEventListener('keydown', onKey);
  function onKey(e) { if (['Enter', ' ', 'Escape'].includes(e.key)) { e.preventDefault(); skip(); } }
  const clickTimer = setTimeout(() => root.addEventListener('pointerdown', skip, { once: true }), 900);
  skipBtn?.focus({ preventScroll: true });

  /* ---- Acte 1 : ambiance + tracé + assemblage ---- */
  A(grid, [{ opacity: 0 }, { opacity: 1 }], { duration: 1600, easing: IO });
  A(glow, [{ opacity: 0, transform: 'translate(-50%,-50%) scale(.4)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }], { duration: 2400, delay: 200, easing: OUT });
  A(scan, [{ opacity: 1, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)', offset: 0.55 }, { opacity: 0, transform: 'scaleX(1)' }], { duration: 1400, delay: 350, easing: IO });
  [meta, count, skipBtn].forEach((el, i) => A(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 500 + i * 120, easing: IO }));

  const off = [[46, -78], [-78, 14], [52, 86]];
  faces.forEach((f, i) => {
    A(f, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1100, delay: 250 + i * 170, easing: IO });
    A(f, [{ transform: `translate(${off[i][0]}px,${off[i][1]}px)` }, { transform: 'translate(0px,0px)' }], { duration: 1500, delay: 600 + i * 150, easing: OUT });
    A(f, [{ fillOpacity: 0 }, { fillOpacity: 1 }], { duration: 650, delay: 1250 + i * 150, easing: IO });
  });

  /* ---- Acte 2 : puce bleue + onde de choc ---- */
  A(chip, [{ transform: 'scale(0)' }, { transform: 'scale(1.3)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 950, delay: 2000, easing: OUT });
  A(ring, [{ transform: 'translate(-50%,-50%) scale(0)', opacity: 0.95 }, { transform: 'translate(-50%,-50%) scale(3.4)', opacity: 0 }], { duration: 1500, delay: 2050, easing: OUT });
  A(wrap, [{ transform: 'scale(1)' }, { transform: 'scale(1.035)', offset: 0.5 }, { transform: 'scale(1)' }], { duration: 900, delay: 2000, easing: OUT });

  /* ---- Acte 3 : wordmark ---- */
  letters.forEach((l, i) => A(l, [{ transform: 'translateY(115%)' }, { transform: 'translateY(0)' }], { duration: 1100, delay: 2350 + i * 55, easing: OUT }));
  A(dot, [{ transform: 'translateY(-420%) scale(0)', opacity: 0 }, { transform: 'translateY(0) scale(1)', opacity: 1 }], { duration: 900, delay: 2900, easing: BOUNCE });
  A(tag, [{ opacity: 0, transform: 'translateY(12px)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 1100, delay: 3000, easing: OUT });

  /* ---- Compteur synchronisé sur la timeline ---- */
  const t0 = performance.now() + 300, dur = 3300;
  let raf;
  const tick = (t) => {
    const p = Math.min(Math.max((t - t0) / dur, 0), 1);
    counter.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * 100)).padStart(3, '0');
    if (p < 1 && !skipped) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return (async () => {
    await sleep(4500);
    cancelAnimationFrame(raf);
    counter.textContent = '100';
    if (skipped) anims.forEach((a) => { try { a.finish(); } catch (e) {} });
    const D = skipped ? 800 : 1250;

    /* ---- Sortie : le logo rejoint le header, les rideaux s'ouvrent ---- */
    d.classList.add('intro-exit');
    clearTimeout(clickTimer);
    document.removeEventListener('keydown', onKey);
    [tag, meta, count, skipBtn, grid, scan].forEach((el) => A(el, [{ opacity: 1 }, { opacity: 0 }], { duration: D * 0.45, easing: IO }));
    A(word, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-26px)' }], { duration: D * 0.55, easing: IO });
    A(glow, [{ opacity: 1 }, { opacity: 0 }], { duration: D, easing: IO });
    faces.forEach((f) => A(f, [{ strokeOpacity: 1 }, { strokeOpacity: 0 }], { duration: D * 0.3, easing: IO }));

    const target = document.querySelector('#brand .brand-logo')?.getBoundingClientRect();
    const from = wrap.getBoundingClientRect();
    if (target && target.width) {
      const dx = target.left + target.width / 2 - (from.left + from.width / 2);
      const dy = target.top + target.height / 2 - (from.top + from.height / 2);
      A(wrap, [{ transform: 'none' }, { transform: `translate(${dx}px,${dy}px) scale(${target.width / from.width})` }], { duration: D, delay: D * 0.12, easing: IO });
    }
    A(top, [{ transform: 'none' }, { transform: 'translateY(-101%)' }], { duration: D, delay: D * 0.3, easing: IO });
    A(bottom, [{ transform: 'none' }, { transform: 'translateY(101%)' }], { duration: D, delay: D * 0.3, easing: IO });

    await new Promise((r) => setTimeout(r, D * 0.36));
    onExitStart?.();
    await new Promise((r) => setTimeout(r, D * 1.08));

    // Handoff atomique : on retire l'intro et on dévoile le vrai logo du header.
    anims.forEach((a) => { try { a.cancel(); } catch (e) {} });
    root.remove();
    d.classList.remove('intro-on', 'intro-exit');
    locked.forEach((el) => (el.inert = false));
    try { sessionStorage.setItem('cvtl-intro', '1'); history.scrollRestoration = 'auto'; } catch (e) {}
    document.querySelector('#brand .brand-logo')?.animate([{ transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 700, easing: OUT });
  })();
}
