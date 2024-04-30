import './styles/style.css'

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bodymovin from 'lottie-web';
gsap.registerPlugin(ScrollTrigger);
import Lenis from 'lenis';
import SplitType from 'split-type';
import Swiper from 'swiper/bundle';
import { Navigation, Pagination } from 'swiper/modules';
const lenis = new Lenis()


function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

let playSound = false;
// INTRO
if (document.querySelector('.section_home-hero')) {


    let audio = new Audio('https://cdn.jsdelivr.net/gh/fishfinger-media/wwot-dev/media/intro.mp3');


    gsap.set('.navigation', {
        yPercent: -100
    });

    var animation = bodymovin.loadAnimation({
        container: document.getElementById('bm'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'https://uploads-ssl.webflow.com/662b7f60d03c5e2b1e67488f/66301265da26ca5dc373a497_logoMenu.json'
    });

    function disableScroll() {
        document.body.classList.add('no-scroll');
    }

    function enableScroll() {
        document.body.classList.remove('no-scroll');
    }

    function hideSlideAndPlayAnimation() {
        disableScroll();

        // Hide slide 1
        gsap.to('.loader_slide.slide-1', {
            opacity: 0,
            duration: 1.4,
            ease: "power4.inOut",
            onComplete: () => {
                document.querySelector('.loader_slide.slide-1').remove();
            }
        });

        // Show slide 2 containing the Lottie animation
        gsap.to('.loader_slide.slide-2', {
            opacity: 1,
            duration: 1.4,
            ease: "power4.inOut",
        });

        // Start playing the animation immediately
        animation.goToAndStop(1, true);
        animation.playSegments([1, animation.totalFrames - 1], true);

        // Start playing audio
        if (playSound) {
            audio.volume = 0.3;
            audio.loop = true;
            audio.play();
        }

        // Wait for about 4 seconds after the Lottie animation finishes
        setTimeout(() => {
            gsap.to('.home-loader', {
                yPercent: -100,
                duration: 1.5,
                ease: "power4.inOut",
                onStart: () => {
                    enableScroll();

                    gsap.from('[data-slide="burger"]', {
                        yPercent: 30,
                        duration: 1.8,
                        ease: "power4.inOut",

                    });
                    gsap.to('.navigation', {
                        yPercent: 0,
                        duration: 1.5,
                        ease: "power4.inOut",
                        delay: 0.5
                    });


                }
            });
        }, (animation.totalFrames / animation.frameRate) * 1000); // Wait for Lottie animation to finish + 4 seconds
    }

    document.querySelector('[loader-menu="yes"]').addEventListener('click', () => {
        playSound = true;
        hideSlideAndPlayAnimation();
    });

    document.querySelector('[loader-menu="no"]').addEventListener('click', () => {
        playSound = false;
        hideSlideAndPlayAnimation();
    });

}


// SLIDER
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


            if (playSound) {
                const sound = new Audio('https://cdn.jsdelivr.net/gh/fishfinger-media/wwot-dev/media/wind.mp3');
                sound.volume = 0.4;
                sound.play();
            }
            transitionSlide(slide, nextSlide, 'next');
        });

        document.querySelector(`[goToSlide="${prevSlide}"][slide-direction="prev"]`).addEventListener('click', () => {
            if (playSound) {
                const sound = new Audio('https://cdn.jsdelivr.net/gh/fishfinger-media/wwot-dev/media/wind.mp3');
                sound.volume = 0.4;
                sound.play();
            }
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
        scrollTrigger: {
            trigger: polaroid,
            start: "top 80%",
        }
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

// QUIZ
if (document.querySelector('.section_quiz')) {


    let quizSwiper = new Swiper('.swiper.is-quiz', {
        wrapperClass: 'swiper_wrapper',
        slideClass: 'swiper_slide',

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

if (document.querySelector('.swiper.is-product')) {
    let productSwiper = new Swiper('.swiper.is-product', {
        wrapperClass: 'swiper_wrapper',
        slideClass: 'swiper_slide',
        loop: true,
        effect: "slide",
        slidesPerView: 1,
        speed: 350,

        pagination: {
            el: '.ourproducts-tabs_links',
            clickable: true,
            bulletClass: 'button is-tab',
            bulletActiveClass: 'is-active',
            renderBullet: function (index, className) {
                // Get the slide corresponding to the index
                let slide = this.slides[index];
                // Get the value of the data-slide-name attribute
                let slideName = slide.getAttribute('data-slide-name');
                // Create a new bullet element
                return '<span class="' + className + '" data-slide-name="' + slideName + '">' + slideName + '</span>';
            },
        },

    });
}

if (document.querySelector('.swiper.is-why')) {

    let whySwiper = new Swiper('.swiper.is-why', {
        wrapperClass: 'swiper_wrapper',
        slideClass: 'swiper_slide',
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        mousewheel: true,

        pagination: {
            el: '.swiper_pagination-wrapper.is-vertical',
            clickable: true,
            bulletClass: 'swiper_dot',
            bulletActiveClass: 'is-active'
        }
    });

}
let envelope = gsap.timeline();

envelope.to('.envolope.top', {
    rotateX: 180,
    duration: 2,
    ease: "power4.inOut",
    scrollTrigger: {
        trigger: '.envolope.top',
        start: "top 80%",
        end: "top 60%",
        scrub: 1
    },

})

const dogPhotos = document.querySelectorAll('.polaroid');

dogPhotos.forEach((photo) => {
    gsap.from(photo, {
        top: "25%",
        left: "25%",
        bottom: "25%",
        right: "25%",
        scale: 0,
        duration: 1.5,
        ease: "power4.inOut",
        stagger: 1,
        scrollTrigger: {
            trigger: '.envolope.top',
            start: "top 80%",
            end: "top 50%",

        },

    });
});



gsap.from(".star", {
    scale: 0,
    duration: 0.2,
    ease: "power4.inOut",
    stagger: {
        each: 0.05,
        from: "random"
    },

    ease: "power2.inOut",
    scrollTrigger: {
        trigger: ".section_home-club",
        start: "top 60%", // Change this according to your needs
        end: "bottom center", // Change this according to your needs

    },

});



// BARK SOUND

const barkElements = document.querySelectorAll('[bark]');

// Function to play bark sound
function playBarkSound() {
    // Create an audio element
    const audio = new Audio('https://cdn.jsdelivr.net/gh/fishfinger-media/wwot-dev/media/bark.mp3');
    // Play the audio
    audio.play();
}

// Add click event listener to each element
barkElements.forEach(function (element) {
    element.addEventListener('click', playBarkSound);
});


// home swiper

let homeSwiper = new Swiper('.swiper.is-home', {

    wrapperClass: 'swiper_wrapper',
    slideClass: 'swiper_slide',
    slidesPerView: 1,
    loop: true,
    autoplay: {
        delay: 5000,
    },
    
});