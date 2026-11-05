// New homepage hero. Markup, styles and assets all live in Webflow (every class is `wh-` prefixed);
// this module only wires up behaviour, and runs only when the hero root (.wh-root) is on the page.
import { initClouds } from './clouds.js';
import { initIntro } from './intro.js';
import { initHero } from './hero.js';
import { initMobileHero } from './mobile-hero.js';
import { initPopups } from './popups.js';
import { initMotion, destroyMotion, setMotionScope } from './motion.js';
import { initBarks } from './barks.js';
import { pauseMusic, resumeMusic } from './audio.js';

/**
 * Webflow's builder turns <button>s into links, so every control is <a href="#" role="button">.
 * Stop those links jumping to the top of the page, and let Space activate them like a button
 * (Enter already fires click on links).
 */
function initLinkButtons(root) {
  // Capture phase so a handler calling stopPropagation (e.g. barks) can't let the jump through.
  root.addEventListener('click', (e) => {
    if (e.target.closest('a[href="#"]')) e.preventDefault();
  }, true);
  root.addEventListener('keydown', (e) => {
    if (e.key !== ' ' && e.key !== 'Spacebar') return;
    const btn = e.target.closest?.('a[role="button"]');
    if (!btn) return;
    e.preventDefault(); // no page scroll
    btn.click();
  });
}

/**
 * `skipIntro`: the visitor arrived from another page on the site, so the Enter screen and the hero's
 * entrance are skipped; the page transition is their way in. Returns the teardown function.
 */
export function initNewHero({ skipIntro = false } = {}) {
  const root = document.querySelector('.wh-root');
  if (!root) return null;
  const isDesktop = window.matchMedia('(min-width: 992px)').matches;

  document.body.dataset.product = 'burger';
  if (!skipIntro && document.getElementById('home-intro')) document.body.classList.add('wh-no-scroll');

  initLinkButtons(root);
  initClouds();
  const destroyPopups = initPopups();
  initBarks();

  setMotionScope(document.getElementById(isDesktop ? 'home-hero' : 'mobile-hero'));
  const hero = isDesktop ? initHero() : null;
  const mobileHero = isDesktop ? null : initMobileHero();

  // Motion assets (videos / animated webp / vector) are injected only for the
  // active world and its neighbours, see motion.js.
  initMotion({ hero, mobileHero });

  const destroyIntro = initIntro({
    skip: skipIntro,
    onEnter() {
      // Reveal the hero with the staggered "rise" the original had.
      hero?.playEntrance();
      mobileHero?.playEntrance();
    },
  });

  // The music is the one thing that carries on between pages: it stops when the visitor leaves,
  // since only the homepage has a control for it, and picks up again when they come back.
  if (skipIntro) resumeMusic();

  return () => {
    pauseMusic();
    destroyIntro?.();
    destroyPopups();
    hero?.destroy();
    destroyMotion();
  };
}
