import { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, MotionPathPlugin } from 'gsap/all'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, MotionPathPlugin)

export function gsapController() {
  /* LENIS SCROLL */
  let lenis = new Lenis()
  gsap.ticker.add((time) => {
    lenis.raf(time * 700)
  })
  gsap.ticker.lagSmoothing(0)


  /* BANNER */
  gsap.from('.banner_con img', {
    scale: 1.3,
    duration: 3,
    ease:'power4.out'
  })

  
  let bannerTextsST = new SplitText(['header p', 'nav ul li a', '.banner_info p'], {
    type: 'lines, lines', 
    linesClass: 'line'
  });

  let bannerTextsTL = gsap.timeline()

  bannerTextsTL.from(bannerTextsST.lines, {
    y: 200,
    opacity: 0,
    ease:'back.out',
    stagger: {
      each: 0.1
    }
  })

  let bannerImg = gsap.timeline({
    scrollTrigger: {
      start: 'top top',
      scrub: true,
    }
  })

  bannerImg.to('.banner_con img', {
    objectPosition: '0% 100%'
  })

  /* MIDDLE */
  let middleImg = gsap.timeline({
    scrollTrigger: {
      start: 'top top',
      end: 'bottom center',
      scrub: true
    }
  })
  middleImg.to('.middle_img img', {
    objectPosition: '0% 100%'
  })

  let middleTextsST = new SplitText(['.middle_con h2', '.middle_con p'], {
    type: 'lines, lines', 
    linesClass: 'line'
  });

  let middleTextsTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.middle_con',
      start: 'top center',
      // end: 'bottom 70%',
      // scrub: true,
    }
  })

  middleTextsTL.from(middleTextsST.lines, {
    y: 50,
    opacity: 0,
    ease: 'back.out',
    stagger: {
      each: 0.1
    }
  })

  let mainTextsST = new SplitText(['.founded_info section h3', '.founded_info section p', '.foundational_guiding h2', '.foundational_guiding p', '.foundational_guiding ul'], {
    type: 'lines, lines', 
    linesClass: 'line'
  });

  gsap.from(mainTextsST.lines, {
    y: 50,
    opacity: 0,
    ease: 'back.out',
    stagger: {
      each: 0.1,
    },
    scrollTrigger: {
        trigger: '.main_con',
        start: 'top center',
        // end: 'bottom 90%',
        // scrub: true,
      }
  })
}