<template>
  <transition name="fade">
    <button v-if="visible" class="scroll-top" @click="scrollTop" title="Back to top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
function onScroll() { visible.value = window.scrollY > 400 }
function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.scroll-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 500;
  width: 44px; height: 44px;
  background: var(--accent-red);
  border: none;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(230,57,70,0.4);
  transition: all 0.2s;
}
.scroll-top:hover { transform: scale(1.1) translateY(-2px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
