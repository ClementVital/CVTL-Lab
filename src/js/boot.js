/* boot.js — exécuté en <head>, bloquant et minuscule : décide AVANT le premier
   rendu si l'intro joue, pour éviter tout flash de contenu. */
(function () {
  var d = document.documentElement;
  d.classList.remove('no-js');
  d.classList.add('js');
  var reduce = false, seen = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  try { seen = sessionStorage.getItem('cvtl-intro') === '1'; } catch (e) {}
  var isHome = d.getAttribute('data-page') === 'home';
  var deepLink = location.hash && location.hash.length > 1;
  var forced = /[?&]intro=1/.test(location.search);
  if (isHome && !reduce && (forced || (!seen && !deepLink))) {
    d.classList.add('intro-on');
    try { history.scrollRestoration = 'manual'; } catch (e) {}
    window.scrollTo(0, 0);
  }
  // Filet de sécurité : si le module principal échoue, on rend tout visible.
  setTimeout(function () {
    if (!d.classList.contains('ready')) {
      d.classList.add('js-failed', 'hero-go');
      d.classList.remove('intro-on', 'intro-exit');
    }
  }, 5000);
})();
