import './styles/style.css'

import gsap from 'gsap'

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
