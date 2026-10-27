import { HERO_BASE } from './base.js';
/**
 * Registry of motion assets by slot id.
 *
 *  video : { mov?, webm, webp?, poster, loop?, duration?, segments? }
 *          mov  = HEVC+alpha for Safari (if present), webm = VP9+alpha for Chrome/Firefox,
 *          webp = animated WebP fallback (only where it is light enough), poster = static frame.
 *  svg   : { svg }  inline SVG built by vector-motion.js and animated with CSS/GSAP
 *  img   : { src }  static frame
 *  logo  : the intro pen write-on (logo-writeon.js)
 *
 * Decisions follow raw-assets/motion/REPORT.md. The grainy brush texture of the illustrations is
 * not reproducible in the CSS/SVG versions; where that matters the video is used instead.
 */
import { sunSVG } from './vector-motion.js';
import { LOGO_DURATION } from './logo-writeon.js';

const M = HERO_BASE + '/assets/motion/';

export const MOTION = {
  // ---- Birds (shared), the original flock GIFs
  'flock-1': { type: 'video', mov: M + 'flock-1.mov', webm: M + 'flock-1.webm', webp: M + 'flock-1.webp', poster: M + 'flock-1-poster.webp' },
  'flock-3': { type: 'video', mov: M + 'flock-3.mov', webm: M + 'flock-3.webm', webp: M + 'flock-3.webp', poster: M + 'flock-3-poster.webp' },

  // ---- Burger Hills
  'burger-fries': { type: 'video', loop: false, autoplay: false, trigger: 'click', mov: M + 'burger-fries.mov', webm: M + 'burger-fries.webm', webp: M + 'burger-fries.webp', poster: M + 'burger-fries-poster.webp' },
  'burger-milk': { type: 'video', webm: M + 'burger-milk.webm', webp: M + 'burger-milk.webp', poster: M + 'burger-milk-poster.webp' },

  // ---- Cake Mountains
  // cake with the dog peeking out: the cake is video (character animation deforms the cake surface)
  'cake-featured': { type: 'video', mov: M + 'cake-mountains-cake.mov', webm: M + 'cake-mountains-cake.webm', poster: M + 'cake-mountains-cake-poster.webp' },
  'cake-cupcake': { type: 'video', loop: false, autoplay: false, trigger: 'click', mov: M + 'cake-cupcake.mov', webm: M + 'cake-cupcake.webm', webp: M + 'cake-cupcake.webp', poster: M + 'cake-cupcake-poster.webp' },

  // ---- Pizza Oasis
  'pizza-cheesefall': { type: 'img', src: M + 'pizza-cheesefall-poster.webp' }, // the GIF never actually moved
  'pizza-box': { type: 'video', mov: M + 'pizza-box.mov', webm: M + 'pizza-box.webm', webp: M + 'pizza-box.webp', poster: M + 'pizza-box-poster.webp' },
  'pizza-sausage': { type: 'video', mov: M + 'pizza-sausage.mov', webm: M + 'pizza-sausage.webm', webp: M + 'pizza-sausage.webp', poster: M + 'pizza-sausage-poster.webp' },
  'pizza-sun': { type: 'svg', svg: sunSVG },

  // ---- Sushi Forest
  'sushi-chopstick': { type: 'video', mov: M + 'sushi-chopstick.mov', webm: M + 'sushi-chopstick.webm', poster: M + 'sushi-chopstick-poster.webp' },
  'sushi-houdini': { type: 'video', mov: M + 'sushi-houdini.mov', webm: M + 'sushi-houdini.webm', poster: M + 'sushi-houdini-poster.webp' },
  'sushi-edamame': {
    type: 'video', loop: false, autoplay: false, mov: M + 'edamame.mov', webm: M + 'edamame.webm', webp: M + 'edamame.webp', poster: M + 'edamame-poster.webp',
    // original: four click-through segments (frames 0-30, 30-57, 57-86, 86-100 at 30fps)
    segments: [[0, 1.0], [1.0, 1.9], [1.9, 2.87], [2.87, 3.37]],
  },

  // ---- Intro
  'intro-logo': { type: 'logo', duration: LOGO_DURATION },

  // ---- Mobile
  'mobile-cake-dog': { type: 'video', mov: M + 'cake-mountains-cake.mov', webm: M + 'cake-mountains-cake.webm', poster: M + 'cake-mountains-cake-poster.webp' },
  'mobile-sushi-dog': { type: 'video', mov: M + 'mobile-sf-dog-full.mov', webm: M + 'mobile-sf-dog-full.webm', poster: M + 'mobile-sf-dog-crop-poster.webp' },
};
