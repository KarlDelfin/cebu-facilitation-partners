<template>
    <div class="header_con" v-if="!$route.path.includes('/admin')" :style="$route.path.includes('/') ? 'position:fixed' : 'position:relative'">
        <!-- HEADER -->
        <header id="header">
            <div class="comp_logo">
                <a href="/">
                    <img src="@/assets/image/logo.webp" alt="Upskills Facilitation Partners Logo">
                </a>
            </div>
        </header>

        <!-- NAVIGATION DESKTOP -->
        <nav id="nav">
            <el-menu
                :default-active="activeLink"
                class="el-menu-desktop"
                mode="horizontal"
                background-color="transparent"
                text-color="var(--defaultColor, #ffffff)"
                active-text-color="var(--secColor, #ffd04b)"
                @select="handleSelect"
                :ellipsis="false"
            >
                <el-menu-item index="banner"><a :href="$route.path === '/' ? '#' : '/'">Home</a></el-menu-item>
                <el-menu-item index="about"><a :href="$route.path === '/' ? '#about' : '/#about'">About</a></el-menu-item>
                <el-menu-item index="services"><a :href="$route.path === '/' ? '#services' : '/#services'">Services</a></el-menu-item>
                <el-menu-item index="team"><a :href="$route.path === '/' ? '#team' : '/#team'">Team</a></el-menu-item>
                <el-menu-item index="contact"><a :href="$route.path === '/' ? '#contact' : '/#contact'">Contact</a></el-menu-item>
            </el-menu>
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
                <nav class="nav_top nav_border nav_panel" id="navTop">
                   <ul class="nav_list">
                        <li class="nav_item"><a class="nav_link" :href="$route.path === '/' ? '#' : '/'">Home</a></li>
                        <li class="nav_item"><a class="nav_link" :href="$route.path === '/' ? '#about' : '/#about'">About</a></li>
                        <li class="nav_item"><a class="nav_link" :href="$route.path === '/' ? '#services' : '/#services'">Services</a></li>
                        <li class="nav_item"><a class="nav_link" :href="$route.path === '/' ? '#team' : '/#team'">Team</a></li>
                        <li class="nav_item"><a class="nav_link" :href="$route.path === '/' ? '#contact' : '/#contact'">Contact</a></li>
                    </ul>
            </nav>
        </div>
    </div>
    
    <!-- NON-HOME BANNER -->
    <div class="banner" v-if="!$route.path.includes('/admin') && $route.path !== '/'">
        <figure>
            <img src="@/assets/image/bnr-privacy-policy.webp" alt="hands holding a lock">
            <figcaption><h1>{{ $route.name }}</h1></figcaption>
        </figure>
    </div>

    <!-- MAIN -->
    <RouterView />
  
    <!-- FOOTER -->
    <footer id="contact" v-if="!$route.path.includes('/admin')">
        <div class="footer_con">
            <div class="footer_cta">
                <div>
                    <h2>Ready to design your next team experience?</h2>
                    <ul>
                        <li>Email: <a href="mailto:hello.upskills@gmail.com">hello.upskills@gmail.com</a></li>
                        <li>Phone: <a href="tel:09610115585">0961-011-5585</a></li>
                    </ul>
                </div>
                <div class="footer_btn_con">
                    <a class="footer_link" @click="openBookingForm('Book Now')">Book Now</a>
                </div>
            </div>
            <div class="footer_meta">
                <div>
                <p>&copy; 2026 <mark>Upskills Team Building Services</mark> · Cebu, Philippines</p>
                <p><a class="privacy_policy" href="privacy-policy" :style="$route.path === '/privacy-policy' ? { color: 'var(--secColor)', textDecoration: 'underline' } : {}">Privacy Policy</a></p>
                </div>
                <nav>
                    <el-menu
                        :default-active="activeLink"
                        class="el-menu-desktop"
                        mode="horizontal"
                        background-color="transparent"
                        text-color="var(--defaultColor, #ffffff)"
                        active-text-color="var(--secColor, #ffd04b)"
                        @select="handleSelect"
                        :ellipsis="false"
                    >
                        <el-menu-item index="banner"><a :href="$route.path === '/' ? '#' : '/'">Home</a></el-menu-item>
                        <el-menu-item index="about"><a :href="$route.path === '/' ? '#about' : '/#about'">About</a></el-menu-item>
                        <el-menu-item index="services"><a :href="$route.path === '/' ? '#services' : '/#services'">Services</a></el-menu-item>
                        <el-menu-item index="team"><a :href="$route.path === '/' ? '#team' : '/#team'">Team</a></el-menu-item>
                        <el-menu-item index="contact"><a :href="$route.path === '/' ? '#contact' : '/#contact'">Contact</a></el-menu-item>
                    </el-menu>
                </nav>
            </div>
        </div>
    </footer>

    <div v-if="!$route.path.includes('/admin')">
        <!-- BACK TO TOP -->
        <el-backtop :right="32" :bottom="100"/>

        <!-- CHATBOT -->
        <ChatBot/>

        <!-- BOOKING FORM -->
        <BookingForm/>
    </div>

</template>

<script>
import { initHeaderAnimations, initFooterAnimations, initMobileMenu } from '@/utils/gsap'
import { gsap } from 'gsap/all'
import ChatBot from './components/ChatBot.vue'
import BookingForm from '@/components/BookingForm.vue';

export default {
    components: { ChatBot, BookingForm },
    data() {
        return {
            dialog: {
                bookingForm: false,
            },
            activeLink: localStorage.getItem('activeLink') || '',
        }
    },
    methods: {
        handleSelect(index) {
            this.activeLink = index;
            localStorage.setItem('activeLink', index);
        },
        openBookingForm(){
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
        },
    
    },
    mounted() {
        setTimeout(() => {
            initHeaderAnimations();
            initFooterAnimations();
            initMobileMenu();
        },500)
       

        const updateLink = (path) => {
            if (path === '/') {
                this.activeLink = this.activeLink || 'banner';
                localStorage.setItem('activeLink', this.activeLink);
            } else {
                this.activeLink = '';
                localStorage.removeItem('activeLink');
            }
        };

        updateLink(this.$route.path);

        this.$router.afterEach((to) => updateLink(to.path));
        console.log(this.$route.path)
    }
}
</script>
