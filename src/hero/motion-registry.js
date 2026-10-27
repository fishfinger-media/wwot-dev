/**
 * Registry of motion behaviour by slot id. Asset URLs are not here: each slot carries its own on
 * the Webflow markup (data-mov, data-webm, data-webp, data-poster, data-src; the intro logo has
 * data-logo-svg and data-timemap), and motion.js merges them over these entries.
 *
 *  video : { loop?, autoplay?, trigger?, duration?, segments? }
 *          URLs: mov = HEVC+alpha for Safari (if present), webm = VP9+alpha for Chrome/Firefox,
 *          webp = animated WebP fallback (only where it is light enough), poster = static frame.
 *  svg   : { svg }  inline SVG built by vector-motion.js and animated with CSS/GSAP
 *  img   : static frame (data-src)
 *  logo  : the intro pen write-on (logo-writeon.js)
 *
 * Decisions follow raw-assets/motion/REPORT.md. The grainy brush texture of the illustrations is
 * not reproducible in the CSS/SVG versions; where that matters the video is used instead.
 */
import { sunSVG } from './vector-motion.js';
import { LOGO_DURATION } from './logo-writeon.js';

export const MOTION = {
  // ---- Birds (shared), the original flock GIFs
  'flock-1': { type: 'video' },
  'flock-3': { type: 'video' },

  // ---- Burger Hills
  'burger-fries': { type: 'video', loop: false, autoplay: false, trigger: 'click' },
  'burger-milk': { type: 'video' },

  // ---- Cake Mountains
  // cake with the dog peeking out: the cake is video (character animation deforms the cake surface)
  'cake-featured': { type: 'video' },
  'cake-cupcake': { type: 'video', loop: false, autoplay: false, trigger: 'click' },

  // ---- Pizza Oasis
  'pizza-cheesefall': { type: 'img' }, // the GIF never actually moved
  'pizza-box': { type: 'video' },
  'pizza-sausage': { type: 'video' },
  'pizza-sun': { type: 'svg', svg: sunSVG },

  // ---- Sushi Forest
  'sushi-chopstick': { type: 'video' },
  'sushi-houdini': { type: 'video' },
  'sushi-edamame': {
    type: 'video', loop: false, autoplay: false,
    // original: four click-through segments (frames 0-30, 30-57, 57-86, 86-100 at 30fps)
    segments: [[0, 1.0], [1.0, 1.9], [1.9, 2.87], [2.87, 3.37]],
  },

  // ---- Intro
  'intro-logo': { type: 'logo', duration: LOGO_DURATION },

  // ---- Mobile
  'mobile-cake-dog': { type: 'video' },
  'mobile-sushi-dog': { type: 'video' },
};
