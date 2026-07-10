<template>
    <div class="header_con">
        <!-- HEADER -->
        <header id="header">
            <div class="company_name">
                <p>Cebu<span>Upskill</span></p>
            </div>
        </header>

        <!-- NAVIGATION -->
        <nav id="nav">
            <ul class="bullet">
                <li>
                    <a>Home</a>
                </li>
                <li>
                    <a>About</a>
                </li>
                <li>
                    <a>Contact</a>
                </li>
            </ul>
        </nav>
    </div>
    <div id="banner">
        <div class="banner_con">
            <img src="../assets/image/banner.jpg" alt="group of people">
            <div class="banner_info">
                <p>Upskills<span>Facilitation <mark>Partners</mark></span></p>
            </div>
        </div>
    </div>

    <!-- MIDDLE -->
    <div id="middle">
        <div class="middle_con">
            <div class="middle_info">
                <h2>WELCOME TO<span>Upskills Facilitation Partners</span></h2>
                <p>Based in <b>Cebu</b>, Upskill Facilitation Partners accelerates professional readiness by transforming your unique corporate objectives into high-impact, tailor-made training programs. We collaborate closely with your organization to design bespoke bootcamps that directly address your specific operational needs. Guided by our core values of <b>Growth, Leadership, and Excellence</b>, we empower local talent to meet evolving industry demands, establishing Cebu as a premier destination for world-class, future-ready professionals.</p>
            </div>
        </div>
        <div class="middle_img">
            <img src="../assets/image/middle.jpg" alt="group of people">
        </div>
    </div>

    <!-- MAIN -->
    <main id="main">
        <div class="main_con">
            <div class="founded_info">
                <section>
                    <h3>Founded</h3>
                    <div>
                        <p>2026</p>
                    </div>
                </section>
                <section>
                    <h3>Founder</h3>
                    <div>
                        <p>Reb Camacho, Founder</p>
                    </div>
                </section>
                <section>
                    <h3>Services</h3>
                    <div>
                        <p></p>
                    </div>                
                </section>
            </div>
            <div class="foundational_guiding">
                <div class="mission">
                    <h2>Mission</h2>
                    <p>Upskill Facilitation Partners delivers client-curated bootcamps that bridge skill gaps and accelerate professional readiness within Cebu’s growing business community. We transform corporate objectives into targeted, high-impact training tracks that empower local talent and drive organizational growth.</p>
                </div>
                <div class="vision">
                    <h2>Vision</h2>
                    <p>To be Cebu’s premier learning facilitation partner, transforming the region into a world-class hub for agile, future-ready professional talent. </p>
                </div>
                <div class="core_values">
                    <h2>Core Values</h2>
                    <ul class="bullet">
                        <li>Growth: Driving continuous learning and performance evolution.</li>
                        <li>Leadership: Cultivating accountability and strategic vision.</li>
                        <li>Excellence: Maintaining uncompromising standards for measurable results.</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>

    <!-- FOOTER -->
    <footer id="footer">
    </footer>
</template>

<script>
import {gsapController} from '../utils/gsap'
export default {
  data(){},
  methods: {},
  mounted(){
    gsapController()
  },
}
</script>