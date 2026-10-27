/**
 * Motion assets.
 * Every animated element in the hero is a `.wh-motion-slot[data-motion="id"]`. This module decides
 * what goes in it (a looping <video>, an animated WebP, an inline SVG with CSS animation, or a static
 * frame) and only mounts assets for the active world + its neighbours, unmounting the rest so the
 * GPU never holds all four worlds' videos at once.
 * Behaviour comes from motion-registry.js; asset URLs come from the slot's own data attributes,
 * so slots sharing an id (the flocks) can each point at whatever Webflow serves.
 */
import { MOTION } from './motion-registry.js';
import { buildLogoWriteOn, preloadLogoWriteOn } from './logo-writeon.js';

const mounted = new Map(); // slot -> { el, tl? }
const NEIGHBOURS = { burger: ['sushi', 'cake'], cake: ['burger', 'pizza'], pizza: ['cake', 'sushi'], sushi: ['pizza', 'burger'] };
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Slot attributes that hold asset URLs (dataset names), merged over the registry entry.
const URL_KEYS = ['mov', 'webm', 'webp', 'poster', 'src', 'logoSvg', 'timemap'];
function defOf(slot) {
  const base = MOTION[slot.dataset.motion];
  if (!base) return null;
  const def = { ...base };
  URL_KEYS.forEach((k) => { if (slot.dataset[k]) def[k] = slot.dataset[k]; });
  return def;
}

const probe = document.createElement('video');
const canHevcAlpha = !!probe.canPlayType('video/mp4; codecs="hvc1"') && /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Edg/.test(navigator.userAgent);
const canVp9 = !!probe.canPlayType('video/webm; codecs="vp9"');

function buildVideo(def) {
  const src = canHevcAlpha && def.mov ? { url: def.mov, type: 'video/mp4; codecs="hvc1"' }
    : canVp9 && def.webm ? { url: def.webm, type: 'video/webm' }
    : null;
  if (!src || reduced) return buildStill(def);
  const v = document.createElement('video');
  v.muted = true; v.loop = def.loop !== false; v.playsInline = true; v.autoplay = false; v.preload = 'metadata';
  v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.disablePictureInPicture = true;
  if (def.poster) v.poster = def.poster;
  const s = document.createElement('source'); s.src = src.url; s.type = src.type; v.append(s);
  // If the chosen codec fails at runtime, fall back to the still/animated webp.
  v.addEventListener('error', () => v.replaceWith(buildStill(def)), { once: true });
  return v;
}
function buildStill(def) {
  const i = new Image();
  const url = reduced ? (def.poster || def.webp) : (def.webp || def.poster);
  if (url) i.src = url;
  i.alt = ''; i.decoding = 'async';
  return i;
}
function build(def, slot) {
  switch (def.type) {
    case 'video': return { el: buildVideo(def) };
    case 'webp': return { el: buildStill(def) };
    case 'img': { if (!def.src) return null; const i = new Image(); i.src = def.src; i.alt = ''; i.decoding = 'async'; return { el: i }; }
    case 'logo': return buildLogoWriteOn({ reduced, svg: def.logoSvg, map: def.timemap });
    case 'svg': { const w = document.createElement('div'); w.innerHTML = def.svg; return { el: w.firstElementChild }; }
    default: return null;
  }
}

function mount(slot) {
  if (mounted.has(slot)) return;
  const def = defOf(slot);
  if (!def) return;
  const built = build(def, slot);
  if (!built?.el) return;
  slot.replaceChildren(built.el);
  mounted.set(slot, built);
}
function unmount(slot) {
  const m = mounted.get(slot);
  if (!m) return;
  m.tl?.kill();
  if (m.el.tagName === 'VIDEO') { m.el.pause(); m.el.querySelectorAll('source').forEach((s) => s.remove()); m.el.removeAttribute('src'); m.el.load(); }
  m.el.remove();
  mounted.delete(slot);
}
function setPlaying(slot, playing) {
  const m = mounted.get(slot);
  if (!m) return;
  const def = MOTION[slot.dataset.motion];
  if (m.el.tagName === 'VIDEO') { if (playing && def.autoplay !== false) m.el.play().catch(() => {}); else m.el.pause(); }
  if (m.tl) { if (playing && !reduced) m.tl.play(); else m.tl.pause(); }
}

let scope = document;
/** Limit mounting to the hero that is actually displayed (desktop or mobile). */
export function setMotionScope(el) { scope = el || document; }

export function setActiveWorld(world) {
  const keep = new Set([world, ...(NEIGHBOURS[world] || [])]);
  scope.querySelectorAll('[data-world]').forEach((w) => {
    const name = w.dataset.world;
    const slots = [...w.querySelectorAll('.wh-motion-slot')];
    if (keep.has(name)) slots.forEach(mount); else slots.forEach(unmount);
    slots.forEach((slot) => setPlaying(slot, name === world));
  });
}

/** Play a one-shot motion (e.g. intro logo). Returns its duration in seconds. */
export function playMotion(id) {
  const slot = document.querySelector(`.wh-motion-slot[data-motion="${id}"]`);
  const def = slot && defOf(slot);
  if (!slot || !def) return 0;
  mount(slot);
  const m = mounted.get(slot);
  if (m?.el.tagName === 'VIDEO') { m.el.loop = false; m.el.play().catch(() => {}); }
  if (m?.play) m.play();
  else if (m?.el.tagName === 'svg') m.el.classList.add('wh-is-playing');
  return reduced ? 0 : (def.duration || 0);
}

/** Slots with `trigger: 'click'` play their video once per click (the original fries/ketchup Lottie). */
function bindClickToPlay(slot) {
  if (slot.dataset.clickBound) return;
  slot.dataset.clickBound = '1';
  slot.style.cursor = 'pointer';
  slot.addEventListener('click', () => {
    const m = mounted.get(slot);
    if (m?.el.tagName !== 'VIDEO') return;
    m.el.loop = false; m.el.currentTime = 0; m.el.play().catch(() => {});
  });
}

export function initMotion() {
  // The intro logo's SVG and time map are fetched now so they are ready by the time "Enter" is clicked.
  const logo = document.querySelector('.wh-motion-slot[data-motion="intro-logo"]');
  if (logo) { const def = defOf(logo); preloadLogoWriteOn({ svg: def.logoSvg, map: def.timemap }); }
  document.querySelectorAll('.wh-motion-slot').forEach((slot) => { if (MOTION[slot.dataset.motion]?.trigger === 'click') bindClickToPlay(slot); });
  // Edamame: each click plays the next of four segments (as in the original Lottie).
  const edamame = document.querySelector('[data-motion="sushi-edamame"]');
  edamame?.addEventListener('click', () => {
    const m = mounted.get(edamame);
    const def = MOTION['sushi-edamame'];
    if (m?.el.tagName !== 'VIDEO' || !def?.segments) return;
    const el = m.el;
    const i = (+(edamame.dataset.step || 0)) % def.segments.length;
    const [from, to] = def.segments[i];
    el.loop = false; el.currentTime = from; el.play().catch(() => {});
    const stop = () => { if (el.currentTime >= to) { el.pause(); el.removeEventListener('timeupdate', stop); } };
    el.addEventListener('timeupdate', stop);
    edamame.dataset.step = String(i + 1);
  });
}
