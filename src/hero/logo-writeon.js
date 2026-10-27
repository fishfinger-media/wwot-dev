import { HERO_BASE } from './base.js';
/**
 * Intro logo write-on, rebuilt from the original 6 MB image-sequence Lottie (logoMenu.json).
 *
 * The Lottie was 120 PNG frames of two things happening at once:
 *   1. a pen writing the lettering stroke by stroke, and
 *   2. from 2.27 s, the whole logo fading in linearly (it fills in what the pen hasn't reached).
 *
 * (1) is baked into logo-timemap.png: one greyscale pixel per viewBox unit, where the value is
 * 1 - (moment the pen reaches that pixel / T). Black means the pen never gets there, so only the
 * fade reveals it. Each frame, a colour-matrix filter turns the map into an alpha mask that keeps
 * every pixel the pen has already passed. (2) is a white rect in the same mask with tweened opacity.
 * The mask sits over the real vector wordmark, so the edges stay sharp at any size, and it is
 * removed when the animation finishes. Timings were measured from the Lottie frames; the result
 * matches them to within about 1% per frame. Rebuild scripts: raw-assets/intro/*.py (analyze → register → refine → timemap).
 */
import { gsap } from 'gsap';
import logoRaw from '../../public/hero/assets/nav/logo.svg?raw';

const MAP = HERO_BASE + '/assets/motion/logo-timemap.png';
const T = 3.449;                    // seconds the time map spans (last pen stroke + fade end)
const FADE = [2.265, 3.399];        // whole-logo fade, seconds
const SOFT = 70;                    // edge softness: the pen edge ramps in over T / SOFT ≈ 50 ms
export const LOGO_DURATION = T;

// Start fetching the map as soon as the module loads so it is ready by the time "Enter" is clicked.
const preload = new Image();
preload.src = MAP;

const paths = logoRaw.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, '').replace(/fill="[^"]*"/g, 'fill="#005469"');

// alpha = SOFT * mapValue + (0.5 - SOFT * threshold); colour channels are always white.
const matrix = (thr) => `0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${SOFT} 0 0 0 ${0.5 - SOFT * thr}`;

export function buildLogoWriteOn({ reduced = false } = {}) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
<svg class="wh-vm wh-vm-logo" viewBox="0 0 1152 287" role="img" aria-label="Wonderful World of Treats">
  <defs>
    <filter id="lw-threshold" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="${matrix(1)}"/>
    </filter>
    <mask id="lw-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1152" height="287">
      <image href="${MAP}" width="1152" height="287" preserveAspectRatio="none" filter="url(#lw-threshold)"/>
      <rect width="1152" height="287" fill="#fff" opacity="0"/>
    </mask>
  </defs>
  <g ${reduced ? '' : 'mask="url(#lw-mask)"'}>${paths}</g>
</svg>`;
  const el = wrap.firstElementChild;
  const g = el.querySelector('g');
  const cm = el.querySelector('feColorMatrix');
  const fade = el.querySelector('mask rect');

  const state = { t: 0 };
  const tl = gsap.timeline({ paused: true, onComplete: () => g.removeAttribute('mask') });
  tl.to(state, {
    t: T, duration: T, ease: 'none',
    onUpdate: () => {
      cm.setAttribute('values', matrix(1 - state.t / T));
      fade.setAttribute('opacity', gsap.utils.clamp(0, 1, (state.t - FADE[0]) / (FADE[1] - FADE[0])));
    },
  });

  const play = () => {
    if (reduced) return;
    // If the map somehow isn't decoded yet, wait for it rather than revealing nothing then popping.
    (preload.complete ? Promise.resolve() : preload.decode().catch(() => {})).then(() => tl.play(0));
  };
  return { el, tl, play };
}
