<template>
    <div class="header_con">
        <!-- HEADER -->
        <header id="header">
            <div class="company_logo">
                <img src="../assets/image/logo.webp" alt="Upskills Facilitation Partners Logo">
            </div>
        </header>

        <!-- NAVIGATION DESKTOP -->
        <nav id="nav">
            <ul>
                <li><a href="#banner">Home</a></li>
                <li><a href="#main">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#team">Team</a></li>
                <li><a href="#footer">Contact</a></li>
            </ul>
        </nav>

        <!-- NAVIGATION MOBILE -->
        <button class="menu_toggle" id="menu_toggle">
            <svg width="40" height="40" viewBox="0 0 20 20" fill="none">
                <line class="bar bar-top" x1="3" y1="7" x2="17" y2="7" stroke="var(--defaultColor)" stroke-width="1.5" stroke-linecap="round"/>
                <line class="bar bar-mid" x1="3" y1="10" x2="17" y2="10" stroke="var(--defaultColor)" stroke-width="1.5" stroke-linecap="round"/>
                <line class="bar bar-bot" x1="3" y1="13" x2="17" y2="13" stroke="var(--defaultColor)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        </button>
            
    
        <div class="nav" id="nav_mobile">
            <div class="nav_bg"></div>
            <div class="nav_top nav_border nav_panel" id="navTop">
                <ul class="nav_list">
                    <li class="nav_item"><a class="nav_link" href="#banner">Home</a></li>
                    <li class="nav_item"><a class="nav_link" href="#main">About</a></li>
                    <li class="nav_item"><a class="nav_link" href="#services">Services</a></li>
                    <li class="nav_item"><a class="nav_link" href="#team">Team</a></li>
                    <li class="nav_item"><a class="nav_link" href="#footer">Contact</a></li>
                </ul>
            </div>
        </div>
    </div>

    <!-- BANNER -->
    <div id="banner">
        <div class="banner_con">
            <img src="../assets/image/banner.webp" alt="Facilitators leading a corporate bootcamp session in Cebu">
            <div class="banner_info">
                <p>Upskills<span>Facilitation <mark>Partners</mark></span></p>
            </div>
            <div class="banner_scroll">Scroll</div>
        </div>
    </div>

    <!-- MIDDLE -->
    <div id="middle">
        <div class="middle_con">
            <div class="middle_info">
                <h2>Welcome to<span>Upskills Facilitation Partners</span></h2>
                <p>Based in <b>Cebu</b>, <mark>Upskill Facilitation Partners</mark> accelerates professional readiness by transforming your unique corporate objectives into high-impact, tailor-made training programs. We collaborate closely with your organization to design bespoke bootcamps that directly address your specific operational needs. Guided by our core values of <b>Growth, Leadership, and Excellence</b>, we empower local talent to meet evolving industry demands, establishing Cebu as a premier destination for world-class, future-ready professionals.</p>
            </div>
        </div>
        <div class="middle_img">
            <img src="../assets/image/middle.webp" alt="Bootcamp participants collaborating during a session">
        </div>
    </div>

    <!-- MAIN -->
    <main id="main">
        <div class="main_con">
            <div class="founded_info">
                <section>
                    <h3>Founded</h3>
                    <div><p>2026</p></div>
                </section>
                <section>
                    <h3>Founders</h3>
                    <div><p>Reb Camacho &amp; Myrene Camingawan </p></div>
                </section>
                <section>
                    <h3>Based in</h3>
                    <div><p>Cebu, Philippines</p></div>
                </section>
            </div>
            <div class="foundational_guiding">
                <svg class="pathway_line" viewBox="0 0 3 600" preserveAspectRatio="none">
                    <path d="M 1.5 0 L 1.5 600" />
                </svg>
                <div class="mission">
                    <h2>Mission</h2>
                    <p><mark>Upskill Facilitation Partners</mark> delivers client-curated bootcamps that bridge skill gaps and accelerate professional readiness within Cebu's growing business community. We transform corporate objectives into targeted, high-impact training tracks that empower local talent and drive organizational growth.</p>
                </div>
                <div class="vision">
                    <h2>Vision</h2>
                    <p>To be Cebu's premier learning facilitation partner, transforming the region into a world-class hub for agile, future-ready professional talent.</p>
                </div>
                <div class="core_values">
                    <h2>Core Values</h2>
                    <ul>
                        <li><b>Growth</b> — Driving continuous learning and performance evolution.</li>
                        <li><b>Leadership</b> — Cultivating accountability and strategic vision.</li>
                        <li><b>Excellence</b> — Maintaining uncompromising standards for measurable results.</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>

    <!-- SERVICES -->
    <div id="services">
        <div class="services_con">
            <div class="services_head">
                <h2>The Bootcamp Experience<span>Transformative, immersive, and results-oriented.</span></h2>
                <p>Two ways to move your team along the readiness pathway — a one-day spark, or a three-day deep dive.</p>
            </div>

            <div class="pathway">
                <div class="bootcamp_card">
                    <p class="tier">Step 01 · Foundation</p>
                    <h3>1-Day Foundation</h3>
                    <dl>
                        <dt>Focus</dt><dd>Skill Injection &amp; Motivation</dd>
                        <dt>Duration</dt><dd>9 AM – 4 PM (1 Full Day)</dd>
                        <dt>Facilitators</dt><dd>1 Lead, 1 Assistant</dd>
                        <dt>Documentation</dt><dd>Photo</dd>
                        <dt>Inclusions</dt><dd>Venue, Meals, Materials, Pathway Orientation</dd>
                    </dl>
                    <p class="investment"><span>Investment</span>Starts at ₱1,500/pax</p>
                </div>
                <div class="bootcamp_card">
                    <p class="tier">Step 02 · Intensive</p>
                    <h3>3-Day Intensive</h3>
                    <dl>
                        <dt>Focus</dt><dd>Deep Dive &amp; Strategic Growth</dd>
                        <dt>Duration</dt><dd>3 Days (Varied hours)</dd>
                        <dt>Facilitators</dt><dd>2 Leads</dd>
                        <dt>Documentation</dt><dd>Photo &amp; Video</dd>
                        <dt>Inclusions</dt><dd>Venue, Meals, Materials, Pathway Orientation</dd>
                    </dl>
                    <p class="investment"><span>Investment</span>Starts at ₱4,000/pax</p>
                </div>
            </div>

            <div class="workshops">
                <div class="workshops_head">
                    <h3>Specialized Workshops</h3>
                    <p class="investment_tag">Starts at ₱3,000/topic · 2–4 hour interactive sessions</p>
                </div>
                <ul class="workshops_list">
                    <li>Basics of Photography</li>
                    <li>Basics of Graphic Design</li>
                    <li>Basics of Content Creation</li>
                    <li>Crafting the Curriculum using MELC</li>
                    <li>Lesson Planning: OBE &amp; UBD</li>
                    <li>Public Speaking 101</li>
                    <li>Creative Writing &amp; Spoken Poetry</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- GALLERY -->
    <div id="gallery">
        <div class="gallery_con">
            <img src="../assets/image/our-works/1.webp" alt="Business Meeting">
            <img src="../assets/image/our-works/2.webp" alt="Corporate Training">
            <img src="../assets/image/our-works/3.webp" alt="Team Collaboration">
            <img src="../assets/image/our-works/4.webp" alt="Office Team">
            <img src="../assets/image/our-works/5.webp" alt="Business Workshop">
            <img src="../assets/image/our-works/6.webp" alt="Presentation">
            <img src="../assets/image/our-works/7.webp" alt="Leadership">
            <img src="../assets/image/our-works/8.webp" alt="Startup Team">
            <img src="../assets/image/our-works/9.webp" alt="Business Discussion">
            <img src="../assets/image/our-works/10.webp" alt="Modern Office">
            <p>Our Works</p>
        </div>
    </div>

    <!-- TEAM -->
    <div id="team">
        <div class="team_con">
            <div class="team_head">
                <h2>Meet the Team <span>The co-founders behind the curriculum.</span></h2>
            </div>
            <div class="team_grid">
                <article class="team_card">
                    <div class="team_avatar">RC</div>
                    <h3>Reb Camacho</h3>
                    <p class="role">Co-founder</p>
                    <p class="bio">Reb brings years of hands-on experience in talent development, process improvement, and creative media. With a background as a BPO Trainer at Concentrix and Ambassador of Culture at Moder Solutions, Reb combines a Lean Six Sigma certification with a human-centric approach to training — using a deep creative portfolio to help local talent thrive in a fast-paced corporate environment.</p>
                    <div class="credentials">
                        <span>BA in Marketing Communication (2026)</span>
                        <span>BPO Trainer, Concentrix (2025–2026)</span>
                        <span>Certified Lean Six Sigma Yellow Belt</span>
                        <span>Content Creator, CADCOMM (2021–2025)</span>
                    </div>
                </article>
                <article class="team_card">
                    <div class="team_avatar">MC</div>
                    <h3>Myrene Camingawan</h3>
                    <p class="role">Co-founder</p>
                    <p class="bio">A Licensed Professional Teacher with extensive experience in both the classroom and the corporate sector, Myrene blends professional teaching expertise with a results-oriented business mindset — specializing in learning experiences that convert potential into professional readiness. From coordinating high-impact summer camps to performing as a spoken poetry artist, her background lets her design curriculum that engages, inspires, and delivers measurable outcomes.</p>
                    <div class="credentials">
                        <span>Bachelor in Secondary Education, Major in Filipino</span>
                        <span>Licensed Professional Teacher · TEFL Certified</span>
                        <span>High School Teacher, Bright Academy Cebu</span>
                        <span>Facilitator &amp; Summer Camp Director, Enfants du Mekong (2016–2023)</span>
                    </div>
                </article>
         
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <footer id="footer">
        <div class="footer_con">
            <div class="footer_cta">
                <h2>Ready to build your team's bootcamp?</h2>
                <div class="footer_btn_con">
                    <a class="footer_link" @click="openForm('Book Now')">Book Now</a>
                </div>
            </div>
            <div class="footer_meta">
                <p>&copy; 2026 <mark>Upskill Facilitation Partners</mark> · Cebu, Philippines</p>
                <nav>
                    <ul>
                        <li><a href="#banner">Home</a></li>
                        <li><a href="#main">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#team">Team</a></li>
                        <li><a href="#footer">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </footer>

    <BookingForm :isOpenForm="dialog.bookingForm"/>

    <div class="fixed bottom-5 right-5 z-50">
        <button @click="gotoAdmin()" class="group flex aspect-square w-12 items-center justify-center rounded-full bg-[var(--secColor)] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl text-xs font-[family-name:var(--secFont)]" > Admin </button>
    </div>
</template>

<script>
import { Setting } from '@element-plus/icons-vue'
import { gsapController, gsapSidebarController } from '../utils/gsap'
import gsap from 'gsap/all'
import BookingForm from '@/components/BookingForm.vue';
import {ElLoading} from 'element-plus'
export default {
    components: {BookingForm},
    data(){
        return{
            dialog: {
                bookingForm: false,
            },
        }
    },
    methods: {
        async gotoAdmin() {
            const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            
            try {
                await this.$router.push('/admin')
            } catch (error) {
                console.error('Navigation error:', error)
            } finally {
                loading.close()
            }
        },
        
        openForm(title){
            if(title == 'Book Now') {
                this.dialog.bookingForm = true
            }
            gsap.fromTo('#bookingForm', {
                opacity: 0,
                y: 300,
                
            }, {
                visibility: 'visible',
                opacity: 1,
                y: 0,
                ease: 'back.out'
            })

        },
        clear() {
            this.dialog.bookingForm = false
        }
    },
    mounted() {
        gsapController()
        gsapSidebarController()
    },
}
</script>