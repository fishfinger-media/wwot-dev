/**
 * Enter screen.
 * Original: click "Enter" -> 2.3 MB mp3 starts, 6 MB image-sequence Lottie plays, screen slides up.
 * Here: audio is created only on click (so nothing downloads before consent), the logo reveal
 * comes from motion.js (a small video or CSS reveal), and the slide-up is a CSS transition.
 */
import { gsap } from 'gsap';
import { createMusic } from './audio.js';
import { playMotion } from './motion.js';

export function initIntro({ onEnter } = {}) {
  const intro = document.getElementById('home-intro');
  if (!intro) return;
  const slide1 = intro.querySelector('.wh-slide-1');
  const enterBtn = document.getElementById('enter-btn');
  const quietBtn = document.getElementById('enter-quiet');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let started = false;
  const enter = (withSound) => {
    if (started) return;
    started = true;
    if (withSound) createMusic().play();

    const tl = gsap.timeline({ onComplete: () => { intro.classList.add('wh-is-done'); } });
    tl.to(slide1, { opacity: 0, duration: 0.6, onComplete: () => (slide1.style.display = 'none') });

    const logoDuration = playMotion('intro-logo'); // returns seconds, 0 if nothing to play
    const hold = reduced ? 0.2 : Math.max(logoDuration, 1.2);

    tl.to(intro, { yPercent: -100, duration: 1.4, ease: 'power4.inOut' }, `+=${hold}`);
    tl.add(() => { document.body.classList.remove('wh-no-scroll'); onEnter?.(); }, '<+0.2');
  };

  enterBtn?.addEventListener('click', () => enter(true));
  quietBtn?.addEventListener('click', () => enter(false));

  // Dev/testing: /?skipintro jumps straight into the hero.
  if (new URLSearchParams(location.search).has('skipintro')) {
    intro.classList.add('wh-is-done');
    document.body.classList.remove('wh-no-scroll');
    started = true;
    onEnter?.();
  }
}
