/**
 * Page transitions. The old page fades up and away, the new one fades up into place.
 *
 * Barba swaps .page_wrapper (nav, main and footer), so each page starts as fresh as a real load:
 * no mobile menu left open, no compact nav, no footer tweens already spent. Webflow never needs
 * data-barba attributes because the two lookups below point at the wrapper classes instead, which
 * also means a page added in Webflow later just works. If anything throws mid-transition, Barba
 * falls back to a normal page load.
 */
import barba from '@barba/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const OUT = 0.35;  // s, old page leaving
const IN = 0.8;    // s, new page arriving
const RISE = 48;   // px the new page travels up
const FETCH_TIMEOUT = 8000; // ms before giving up and doing a normal page load
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Only the content moves: a transform on .page_wrapper would make it the containing block of the
// fixed nav, which would jump when the page is scrolled.
const movingParts = (container) => container.querySelectorAll(':scope > main, :scope > footer');

/**
 * Styles from a page's <head> custom code; Home's holds the hero's CSS, for example. Not read through
 * doc.head: the tracking pixel's <noscript><img> ends the head early when the HTML is parsed without
 * scripting, as Barba's parser does, so everything after it lands in the body.
 */
const pageStyles = (doc) => [...doc.querySelectorAll('style, link[rel="stylesheet"]')].filter((el) => !el.closest('.page_wrapper'));

// Only what this adds is ever removed. Scripts inject styles too (Webflow, Swiper from this bundle)
// and can't be told apart from the first page's own, so that page's styles stay for the whole visit.
let addedStyles = [];

function syncHead(nextDoc) {
  const next = pageStyles(nextDoc);
  const nextHtml = new Set(next.map((el) => el.outerHTML));
  addedStyles = addedStyles.filter((el) => nextHtml.has(el.outerHTML) || el.remove());
  const inPage = new Set(pageStyles(document).map((el) => el.outerHTML));
  const missing = next.filter((el) => !inPage.has(el.outerHTML)).map((el) => document.adoptNode(el));
  document.head.append(...missing);
  addedStyles.push(...missing);
}

/** Product pages colour <body> per item, and scripts leave classes and data on it. */
function syncBody(nextDoc) {
  const { body } = document;
  [...body.attributes].forEach(({ name }) => body.removeAttribute(name));
  [...nextDoc.body.attributes].forEach(({ name, value }) => body.setAttribute(name, value));
}

/** Webflow only wires up interactions, Lotties and forms once, and keys them on the page ID. */
function restartWebflow(nextDoc) {
  document.documentElement.dataset.wfPage = nextDoc.documentElement.dataset.wfPage;
  const webflow = window.Webflow;
  if (!webflow) return;
  webflow.destroy();
  webflow.ready();
  webflow.require('ix2')?.init();
}

export function initTransitions({ lenis, initPage }) {
  let destroyPage = initPage();

  // Webflow's editor drives the page itself; leave it with normal page loads.
  if (window.Webflow?.env('editor')) return;

  // Pages get taller as lazy images arrive, and there's no window load event after a page swap.
  const refreshSoon = gsap.delayedCall(0.2, () => ScrollTrigger.refresh()).pause();
  document.addEventListener('load', (e) => {
    if (e.target.tagName === 'IMG') refreshSoon.restart(true);
  }, true);

  const scrollPositions = new Map(); // url -> scrollY, so back and forward land where they left
  window.addEventListener('pagehide', () => { history.scrollRestoration = 'auto'; });

  barba.dom.getWrapper = () => document.body;
  barba.dom.getContainer = (scope = document) => scope.querySelector('.page_wrapper');

  barba.init({
    timeout: FETCH_TIMEOUT,
    transitions: [{
      name: 'fade-up',

      before() {
        history.scrollRestoration = 'manual';
        lenis.stop();
      },

      leave({ current }) {
        scrollPositions.set(current.url.href, window.scrollY);
        return gsap.timeline({ defaults: { duration: reduced ? 0 : OUT, ease: 'power2.in' } })
          .to(current.container, { opacity: 0 }, 0)
          .to(movingParts(current.container), { y: -RISE / 2 }, 0)
          .then();
      },

      afterLeave({ current }) {
        destroyPage();
        // Webflow caches every Lottie and destroy() doesn't clear it, which would keep each old page in memory.
        const lottie = window.Webflow?.require('lottie');
        current.container.querySelectorAll('[data-animation-type="lottie"]').forEach((el) => lottie?.cleanupElement(el));
      },

      // Barba keeps the old page until after enter. It goes now, because the page setup looks
      // things up across the whole document and would find the old page's copies first.
      beforeEnter({ current, next, trigger }) {
        barba.dom.removeContainer(current.container);
        const nextDoc = barba.dom.toDocument(next.html);
        const { body } = document;
        const fromColour = getComputedStyle(body).backgroundColor;

        gsap.set(next.container, { opacity: 0 });
        syncHead(nextDoc);
        syncBody(nextDoc);
        restartWebflow(nextDoc);
        destroyPage = initPage({ skipIntro: true });

        const bodyStyle = body.getAttribute('style');
        gsap.fromTo(body, { backgroundColor: fromColour }, {
          backgroundColor: getComputedStyle(body).backgroundColor,
          duration: reduced ? 0 : IN,
          ease: 'sine.inOut',
          onComplete() {
            if (bodyStyle) body.setAttribute('style', bodyStyle);
            else body.removeAttribute('style');
          },
        });

        lenis.resize();
        ScrollTrigger.refresh();
        const target = next.url.hash && document.getElementById(next.url.hash);
        const remembered = trigger === 'back' || trigger === 'forward' ? scrollPositions.get(next.url.href) : 0;
        lenis.scrollTo(target || remembered || 0, { immediate: true, force: true });
      },

      enter({ next }) {
        return gsap.timeline({ defaults: { duration: reduced ? 0 : IN, ease: 'power3.out' } })
          .to(next.container, { opacity: 1, clearProps: 'opacity' }, 0)
          .from(movingParts(next.container), { y: RISE, clearProps: 'transform' }, 0)
          .then();
      },

      after() {
        lenis.start();
        ScrollTrigger.refresh();
        // Plausible follows history changes by itself; the Google tag doesn't.
        window.gtag?.('event', 'page_view', {
          page_location: location.href,
          page_path: location.pathname,
          page_title: document.title,
        });
      },
    }],
  });
}
