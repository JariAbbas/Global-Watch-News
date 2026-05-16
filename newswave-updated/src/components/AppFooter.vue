<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-mark">GW.</span>
            <span class="logo-text">GLOBALWATCH<span class="logo-accent">news</span></span>
          </div>
          <p class="footer-tagline">Live. Bold. Now. — The world's most trusted source for breaking news, in-depth analysis, and real-time coverage.</p>
          <div class="footer-socials">
            <a href="#" class="social-btn">Twitter</a>
            <a href="#" class="social-btn">YouTube</a>
            <a href="#" class="social-btn">Instagram</a>
            <a href="#" class="social-btn">Facebook</a>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Sections</h4>
          <ul>
            <li v-for="cat in categories" :key="cat.slug">
              <router-link :to="`/category/${cat.slug}`" class="footer-link">{{ cat.label }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">GlobalWatch News</h4>
          <ul>
            <li><router-link to="/about-us" class="footer-link">About Us</router-link></li>
            <li><router-link to="/privacy-policy" class="footer-link">Privacy Policy</router-link></li>
            <li><router-link to="/contact-us" class="footer-link">Contact Us</router-link></li>
            <li><router-link to="/terms-conditions" class="footer-link">Terms & Conditions</router-link></li>
            <li><router-link to="/disclaimer" class="footer-link">Disclaimer</router-link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Subscribe to Newsletter</h4>
          <p class="footer-desc">Get the biggest stories delivered to your inbox every morning.</p>
          <div class="footer-subscribe">
            <input type="email" placeholder="your@email.com" class="footer-input" />
            <button class="btn btn-primary" style="padding: 10px 16px; font-size: 11px;">Subscribe</button>
          </div>
          <div class="footer-apps">
            <a href="#" class="app-btn">📱 iOS App</a>
            <a href="#" class="app-btn">🤖 Android App</a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <span>© 2026 NewsWave Media Group. All rights reserved.</span>
        <div class="footer-legal">
          <a href="#" class="footer-link-sm">Privacy Policy</a>
          <a href="#" class="footer-link-sm">Terms of Service</a>
          <a href="#" class="footer-link-sm">Cookie Settings</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { categories } from '../store/newsData.js'
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  margin-top: 80px;
}
.footer-top { padding: 60px 0 40px; }
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
}
.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.logo-mark {
  width: 36px; height: 36px;
  background: var(--accent-red);
  color: #fff;
  font-family: var(--font-display);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
.logo-text {
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: 0.1em;
}
.logo-accent { color: var(--accent-red); }
.footer-tagline {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 20px;
}
.footer-socials { display: flex; gap: 8px; flex-wrap: wrap; }
.social-btn {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 5px 12px;
  border: 1px solid var(--border-bright);
  border-radius: 2px;
  color: var(--text-secondary);
  transition: all 0.2s;
}
.social-btn:hover { border-color: var(--accent-red); color: var(--accent-red); }

.footer-col-title {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary);
  margin-bottom: 16px;
}
.footer-col ul { display: flex; flex-direction: column; gap: 8px; }
.footer-link {
  font-size: 0.85rem;
  color: var(--text-muted);
  transition: color 0.2s;
}
.footer-link:hover { color: var(--accent-red); }

.footer-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 12px;
  line-height: 1.6;
}
.footer-subscribe {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.footer-input {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
}
.footer-input:focus { border-color: var(--accent-red); }
.footer-input::placeholder { color: var(--text-muted); }

.footer-apps { display: flex; gap: 8px; flex-wrap: wrap; }
.app-btn {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 7px 12px;
  border: 1px solid var(--border-bright);
  border-radius: var(--radius);
  color: var(--text-secondary);
  transition: all 0.2s;
}
.app-btn:hover { border-color: var(--accent-cyan); color: var(--accent-cyan); }

.footer-bottom {
  border-top: 1px solid var(--border);
  padding: 16px 0;
}
.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
}
.footer-legal { display: flex; gap: 20px; }
.footer-link-sm { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); transition: color 0.2s; }
.footer-link-sm:hover { color: var(--accent-red); }

@media (max-width: 1000px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-brand { grid-column: 1 / -1; }
}
@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr; }
  .footer-bottom-inner { flex-direction: column; text-align: center; }
}
</style>
