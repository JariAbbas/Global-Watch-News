<template>
  <div id="app-root">
    
    <Transition name="fade">
      <div v-if="isGlobalLoading" class="global-loader-overlay">
        <div class="loader-content">
          <h1 class="loader-logo">
            <span class="brand-gw">GW.</span>
            <span class="brand-text">GLOBALWATCH<span class="brand-news">NEWS</span></span>
          </h1>
          
          <div class="loader-bar-container">
            <div class="loader-bar-progress"></div>
          </div>
          
          <p class="loader-status">Connecting to live feed...</p>
        </div>
      </div>
    </Transition>

    <AppNav />
    <TickerBanner />
    
    <main>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <AppFooter />
    <ScrollTop />
  </div>
</template>

<script setup>
import AppNav from './components/AppNav.vue'
import TickerBanner from './components/TickerBanner.vue'
import AppFooter from './components/AppFooter.vue'
import ScrollTop from './components/ScrollTop.vue'
import { isGlobalLoading } from './store/loader.js' // Note: Agar aapka store src/store mein hai toh path ka dhyan rakhein (e.g. './store/loader.js' ya '../store/loader.js')
</script>

<style>
/* Base Layout Setup */
#app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

main { 
  flex: 1; 
}

/* ═══════════════════════════════════════════
   GLOBAL LOADER STYLES
═══════════════════════════════════════════ */
.global-loader-overlay {
  position: fixed;
  inset: 0;
  background: #000000; /* Full black screen mode */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999; /* Pure layout par overlay block karne ke liye high stack pointer */
  pointer-events: all;
}

.loader-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Animated Typography */
.loader-logo {
  font-family: var(--font-display, 'Arial Black', sans-serif);
  font-size: clamp(1.8rem, 4vw, 3rem);
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  animation: pulseScale 2s ease-in-out infinite;
}

.brand-gw {
  background: #e63946; /* GlobalWatch Signature Red */
  color: #fff;
  padding: 4px 10px;
  border-radius: 2px;
  font-size: 0.85em;
}

.brand-text {
  color: #ffffff;
}

.brand-news {
  color: #e63946;
}

/* Sleek Progress Bar Animation */
.loader-bar-container {
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.loader-bar-progress {
  position: absolute;
  height: 100%;
  width: 50%;
  background: #e63946;
  border-radius: 4px;
  animation: indeterminateLoading 1.5s infinite linear;
}

.loader-status {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0;
}

/* ── ANIMATION KEYFRAMES ───────────────────── */
@keyframes indeterminateLoading {
  0% { left: -50%; }
  100% { left: 100%; }
}

@keyframes pulseScale {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.03); opacity: 1; }
}

/* ── TRANSITIONS (VUE FADE EFFECT) ─────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Router page transition mapping style hook */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>