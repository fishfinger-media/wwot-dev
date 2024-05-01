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

    gsap.from('.newsletter_container',{
        yPercent: 100,
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: {
            trigger: '.footer',
            start: "top 80%",
        }
    })

 
}