

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import Lenis from 'lenis';
import SplitType from 'split-type';
import Swiper from 'swiper/bundle';
import { Navigation, Pagination } from 'swiper/modules';
import { initNewHero } from './hero/main.js';
import { createMusic } from './hero/audio.js';

// Homepage hero (src/hero); does nothing on pages without it.
initNewHero();


gsap.registerPlugin(ScrollTrigger,Draggable,);

// LENIS
const lenis = new Lenis()

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)


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
if (window.matchMedia("(max-width: 991px)").matches) {
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
        duration: 0.9,
        ease: "power4.inOut",
        stagger: {
            each: 0.05,
            from: "random"
        },
        scrollTrigger: {
            trigger: ".section_home-club",
            start: "top 80%",
        },
    });
    
    // GSAP animation for continuously rotating the stars with stop-framey effect
    gsap.to(".star", {
        duration: 0.6, // Adjust the duration for the desired speed of rotation
        rotation: () => Math.random() * 30 - 15, // Random rotation between -15 and 15 degrees
        repeat: -1, // Repeat indefinitely
        yoyo: true, // Reverse the rotation direction
        ease: "steps(1)",    });
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

    gsap.from('.footer_boat',{
        xPercent: 150,
        duration: 4,
        ease: "power4.inOut",
        scrollTrigger: {
            trigger: '.footer',
            start: "top 80%",
        }
    })

}

// STICKER
if (document.querySelector('.sticker')) {
    const stickers = document.querySelectorAll('.sticker');

    function scaleSticker(sticker, scaleValue) {
        gsap.to(sticker, { scale: scaleValue, duration: 0.2 });
    }
    
    stickers.forEach(sticker => {
        Draggable.create(sticker, {
            bounds: ".page_wrapper",
            inertia: true,
            onDragStart: function() {
                scaleSticker(this.target, 0.9);
            },
            onDragEnd: function() {
                scaleSticker(this.target, 1);
            }
        });
    
        sticker.addEventListener('mouseenter', function() {
            scaleSticker(this, 1.1);
        });
    
        sticker.addEventListener('mouseleave', function() {
            scaleSticker(this, 1);
        });
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
        slidesPerView: 1,
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
            nextEl: '.swiper-mobile_nav.is-right',
            prevEl: '.swiper-mobile_nav.is-left',
        },

        breakpoints: {
            992: {
                slidesPerView: 3,
                slidesPerGroup: 3,
            },
            991: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                autoplay: {
                    delay: 5000,
                },
            },
        },

    });

    const popups = document.querySelectorAll('.team_popup-message');
    let currentPopup = null;

    popups.forEach(popup => {
    popup.parentElement.addEventListener('click', () => {
        if (currentPopup && currentPopup !== popup) {
        gsap.to(currentPopup, { duration: 0.3, scale: 0 });
        }

        const isOpen = popup.style.transform === 'translate(-50%, -50%) scale(1)';
        currentPopup = isOpen ? null : popup;

        gsap.to(popup, { duration: 0.3, scale: isOpen ? 0 : 1 });
    });
    });

}

// NEWS SLIDER
let newsSwiper = new Swiper('.swiper.is-news', {
    wrapperClass: 'swiper_wrapper',
    slideClass: 'swiper_slide',
    loop: true,
    slidesPerView: 5,
    slidesPerView: 'auto',
    spaceBetween: 20,

    navigation: {
        nextEl: '.swiper_nav.is-next',
        prevEl: '.swiper_nav.is-prev',
    },
    
    breakpoints: {
        992: {

            slidesOffsetBefore: 80,
                slidesPerView: 5.2,
            },
            991: {
                slidesPerView: 3,
                autoplay: {
                    delay: 5000,
                },
            },
            768 : {
                slidesPerView: 1,
            },
    }
});

// PRODUCT SWIPER
if (document.querySelector('.swiper.is-product')) {
    let productSwiper = new Swiper('.swiper.is-product', {
        wrapperClass: 'swiper_wrapper',
        slideClass: 'swiper_slide',
        loop: true,
        allowTouchMove: false,
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

        on: {
            slideChange: function () {
                // Get current active slide
                let activeSlide = this.slides[this.activeIndex];

                // Get image source and background color from current active slide
                let imageUrl = activeSlide.getAttribute('data-image-src');
                let containerColor = activeSlide.getAttribute('data-container-color');

                // Change image source
                document.querySelector('.ourproducts_hills').setAttribute('src', imageUrl);
                // Change background color
                document.querySelector('.ourproducts_container').style.backgroundColor = containerColor;
            }
        }
    });
}


