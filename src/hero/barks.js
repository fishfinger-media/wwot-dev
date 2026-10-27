/** Click a dog -> bark + speech bubble pops. */
import { gsap } from 'gsap';
import { playBark } from './audio.js';

export function initBarks() {
  document.querySelectorAll('[data-bark]').forEach((el) => {
    const bubble = el.querySelector('.wh-home-hero_speechbubble');
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      playBark();
      if (!bubble) return;
      gsap.killTweensOf(bubble);
      gsap.fromTo(bubble, { scale: 0, opacity: 1 }, { scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
      gsap.to(bubble, { scale: 0, duration: 0.3, delay: 1.6, ease: 'power2.in' });
    });
  });
}
