<template>
  <section class="hero">
    <div v-if="loading" class="hero-loading">
      <div class="hero-spinner"></div>
    </div>
    <template v-else-if="featured.length">
      <div class="hero-slides">
        <transition name="hero-slide" mode="out-in">
          <div :key="current" class="hero-slide">
            <div class="hero-bg" :style="{ backgroundImage: `url(${getImage(featured[current])})` }"></div>
            <div class="hero-overlay"></div>
            <div class="container hero-content">
              <div class="hero-text">
                <div class="hero-meta">
                  <span class="tag" :class="featured[current].category">{{ featured[current].category }}</span>
                  <span class="hero-time">
                    <span class="live-dot"></span>
                    {{ getTime(featured[current]) }}
                  </span>
                </div>
                <h1 class="hero-title">{{ featured[current].title }}</h1>
                <p class="hero-excerpt">{{ featured[current].excerpt }}</p>
                <div class="hero-actions">
                  <router-link :to="`/article/${featured[current].id}`" class="btn btn-primary">
                    Read Full Story
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </router-link>
                  <span class="hero-views">👁 {{ Number(featured[current].views || 0).toLocaleString() }} views</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="hero-controls">
        <button class="hero-arrow" @click="prev">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div class="hero-dots">
          <button v-for="(_, i) in featured" :key="i" class="hero-dot" :class="{ active: i === current }" @click="goTo(i)"></button>
        </div>
        <button class="hero-arrow" @click="next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div class="hero-progress"><div class="hero-progress-bar" :style="{ width: progress + '%' }"></div></div>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { newsAPI } from '../services/api.js'
import { getFeaturedArticles } from '../store/newsData.js'

const featured = ref([])
const loading = ref(true)
const current = ref(0)
const progress = ref(0)
let timer = null, progressTimer = null

function getImage(a) {
  return a.imageUrl || a.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80'
}
function getTime(a) {
  if (a.time) return a.time
  if (a.publishedAt) return new Date(a.publishedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return ''
}

onMounted(async () => {
  try {
    const data = await newsAPI.getFeatured()
    featured.value = (data && data.length) ? data : getFeaturedArticles()
  } catch {
    featured.value = getFeaturedArticles()
  } finally {
    loading.value = false
    if (featured.value.length) { startProgress(); timer = setInterval(next, 5000) }
  }
})
onUnmounted(() => { clearInterval(timer); clearInterval(progressTimer) })

function startProgress() {
  progress.value = 0; let p = 0
  progressTimer = setInterval(() => { p += 0.5; progress.value = p; if (p >= 100) clearInterval(progressTimer) }, 25)
}
function next() { current.value = (current.value + 1) % featured.value.length; resetTimer() }
function prev() { current.value = (current.value - 1 + featured.value.length) % featured.value.length; resetTimer() }
function goTo(i) { current.value = i; resetTimer() }
function resetTimer() { clearInterval(timer); clearInterval(progressTimer); startProgress(); timer = setInterval(next, 5000) }
</script>

<style scoped>
.hero { position: relative; height: 75vh; min-height: 540px; overflow: hidden; background: var(--bg-secondary); }
.hero-loading { height: 100%; display: flex; align-items: center; justify-content: center; }
.hero-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--accent-red); border-radius: 50%; animation: spin 0.8s linear infinite; }
.hero-slides { height: 100%; }
.hero-slide { position: absolute; inset: 0; }
.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; animation: heroZoom 6s ease forwards; }
@keyframes heroZoom { from { transform: scale(1.05); } to { transform: scale(1); } }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%); }
.hero-content { position: relative; z-index: 1; height: 100%; display: flex; align-items: flex-end; padding-bottom: 80px; }
.hero-text { max-width: 640px; animation: fadeUp 0.8s ease forwards; }
.hero-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.hero-time { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.7); }
.live-dot { width: 6px; height: 6px; background: var(--accent-red); border-radius: 50%; animation: tagPulse 1.5s ease-in-out infinite; display: inline-block; }
.hero-title { font-family: var(--font-headline); font-size: clamp(1.8rem,4vw,3rem); font-weight: 900; line-height: 1.15; color: #fff; margin-bottom: 14px; text-shadow: 0 2px 20px rgba(0,0,0,0.5); }
.hero-excerpt { font-size: 1rem; color: rgba(255,255,255,0.75); line-height: 1.6; margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.hero-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.hero-views { font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.5); }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; font-family: var(--font-mono); font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; border-radius: var(--radius); transition: all 0.2s; cursor: pointer; border: 1px solid transparent; text-decoration: none; }
.btn-primary { background: var(--accent-red); color: #fff; border-color: var(--accent-red); }
.btn-primary:hover { background: #c62b38; }
.hero-controls { position: absolute; bottom: 24px; right: 24px; z-index: 10; display: flex; align-items: center; gap: 12px; }
.hero-arrow { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); color: #fff; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; }
.hero-arrow:hover { background: var(--accent-red); border-color: var(--accent-red); }
.hero-dots { display: flex; gap: 8px; }
.hero-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: all 0.2s; }
.hero-dot.active { background: var(--accent-red); width: 24px; border-radius: 4px; }
.hero-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: rgba(255,255,255,0.1); }
.hero-progress-bar { height: 100%; background: var(--accent-red); transition: width 0.05s linear; }
.hero-slide-enter-active, .hero-slide-leave-active { transition: opacity 0.7s ease; }
.hero-slide-enter-from, .hero-slide-leave-to { opacity: 0; }
@media (max-width: 600px) { .hero { height: 65vh; } .hero-content { padding-bottom: 60px; } }
</style>
