import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import Lenis from 'lenis';
import { initNewHero } from './hero/main.js';
import { initSite } from './site.js';
import { initTransitions } from './transitions.js';

gsap.registerPlugin(ScrollTrigger,Draggable,);

// LENIS
// One instance for the whole visit: it scrolls the window, which page changes don't replace.
const lenis = new Lenis()

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

/** Set up whatever is on the page right now. Returns the function that tears it down again. */
function initPage(options) {
    let destroyHero, destroySite;
    const ctx = gsap.context(() => {
        // Homepage hero (src/hero); does nothing on pages without it.
        destroyHero = initNewHero(options);
        destroySite = initSite();
    });
    return () => {
        destroySite();
        destroyHero?.();
        ctx.revert();
    };
}

initTransitions({ lenis, initPage });
