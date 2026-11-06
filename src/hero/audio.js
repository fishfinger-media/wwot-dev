/**
 * Background music + dog barks. Nothing is fetched until the user opts in.
 * File URLs come from Webflow: data-music-ogg and data-music-mp3 on whichever element carries them
 * (the Enter screen or the homepage hero), data-bark-src on the hero root.
 *
 * The visitor's sound choice and the track's URLs are kept for the visit (sessionStorage, so per
 * tab), which lets a reload, a new tab or a page without the track carry on where they left off.
 */
const CHOICE_KEY = 'wwot-sound';  // 'on' | 'off'
const SOURCES_KEY = 'wwot-music'; // { musicOgg, musicMp3 }

const read = (key) => { try { return sessionStorage.getItem(key); } catch { return null; } };
const write = (key, value) => { try { sessionStorage.setItem(key, value); } catch { /* private mode */ } };

/** 'on' or 'off' once the visitor has chosen this visit (Enter screen or music button), else null. */
export const soundChoice = () => read(CHOICE_KEY);
export const setSoundChoice = (on) => write(CHOICE_KEY, on ? 'on' : 'off');

let sources = null;
try { sources = JSON.parse(read(SOURCES_KEY)); } catch { /* nothing stored */ }

/** Picks up the track's URLs from the page if it has them. True once they're known. */
export function rememberMusicSources() {
  if (sources) return true;
  const { musicOgg, musicMp3 } = document.querySelector('[data-music-ogg], [data-music-mp3]')?.dataset || {};
  if (!musicOgg && !musicMp3) return false;
  sources = { musicOgg, musicMp3 };
  write(SOURCES_KEY, JSON.stringify(sources));
  return true;
}
export const hasMusic = () => !!sources;

let music;
const createdListeners = new Set();
export const onMusicCreated = (fn) => createdListeners.add(fn);

/** The looping intro track, or null while its URLs aren't known. */
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

let stopWaiting = () => {};

/** Play or stop the music because the visitor asked to, and remember that for the visit. */
export function setMusicOn(on) {
  stopWaiting();
  setSoundChoice(on);
  const track = createMusic();
  if (!track) return;
  if (on) track.play().catch(() => {});
  else track.pause();
}

/**
 * On a fresh page load, start the music again if the visitor had it on. Browsers refuse to play
 * sound before the visitor has interacted with the page, so when that happens it starts on their
 * first click, tap or key press instead.
 */
export function resumeMusicIfChosen() {
  if (soundChoice() !== 'on') return;
  const track = createMusic();
  track?.play().catch(() => {
    const events = ['pointerdown', 'keydown'];
    const start = (e) => {
      stopWaiting();
      // The music button toggles the track itself; starting it here as well would undo that click.
      if (!e.target.closest?.('.music_control')) track.play().catch(() => {});
    };
    stopWaiting = () => {
      events.forEach((type) => window.removeEventListener(type, start, true));
      stopWaiting = () => {};
    };
    events.forEach((type) => window.addEventListener(type, start, true));
  });
}

let bark;
export function playBark() {
  if (!bark) {
    const { barkSrc } = document.querySelector('.wh-root')?.dataset || {};
    if (!barkSrc) return;
    bark = new Audio(barkSrc);
    bark.preload = 'auto';
  }
  bark.currentTime = 0;
  bark.play().catch(() => {});
}
