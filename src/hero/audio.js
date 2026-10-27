/**
 * Background music + dog barks. Nothing is fetched until the user opts in.
 * File URLs come from the hero root in Webflow: data-music-ogg, data-music-mp3, data-bark-src.
 */
const urls = () => document.querySelector('.wh-root')?.dataset || {};

let music;
/** The looping intro track, or null when the page has no hero to read it from. */
export function createMusic() {
  if (music) return music;
  const { musicOgg, musicMp3 } = urls();
  if (!musicOgg && !musicMp3) return null;
  music = new Audio();
  // Opus/OGG is ~1/3 the size of the original mp3 for the same loudness; mp3 as fallback.
  const canOgg = musicOgg && music.canPlayType('audio/ogg; codecs=opus');
  music.src = canOgg ? musicOgg : musicMp3 || musicOgg;
  music.loop = true;
  music.volume = 0.6;
  music.preload = 'none';
  return music;
}
export function getMusic() { return music; }

let bark;
export function playBark() {
  if (!bark) {
    const { barkSrc } = urls();
    if (!barkSrc) return;
    bark = new Audio(barkSrc);
    bark.preload = 'auto';
  }
  bark.currentTime = 0;
  bark.play().catch(() => {});
}
