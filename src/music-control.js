/**
 * The music on/off button. Set up once per visit, not per page: like the music itself it stays put
 * while Barba swaps pages, so the visitor can turn the music off from anywhere.
 *
 * Webflow only has the button on the homepage, outside .page_wrapper (so Barba never replaces it).
 * When a visit starts on another page there isn't one, so it's built here with the same class and
 * picks up the same Webflow styles: fixed bottom right, parked 20vh below the screen until shown.
 */
import { getMusic, hasMusic, onMusicCreated, rememberMusicSources, setMusicOn } from './hero/audio.js';
import { introShowing, onEntered } from './intro.js';

const ICON_VOL_ON = 'https://uploads-ssl.webflow.com/662b7f60d03c5e2b1e67488f/6633b1f66fa8b47bafdf14a7_icon_vol-on.svg';
const ICON_VOL_OFF = 'https://uploads-ssl.webflow.com/662b7f60d03c5e2b1e67488f/6633b1f68e8cce0ba76b5e15_icon_vol-off.svg';

let button;
let icon;

function findOrBuildButton() {
  button = document.querySelector('.music_control');
  if (!button) {
    button = document.createElement('button');
    button.className = 'music_control';
    button.type = 'button';
    button.innerHTML = '<img id="audio-icon" alt="">';
    document.body.append(button);
  }
  icon = button.querySelector('img');
  // Barba only swaps .page_wrapper, but keep the button out of any page's markup regardless.
  if (button.closest('.page_wrapper')) document.body.append(button);
}

function showState() {
  const playing = !!getMusic() && !getMusic().paused;
  if (icon) icon.src = playing ? ICON_VOL_OFF : ICON_VOL_ON;
  button.setAttribute('aria-label', playing ? 'Turn music off' : 'Turn music on');
  button.setAttribute('aria-pressed', String(playing));
}

let shown = false;
/**
 * Slides the button up, once the visit has music to control and the Enter screen isn't covering
 * the page. Called after every page set-up and as the Enter screen slides away.
 */
export function updateMusicControl() {
  if (!button || shown) return;
  rememberMusicSources();
  if (!hasMusic() || introShowing()) return;
  shown = true;
  // A CSS transition rather than a tween: tweens made during page set-up are reverted with the page.
  button.style.transition = 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
  button.style.transform = 'translate(0, 0)';
}

export function initMusicControl() {
  findOrBuildButton();
  showState();

  const watch = (track) => {
    track.addEventListener('play', showState);
    track.addEventListener('pause', showState);
    showState();
  };
  if (getMusic()) watch(getMusic());
  onMusicCreated(watch);
  onEntered(updateMusicControl);

  button.addEventListener('click', () => setMusicOn(!getMusic() || getMusic().paused));
}
