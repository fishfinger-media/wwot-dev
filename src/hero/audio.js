/**
 * Background music + dog barks. Nothing is fetched until the user opts in.
 * File URLs come from the hero root in Webflow: data-music-ogg, data-music-mp3, data-bark-src.
 */
const urls = () => document.querySelector('.wh-root')?.dataset || {};

// The track's URLs only live on the homepage, but the music carries on across the whole visit, so
// they're kept from the first time the homepage is seen.
let sources = null;
export function rememberMusicSources() {
  const { musicOgg, musicMp3 } = urls();
  if (!sources && (musicOgg || musicMp3)) sources = { musicOgg, musicMp3 };
  return !!sources;
}
export const hasMusic = () => !!sources;

let music;
const createdListeners = new Set();
export const onMusicCreated = (fn) => createdListeners.add(fn);

/** The looping intro track, or null when the visitor hasn't been on the homepage yet. */
export function createMusic() {
  if (music) return music;
  if (!rememberMusicSources()) return null;
  const { musicOgg, musicMp3 } = sources;
  music = new Audio();
  // Opus/OGG is ~1/3 the size of the original mp3 for the same loudness; mp3 as fallback.
  const canOgg = musicOgg && music.canPlayType('audio/ogg; codecs=opus');
  music.src = canOgg ? musicOgg : musicMp3 || musicOgg;
  music.loop = true;
  music.volume = 0.6;
  music.preload = 'none';
  createdListeners.forEach((fn) => fn(music));
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
