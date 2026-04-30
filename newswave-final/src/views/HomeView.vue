<template>
  <div class="home">
    <HeroSlider />
    
    <section class="home-body">
      <div class="container home-layout">
        <div class="home-main">
          
          <div class="section-header" v-if="loadingLatest || latest.length > 0">
            <h2 class="section-title">Latest News</h2>
          </div>
          
          <div v-if="loadingLatest" class="news-grid news-grid-3">
            <div v-for="i in 3" :key="i" class="skeleton-card"></div>
          </div>
          
          <div v-else-if="latest.length > 0" class="news-grid news-grid-3">
            <NewsCard v-for="article in latest" :key="article.id" :article="article" />
          </div>

          <div v-for="cat in activeCategories" :key="cat.slug" class="cat-section">
            <div class="divider"></div>
            <div class="section-header">
              <h2 class="section-title">{{ cat.label }}</h2>
              <router-link :to="`/category/${cat.slug}`" class="view-all">View All →</router-link>
            </div>
            <div class="news-grid news-grid-3">
              <NewsCard v-for="article in catArticles[cat.slug]" :key="article.id" :article="article" />
            </div>
          </div>

        </div>

        <aside class="home-sidebar">
          <TrendingSidebar />
          
          <div class="divider"></div>
          <div class="widget weather-widget">
            <div class="widget-header">
              <span class="widget-title">Weather</span>
            </div>
            
            <div v-if="weather" class="weather-now">
              <div class="weather-temp">{{ Math.round(weather.main.temp) }}°C</div>
              <div class="weather-info">
                <div class="weather-city">{{ weather.name }}</div>
                <div class="weather-desc">{{ weather.weather[0].main }}</div>
              </div>
            </div>
            <div v-else class="weather-loading">Detecting location...</div>
          </div>

          <div class="divider"></div>
          <div class="widget" v-if="activeCategories.length > 0">
            <div class="widget-header"><span class="widget-title">Browse Topics</span></div>
            <div class="cat-bubbles">
              <router-link 
                v-for="cat in activeCategories" 
                :key="cat.slug" 
                :to="`/category/${cat.slug}`" 
                class="cat-bubble" 
                :style="{ '--cat-color': cat.color || '#d32f2f' }">
                {{ cat.label }}
              </router-link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import HeroSlider from '../components/HeroSlider.vue'
import NewsCard from '../components/NewsCard.vue'
import TrendingSidebar from '../components/TrendingSidebar.vue'
import { newsAPI } from '../services/api.js'
import { categories } from '../store/newsData.js'

const latest = ref([])
const catArticles = ref({})
const loadingLatest = ref(true)
const weather = ref(null)

// Computed list: sirf wahi categories jinme articles hain
const activeCategories = computed(() => {
  return categories.filter(cat => catArticles.value[cat.slug]?.length > 0)
})

// Weather Fetcher
async function getWeather(lat, lon) {

  const API_KEY = '42dadee5d9c321165f42ccdde609db7a' // <--- Yahan apni API key daalein
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    weather.value = await res.json()
  } catch (e) { console.error("Weather error:", e) }
}

onMounted(async () => {
  // 1. Get Latest
  try {
    const data = await newsAPI.getAll(0, 6)
    latest.value = data || []
  } finally {
    loadingLatest.value = false
  }

  // 2. Get All Categories (Parallel Fetching)
  const categoryPromises = categories.map(async (cat) => {
    try {
      const data = await newsAPI.getByCategory(cat.slug, 0, 3)
      if (data && data.length > 0) {
        catArticles.value[cat.slug] = data
      }
    } catch (e) { console.error(e) }
  })
  await Promise.all(categoryPromises)

  // 3. Get Weather
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => getWeather(pos.coords.latitude, pos.coords.longitude),
      () => getWeather(24.86, 67.00) // Fallback to Karachi if permission denied
    )
  }
})
</script>

<style scoped>
.home-body { padding: 60px 0; }
.home-layout { display: grid; grid-template-columns: 1fr 340px; gap: 40px; align-items: start; }
.home-sidebar { position: sticky; top: 120px; }
.skeleton-card { height: 280px; background: linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card-hover) 50%, var(--bg-card) 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius-lg); }
.widget { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
.widget-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.widget-title { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-primary); }
.weather-now { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.weather-temp { font-family: var(--font-display); font-size: 3.5rem; line-height: 1; color: var(--accent-amber); }
.weather-city { font-weight: 600; font-size: 1rem; }
.weather-desc { font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px; }
.weather-row { display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 14px; }
.weather-day { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.w-day { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); text-transform: uppercase; }
.w-icon { font-size: 1.2rem; }
.w-temp { font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); }
.cat-bubbles { display: flex; flex-wrap: wrap; gap: 8px; }
.cat-bubble { padding: 6px 14px; border-radius: 20px; font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; border: 1px solid color-mix(in srgb, var(--cat-color) 40%, transparent); color: var(--cat-color); background: color-mix(in srgb, var(--cat-color) 8%, transparent); transition: all 0.2s; }
.cat-bubble:hover { background: var(--cat-color); color: #fff; }
.stats-bar { background: var(--bg-card); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 28px 0; }
.stats-inner { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 24px; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-value { font-family: var(--font-display); font-size: 2rem; color: var(--accent-red); letter-spacing: 0.04em; }
.stat-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.divider { margin: 40px 0; border-bottom: 1px solid var(--border); }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.section-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
.view-all { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; color: var(--accent-red); text-decoration: none; }
.weather-loading { font-size: 0.8rem; color: var(--text-muted); }
@media (max-width: 1100px) { .home-layout { grid-template-columns: 1fr; } .home-sidebar { position: static; } }
</style>
