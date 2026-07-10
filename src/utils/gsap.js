import { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, MotionPathPlugin } from 'gsap/all'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, MotionPathPlugin)

export function gsapController() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    /* LENIS SCROLL */
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
        // gsap's ticker passes elapsed time in seconds; Lenis expects a ms timestamp
        lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    /* BANNER */
    gsap.from('.banner_con img', {
        scale: 1.3,
        duration: 3,
        ease: 'power4.out',
    })

    const bannerTextsST = new SplitText(['header p', 'nav ul li a', '.banner_info p'], {
        type: 'lines',
        linesClass: 'line',
    })
    gsap.timeline().from(bannerTextsST.lines, {
        y: 200,
        opacity: 0,
        ease: 'back.out',
        stagger: { each: 0.1 },
    })
    gsap.from('.banner_scroll', {
        opacity: 0,
        duration: 1,
        delay: 0.8,
    })

    gsap.timeline({
        scrollTrigger: { trigger: '#banner', start: 'top top', end: 'bottom top', scrub: true },
    }).to('.banner_con img', { objectPosition: '50% 100%' })

    /* MIDDLE */
    gsap.timeline({
        scrollTrigger: { trigger: '#middle', start: 'top bottom', end: 'bottom top', scrub: true },
    }).to('.middle_img img', { objectPosition: '50% 100%' })

    const middleTextsST = new SplitText(['.middle_con h2', '.middle_con p'], {
        type: 'lines',
        linesClass: 'line',
    })
    gsap.timeline({
        scrollTrigger: { trigger: '.middle_con', start: 'top 75%' },
    }).from(middleTextsST.lines, {
        y: 50,
        opacity: 0,
        ease: 'back.out',
        stagger: { each: 0.1 },
    })

    /* SERVICES: bootcamp cards + drawn pathway track */
    gsap.from('.bootcamp_card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.pathway', start: 'top 75%' },
    })
    gsap.from('.pathway_track path', {
        drawSVG: '0%',
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.pathway', start: 'top 70%' },
    })
    gsap.from('.workshops_list li', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        scrollTrigger: { trigger: '.workshops_list', start: 'top 85%' },
    })

    /* MAIN: founded info, mission / vision / values, drawn pathway line */
    const mainTextsST = new SplitText(
        ['.founded_info section h3', '.founded_info section p', '.foundational_guiding h2', '.foundational_guiding p', '.foundational_guiding ul'],
        { type: 'lines', linesClass: 'line' }
    )
    gsap.from(mainTextsST.lines, {
        y: 50,
        opacity: 0,
        ease: 'back.out',
        stagger: { each: 0.08 },
        scrollTrigger: { trigger: '.main_con', start: 'top 70%' },
    })
    gsap.from('.pathway_line path', {
        drawSVG: '0%',
        duration: 1.5,
        ease: 'none',
        scrollTrigger: { trigger: '.foundational_guiding', start: 'top 60%', end: 'bottom 80%', scrub: true },
    })

    /* GALLERY */
    let galleryImages = gsap.utils.toArray('.gallery_con img');

    let galleryTL = gsap.timeline({
        scrollTrigger: {    trigger: ".gallery_con", start: "top top", end: "+=1000", scrub: true, pin: true }
    })
    
    galleryImages.forEach((image, i) => {
        const angle = (i / galleryImages.length) * Math.PI * 2;

        galleryTL.to(image, {
            x: Math.cos(angle) * 600,
            y: Math.sin(angle) * 250,
            rotation: 'random(-20, 20)',
            scale: 1,
            duration: 1.5,
            ease: "none",
        }, 0);
    });

    galleryTL.from('.gallery_con p', {
        opacity: 0,
    }, 0)

    /* TEAM */
    gsap.from('.team_card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: { trigger: '.team_grid', start: 'top 75%' },
    })

    /* FOOTER */
    gsap.to('#footer', {
        width: '97%',
        scrollTrigger: { trigger: '#footer', start: 'top 90%', end: 'bottom 100%', scrub: true },
    })
    gsap.from('.footer_cta h2, .footer_link', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: { trigger: '#footer', start: 'top 80%' },
    })
}