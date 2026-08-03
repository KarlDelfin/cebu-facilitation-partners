<template>
  <div class="header_con">
      <!-- HEADER -->
      <header id="header">
          <div class="company_logo">
              <img src="@/assets/image/logo.webp" alt="Upskills Facilitation Partners Logo">
          </div>
      </header>

      <!-- NAVIGATION DESKTOP -->
      <nav id="nav">
          <ul>
              <li><a href="/#">Home</a></li>
              <li><a href="/#main">About</a></li>
              <li><a href="/#services">Services</a></li>
              <li><a href="/#team">Team</a></li>
              <li><a href="/#footer">Contact</a></li>
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

  <RouterView />
  
  <!-- FOOTER -->
  <footer id="footer">
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
              <p><a class="privacy_policy" href="privacy-policy">Privacy Policy</a></p>
            </div>
            <nav>
                <ul>
                    <li><a href="/#banner">Home</a></li>
                    <li><a href="/#main">About</a></li>
                    <li><a href="/#services">Services</a></li>
                    <li><a href="/#team">Team</a></li>
                    <li><a href="/#footer">Contact</a></li>
                </ul>
            </nav>
          </div>
      </div>
  </footer>
</template>

<script>
import { gsapController } from './utils/gsap'
export default {
  mounted() {
      gsapController()
  }
}
</script>
