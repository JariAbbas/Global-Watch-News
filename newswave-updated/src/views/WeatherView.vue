<template>
  <div class="weather-page">
    <div class="weather-hero">
      <div class="weather-hero-bg"></div>
      <div class="container weather-hero-content">
        <h1 class="weather-page-title">Weather Center</h1>
        <p class="weather-hero-sub">Live meteorological data for your selected city.</p>

        <!-- Main Weather Card -->
        <div v-if="weather" class="weather-main-card animate-fade-in-up">
          <div class="wm-left">
            <div class="wm-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ weather.location || 'Unknown' }}
            </div>
            <div class="wm-temp">{{ weather.temp || '--' }}</div>
            <div class="wm-feel">Feels like {{ weather.feelsLike || '--' }} · Humidity {{ weather.humidity || '--' }}</div>
            <div class="wm-condition">{{ conditionIcon(weather.condition) }} {{ weather.condition || '--' }}</div>
            <div class="wm-meta">
              <span>Wind: {{ weather.wind || '--' }}</span>
              <span>·</span>
              <span>Visibility: {{ weather.visibility || '--' }}</span>
            </div>
          </div>
          <div class="wm-right">
            <div class="wm-sun-info">
              <div class="sun-row">
                <span class="sun-label">🌅 Sunrise</span>
                <span class="sun-val">{{ weather.sunrise || '--' }}</span>
              </div>
              <div class="sun-row">
                <span class="sun-label">🌇 Sunset</span>
                <span class="sun-val">{{ weather.sunset || '--' }}</span>
              </div>
              <div class="sun-row">
                <span class="sun-label">💧 Precip</span>
                <span class="sun-val">{{ weather.precip || '0%' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton loader -->
        <div v-else class="weather-main-card skeleton"></div>
      </div>
    </div>

    <div class="container weather-body">
      <div class="major-cities-section animate-fade-in-up">
        <h3 class="section-title">Major Cities</h3>
        <p class="section-subtitle">Select a city to view detailed weather</p>

        <div class="cities-grid">
          <div
            v-for="city in cities"
            :key="city.name"
            class="city-card"
            :class="{ active: selectedCity === city.name }"
            @click="selectCity(city.name)"
          >
            <div class="city-top">
              <div>
                <div class="city-name">{{ city.name }}</div>
                <div class="city-country">{{ city.country }}</div>
              </div>
              <div class="city-icon">
                <!-- Loading spinner for this card -->
                <span v-if="city.loading" class="card-spinner"></span>
                <span v-else>{{ city.icon }}</span>
              </div>
            </div>
            <div class="city-bottom">
              <!-- Real temp from API or skeleton -->
              <div class="city-temp">
                <span v-if="city.loading || city.temp === null" class="skel-temp"></span>
                <span v-else>{{ city.temp }}</span>
              </div>
              <div class="city-cond">
                <span v-if="city.loading || city.cond === null" class="skel-cond"></span>
                <span v-else>{{ city.cond }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { weatherAPI } from '../services/api.js'

// ── STATE ────────────────────────────────────────
const weather     = ref(null)        // main card data
const selectedCity = ref('Karachi')  // currently selected city

// City list — temp/cond/icon will be filled from API
const cities = ref([
  { name: 'Karachi',  country: 'Pakistan',   icon: '☀️',  temp: null, cond: null, loading: true },
  { name: 'Lahore',   country: 'Pakistan',   icon: '🌤️',  temp: null, cond: null, loading: true },
  { name: 'London',   country: 'UK',         icon: '🌧️',  temp: null, cond: null, loading: true },
  { name: 'New York', country: 'USA',        icon: '⛅',  temp: null, cond: null, loading: true },
  { name: 'Dubai',    country: 'UAE',        icon: '☀️',  temp: null, cond: null, loading: true },
  { name: 'Tokyo',    country: 'Japan',      icon: '🌸',  temp: null, cond: null, loading: true },
  { name: 'Mumbai',   country: 'India',      icon: '🌫️',  temp: null, cond: null, loading: true },
  { name: 'Paris',    country: 'France',     icon: '🌤️',  temp: null, cond: null, loading: true },
])

// ── HELPERS ──────────────────────────────────────

// Condition string se emoji decide karo
function conditionIcon(cond = '') {
  const c = cond.toLowerCase()
  if (c.includes('sun') || c.includes('clear'))  return '☀️'
  if (c.includes('cloud'))                        return '⛅'
  if (c.includes('rain') || c.includes('drizzle'))return '🌧️'
  if (c.includes('thunder') || c.includes('storm'))return '⛈️'
  if (c.includes('snow'))                         return '❄️'
  if (c.includes('fog') || c.includes('haze') || c.includes('mist')) return '🌫️'
  if (c.includes('wind'))                         return '💨'
  return '🌡️'
}

// ── FETCH MAIN CARD ──────────────────────────────
async function fetchMainWeather(cityName) {
  weather.value = null
  selectedCity.value = cityName

  try {
    const data = await weatherAPI.getWeather(cityName.toLowerCase())
    weather.value = data
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    console.error(`Main weather fetch failed for ${cityName}:`, e)
    weather.value = null
  }
}

// ── FETCH CARD DATA (single city) ───────────────
async function fetchCardWeather(city) {
  city.loading = true
  try {
    const data = await weatherAPI.getWeather(city.name.toLowerCase())
    city.temp    = data?.temp    || '--'
    city.cond    = data?.condition || '--'
    city.icon    = conditionIcon(data?.condition || '')
  } catch (e) {
    console.error(`Card weather fetch failed for ${city.name}:`, e)
    city.temp = '--'
    city.cond = '--'
  } finally {
    city.loading = false
  }
}

// ── SELECT CITY (card click) ─────────────────────
function selectCity(cityName) {
  if (selectedCity.value === cityName) return
  fetchMainWeather(cityName)
}

// ── ON MOUNT ─────────────────────────────────────
onMounted(() => {
  // Main card — Karachi by default
  fetchMainWeather('Karachi')

  // All city cards — parallel fetch (Promise.all for speed)
  Promise.all(cities.value.map(city => fetchCardWeather(city)))
})
</script>

<style scoped>
* { box-sizing: border-box; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.02); }
  100% { transform: scale(1); }
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* Skeleton */
.skeleton {
  height: 250px;
  background: linear-gradient(90deg, #162032 0%, #1e2a3d 50%, #162032 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Inline skeleton placeholders inside city cards */
.skel-temp, .skel-cond {
  display: inline-block;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skel-temp { width: 60px; height: 28px; }
.skel-cond { width: 80px; height: 14px; margin-top: 4px; }

/* Card spinner */
.card-spinner {
  display: inline-block;
  width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,0.15);
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.wm-temp {
  transition: all 0.3s ease;
  animation: pulse 4s infinite ease-in-out;
}

/* ── HERO ──────────────────────────────────────── */
.weather-hero {
  position: relative;
  padding: 70px 0 50px;
  overflow: hidden;
  background: linear-gradient(135deg, #0d1b2a 0%, #162032 50%, #1a0a0a 100%);
  color: white;
}
.weather-hero-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(251,191,36,0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(230,57,70,0.08) 0%, transparent 50%);
  pointer-events: none;
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.weather-hero-content { position: relative; z-index: 1; }
.weather-page-title { font-size: clamp(2.5rem, 5vw, 5rem); letter-spacing: 0.04em; margin-bottom: 8px; margin-top: 0; }
.weather-hero-sub { font-size: 0.95rem; color: #cbd5e1; margin-bottom: 36px; }

/* ── MAIN CARD ─────────────────────────────────── */
.weather-main-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  backdrop-filter: blur(10px);
  max-width: 800px;
}
.wm-location { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
.wm-temp { font-size: 6rem; line-height: 1; color: #f59e0b; margin-bottom: 4px; }
.wm-feel { font-size: 0.82rem; color: #94a3b8; margin-bottom: 6px; }
.wm-condition { font-size: 1.2rem; margin-bottom: 16px; }
.wm-meta { display: flex; gap: 10px; flex-wrap: wrap; font-size: 11px; color: #94a3b8; }
.sun-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
.sun-row:last-child { border-bottom: none; }
.sun-label { font-size: 0.85rem; color: #cbd5e1; }
.sun-val { font-size: 12px; color: white; }

/* ── BODY & CITIES ─────────────────────────────── */
.weather-body { padding: 40px 0 80px; }
.section-title { color: white; font-size: 1.5rem; margin-bottom: 4px; }
.section-subtitle { color: #94a3b8; font-size: 0.9rem; margin-bottom: 24px; }

.cities-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

.city-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}
.city-card:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.3);
  transform: translateY(-4px);
}
.city-card.active {
  border-color: #f59e0b;
  background: rgba(245,158,11,0.08);
}

.city-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.city-name { font-weight: 700; font-size: 1rem; }
.city-country { font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-top: 2px; }
.city-icon { font-size: 1.8rem; min-width: 32px; display: flex; align-items: center; justify-content: center; }
.city-bottom { display: flex; flex-direction: column; gap: 4px; min-height: 48px; }
.city-temp { font-size: 2rem; color: #f59e0b; font-weight: 600; line-height: 1; min-height: 32px; display: flex; align-items: center; }
.city-cond { font-size: 0.82rem; color: #cbd5e1; min-height: 18px; display: flex; align-items: center; }

@media (max-width: 1000px) { .cities-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) {
  .weather-main-card { grid-template-columns: 1fr; gap: 20px; }
  .cities-grid { grid-template-columns: 1fr 1fr; }
}
</style>