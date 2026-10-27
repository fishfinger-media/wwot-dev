/** Postcard popups opened by clicking the main character in each world. */
import { gsap } from 'gsap';

export function initPopups() {
  const popups = [...document.querySelectorAll('[data-popup]')];
  // Webflow may drop the `hidden` attribute from the markup, so start every popup closed here.
  popups.forEach((popup) => { popup.hidden = true; });
  let lastTrigger = null;

  const close = (popup) => {
    gsap.to(popup, { opacity: 0, duration: 0.4, onComplete: () => { popup.hidden = true; lastTrigger?.focus(); } });
  };

  document.querySelectorAll('[data-button]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const popup = document.querySelector(`[data-popup="${btn.dataset.button}"]`);
      if (!popup) return;
      lastTrigger = btn;
      popup.hidden = false;
      const character = popup.querySelector('.wh-home-popup_postcard-character');
      const card = popup.querySelector('.wh-home-popup_postcard');
      gsap.fromTo(popup, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      gsap.from(character, { yPercent: -100, duration: 1.5, ease: 'back.out(1.7)' });
      gsap.from(card, { yPercent: 100, duration: 1.5, ease: 'back.out(1.7)' });
      popup.querySelector('.wh-overlay_btn')?.focus();
    });
  });

  popups.forEach((popup) => {
    popup.addEventListener('click', (e) => {
      // Let the postcard link through; the close control is an a[role="button"] and should close.
      if (e.target.closest('a:not([role="button"])')) return;
      close(popup);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') popups.filter((p) => !p.hidden).forEach(close);
  });
}
