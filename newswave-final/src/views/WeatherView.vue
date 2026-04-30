<template>
  <div class="weather-page">
    <div class="weather-hero">
      <div class="weather-hero-bg"></div>
      <div class="container weather-hero-content">
        <h1 class="weather-page-title">Weather Center</h1>
        <p class="weather-hero-sub">Accurate forecasts powered by NewsWave Meteorological Division</p>

        <!-- Current City -->
        <div class="weather-main-card">
          <div class="wm-left">
            <div class="wm-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Karachi, Sindh, PK
            </div>
            <div class="wm-temp">28°</div>
            <div class="wm-feel">Feels like 31°C · Humidity 68%</div>
            <div class="wm-condition">☀️ Sunny & Clear</div>
            <div class="wm-meta">
              <span>Wind: 12 km/h NW</span>
              <span>·</span>
              <span>UV Index: 8 (Very High)</span>
              <span>·</span>
              <span>Visibility: 16 km</span>
            </div>
          </div>
          <div class="wm-right">
            <div class="wm-sun-info">
              <div class="sun-row">
                <span class="sun-label">🌅 Sunrise</span>
                <span class="sun-val">06:14 AM</span>
              </div>
              <div class="sun-row">
                <span class="sun-label">🌇 Sunset</span>
                <span class="sun-val">06:47 PM</span>
              </div>
              <div class="sun-row">
                <span class="sun-label">🌕 Moon</span>
                <span class="sun-val">Waxing Gibbous</span>
              </div>
              <div class="sun-row">
                <span class="sun-label">💧 Precip</span>
                <span class="sun-val">0% chance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container weather-body">
      <!-- Hourly -->
      <div class="section-header">
        <h2 class="section-title">Hourly Forecast</h2>
      </div>
      <div class="hourly-scroll">
        <div class="hourly-track">
          <div v-for="h in hourly" :key="h.time" class="hourly-card" :class="{ now: h.now }">
            <div class="h-time">{{ h.time }}</div>
            <div class="h-icon">{{ h.icon }}</div>
            <div class="h-temp">{{ h.temp }}</div>
            <div class="h-rain">{{ h.rain }}</div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- 7-day -->
      <div class="section-header">
        <h2 class="section-title">7-Day Forecast</h2>
      </div>
      <div class="forecast-list">
        <div v-for="day in sevenDay" :key="day.day" class="forecast-row">
          <div class="fc-day">{{ day.day }}</div>
          <div class="fc-icon">{{ day.icon }}</div>
          <div class="fc-desc">{{ day.desc }}</div>
          <div class="fc-bar-wrap">
            <span class="fc-low">{{ day.low }}°</span>
            <div class="fc-bar">
              <div class="fc-fill" :style="{ left: barLeft(day.low) + '%', width: barWidth(day.low, day.high) + '%', background: day.color }"></div>
            </div>
            <span class="fc-high">{{ day.high }}°</span>
          </div>
          <div class="fc-rain">💧 {{ day.rain }}</div>
          <div class="fc-wind">💨 {{ day.wind }}</div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- World Cities -->
      <div class="section-header">
        <h2 class="section-title">World Cities</h2>
      </div>
      <div class="cities-grid">
        <div v-for="city in cities" :key="city.name" class="city-card card">
          <div class="card-body">
            <div class="city-top">
              <div>
                <div class="city-name">{{ city.name }}</div>
                <div class="city-country">{{ city.country }}</div>
              </div>
              <div class="city-icon">{{ city.icon }}</div>
            </div>
            <div class="city-temp">{{ city.temp }}</div>
            <div class="city-cond">{{ city.cond }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const hourly = [
  { time: 'Now', icon: '☀️', temp: '28°', rain: '0%', now: true },
  { time: '10 AM', icon: '☀️', temp: '29°', rain: '0%' },
  { time: '11 AM', icon: '🌤', temp: '30°', rain: '0%' },
  { time: '12 PM', icon: '☀️', temp: '32°', rain: '0%' },
  { time: '01 PM', icon: '☀️', temp: '33°', rain: '0%' },
  { time: '02 PM', icon: '🌤', temp: '33°', rain: '5%' },
  { time: '03 PM', icon: '⛅', temp: '31°', rain: '10%' },
  { time: '04 PM', icon: '🌤', temp: '30°', rain: '5%' },
  { time: '05 PM', icon: '☀️', temp: '29°', rain: '0%' },
  { time: '06 PM', icon: '🌅', temp: '27°', rain: '0%' },
  { time: '07 PM', icon: '🌙', temp: '25°', rain: '0%' },
  { time: '08 PM', icon: '🌙', temp: '24°', rain: '0%' },
  { time: '09 PM', icon: '🌙', temp: '23°', rain: '0%' },
  { time: '10 PM', icon: '🌙', temp: '22°', rain: '0%' },
  { time: '11 PM', icon: '🌙', temp: '21°', rain: '0%' },
]

const sevenDay = [
  { day: 'Today', icon: '☀️', desc: 'Sunny', low: 22, high: 33, rain: '0%', wind: '12 km/h', color: '#f59e0b' },
  { day: 'Sunday', icon: '⛅', desc: 'Partly Cloudy', low: 21, high: 30, rain: '5%', wind: '15 km/h', color: '#60a5fa' },
  { day: 'Monday', icon: '🌧️', desc: 'Light Rain', low: 19, high: 26, rain: '70%', wind: '20 km/h', color: '#3b82f6' },
  { day: 'Tuesday', icon: '⛅', desc: 'Mostly Cloudy', low: 20, high: 28, rain: '20%', wind: '14 km/h', color: '#94a3b8' },
  { day: 'Wednesday', icon: '☀️', desc: 'Clear', low: 21, high: 31, rain: '0%', wind: '10 km/h', color: '#f59e0b' },
  { day: 'Thursday', icon: '☀️', desc: 'Sunny', low: 22, high: 32, rain: '0%', wind: '8 km/h', color: '#f59e0b' },
  { day: 'Friday', icon: '🌤', desc: 'Partly Sunny', low: 21, high: 30, rain: '10%', wind: '12 km/h', color: '#fbbf24' },
]

function barLeft(low) { return ((low - 15) / 25) * 100 }
function barWidth(low, high) { return ((high - low) / 25) * 100 }

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
/* HERO */
.weather-hero {
  position: relative;
  padding: 70px 0 50px;
  overflow: hidden;
  background: linear-gradient(135deg, #0d1b2a 0%, #162032 50%, #1a0a0a 100%);
}
.weather-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(251,191,36,0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(230,57,70,0.08) 0%, transparent 50%);
  pointer-events: none;
}
.weather-hero-content { position: relative; z-index: 1; }
.weather-page-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 5rem);
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}
.weather-hero-sub { font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 36px; }