// PRODUCT INNER SWIPER
if (window.matchMedia("(min-width: 991px)").matches) {

    gsap.set('.ourproducts_label',{yPercent: -50, scale:0});

let productOne = document.querySelectorAll('.ourproducts_img.is-1');
let productTwo = document.querySelectorAll('.ourproducts_img.is-2');
let productThree = document.querySelectorAll('.ourproducts_img.is-3');

let productLabelOne = document.querySelectorAll('.ourproducts_label.is-1');
let productLabelTwo = document.querySelectorAll('.ourproducts_label.is-2');
let productLabelThree = document.querySelectorAll('.ourproducts_label.is-3');

let isClicked = false;

// when i click on product two shrink .ourproducts_tabs-container to 50%


productOne.forEach(productOne => {
    productOne.addEventListener('click', function () {
        
        if (isClicked === false) {

    
            gsap.to('.ourproducts_tabs-container', {
                width: '80%',
                duration: 0.8,
                ease: "power4.inOut", 
            });
            gsap.to(productOne, {
                scale: 1.3,
                zIndex: "3",
                marginLeft: '-20%',
                duration: 0.8,
                ease: "power4.inOut",
                

            })
            gsap.to(productTwo, {
                scale: 0.8,
                zIndex: "2",
                marginLeft: '-10%',
                duration: 0.8,
                ease: "power4.inOut",
                

            })
            gsap.to(productThree, {
                scale: 0.6,
                zIndex: "1",
                marginLeft: '-20%',
                duration: 0.8,
                ease: "power4.inOut",
            


            })
            gsap.to(productLabelOne, {
                scale: 1,
                duration: 0.8,
                ease: "power4.inOut",
                

            })
    
            isClicked = true;

            productTwo.forEach(productTwo => {
                productTwo.style.pointerEvents = 'none';
            });
            productThree.forEach(productThree => {
                productThree.style.pointerEvents = 'none';
            });
        } else {

            gsap.to('.ourproducts_tabs-container', {
                width: '100%',
                duration: 0.8,
                ease: "power4.inOut"
            });
            gsap.to(productOne, {
                scale: 1,
                marginLeft: '0%',
                duration: 0.8,
                ease: "power4.inOut",
            

            })
            gsap.to(productTwo, {
                scale: 1,
                marginLeft: '0%',
                duration: 0.8,
                ease: "power4.inOut"
            })
            gsap.to(productThree, {
                scale: 1,
                marginLeft: '0%',
                duration: 0.8,
                ease: "power4.inOut"
            })
            gsap.to(productLabelOne, {
                scale: 0,
                duration: 0.8,
                ease: "power4.inOut"
            })
    
            isClicked = false;
            productTwo.forEach(productTwo => {
                productTwo.style.pointerEvents = 'auto';
            });
            productThree.forEach(productThree => {
                productThree.style.pointerEvents = 'auto';
            });

        }

    });
});


productTwo.forEach(productTwo => {
    productTwo.addEventListener('click', function () {
        
        if (isClicked === false) {

            gsap.to('.ourproducts_tabs-container', {
                width: '80%',
              
                marginLeft: '-10%',
                duration: 0.8,
                ease: "power4.inOut"
            });
            gsap.to(productOne, {
                scale: 0.8,
                zIndex: "2",
                marginRight: '-10%',
    
                duration: 0.8,
                ease: "power4.inOut"
            })
            gsap.to(productThree, {
                zIndex: "1",
                scale: 0.8,
                marginLeft: '-10%',
                duration: 0.8,
                ease: "power4.inOut"
            })
            gsap.to(productTwo, {
                zIndex: "3",
                scale: 1.3,
                duration: 0.8,
                ease: "power4.inOut"
            })
            gsap.to(productLabelTwo, {
                scale: 1,
                duration: 0.8,
                ease: "power4.inOut"
            })
    
            isClicked = true;
            

            productOne.forEach(productOne => {
                productOne.style.pointerEvents = 'none';
            });
            productThree.forEach(productThree => {
                productThree.style.pointerEvents = 'none';
            });


        } else {

            gsap.to('.ourproducts_tabs-container', {
                width: '100%',
                marginLeft: '0%',
                duration: 0.8,
                ease: "power4.inOut"
            });
            gsap.to(productOne, {
                scale: 1,
                marginRight: '0%',
    
                duration: 0.8,
                ease: "power4.inOut"
            })
            gsap.to(productThree, {
                scale: 1,
                marginLeft: '0%',
                duration: 0.8,
                ease: "power4.inOut"
            })
            gsap.to(productTwo, {
                scale: 1,
                duration: 0.8,
                ease: "power4.inOut"
            })
            gsap.to(productLabelTwo, {
                scale: 0,
                duration: 0.8,
                ease: "power4.inOut"
            })
    
            isClicked = false;
            productOne.forEach(productOne => {
                productOne.style.pointerEvents = 'auto';
            });
            productThree.forEach(productThree => {
                productThree.style.pointerEvents = 'auto';
            });

        }

    });
});


productThree.forEach(productThree => {

    productThree.addEventListener('click', function () {

        if (isClicked === false) {
        
            gsap.to('.ourproducts_tabs-container', {
                width: '80%',
                duration: 0.8,
                ease: "power4.inOut"
            });

            gsap.to(productOne, {
                scale: 0.6,
                zIndex: "1",
                marginLeft: '-30%',
                duration: 0.8,
                ease: "power4.inOut"
            })
            
            gsap.to(productTwo, {
                scale: 0.8,
                zIndex: "2",
                marginLeft: '-20%',
                duration: 0.8,
                ease: "power4.inOut"
            })

            gsap.to(productThree, {
                scale: 1.3,
                zIndex: "3",
                marginLeft: '-10%',
                duration: 0.8,
                ease: "power4.inOut"
            })

            gsap.to(productLabelThree, {
                scale: 1,
                duration: 0.8,
                ease: "power4.inOut"
            })
        
            isClicked = true;
            productOne.forEach(productOne => {
                productOne.style.pointerEvents = 'none';
            });
            productTwo.forEach(productTwo => {
                productTwo.style.pointerEvents = 'none';
            });

        }
    
        else {

           
            gsap.to('.ourproducts_tabs-container', {
                width: '100%',
                duration: 0.8,
                ease: "power4.inOut"
            });

            gsap.to(productOne, {
                scale: 1,
                marginLeft: '0%',
                duration: 0.8,
                ease: "power4.inOut"
            })
            
            gsap.to(productTwo, {
                scale: 1,
                marginLeft: '0%',
                duration: 0.8,
                ease: "power4.inOut"
            })

            gsap.to(productThree, {
                scale: 1,
                marginLeft: '-0',
                duration: 0.8,
                ease: "power4.inOut"
            })

            gsap.to(productLabelThree, {
                scale: 0,
                duration: 0.8,
                ease: "power4.inOut"
            })

            isClicked = false;
            productOne.forEach(productOne => {
                productOne.style.pointerEvents = 'auto';
            });
            productTwo.forEach(productTwo => {
                productTwo.style.pointerEvents = 'auto';
            });

        }
    }
    )
}

);

} else {
    // INNER SWIPER

    let innerProductSwiper = new Swiper('.swiper .is-inner-product', {
        wrapperClass: 'ourproducts_tabs-container',
        slideClass: 'ourproducts_img',
        loop: true,
        slidesPerView: 1,
        speed: 400,

        navigation :{
            nextEl: '.ourproducts-inner_nav.is-right',
            prevEl: '.ourproducts-inner_nav.is-left',
        }
    });
}


