import './styles/style.css'

import gsap from 'gsap'


// Define the GSAP timeline
let slide1 = gsap.timeline({
    paused: true, // Initially pause the timeline
});

let slide2 = gsap.timeline({
    paused: true, // Initially pause the timeline
});

slide1.set('.home-slide_fade', { xPercent: 0})

slide1.to('.home-slide_fade', { xPercent: -200, duration: 3, ease: 'power4.inOut', backgroundColor: '#ffe2e8', })
.to('.slide-1', { xPercent: -100, duration: 2, ease: 'power4.inOut', }, "<0.5")
.from('.slide-2', { xPercent: 100, duration: 2, ease: 'power4.inOut', }, "<");

// Add event listener to the element with goToSlide="2" attribute
document.querySelector('[goToSlide="2"]').addEventListener('click', function() {
    slide1.play(); // Play the GSAP timeline when the element is clicked
});


    /* Paralax on first slide layers - ISSUE - Flicking when transforming images */
    // slide1.to('._1', {xPercent: -100, duration: 2, stagger: { amount: 0.05, from: "random" }, ease: 'power4.inOut'},+2)



slide2.set('.home-slide_fade', { xPercent: -200})

slide2.to('.home-slide_fade', { xPercent: 200, duration: 3, ease: 'power4.inOut', backgroundColor: '#9af4f9', })
    .to('.slide-2',{xPercent: 200, duration: 2, ease: 'power4.inOut'}, "<0.5")
    .to('.slide-1',{xPercent: 0, duration: 2, ease: 'power4.inOut'}, "<");


document.querySelector('[goToSlide="1"]').addEventListener('click', function() {
    slide2.play(); // Play the GSAP timeline when the element is clicked
});