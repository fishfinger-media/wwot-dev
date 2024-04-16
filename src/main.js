import './styles/style.css'

import gsap from 'gsap'
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const slides = ['burger', 'cake', 'pizza', 'sushi'];

const slideColors = {
    burger: '#A6FAFE',
    cake: '#FDF6F7',
    pizza: '#FAE3CD',
    sushi: '#F1F3A6'
};

function transitionSlide(fromSlide, toSlide, direction) {
    const fromSlideSelector = `[data-slide="${fromSlide}"]`;
    const toSlideSelector = `[data-slide="${toSlide}"]`;
    const fromSlideImgSelector = `[data-slide-img="${fromSlide}"]`;
    const toSlideImgSelector = `[data-slide-img="${toSlide}"]`;

    const backgroundColorFrom = slideColors[fromSlide];
    const backgroundColorTo = slideColors[toSlide];

    gsap.timeline()
        .set('.slider_fade', { xPercent: direction === 'next' ? 0 : -200, backgroundColor: backgroundColorFrom })
        .set(toSlideSelector, { xPercent: direction === 'next' ? 100 : -100 })
        .set(fromSlideImgSelector, { x: '0%', z: 1 })
        .set(toSlideImgSelector, { x: direction === 'next' ? '10%' : '-10%', z: 1 })

        .to('.slider_fade', { xPercent: direction === 'next' ? -200 : 0, duration: 3, ease: "power4.inOut", backgroundColor: backgroundColorTo })
        .to(fromSlideSelector, { xPercent: direction === 'next' ? -100 : 100, duration: 2, ease: "power4.inOut" }, "<0.5")
        .to(fromSlideImgSelector, { x: direction === 'next' ? '-10%' : '10%', z: 1, duration: 2, ease: "power4.inOut", stagger: { amount: 0.5, from: "random" } }, "<")
        .to(toSlideSelector, { xPercent: 0, duration: 2, ease: "power4.inOut" }, "<")
        .to(toSlideImgSelector, { x: '0%', z: 1, duration: 1.5, ease: "power4.inOut", stagger: { amount: 0.5, from: "random" } }, "<");
}

slides.forEach((slide, index) => {
    const nextSlide = slides[(index + 1) % slides.length];
    const prevSlide = slides[(index - 1 + slides.length) % slides.length];

    document.querySelector(`[goToSlide="${nextSlide}"][slide-direction="next"]`).addEventListener('click', () => {
        transitionSlide(slide, nextSlide, 'next');
    });

    document.querySelector(`[goToSlide="${prevSlide}"][slide-direction="prev"]`).addEventListener('click', () => {
        transitionSlide(slide, prevSlide, 'prev');
    });
});


    gsap.set('.slider_overlay-wrapper', { display: 'none', opacity: 0 });

    

document.querySelector('[data-overlay-balloon="main"]').addEventListener('click', () => {

    let main = document.querySelector('[data-overlay-balloon="main"]');
    let anchor = document.querySelector('[data-overlay-balloon="anchor"]');

    let state = Flip.getState(`[data-overlay-balloon="main"]`);
    anchor.appendChild(main);

    Flip.from(state, { duration: 1, ease: "power1.out" });
    gsap.to('.slider_overlay-wrapper', {display: 'flex', opacity: 1})
    gsap.from('.is-postcard', {yPercent:150, duration: 1.5, ease: "back.inOut(1.7)"}, "<")
    gsap.from('.slider_overlay-button', { yPercent:50, opacity:0, duration: 1, ease: "power4.inOut"}, "<0.7");

});


document.querySelector('.slider_overlay-button').addEventListener('click', () => {

        let main = document.querySelector('[data-overlay-balloon="main"]');
        let anchor = document.querySelector('[data-overlay-balloon="anchor"]');
    
        let state = Flip.getState(`[data-overlay-balloon="main"]`);
        anchor.removeChild(main);
    
        Flip.from(state, { duration: 1, ease: "power1.out", onComplete: () => {
            gsap.to('.slider_overlay-wrapper', {display: 'none', opacity: 0});
            gsap.to('.is-postcard', {yPercent: 0, duration: 1.5, ease: "back.inOut(1.7)"});
            gsap.to('.slider_overlay-button', {yPercent: 0, opacity: 1, duration: 1, ease: "power4.inOut"});
        } });
        
    });
    