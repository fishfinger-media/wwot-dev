/** Mobile hero: outer slider (worlds, driven by the tab buttons) + inner slider per world. */
import Swiper from 'swiper';
import 'swiper/css';
import { setActiveWorld } from './motion.js';

const WORLDS = ['burger', 'cake', 'pizza', 'sushi'];

export function initMobileHero() {
  const root = document.getElementById('mobile-hero');
  if (!root) return null;

  root.querySelectorAll('.swiper.wh-is-mobile-hero_inner').forEach((el) => {
    new Swiper(el, {
      loop: false,
      centeredSlides: true,
      slidesPerView: 1,
      initialSlide: 1,
      speed: 400,
    });
    el.querySelector('.wh-ourproducts-inner_nav.wh-is-left')?.addEventListener('click', () => el.swiper.slidePrev());
    el.querySelector('.wh-ourproducts-inner_nav.wh-is-right')?.addEventListener('click', () => el.swiper.slideNext());
  });

  const outerEl = root.querySelector('.swiper.wh-is-home-hero_mobile');
  const outer = new Swiper(outerEl, {
    loop: false,
    allowTouchMove: false,
    slidesPerView: 1,
    speed: 400,
    on: {
      slideChange(s) {
        setActiveWorld(WORLDS[s.activeIndex]);
        document.body.dataset.product = WORLDS[s.activeIndex];
        tabs.forEach((t, i) => t.classList.toggle('wh-is-active', i === s.activeIndex));
      },
    },
  });
  const tabs = [...root.querySelectorAll('[data-mobile-goto]')];
  tabs.forEach((t) => t.addEventListener('click', () => outer.slideTo(+t.dataset.mobileGoto - 1, 0)));
  setActiveWorld('burger');

  return { swiper: outer, playEntrance() {} };
}
