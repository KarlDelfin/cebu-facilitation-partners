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
    /* HEADER */
    gsap.from('.company_logo', {
        y: -200,
        delay: .5,
    })

    /* BANNER */
    gsap.from('.banner_con img', {
        scale: 1.3,
        duration: 3,
        ease: 'power4.out',
    })

    const bannerTextsST = new SplitText(['header p', 'nav ul li a', '.banner_info p'], {
        type: 'lines',
    })
    gsap.timeline().from(bannerTextsST.lines, {
        y: 50,
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
    })
    gsap.timeline({
        scrollTrigger: { trigger: '.middle_con', start: 'top 75%' },
    }).from(middleTextsST.lines, {
        y: 50,
        opacity: 0,
        ease: 'back.out',
        stagger: { each: 0.1 },
    })

    /* SERVICES */
    gsap.timeline({
        scrollTrigger: { trigger: '.services_head', start: 'top 75%' },
    }).from('.services_head h2', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
    }).from('.services_head p', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
    }, 0)

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

    /* MAIN */
    const mainTextsST = new SplitText(
        ['.founded_info section h3', '.founded_info section p', '.foundational_guiding h2', '.foundational_guiding p', '.foundational_guiding ul'],
        { type: 'lines' }
    )
    gsap.from(mainTextsST.lines, {
        y: 50,
        opacity: 0,
        ease: 'back.out',
        stagger: { each: 0.08 },
        scrollTrigger: { trigger: '.main_con', start: 'top 70%' },
    })
    gsap.to('.pathway_line path', {
        drawSVG: '100%',
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
            ease: "expo.out",
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




export function gsapSidebarController() {
    let isOpen = false;
    let exitSpeed = 1.5;
    let tl;
    let enterEndTime = 0;


    function er(val) {
        return isOpen = !isOpen
    }

    function init() {
        tl && tl.revert();

        gsap.set("#nav_mobile", {
            visibility: "hidden"
        });
        gsap.set(".nav_bg", {
            opacity: 0
        });
        gsap.set(".nav-login", {
            opacity: 0,
            y: 8
        });

        tl = gsap
            .timeline({
                paused: true
            })

            .set("#nav_mobile", {
                visibility: "visible",
                pointerEvents: "auto"
            })
            .set('.bar-mid', {
                visibility: 'hidden'
            })
          
            // ═══ ENTER ═══

            .to(
                ".nav_bg", {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    easeReverse: er("power4.out")
                },
                0
            )

            .fromTo(
                ".nav_panel", {
                    x: "110%",
                    y: 0,
                    rotation: 0
                }, {
                    x: "0%",
                    y: 0,
                    duration: 0.6,
                    ease: "back.out",
                    easeReverse: er("power3.in"),
                    stagger: 0.1,
                },
                0
            )

            .fromTo(
                ".nav_item", {
                    opacity: 0,
                    x: -20
                }, {
                    opacity: 1,
                    x: 0,
                    duration: 1.2,
                    ease: "expo.out",
                    easeReverse: er("power3.in"),
                    stagger: 0.03
                },
                0.1
            )

            .fromTo(
                ".bar-top", {
                    stroke: "var(--defaultColor)",
                    attr: {
                        x1: 3,
                        y1: 7,
                        x2: 17,
                        y2: 7
                    }
                }, {
                    stroke: "var(--defaultColor)",
                    attr: {
                        x1: 5,
                        y1: 5,
                        x2: 15,
                        y2: 15
                    },
                    duration: 0.35,
                    ease: "back.out(1.4)",
                    easeReverse: er("power3.out")
                },
                0.06
            )
            .fromTo(
                ".bar-bot", {
                    stroke: "var(--defaultColor)",
                    attr: {
                        x1: 3,
                        y1: 13,
                        x2: 17,
                        y2: 13
                    }
                }, {
                    stroke: "var(--defaultColor)",
                    attr: {
                        x1: 15,
                        y1: 5,
                        x2: 5,
                        y2: 15
                    },
                    duration: 0.35,
                    ease: "back.out(1.4)",
                    easeReverse: er("power3.out")
                },
                0.06
            )
            .to(
                ".nav-login", {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power3.out",
                    easeReverse: er("power4.out")
                },
                0.4
            )

            // ═══ PAUSE ═══
            .addPause();

        enterEndTime = tl.duration();

        // ═══ EXIT — panels fall down with stagger, bottom first ═══

        tl
            // X → hamburger
            .to(".bar", {
                stroke: "var(--defaultColor)",
                duration: 0.2
            })
            .to(
                ".bar-top", {
                    attr: {
                        x1: 3,
                        y1: 7,
                        x2: 17,
                        y2: 7
                    },
                    duration: 0.2,
                    ease: "power3.in"
                },
                "<"
            )
            .to(
                ".bar-bot", {
                    attr: {
                        x1: 3,
                        y1: 13,
                        x2: 17,
                        y2: 13
                    },
                    duration: 0.2,
                    ease: "power3.in"
                },
                "<"
            )

            // panels fall
            .to(
                ".nav_panel", {
                    y: "110vh",
                    rotation: "random(-25, 25)",
                    duration: 1,
                    ease: "power3.in",
                    stagger: {
                        from: "end",
                        each: 0.02
                    }
                },
                "<"
            )

            // bg fades
            .to(
                ".nav_bg", {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in"
                },
                "<0.1"
            )

            .set("#nav_mobile", {
                visibility: "hidden",
                pointerEvents: "none"
            })
            .set('.bar-mid', {
                visibility: 'visible'
            })
            
            
    }
    init();

    function toggle() {
        isOpen = !isOpen;
        const btn = document.getElementById("menu_toggle");
        btn.setAttribute("aria-expanded", isOpen);
        btn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

        if (isOpen) {
            if (tl.time() >= enterEndTime) {
                tl.timeScale(1).restart();
            } else {
                tl.timeScale(1).play();
            }
        } else {
            if (tl.time() < enterEndTime) {
                tl.timeScale(exitSpeed).reverse();
            } else {
                tl.timeScale(1).play();
            }
        }
    }

    document.getElementById("menu_toggle").addEventListener("click", toggle);
    document.querySelector(".nav_bg").addEventListener("click", () => {
        if (isOpen) toggle();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) {
            toggle();
            document.getElementById("menu_toggle").focus();
        }
    });
}






