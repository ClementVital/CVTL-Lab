/* main.js — point d'entrée CVTL Lab */
import { runIntro } from './intro.js';
import { splitText, reveals, heroIndexes, counters, pointerFx, heroPointer, scrollFx } from './fx.js';
import { menu, faq, form, prefetch, year } from './ui.js';

const d = document.documentElement;
const go = () => d.classList.add('hero-go');

try {
  splitText();
  heroIndexes();
  menu(); faq(); form(); prefetch(); year();
  pointerFx(); heroPointer(); scrollFx();
  counters();
  reveals();
} catch (err) {
  console.error('[CVTL] init', err);
  d.classList.add('js-failed');
}
d.classList.add('ready');

if (d.classList.contains('intro-on')) {
  runIntro({ onExitStart: go }).catch((err) => {
    console.error('[CVTL] intro', err);
    d.classList.remove('intro-on', 'intro-exit');
    document.getElementById('intro')?.remove();
    document.querySelectorAll('main, .site-header, footer').forEach((el) => (el.inert = false));
    go();
  });
} else {
  requestAnimationFrame(() => requestAnimationFrame(go));
}
