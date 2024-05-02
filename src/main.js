import './styles/style.css'

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import bodymovin from 'lottie-web';
import Lenis from 'lenis';
import SplitType from 'split-type';
import Swiper from 'swiper/bundle';
import { Navigation, Pagination } from 'swiper/modules';

gsap.registerPlugin(ScrollTrigger, Draggable);

// LENIS
const lenis = new Lenis()

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

let playSound = true;
let music = new Audio('https://cdn.jsdelivr.net/gh/fishfinger-media/wwot-dev/media/intro.mp3');

// LOADER
if (document.querySelector('.section_home-intro')) {

    var animation = bodymovin.loadAnimation({
        container: document.querySelector('.home-intro_lottie-container'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'https://uploads-ssl.webflow.com/662b7f60d03c5e2b1e67488f/66301265da26ca5dc373a497_logoMenu.json',

    });

    function loader() {
        const slide1 = document.querySelector('.home_intro-slide.slide-1');
        gsap.to(slide1, {
            opacity: 0,
            duration: 1,
            onComplete: () => slide1.style.display = 'none'
        });
        animation.play();

        gsap.to('.home_intro', {
            yPercent: -100,
            duration: 1.4,
            ease: "power4.inOut",
        }, "+4");
        gsap.from('.navigation', {
            yPercent: -100,
            duration: 1.4,
            ease: "power4.inOut"
        }, "-=1");
        gsap.from('.home-hero_slide', {
            yPercent: 30,
            duration: 1.4,
            ease: "power4.inOut",
            stagger: 0.1
        }, "-=2");
        lenis.scrollTo(0, 0, 0);

        if (playSound) {
            music.loop = true;
            music.volume = 0.6
            music.play();
        }
    }

    const loaderBtnTrue = document.querySelector('[play-sound="true"]').addEventListener('click', function () {
        playSound = true;
        loader();
    });

    const loaderBtnFalse = document.querySelector('[play-sound="false"]').addEventListener('click', function () {
        playSound = false;
        loader();
    });

}

// DOG BARKS 
const dogBarks = document.querySelectorAll('[dog-bark]');

dogBarks.forEach(dogBark => {
    dogBark.addEventListener('click', function () {
        const audio = new Audio('https://cdn.jsdelivr.net/gh/fishfinger-media/wwot-dev/media/bark.mp3');
        audio.play();

        const speechBubble = dogBark.querySelector('.home-hero_speechbubble');

        gsap.set(speechBubble, {
            scale: 0,
            opacity: 1
        });

        gsap.to(speechBubble, {
            duration: 0.5,
            scale: 1,
            ease: "power2.out",
            onComplete: function () {
                gsap.set(speechBubble, {
                    scale: 0,
                    opacity: 1
                }, "+=0.5");
            }
        });
    });
});

// HERO SLIDER
if (document.querySelector('.section_home-hero')) {

    var homeSwiper = new Swiper(".section_home-hero", {
        wrapperClass: "swiper_wrapper",
        slideClass: "home-hero_slide",
        speed: 800,
        simulateTouch: false,
        parallax: true,
        loop: true,

    });

    let buttonsNext = document.querySelectorAll('.hero_slide-nav.is-next');
    let buttonsPrev = document.querySelectorAll('.hero_slide-nav.is-prev');

    buttonsNext.forEach(function (button) {
        button.addEventListener('click', function () {
            homeSwiper.slideNext();
        });
    });

    buttonsPrev.forEach(function (button) {
        button.addEventListener('click', function () {
            homeSwiper.slidePrev();
        })
    });


    document.querySelectorAll('[data-button]').forEach(button => {
        button.addEventListener('click', function () {
            let popup = document.querySelector(`[data-popup="${this.getAttribute('data-button')}"]`);
            let popupImage = popup.querySelector('.home-popup_postcard-character');
            let popupLetter = popup.querySelector('.home-popup_postcard');
            popup.style.display = 'flex';
            gsap.fromTo(popup, {
                opacity: 0
            }, {
                opacity: 1,
                duration: 0.5
            });
            gsap.from(popupImage, {
                yPercent: -100,
                duration: 1.5,
                ease: "back"
            });
            gsap.from(popupLetter, {
                yPercent: 100,
                duration: 1.5,
                ease: "back"
            })

        });
    });


    document.querySelectorAll('[data-popup]').forEach(popup => {
        popup.addEventListener('click', function () {
            let popupImage = popup.querySelector('.home-popup_postcard-character');
            let popupLetter = popup.querySelector('.home-popup_postcard');

            gsap.to(this, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    this.style.display = 'none';
                }
            });

        });
    });



};

