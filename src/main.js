import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import Lenis from 'lenis';
import { initNewHero } from './hero/main.js';
import { initSite } from './site.js';
import { initTransitions } from './transitions.js';
import { initMusicControl, updateMusicControl } from './music-control.js';
import { initIntro, settleIntro } from './intro.js';

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
    settleIntro();
    let destroyHero, destroySite;
    const ctx = gsap.context(() => {
        // Homepage hero (src/hero); does nothing on pages without it.
        destroyHero = initNewHero(options);
        destroySite = initSite();
    });
    updateMusicControl();
    return () => {
        destroySite();
        destroyHero?.();
        ctx.revert();
    };
}

// Once per page load, before the page set-up: the Enter screen decides whether the hero waits for it.
initIntro();
initMusicControl();
initTransitions({ lenis, initPage });