// MUSIC CONTROL
// Drives the homepage hero's track (src/hero/audio.js); it is created on first use, so this
// works whether or not the visitor clicked Enter. Pages without the hero have no track.
if (document.querySelector('.music_control')) {

    const musicControl = document.querySelector('.music_control');
    const audioIcon = document.getElementById('audio-icon');

    musicControl.addEventListener('click', function () {
        const track = createMusic();
        if (!track) return;
        if (track.paused) {
            track.play().catch(() => {});
            audioIcon.src = 'https://uploads-ssl.webflow.com/662b7f60d03c5e2b1e67488f/6633b1f68e8cce0ba76b5e15_icon_vol-off.svg';
        } else {
            track.pause();
            audioIcon.src = 'https://uploads-ssl.webflow.com/662b7f60d03c5e2b1e67488f/6633b1f66fa8b47bafdf14a7_icon_vol-on.svg';
        }
    });
}


// NAVIGATION
if (window.innerWidth >= 992) {
    let navSize = gsap.timeline({
        scrollTrigger: {
            trigger: '.navigation',
            start: "bottom top",
            toggleActions: "play none none reverse"
        }
    })

    navSize.to('.nav_logo',{ height: '3.5rem', duration: 1, ease: "power4.inOut",})
    navSize.to('.nav_content', { paddingTop: '2rem', paddingBottom: '2rem', duration: 1, ease: "power4.inOut" }, "-=1")
    navSize.to('.navigation', { background: 'rgba(245, 254, 255, 0.2)', backdropFilter: 'blur(5px)', duration: 1, ease: "power4.inOut" }, "-=1")

} else {
    gsap.from('.nav_bg',{ opacity:0})
}

// MUSIC CONTROL VIEW
if (document.querySelector('.music_control')) {
    // by deafult music control is down 20vh when the user has scrolled 100vh the music control shoudl go up 

    gsap.to('.music_control',{
        y: '0vh',
        duration: 1,
        ease: "back.out(1)",
        scrollTrigger: {
            trigger: '.music_control',
            start: "top 80%",
            
        }
    })
}

