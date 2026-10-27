// New homepage hero (ported from the standalone rebuild by tools/port-hero.mjs (node tools/port-hero.mjs <rebuild-dir> .); styles are public/hero/hero.css).
// Runs only when the hero embed (.wh-root) is on the page.
import { initClouds } from './clouds.js';
import { initIntro } from './intro.js';
import { initHero } from './hero.js';
import { initMobileHero } from './mobile-hero.js';
import { initPopups } from './popups.js';
import { initMotion, setMotionScope } from './motion.js';
import { initBarks } from './barks.js';

export const hasNewHero = () => !!document.querySelector('.wh-root');

export function initNewHero() {
  if (!hasNewHero()) return;
  const isDesktop = window.matchMedia('(min-width: 992px)').matches;

  document.body.dataset.product = 'burger';
  if (document.getElementById('home-intro')) document.body.classList.add('wh-no-scroll');

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
