/**
 * Enter screen: "Enter" (with music) or "Enter without sound", then the logo write-on, then the
 * screen slides up.
 * Original: click "Enter" -> 2.3 MB mp3 starts, 6 MB image-sequence Lottie plays, screen slides up.
 * Here: audio is created only on click (so nothing downloads before consent), the logo reveal
 * comes from motion.js, and the slide-up is a tween.
 *
 * It greets the visitor once per visit, on whichever page they land, so it runs once per page load
 * rather than per page: pages Barba brings in never show it. The choice is kept for the visit
 * (src/hero/audio.js), so a reload or a new tab goes straight in, with the music back on if it was.
 * It works with the screen anywhere in the page, inside .wh-root on Home or site-wide in Webflow.
 */
import { gsap } from 'gsap';
import { rememberMusicSources, resumeMusicIfChosen, setMusicOn, setSoundChoice, soundChoice } from './hero/audio.js';
import { playMotion } from './hero/motion.js';
import { preloadLogoWriteOn } from './hero/logo-writeon.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let showing = null; // the Enter screen while it's up
export const introShowing = () => !!showing;

const enteredListeners = new Set();
/** Runs `fn` when the visitor goes through the Enter screen. Returns the unsubscribe function. */
export function onEntered(fn) {
  enteredListeners.add(fn);
  return () => enteredListeners.delete(fn);
}

/** Hide every Enter screen except the one in use, e.g. the copy that arrives with Home via Barba. */
export function settleIntro() {
  document.querySelectorAll('#home-intro').forEach((el) => {
    if (el !== showing) el.classList.add('wh-is-done');
  });
}

export function initIntro() {
  const intro = document.getElementById('home-intro');
  rememberMusicSources();

  // Dev/testing: /?skipintro jumps straight in, as if the visitor had entered quietly.
  const skip = new URLSearchParams(location.search).has('skipintro');
  if (!intro || soundChoice() || skip) {
    intro?.classList.add('wh-is-done');
    resumeMusicIfChosen();
    return;
  }

  showing = intro;
  document.body.classList.add('wh-no-scroll');
  const slide1 = intro.querySelector('.wh-slide-1');
  const logo = intro.querySelector('[data-motion="intro-logo"]');
  // Fetched now so the write-on is ready by the time "Enter" is clicked.
  if (logo) preloadLogoWriteOn({ svg: logo.dataset.logoSvg, map: logo.dataset.timemap });

  let started = false;
  const enter = (withSound) => {
    if (started) return;
    started = true;
    if (withSound) setMusicOn(true); // does nothing if no track is known yet
    else setSoundChoice(false);

    const tl = gsap.timeline({ onComplete: () => intro.classList.add('wh-is-done') });
    tl.to(slide1, { opacity: 0, duration: 0.6, onComplete: () => (slide1.style.display = 'none') });

    const logoDuration = playMotion('intro-logo'); // returns seconds, 0 if nothing to play
    const hold = reduced ? 0.2 : Math.max(logoDuration, 1.2);

    tl.to(intro, { yPercent: -100, duration: 1.4, ease: 'power4.inOut' }, `+=${hold}`);
    tl.add(() => {
      showing = null;
      document.body.classList.remove('wh-no-scroll');
      enteredListeners.forEach((fn) => fn());
    }, '<+0.2');
  };

  // Webflow's builder turns <button>s into links, so these are <a href="#">.
  const bind = (el, withSound) => el?.addEventListener('click', (e) => { e.preventDefault(); enter(withSound); });
  bind(intro.querySelector('#enter-btn'), true);
  bind(intro.querySelector('#enter-quiet'), false);
}
