import { HERO_BASE } from './base.js';
/** Background music + dog barks. Nothing is fetched until the user opts in. */
let music;
export function createMusic() {
  if (music) return music;
  music = new Audio();
  // Opus/OGG is ~1/3 the size of the original mp3 for the same loudness; mp3 as fallback.
  const canOgg = music.canPlayType('audio/ogg; codecs=opus');
  music.src = canOgg ? HERO_BASE + '/assets/audio/intro.ogg' : HERO_BASE + '/assets/audio/intro.mp3';
  music.loop = true;
  music.volume = 0.6;
  music.preload = 'none';
  return music;
}
export function getMusic() { return music; }

let bark;
export function playBark() {
  if (!bark) { bark = new Audio(HERO_BASE + '/assets/audio/bark.mp3'); bark.preload = 'auto'; }
  bark.currentTime = 0;
  bark.play().catch(() => {});
}