// SPLIT TEXT
const splitWords = document.querySelectorAll('[data-heading]')
const splitParagraphs = document.querySelectorAll('[data-paragraph]')

splitWords.forEach(splitWords => {
    const text = new SplitType(splitWords);
    gsap.from(text.chars, {
        yPercent: 30,
        opacity: 0,
        stagger: 0.02,
        ease: "back",
        duration: 0.6,
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
        duration: 0.6,
        scrollTrigger: {
            trigger: splitParagraphs,
            start: "top 80%",
        }
    })
});

// WELCOME POLAROIDS
if (document.querySelector('.section_home-welcome')) {

    let welcomeImg = document.querySelectorAll('.welcome_polaroid');

    welcomeImg.forEach(welcomeImg => {
        gsap.from(welcomeImg, {
            top: "25%",
            left: "25%",
            bottom: "25%",
            right: "25%",
            scale: 0,
            duration: 1,
            ease: "back",
            scrollTrigger: {
                trigger: '.welcome_polaroid',
                start: "top 80%",
            }
        });
    });

}

// QUIZ
if (document.querySelector('.section_quiz')) {


    let quizSwiper = new Swiper('.swiper.is-quiz', {
        wrapperClass: 'swiper_wrapper',
        slideClass: 'swiper_slide',
        simulateTouch: false,
        speed: 0,
    });

    document.querySelectorAll('[quiz-goto]').forEach(button => {
        button.addEventListener('click', function () {
            // Get the value of quiz-goto attribute
            let slideIndex = parseInt(this.getAttribute('quiz-goto'));

            // Go to the corresponding slide
            quizSwiper.slideTo(slideIndex - 1, 0); // -1 because slide index starts from 0
        });
    });


    let btn = document.querySelector('[quiz-goto="3"]');
    let input = document.getElementById('quiz-input');
    let names = document.querySelectorAll('[quiz-name]');

    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.5';


    // if input is empty do nothing else enable button

    input.addEventListener('input', function () {
        if (input.value === '') {
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.5';
        } else {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        }
    })


    btn.addEventListener('click', function () {
        names.forEach(name => {
            name.textContent = input.value;
        })
    });
}

// STARS
if (document.querySelector('.star')) {
    gsap.from(".star", {
        scale: 0,
        duration: 0.7,
        ease: "power4.inOut",
        stagger: {
            each: 0.05,
            from: "random"
        },

        ease: "power2.inOut",
        scrollTrigger: {
            trigger: ".section_home-club",
            start: "top 80%",

        },

    });
}

// FOOTER
if (document.querySelector('.footer')) {

    gsap.from('.newsletter_container', {
        yPercent: 100,
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: {
            trigger: '.footer',
            start: "top 80%",
        }
    })


}

