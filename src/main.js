import './styles/style.css'

import gsap from 'gsap'

let slideOne = document.querySelector('.slide.is-1')
let slideTwo = document.querySelector('.slide.is-2')



// gsap timline 

const tl = gsap.timeline({})

tl.to(slideOne, {
    x: '-100%',
    duration: 3,
    ease: 'power4.inOut'
})

tl.to('.overlay', {
    x: '-100%',
    duration: 3.5,
    backgroundColor: '#FFEBEE',
    ease: 'power4.inOut'

}, '-=3.1')


tl.to(slideTwo, {
    x: '-0%',
    duration: 2,
    ease: 'power4.inOut',
}, '-=2.5')