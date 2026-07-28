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
                <p>Based in <b>Cebu</b>, we create training programs that fit your team's unique needs. Instead of using a one-size-fits-all approach, we work with you to design team-building experiences that help your people grow and achieve your business goals.</p>
                <p>Driven by our values of <b>Transformation, Excellence, and Altruism</b>, we believe in developing people with both skill and purpose. We don't just provide training—we help build confident, capable, and future-ready professionals who can succeed in a changing world.</p>
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
                    <p>To empower individuals and organizations through meaningful, customized learning experiences that inspire transformation, pursue excellence, and foster a culture of service.</p>
                </div>
                <div class="vision">
                    <h2>Vision</h2>
                    <p>To be Cebu's trusted partner in developing future-ready professionals and purpose-driven leaders who create lasting impact in their workplaces and communities.</p>
                </div>
                <div class="core_values">
                    <h2>Core Values</h2>
                    <ul>
                        <li><b>Transformation</b> — We drive continuous learning and performance evolution by embracing change, pursuing constant growth, and adaptively upskilling to meet the future.</li>
                        <li><b>Excellence</b> — We maintain uncompromising standards for measurable results through disciplined execution, precise quality control, and an absolute refusal to settle for mediocrity.</li>
                        <li><b>Altruism</b> — We practice unselfish concern for the well-being of others by actively investing our time, empathy, and resources into uplifting the broader community.</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>

    <!-- PACKAGES -->
    <div id="services">
        <div class="services_con">
            <div class="services_head">
                <h2>Our<span>Packages</span></h2>
                <p>Two ways to move your team along the readiness pathway — a one-day spark, or a three-day deep dive.</p>
            </div>

            <div class="pathway">
                <div class="bootcamp_card">
                    <div>
                        <p class="tier">01</p>
                        <h3>ROOKIE</h3>
                        <p>The ultimate championship-level experience.</p>
                        <p class="investment"><span>Price: </span>₱50,000</p>
                    </div>
                    <img src="../assets/image/rookie.png" alt="people hugging">
                    
                </div>
                <div class="bootcamp_card">
                    <div>
                        <p class="tier">02</p>
                        <h3>ALL-STAR</h3>
                        <p>Elevated competition and enhanced experience.</p>
                        <p class="investment"><span>Price:</span>₱70,000</p>
                    </div>
                    <img src="../assets/image/all-star.png" alt="people hugging">
                </div>
                <div class="bootcamp_card">
                    <div>
                        <p class="tier">03</p>
                        <h3>MVP</h3>
                        <p>Fundamental bonding and core teamwork.</p>
                        <p class="investment"><span>Price:</span>₱120,000</p>
                    </div>
                    <img src="../assets/image/mvp.png" alt="people hugging">
                </div>
            </div>

          <!--   <div class="workshops">
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
            </div> -->
        </div>
    </div>

    <!-- PACKAGES -->
    <div id="packages">
        <div class="packages_con package3">
            <div class="packages_inner">
                <div class="package_header">
                    <h2>ROOKIE</h2>
                    <p>Fundamental bonding and core teamwork.</p>
                </div>
                
                <div class="package_details">
                    <div class="feature_col">
                        <ul class="feature_list">
                            <li>2 Team-Building Facilitators</li>
                            <li>Event Banners</li>
                            <li>4 Team Flags (Fire, Water, Air, Earth)</li>
                            <li>50 Headbands (12-13 headbands for each team)</li>
                        </ul>
                    </div>
                    <div class="feature_col">
                        <ul class="feature_list">
                            <li>7ft by 10ft Tarpaulin Backdrop</li>
                            <li>2 UHF Wireless Microphones</li>
                            <li>2 Active Speakers with Stands</li>
                            <li>1 Mixer</li>
                            <li>2-3 Minutes Video Highlights (SDE)</li>
                            <li>Activity Materials</li>
                        </ul>
                    </div>
                </div>

                <div class="perks_box">
                    <div class="perk_item"><span>FREE</span> 15 Medals</div>
                    <div class="perk_item"><span>FREE</span> 50 Certificates of Participation</div>
                    <div class="perk_item"><span>FREE</span> 2-3 meetings with client for coordination</div>
                    <div class="perk_item"><span>FREE</span> FREE Customization of the Activities</div>
                </div>
            </div>
        </div>

        <div class="packages_con package2">
            <div class="packages_inner">
                <div class="package_header">
                    <h2>ALL-STAR</h2>
                    <p>Elevated competition and enhanced experience.</p>
                </div>
                
                <div class="package_details">
                    <div class="feature_col">
                        <ul class="feature_list">
                            <li>2 Team-Building Facilitators</li>
                            <li>Event Banners</li>
                            <li>4 Team Flags (Fire, Water, Air, Earth)</li>
                            <li>50 Headbands (12-13 headbands for each team)</li>
                        </ul>
                    </div>
                    <div class="feature_col">
                        <ul class="feature_list">
                            <li class="hardware-highlight">7ft x 10 ft LED Wall Display</li>
                            <li>2 UHF Wireless Microphones</li>
                            <li>2 Active Speakers with Stands</li>
                            <li>1 Mixer</li>
                            <li>2-3 Minutes Video Highlights (SDE)</li>
                            <li>Activity Materials</li>
                        </ul>
                    </div>
                </div>

                <div class="perks_box">
                    <div class="perk_item"><span>FREE</span> 15 Medals</div>
                    <div class="perk_item"><span>FREE</span> 50 Certificates of Participation</div>
                    <div class="perk_item"><span>FREE</span> 2-3 meetings with client for coordination</div>
                    <div class="perk_item"><span>FREE</span> FREE Customization of the Activities</div>
                </div>
            </div>
        </div>
        
        <div class="packages_con package1">
            <div class="packages_inner">
                <div class="package_header">
                    <h2>MVP</h2>
                    <p>The ultimate championship-level experience.</p>
                </div>
                
                <div class="package_details">
                    <div class="feature_col">
                        <ul class="feature_list">
                            <li class="premium-highlight">Food (AM & PM Snacks; 1 Lunch)</li>
                            <li class="premium-highlight">Venue at Bayfront Hotel Cebu</li>
                            <li>2 Team-Building Facilitators</li>
                            <li>Event Banners</li>
                            <li>4 Team Flags (Fire, Water, Air, Earth)</li>
                            <li>50 Headbands (12-13 headbands for each team)</li>
                        </ul>
                    </div>

                    <div class="feature_col">
                        <ul class="feature_list">
                            <li class="hardware-highlight">7ft x 10 ft LED Wall Display</li>
                            <li>2 UHF Wireless Microphones</li>
                            <li>2 Active Speakers with Stands</li>
                            <li>1 Mixer</li>
                            <li>2-3 Minutes Video Highlights (SDE)</li>
                            <li>Activity Materials</li>
                        </ul>
                    </div>
                </div>

                <div class="perks_box">
                    <div class="perk_item"><span>FREE</span> 15 Medals</div>
                    <div class="perk_item"><span>FREE</span> 50 Certificates</div>
                    <div class="perk_item"><span>FREE</span> 2-3 client coordination meetings</div>
                    <div class="perk_item"><span>FREE</span> FREE Customization of the Activities</div>
                </div>
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
                <h2>Meet the Team <span>The founders behind the curriculum.</span></h2>
            </div>
            <div class="team_grid">
                <article class="team_card">
                    <div class="team_avatar">
                        <img src="../assets/image/team/reb-camacho.webp" alt="Reb Camacho">
                    </div>
                    <h3>Reb Camacho</h3>
                    <p class="role">Founder</p>
                    <p class="bio">Reb Camacho is a Certified Lean Six Sigma Yellow Belt professional, youth leader, and digital storyteller committed to developing people and building meaningful communities. He has served as a facilitator since 2016, was appointed Camp Director in 2022, and has been mentoring emerging facilitators since then. Beyond youth leadership, Reb is a content creator and a founding member of the Archdiocese of Cebu's social media ministry, where he leverages creative media to inspire, educate, and strengthen faith-based engagement.</p>
                    <!-- <div class="credentials">
                        <span>BA in Marketing Communication (2026)</span>
                        <span>BPO Trainer, Concentrix (2025–2026)</span>
                        <span>Certified Lean Six Sigma Yellow Belt</span>
                        <span>Content Creator, CADCOMM (2021–2025)</span>
                    </div> -->
                </article>
                <article class="team_card">
                    <div class="team_avatar">
                        <img src="../assets/image/team/myrene-camingawan.webp" alt="Myrene Camingawan">
                    </div>
                    <h3>Myrene Camingawan</h3>
                    <p class="role">Founder</p>
                    <p class="bio">Yen Camingawan is a Licensed Professional Teacher and Cum Laude graduate with a Bachelor of Secondary Education major in Filipino. A dedicated youth leader and educator, she has served as a summer camp facilitator since 2016 and was appointed Summer Camp Director in 2023. Since then, she has also been mentoring and developing the next generation of facilitators, empowering young leaders through guidance, service, and values-based leadership.</p>
                    <!-- <div class="credentials">
                        <span>Bachelor in Secondary Education, Major in Filipino</span>
                        <span>Licensed Professional Teacher · TEFL Certified</span>
                        <span>High School Teacher, Bright Academy Cebu</span>
                        <span>Facilitator &amp; Summer Camp Director, Enfants du Mekong (2016–2023)</span>
                    </div> -->
                </article>
         
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <footer id="footer">
        <div class="footer_con">
            <div class="footer_cta">
                <div>
                    <h2>Ready to build your team's bootcamp?</h2>
                    <ul>
                        <li>Email: <a href="mailto:hello.upskills@gmail.com">hello.upskills@gmail.com</a></li>
                        <li>Phone: <a href="tel:09610115585">0961-011-5585</a></li>
                    </ul>
                </div>
                <div class="footer_btn_con">
                    <a class="footer_link" @click="openForm('Book Now')">Book Now</a>
                </div>
            </div>
            <div class="footer_meta">
                <p>&copy; 2026 <mark>Upskills Facilitation Partners</mark> · Cebu, Philippines</p>
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
    <ChatBot/>
    <el-backtop :right="32" :bottom="100" />

    <!-- <div class="fixed bottom-5 right-5 z-50">
        <button @click="gotoAdmin()" class="group flex aspect-square w-12 items-center justify-center rounded-full bg-[var(--secColor)] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl text-xs font-[family-name:var(--secFont)]" > Admin </button>
    </div> -->
</template>

<script>
import { gsapController, gsapSidebarController, gsapSlidesPinning } from '../utils/gsap'
import gsap from 'gsap/all'
import BookingForm from '@/components/BookingForm.vue';
import ChatBot from '@/components/ChatBot.vue';
import { ElLoading } from 'element-plus'
export default {
    components: {BookingForm, ChatBot},
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
        gsapSlidesPinning()
    },
}
</script>