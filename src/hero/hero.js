/**
 * Desktop world switcher. Worlds are stacked; changing world is a feathered wipe: the current
 * scenery wipes out behind a soft edge (drifting a little the way it leaves), the sky colour (fading
 * from this world's to the next's) and clouds show through, then the next scenery wipes in from the other side.
 * Nothing inside .layer is transformed by JS, so the artwork stays pinned by CSS alone.
 */
import { gsap } from 'gsap';
import { setActiveWorld } from './motion.js';

const WORLDS = ['burger', 'cake', 'pizza', 'sushi'];
// Sky colour of each world: the hero background behind the wipe, fading from the old world's sky to
// the new one's. The body colour behind the page fades alongside it.
const SKY = { burger: '#a5faff', cake: '#ffe7f1', pizza: '#fce266', sushi: '#f5f8ae' };
const BODY = { burger: '#a6faff', cake: '#ffd9e0', pizza: '#ffe76d', sushi: '#d8fc8f' };
const SLOW = new URLSearchParams(location.search).has('slow') ? 5 : 1; // /?slow for debugging
const OUT = 0.8 * SLOW;    // s, outgoing wipe
const IN = 0.9 * SLOW;     // s, incoming wipe
const GAP = 0.5 * SLOW;    // s, when the incoming wipe starts (the outgoing one is ~3/4 gone by then)
const DRIFT = 5;           // vw the scenery drifts while wiping
const SHOWN = { '--wl': '-16%', '--wr': '116%' }; // must match the @property initial values in hero.css
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHero() {
  const root = document.getElementById('home-hero');
  if (!root) return null;
  const slides = [...root.querySelectorAll('.wh-home-hero_slide')];
  const worldOf = (slide) => slide.querySelector(':scope > .wh-world');
  // The sky stays unmasked under the wipe, so lift it out of the (masked) world.
  slides.forEach((slide) => { const sky = slide.querySelector('.wh-sky'); if (sky) slide.insertBefore(sky, worldOf(slide)); });

  // Neighbours are kept warm (see `warm` below) so the next world paints instantly.
  const setVisible = (active) => {
    const n = slides.length;
    slides.forEach((s, i) => {
      const d = Math.min(Math.abs(i - active), n - Math.abs(i - active));
      s.classList.toggle('wh-is-visible', d <= 1);
    });
  };

  const startWorld = new URLSearchParams(location.search).get('world'); // dev: /?world=cake
  let current = Math.max(0, WORLDS.indexOf(startWorld));
  let busy = false;
  slides[current].classList.add('wh-is-active');
  root.style.backgroundColor = SKY[WORLDS[current]];
  setVisible(current); setActiveWorld(WORLDS[current]);

  function go(dir) { // 1 = next (scenery leaves to the left), -1 = prev
    if (busy) return;
    const from = current, to = (current + dir + slides.length) % slides.length;
    const outgoing = slides[from], incoming = slides[to];
    current = to;
    document.body.dataset.product = WORLDS[to];
    // Alpha video decodes on the CPU; keep it quiet while the worlds change.
    root.querySelectorAll('video').forEach((v) => v.pause());

    const land = () => {
      outgoing.classList.remove('wh-is-leaving');
      gsap.set(outgoing, { clearProps: '--wl,--wr' });
      gsap.set([worldOf(outgoing), worldOf(incoming)], { clearProps: 'x' });
      gsap.set(outgoing.querySelectorAll('.wh-sky'), { clearProps: 'opacity' });
      busy = false;
      setVisible(to); setActiveWorld(WORLDS[to]);
      root.dispatchEvent(new Event('worldchange'));
    };

    outgoing.classList.replace('wh-is-active', 'wh-is-leaving');
    incoming.classList.add('wh-is-active');
    if (reduced) {
      root.style.backgroundColor = SKY[WORLDS[to]];
      document.body.style.backgroundColor = BODY[WORLDS[to]];
      return land();
    }
    busy = true;

    // Next: the visible band's right edge sweeps left; prev: its left edge sweeps right.
    const outEdge = dir === 1 ? { '--wr': '-16%' } : { '--wl': '116%' };
    const inStart = dir === 1 ? { '--wl': '116%', '--wr': '116%' } : { '--wl': '-16%', '--wr': '-16%' };
    const outSky = outgoing.querySelectorAll('.wh-sky'), inSky = incoming.querySelectorAll('.wh-sky'); // sushi has none

    gsap.timeline({ onComplete: land })
      .fromTo(outgoing, SHOWN, { ...outEdge, duration: OUT, ease: 'power1.inOut' }, 0)
      // Sky colour: mostly the old world's while it leaves, mostly the new one's as it arrives.
      .to(root, { backgroundColor: SKY[WORLDS[to]], duration: GAP + IN * 0.5, ease: 'sine.inOut' }, 0)
      .to(worldOf(outgoing), { x: `${-dir * DRIFT}vw`, duration: OUT, ease: 'power1.inOut' }, 0)
      .to(document.body, { backgroundColor: BODY[WORLDS[to]], duration: GAP + IN, ease: 'sine.inOut' }, 0)
      // Clouds cross-fade under the gap rather than being wiped.
      .fromTo(inSky, { opacity: 0 }, { opacity: 1, duration: OUT, ease: 'sine.inOut', clearProps: 'opacity' }, GAP * 0.5)
      .to(outSky, { opacity: 0, duration: OUT, ease: 'sine.inOut' }, GAP * 0.5)
      .fromTo(incoming, inStart, { ...SHOWN, duration: IN, ease: 'power3.out' }, GAP)
      .fromTo(worldOf(incoming), { x: `${dir * DRIFT}vw` }, { x: 0, duration: IN, ease: 'power3.out' }, GAP);
  }

  root.querySelectorAll('.wh-hero_slide-nav').forEach((btn) => {
    btn.addEventListener('click', () => go(btn.dataset.dir === 'next' ? 1 : -1));
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });

  // Boats (Pizza Oasis), ported 1:1 from the original GSAP tweens.
  const boat = root.querySelector('.wh-boat-main');
  const boatAlts = root.querySelectorAll('.wh-boat-alt');
  if (!reduced && boat) {
    gsap.timeline({ repeat: -1, yoyo: true })
      .to(boat, { duration: 2, y: -30, ease: 'power1.inOut' })
      .to(boat, { duration: 2, y: -10, ease: 'power1.inOut' });
    gsap.to(boat, { duration: 4, x: '-=20', repeat: -1, yoyo: true, ease: 'power1.inOut' });
  }
  if (!reduced && boatAlts.length) {
    gsap.timeline({ repeat: -1, yoyo: true })
      .to(boatAlts, { duration: 2.5, y: -20, ease: 'power1.inOut' })
      .to(boatAlts, { duration: 2.5, y: -6, ease: 'power1.inOut' });
    gsap.to(boatAlts, { duration: 4, x: '-=23', repeat: -1, yoyo: true, ease: 'power1.inOut' });
  }

  // Warm the next world's images when idle so the first slide change is instant.
  const warm = () => {
    const n = slides.length;
    [slides[(current + 1) % n], slides[(current + n - 1) % n]].forEach((slide) => {
      slide.querySelectorAll('img').forEach((img) => {
        img.loading = 'eager';
        img.decode?.().catch(() => {}); // decode off the transition frames
      });
    });
  };
  const idle = (fn, ms) => (window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: ms }) : setTimeout(fn, ms));
  idle(warm, 1500);
  root.addEventListener('worldchange', () => idle(warm, 300));

  return {
    next: () => go(1),
    prev: () => go(-1),
    /** Original entrance: slides rise in with a stagger, nav drops in. */
    playEntrance() {
      if (reduced) return;
      gsap.from(slides, { yPercent: 30, duration: 1.4, ease: 'power4.inOut', stagger: 0.1 });
      gsap.from('.navigation', { yPercent: -100, duration: 1.4, ease: 'power4.inOut' });
    },
  };
}