/* MAIN CARD */
.weather-main-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-lg);
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
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.wm-temp {
  font-family: var(--font-display);
  font-size: 6rem;
  line-height: 1;
  color: var(--accent-amber);
  margin-bottom: 4px;
}
.wm-feel { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px; }
.wm-condition { font-size: 1.2rem; margin-bottom: 16px; }
.wm-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
}
.sun-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.sun-row:last-child { border-bottom: none; }
.sun-label { font-size: 0.85rem; color: var(--text-secondary); }
.sun-val { font-family: var(--font-mono); font-size: 12px; color: var(--text-primary); }

/* BODY */
.weather-body { padding: 60px 0 80px; }

/* HOURLY */
.hourly-scroll { overflow-x: auto; padding-bottom: 8px; }
.hourly-track { display: flex; gap: 10px; min-width: max-content; }
.hourly-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  text-align: center;
  min-width: 72px;
  transition: all 0.2s;
}
.hourly-card.now {
  background: rgba(230,57,70,0.1);
  border-color: var(--accent-red);
}
.hourly-card:hover { border-color: var(--border-bright); background: var(--bg-card-hover); }
.h-time { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; }
.h-icon { font-size: 1.5rem; margin-bottom: 8px; }
.h-temp { font-family: var(--font-display); font-size: 1.2rem; color: var(--text-primary); margin-bottom: 4px; }
.h-rain { font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); }

/* 7-DAY */
.forecast-list { display: flex; flex-direction: column; gap: 2px; }
.forecast-row {
  display: grid;
  grid-template-columns: 100px 36px 140px 1fr 80px 100px;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border);
  transition: all 0.2s;
}
.forecast-row:first-child { background: rgba(230,57,70,0.06); border-color: rgba(230,57,70,0.2); }
.forecast-row:hover { background: var(--bg-card-hover); }
.fc-day { font-weight: 600; font-size: 0.9rem; }
.fc-icon { font-size: 1.4rem; }
.fc-desc { font-size: 0.82rem; color: var(--text-secondary); }
.fc-bar-wrap { display: flex; align-items: center; gap: 10px; }
.fc-low, .fc-high { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); min-width: 28px; text-align: center; }
.fc-bar {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}
.fc-fill { position: absolute; height: 100%; border-radius: 3px; top: 0; }
.fc-rain, .fc-wind { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }

/* CITIES */
.cities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.city-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.city-name { font-weight: 700; font-size: 1rem; }
.city-country { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-top: 2px; }
.city-icon { font-size: 1.8rem; }
.city-temp { font-family: var(--font-display); font-size: 2rem; color: var(--accent-amber); }
.city-cond { font-size: 0.82rem; color: var(--text-secondary); }

@media (max-width: 1000px) {
  .cities-grid { grid-template-columns: repeat(2, 1fr); }
  .forecast-row { grid-template-columns: 80px 30px 1fr auto; }
  .fc-desc, .fc-rain, .fc-wind { display: none; }
}
@media (max-width: 600px) {
  .weather-main-card { grid-template-columns: 1fr; gap: 20px; }
  .cities-grid { grid-template-columns: 1fr 1fr; }
}
</style>
