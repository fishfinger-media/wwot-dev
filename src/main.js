import './styles/style.css'

import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(Flip,ScrollTrigger);

import SplitType from 'split-type';
import Swiper from 'swiper/bundle';
import { Navigation, Pagination } from 'swiper/modules';


if (document.querySelector('.section_home-hero')) {


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
            .set('.slider_fade', {
                xPercent: direction === 'next' ? 0 : -200,
                backgroundColor: backgroundColorFrom
            })
            .set(toSlideSelector, {
                xPercent: direction === 'next' ? 100 : -100
            })
            .set(fromSlideImgSelector, {
                x: '0%',
                z: 1
            })
            .set(toSlideImgSelector, {
                x: direction === 'next' ? '10%' : '-10%',
                z: 1
            })

            .to('.slider_fade', {
                xPercent: direction === 'next' ? -200 : 0,
                duration: 3,
                ease: "power4.inOut",
                backgroundColor: backgroundColorTo
            })
            .to(fromSlideSelector, {
                xPercent: direction === 'next' ? -100 : 100,
                duration: 2,
                ease: "power4.inOut"
            }, "<0.5")
            .to(fromSlideImgSelector, {
                x: direction === 'next' ? '-10%' : '10%',
                z: 1,
                duration: 2,
                ease: "power4.inOut",
                stagger: {
                    amount: 0.5,
                    from: "random"
                }
            }, "<")
            .to(toSlideSelector, {
                xPercent: 0,
                duration: 2,
                ease: "power4.inOut"
            }, "<")
            .to(toSlideImgSelector, {
                x: '0%',
                z: 1,
                duration: 1.5,
                ease: "power4.inOut",
                stagger: {
                    amount: 0.5,
                    from: "random"
                }
            }, "<");
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

}
// GLOBAL ANIMATIONS

const splitWords = document.querySelectorAll('[data-heading]')
const splitParagraphs = document.querySelectorAll('[data-paragraph]')

splitWords.forEach(splitWords => {
    const text = new SplitType(splitWords);
    gsap.from(text.chars, {
        yPercent: 30,
        opacity: 0,
        stagger: 0.02,
        ease: "back",
        duration: 0.4,
        scrollTrigger: {
            trigger: splitWords,
            start: "top 80%",
        }
    })
});

splitParagraphs.forEach(splitParagraphs => {
    const text = new SplitType(splitParagraphs);
    gsap.from(text.lines, {
        yPercent: 30,
        opacity: 0,
        stagger: 0.02,
        delay: 0.4,
        ease: "back",
        duration: 0.4,
        scrollTrigger: {
            trigger: splitParagraphs,
            start: "top 80%",
        }
    })
});

let polaroids = document.querySelectorAll('.welcome_polaroid');
polaroids.forEach(polaroid => {
    gsap.from(polaroid, {
        top: "25%",
        left: "25%",
        bottom: "25%",
        right: "25%",
        scale: 0,
        duration: 1,
        ease: "back",

    });
});



// Swiper 

let storySwiper = new Swiper('.swiper.is-story', {
    wrapperClass: 'swiper_wrapper',
    slideClass: 'swiper_slide',
    loop: true,
    effect: "fade",
    fadeEffect: {
        crossFade: true
    },

    navigation: {
        nextEl: '.swiper_nav.is-next',
        prevEl: '.swiper_nav.is-prev',
    },

    pagination: {
        el: '.swiper_pagination-wrapper',
        clickable: true,
        bulletClass: 'swiper_story-dot',
        bulletActiveClass: 'is-active'
    }
});

let teamSwiper = new Swiper('.swiper.is-team', {
    wrapperClass: 'swiper_wrapper',
    slideClass: 'swiper_slide',
    loop: true,

    spaceBetween: 50,

    navigation: {
        nextEl: '.swiper_nav.is-next',
        prevEl: '.swiper_nav.is-prev',
    },

    breakpoints: {
        992: {
            slidesPerView: 3,
            slidesPerGroup: 3,
        },
        991: {
            slidesPerView: 1,
            slidesPerGroup: 1,
        },
    },

});