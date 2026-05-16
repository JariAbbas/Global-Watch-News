<template>
  <header class="nav-wrapper" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
    <div class="nav-top">
      <div class="container nav-top-inner">
        <div class="nav-top-left">
          <span class="nav-date">{{ currentDate }}</span>
          <a href="#" class="nav-edition">
            <span class="live-dot"></span>
            
          </a>
        </div>
        <div class="nav-top-right">
          <span class="nav-weather">The world's most trusted source for breaking news, in-depth analysis, and real-time coverage.</span>
          <!-- <a href="#" class="nav-social">TW</a>
          <a href="#" class="nav-social">YT</a>
          <a href="#" class="nav-social">IG</a> -->
          <router-link to="/search" class="nav-search-btn" @click="menuOpen=false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </router-link>
        </div>
      </div>
    </div>

    <div class="nav-main">
      <div class="container nav-main-inner">
        <router-link to="/" class="nav-logo" @click="menuOpen=false">
          <span class="logo-mark">GW.</span>
          <span class="logo-text">GLOBALWATCH<span class="logo-accent">news</span></span>
        </router-link>

        <nav class="nav-links" :class="{ open: menuOpen }">
          <router-link
            v-for="cat in navCategories"
            :key="cat.slug"
            :to="`/category/${cat.slug}`"
            class="nav-link"
            @click="menuOpen=false"
          >{{ cat.label }}</router-link>
          <router-link to="/live" class="nav-link nav-link-live" @click="menuOpen=false">
            <span class="live-dot"></span> Live TV
          </router-link>
          <router-link to="/video" class="nav-link" @click="menuOpen=false">Video</router-link>
          <router-link to="/weather" class="nav-link" @click="menuOpen=false">Weather</router-link>
        </nav>

        <button class="nav-hamburger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
  <div class="nav-spacer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { categories } from '../store/newsData.js'

const navCategories = categories.slice(0, 6)
const isScrolled = ref(false)
const menuOpen = ref(false)

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
})

function onScroll() { isScrolled.value = window.scrollY > 50 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav-wrapper {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}
.nav-spacer { height: 100px; }

/* TOP BAR */
.nav-top {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 6px 0;
}
.nav-top-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-top-left, .nav-top-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.nav-date {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
}
.nav-edition {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent-red);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.nav-weather {
  font-size: 11px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}
.nav-social {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  transition: color 0.2s;
}
.nav-social:hover { color: var(--accent-red); }
.nav-search-btn {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  transition: color 0.2s;
}
.nav-search-btn svg { width: 16px; height: 16px; }
.nav-search-btn:hover { color: var(--accent-red); }

/* LIVE DOT */
.live-dot {
  display: inline-block;
  width: 6px; height: 6px;
  background: var(--accent-red);
  border-radius: 50%;
  animation: tagPulse 1.5s ease-in-out infinite;
}

/* MAIN NAV */
.nav-main {
  background: rgba(10,10,11,0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 12px 0;
  transition: all 0.3s ease;
}
.scrolled .nav-main {
  padding: 8px 0;
  background: rgba(10,10,11,0.99);
  box-shadow: 0 4px 30px rgba(0,0,0,0.5);
}
.nav-main-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

/* LOGO */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
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
  letter-spacing: 0.1em;
}
.logo-text {
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: 0.1em;
  color: var(--text-primary);
}
.logo-accent { 
  color: var(--accent-red);
}

/* NAV LINKS */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}
.nav-link {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 2px;
  transition: all 0.2s;
  white-space: nowrap;
}
.nav-link:hover, .nav-link.router-link-active {
  color: var(--text-primary);
  background: rgba(255,255,255,0.05);
}
.nav-link.router-link-active { color: var(--accent-red); }
.nav-link-live {
  color: var(--accent-red);
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(230,57,70,0.3);
}
.nav-link-live:hover {
  background: rgba(230,57,70,0.1);
  color: var(--accent-red);
}

/* HAMBURGER */
.nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  cursor: pointer;
}
.nav-hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}
.nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-hamburger.open span:nth-child(2) { opacity: 0; }
.nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 900px) {
  .nav-hamburger { display: flex; }
  .nav-top-left .nav-date { display: none; }
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0; right: 0;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    flex-direction: column;
    align-items: stretch;
    padding: 12px 24px 20px;
    gap: 0;
  }
  .nav-links.open { display: flex; }
  .nav-link { padding: 12px 0; border-bottom: 1px solid var(--border); }
  .nav-spacer { height: 80px; }
}
</style>