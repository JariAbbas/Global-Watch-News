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
            <div class="wm-condition">☀️ {{ weather.condition || '--' }}</div>
            <div class="wm-meta">
              <span>Wind: {{ weather.wind || '--' }}</span>
              <span>·</span>
              <span>Visibility: {{ weather.visibility || '--' }}</span>
            </div>
          </div>
          <div class="wm-right">
             <div class="wm-sun-info">
              <div class="sun-row"><span class="sun-label">🌅 Sunrise</span><span class="sun-val">06:14 AM</span></div>
              <div class="sun-row"><span class="sun-label">🌇 Sunset</span><span class="sun-val">06:47 PM</span></div>
              <div class="sun-row"><span class="sun-label">💧 Precip</span><span class="sun-val">0%</span></div>
            </div>
          </div>
        </div>
        <!-- Skeleton loader for initial load and when switching cities -->
        <div v-else class="weather-main-card skeleton"></div>
      </div>
    </div>

    <div class="container weather-body">
      <!-- Clickable Major Cities Section -->
      <div class="major-cities-section animate-fade-in-up">
        <h3 class="section-title">Major Cities</h3>
        <p class="section-subtitle">Select a city to view detailed weather</p>
        
        <div class="cities-grid">
          <div 
            v-for="city in cities.slice(0, 4)" 
            :key="city.name" 
            class="city-card"
            @click="fetchCityWeather(city.name)"
          >
            <div class="city-top">
              <div>
                <div class="city-name">{{ city.name }}</div>
                <div class="city-country">{{ city.country }}</div>
              </div>
              <div class="city-icon">{{ city.icon }}</div>
            </div>
            <div class="city-bottom">
              <div class="city-temp">{{ city.temp }}</div>
              <div class="city-cond">{{ city.cond }}</div>
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

const weather = ref(null)

// Function to handle fetching weather for any city
const fetchCityWeather = async (cityName) => {
  // Set weather to null temporarily to trigger the skeleton loading effect
  weather.value = null

  try {
    const data = await weatherAPI.getWeather(cityName.toLowerCase())
    weather.value = data
    
    // Smooth scroll back to top if user scrolled down
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    console.error(`Failed to load weather for ${cityName}`, e)
  }
}

onMounted(() => {
  // Initial load starts with Karachi
  fetchCityWeather('karachi')
})

// Data for small clickable cards
const cities = [
  { name: 'London', country: 'UK', icon: '🌧️', temp: '12°C', cond: 'Rainy' },
  { name: 'New York', country: 'USA', icon: '⛅', temp: '8°C', cond: 'Cloudy' },
  { name: 'Dubai', country: 'UAE', icon: '☀️', temp: '34°C', cond: 'Sunny' },
  { name: 'Tokyo', country: 'Japan', icon: '🌸', temp: '16°C', cond: 'Mild' },
  { name: 'Sydney', country: 'Australia', icon: '☀️', temp: '26°C', cond: 'Sunny' },
  { name: 'Paris', country: 'France', icon: '🌤', temp: '14°C', cond: 'Partly Cloudy' },
  { name: 'Mumbai', country: 'India', icon: '🌫', temp: '31°C', cond: 'Hazy' },
  { name: 'Beijing', country: 'China', icon: '⛅', temp: '11°C', cond: 'Cloudy' },
]
</script>

<style scoped>
/* Define generic variables if not defined globally */
:root {
  --radius-lg: 16px;
  --accent-amber: #f59e0b;
  --accent-cyan: #06b6d4;
  --accent-red: #e63946;
  --text-primary: #ffffff;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --bg-card: rgba(255, 255, 255, 0.04);
  --bg-card-hover: rgba(255, 255, 255, 0.08);
  --border: rgba(255, 255, 255, 0.1);
  --border-bright: rgba(255, 255, 255, 0.2);
}

* {
  box-sizing: border-box;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Skeleton Loading Effect */
.skeleton {
  height: 250px;
  background: linear-gradient(90deg, #162032 0%, #1e2a3d 50%, #162032 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.wm-temp { 
  transition: all 0.3s ease;
  animation: pulse 4s infinite ease-in-out;
}

/* HERO */
.weather-hero {
  position: relative;
  padding: 70px 0 50px;
  overflow: hidden;
  background: linear-gradient(135deg, #0d1b2a 0%, #162032 50%, #1a0a0a 100%);
  color: white;
}
.weather-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(251,191,36,0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(230,57,70,0.08) 0%, transparent 50%);
  pointer-events: none;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.weather-hero-content { position: relative; z-index: 1; }
.weather-page-title {
  font-size: clamp(2.5rem, 5vw, 5rem);
  letter-spacing: 0.04em;
  margin-bottom: 8px;
  margin-top: 0;
}
.weather-hero-sub { font-size: 0.95rem; color: #cbd5e1; margin-bottom: 36px; }

/* MAIN CARD */
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
.wm-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.wm-temp {
  font-size: 6rem;
  line-height: 1;
  color: #f59e0b;
  margin-bottom: 4px;
}
.wm-feel { font-size: 0.82rem; color: #94a3b8; margin-bottom: 6px; }
.wm-condition { font-size: 1.2rem; margin-bottom: 16px; }
.wm-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 11px;
  color: #94a3b8;
}
.sun-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.sun-row:last-child { border-bottom: none; }
.sun-label { font-size: 0.85rem; color: #cbd5e1; }
.sun-val { font-size: 12px; color: white; }

/* BODY & MAJOR CITIES */
.weather-body { padding: 40px 0 80px; }
.section-title {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 4px;
}
.section-subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 24px;
}

/* CITIES GRID & CARDS */
.cities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

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
.city-top { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin-bottom: 12px; 
}
.city-name { font-weight: 700; font-size: 1rem; }
.city-country { font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-top: 2px; }
.city-icon { font-size: 1.8rem; }
.city-bottom { display: flex; flex-direction: column; gap: 4px; }
.city-temp { font-size: 2rem; color: #f59e0b; font-weight: 600; line-height: 1; }
.city-cond { font-size: 0.82rem; color: #cbd5e1; }

@media (max-width: 1000px) {
  .cities-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .weather-main-card { grid-template-columns: 1fr; gap: 20px; }
  .cities-grid { grid-template-columns: 1fr; }
}
</style>