import './styles/style.css'

import gsap from 'gsap'

const goToCakeButton = document.querySelector('.gotocake');
const goToBurgerButton = document.querySelector('.gotoburger');



goToCakeButton.addEventListener('click', function () {
  
    let moveNext = gsap.timeline();

    moveNext.to('.hero_slide-fader', { x: "-100%", duration: 3, ease: 'power4.inOut',  backgroundColor: '#ffd9e0' })
    .to('[data-slide="1"]', {
        x: "-100%",
        z: "1",
        duration:2,
        ease:'power4.inOut',
        stagger: {
            amount: 0.05,
            from: "random"
        },
    }, "<0.5")
    .from('[data-slide="2"]', {x:"100%", duration: 2, ease: 'power4.inOut', stagger:{amount: 0.05, from: 'random'}}, "<")

});


goToBurgerButton.addEventListener('click', function () {
    
    let moveNext = gsap.timeline();

    moveNext.to('.hero_slide-fader', { x: "100%", duration: 3, ease: 'power4.inOut',  backgroundColor: '#9CF9FF' })
    .to('[data-slide="1"]', {
        x: "0%",
        z: "1",
        duration:2,
        ease:'power4.inOut',
        stagger: {
            amount: 0.05,
            from: "random"
        },
    }, "<0.5")
})