// STICKER
if (document.querySelector('.section_quiz')) {

    const images = [
        'https://uploads-ssl.webflow.com/662b7f60d03c5e2b1e67488f/662b9376d45d6c1b0c9c2150_image_sticker-cake.svg',
        'https://uploads-ssl.webflow.com/662b7f60d03c5e2b1e67488f/662b937653bf01ff60b02136_image_sticker-sushi.svg',
        'https://uploads-ssl.webflow.com/662b7f60d03c5e2b1e67488f/662b93766fb299910bb7eada_image_sticker-pizza.svg',
        'https://uploads-ssl.webflow.com/662b7f60d03c5e2b1e67488f/662b9376f7e1bec63eae97db_image_sticker-balloon.svg'
    ];

    // Preload images
    const preloadImages = () => {
        images.forEach(image => {
            const img = new Image();
            img.src = image;
        });
    };

    preloadImages();

    const quizContent = document.querySelector('[data-sticker-area]');

    document.addEventListener('click', function (event) {
        if (event.target.closest('[data-sticker-area]')) {
            const randomImage = images[Math.floor(Math.random() * images.length)];
            const sticker = document.createElement('img');
            sticker.src = randomImage;
            sticker.classList.add('sticker');

            const rotation = Math.floor(Math.random() * 13) * 5 - 30;
            sticker.style.transform = `rotate(${rotation}deg)`;

            const rect = quizContent.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            sticker.style.left = `${x}px`;
            sticker.style.top = `${y}px`;

            quizContent.appendChild(sticker);

            // GSAP animation
            gsap.from(sticker, {
                duration: 0.5,
                scale: 0,
                opacity: 0,
                ease: "elastic.inOut(1.4,1)",
                onComplete: function () {
                    // Rotate after the animation completes
                    gsap.to(sticker, {
                        duration: 0,
                        rotation: rotation,
                    });
                }
            });
        }
    });
}

// ENVELOPE
if (document.querySelector('.envelope_card-wrapper')) {

    var envelopeAnimation = gsap.timeline()

    envelopeAnimation.to('.envelope.top', {
        rotateX: -180,
        duration: 1.5,
        ease: "power4.inOut",
    })

    envelopeAnimation.from('.envelope_card-wrapper', {
        scale: 0,
        duration: 0.8,
        ease: "power4.inOut",
        stagger: {
            amount: 0.1,
            from: "center"
        }
    }, "-=1")


    ScrollTrigger.create({
        animation: envelopeAnimation,
        trigger: '.envelope_content',
        start: "top 80%",
        toggleActions: "play none none reverse"

    });

    const wrappers = document.querySelectorAll('.envelope_card-wrapper');

    wrappers.forEach(wrapper => {
        const content = wrapper.querySelector('.envelope_card-content');
        gsap.set(content, {
            transformStyle: "preserve-3d"
        });

        wrapper.addEventListener('mouseenter', () => {
            gsap.to(content, {
                rotationY: 180,
                duration: 0.5,
                ease: "power2.inOut"
            });
        });

        wrapper.addEventListener('mouseleave', () => {
            gsap.to(content, {
                rotationY: 0,
                duration: 0.5,
                ease: "power2.inOut"
            });
        });
    });
}

// STORY SLIDER
if (document.querySelector('.swiper.is-story')) {

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
}

// TEAM SLIDER
if (document.querySelector('.swiper.is-team')) {

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
}

// BOAT 
function animateBoat() {
    gsap.timeline({
            repeat: -1,
            yoyo: true
        })
        .to("#boat", {
            duration: 2,
            y: -30,
            ease: "power1.inOut"
        })
        .to("#boat", {
            duration: 2,
            y: -10,
            ease: "power1.inOut"
        });

    gsap.to("#boat", {
        duration: 4,
        x: "-=20",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}
animateBoat();

function animateBoatAlt() {
    gsap.timeline({
            repeat: -1,
            yoyo: true
        })
        .to("#boatAlt", {
            duration: 2.5,
            y: -20,
            ease: "power1.inOut"
        })
        .to("#boatAlt", {
            duration: 2.5,
            y: -6,
            ease: "power1.inOut"
        });

    gsap.to("#boatAlt", {
        duration: 4,
        x: "-=23",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}
animateBoatAlt();