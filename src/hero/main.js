// New homepage hero. Markup, styles and assets all live in Webflow (every class is `wh-` prefixed);
// this module only wires up behaviour, and runs only when the hero root (.wh-root) is on the page.
import { initClouds } from './clouds.js';
import { initIntro } from './intro.js';
import { initHero } from './hero.js';
import { initMobileHero } from './mobile-hero.js';
import { initPopups } from './popups.js';
import { initMotion, setMotionScope } from './motion.js';
import { initBarks } from './barks.js';

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

export function initNewHero() {
  const root = document.querySelector('.wh-root');
  if (!root) return;
  const isDesktop = window.matchMedia('(min-width: 992px)').matches;

  document.body.dataset.product = 'burger';
  if (document.getElementById('home-intro')) document.body.classList.add('wh-no-scroll');

  initLinkButtons(root);
  initClouds();
  initPopups();
  initBarks();

  setMotionScope(document.getElementById(isDesktop ? 'home-hero' : 'mobile-hero'));
  const hero = isDesktop ? initHero() : null;
  const mobileHero = isDesktop ? null : initMobileHero();

  // Motion assets (videos / animated webp / vector) are injected only for the
  // active world and its neighbours, see motion.js.
  initMotion({ hero, mobileHero });

  initIntro({
    onEnter() {
      // Reveal the hero with the staggered "rise" the original had.
      hero?.playEntrance();
      mobileHero?.playEntrance();
    },
  });
}
