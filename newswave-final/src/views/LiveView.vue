<template>
  <div class="live-page">
    <!-- HERO -->
    <div class="live-hero">
      <div class="container live-hero-content">
        <div class="live-badge" :class="{ offline: !streamData?.isActive }">
          <span class="live-dot"></span>
          {{ streamData?.isActive ? 'LIVE NOW' : 'OFF AIR' }}
        </div>
        <h1 class="live-hero-title">{{ streamData?.title || 'GlobalWatch News Live' }}</h1>
        <p class="live-hero-sub">{{ streamData?.description || '24/7 breaking news coverage from around the world' }}</p>
      </div>
    </div>

    <div class="container live-layout">
      <!-- PLAYER SECTION -->
      <div class="live-main">

        <!-- YouTube Embed — when active + URL present -->
        <div v-if="streamData?.isActive && streamData?.embedId" class="live-player">
          <div class="yt-frame-wrap">
            <iframe
              :src="`https://www.youtube.com/embed/${streamData.embedId}?autoplay=1&rel=0&modestbranding=1`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              class="yt-iframe"
            ></iframe>
          </div>
          <div class="player-bar">
            <div class="player-channel">
              <span class="channel-logo">GW</span>
              <div>
                <div class="channel-name">GlobalWatch News</div>
                <div class="channel-live">
                  <span class="live-dot-sm"></span> LIVE on YouTube
                </div>
              </div>
            </div>
            <a :href="streamData.youtubeUrl || '#'" target="_blank" class="yt-btn">
              ▶ Open on YouTube
            </a>
          </div>
        </div>

        <!-- Offline / No stream -->
        <div v-else class="live-offline">
          <div class="offline-inner">
            <div class="offline-icon">📡</div>
            <h2 class="offline-title">No Live Stream Right Now</h2>
            <p class="offline-sub">We're not broadcasting live at the moment. Check back soon or watch our latest videos below.</p>
            <div class="offline-actions">
              <router-link to="/video" class="btn btn-primary">Watch Videos →</router-link>
              <router-link to="/" class="btn btn-outline">Latest News</router-link>
            </div>
          </div>
        </div>

        <!-- SCHEDULE -->
        <!-- <div class="schedule-section">
          <div class="section-header">
            <h2 class="section-title">Today's Schedule</h2>
            <span v-if="streamData?.isActive" class="tag live">🔴 On Air Now</span>
          </div>
          <div class="schedule-list">
            <div v-for="show in schedule" :key="show.time" class="schedule-item" :class="{ active: show.isLive, past: show.isPast }">
              <div class="schedule-time">
                <span class="sch-time">{{ show.time }}</span>
                <span v-if="show.isLive" class="sch-live-badge"><span class="live-dot-sm"></span> LIVE</span>
              </div>
              <div class="schedule-info">
                <div class="sch-title">{{ show.title }}</div>
                <div class="sch-desc">{{ show.desc }}</div>
              </div>
              <div class="schedule-dur">{{ show.duration }}</div>
            </div>
          </div>
        </div> -->
      </div>

      <!-- SIDEBAR -->
      <aside class="live-sidebar">
        <!-- Live Updates -->
        <!-- ADVERTISEMENT SIDEBAR -->
        <!-- <div class="ads-panel"> -->
          <!-- <div class="ads-header">
            <span class="ads-label">ADVERTISEMENT</span>
          </div> -->
          <!-- <div class="ads-content"> -->
            <!-- Aap apni image ka URL yahan 'src' mein daal sakte hain -->
            <!-- <img 
              src="https://via.placeholder.com/360x600?text=Your+Advertise+Here" 
              alt="Advertisement" 
              class="ad-image"
            /> -->
            <!-- <div class="ad-overlay">
              <p class="ad-text">Promote your brand with GlobalWatch</p>
              <button class="ad-btn">Contact Us</button>
            </div> -->
          <!-- </div> -->
        <!-- </div> -->

        <!-- Channels -->
        <!-- <div class="channels-panel widget">
          <div class="widget-header"><span class="widget-title">Our Channels</span></div>
          <div class="channels-list">
            <div v-for="ch in channels" :key="ch.name" class="channel-item">
              <div class="ch-icon" :style="{ background: ch.color }">{{ ch.short }}</div>
              <div class="ch-info">
                <div class="ch-name">{{ ch.name }}</div>
                <div class="ch-desc">{{ ch.desc }}</div>
              </div>
              <button class="ch-watch">Watch</button>
            </div>
          </div>
        </div> -->
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { liveAPI } from '../services/api.js'

const streamData = ref(null)

onMounted(async () => {
  // Try API first
  try {
    const data = await liveAPI.get()
    if (data) { streamData.value = data; return }
  } catch {}

  // Fallback: localStorage (saved from admin when API offline)
  try {
    const local = localStorage.getItem('nw_live')
    if (local) streamData.value = JSON.parse(local)
  } catch {}
})

const schedule = [
  { time: '06:00 AM', title: 'Early Edition',    desc: 'Overnight global developments',    duration: '60 min', isPast: true },
  { time: '07:00 AM', title: 'World at Dawn',     desc: 'International correspondents live', duration: '90 min', isPast: true },
  { time: '08:30 AM', title: 'Morning Briefing',  desc: 'Top stories with Aisha Khan',      duration: '60 min', isLive: true },
  { time: '09:30 AM', title: 'Markets Open',      desc: 'Live trading floor coverage',       duration: '30 min' },
  { time: '10:00 AM', title: 'In Depth',          desc: 'Long-form investigative journalism',duration: '60 min' },
  { time: '12:00 PM', title: 'Midday Report',     desc: 'Breaking noon headlines',           duration: '30 min' },
  { time: '05:00 PM', title: 'Evening Edition',   desc: "Today's biggest stories",           duration: '90 min' },
  { time: '07:00 PM', title: 'Prime Time News',   desc: 'NewsWave flagship broadcast',       duration: '60 min' },
  { time: '09:00 PM', title: 'Analysis Hour',     desc: 'Expert panel discussions',          duration: '60 min' },
  { time: '11:00 PM', title: 'Night Desk',        desc: 'Late-breaking global news',         duration: '60 min' },
]

const updates = [
  { time: '09:41', text: 'Geneva Climate Summit: 196 nations sign historic carbon neutrality accord.', breaking: true },
  { time: '09:28', text: 'Fed Reserve Chair signals two rate cuts likely in H2 2026.' },
  { time: '09:15', text: 'MIT quantum computer factors 2048-bit RSA key in under 4 seconds.', breaking: true },
  { time: '09:02', text: 'SpaceX Starship successfully completes cislunar refueling demonstration.' },
  { time: '08:55', text: "Pakistan solar corridor reaches 80GW — world's 3rd largest solar producer." },
  { time: '08:40', text: 'WHO declares global health emergency over antimicrobial resistance surge.' },
  { time: '08:30', text: 'S&P 500 futures point to fresh all-time high at open.' },
]

const channels = [
  { name: 'GlobalWatch Main', short: 'GW', desc: 'Breaking news 24/7',  color: '#e63946' },
  { name: 'GW Business',      short: 'GB', desc: 'Markets & finance',   color: '#059669' },
  { name: 'GW Sports',        short: 'GS', desc: 'Live scores',         color: '#d97706' },
  { name: 'GW World',         short: 'GW', desc: 'International news',  color: '#7c3aed' },
]
</script>

<style scoped>

/* ADS PANEL SIDEBAR */
.ads-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* Video screen ke balance ke liye height */
  min-height: 550px; 
}

.ads-header {
  padding: 10px 15px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  text-align: center;
}

.ads-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  font-weight: 600;
}

.ads-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  background: #000; /* Taake agar image load na ho to black dikhe */
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Image ko area cover karne ke liye stretch nahi karega */
  display: block;
  transition: transform 0.5s ease;
}

.ads-content:hover .ad-image {
  transform: scale(1.05); /* Subtle hover effect */
}

.ad-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.85));
  color: #fff;
  text-align: center;
}

.ad-text {
  font-size: 0.85rem;
  margin-bottom: 12px;
  font-weight: 500;
}

.ad-btn {
  background: #fff;
  color: #000;
  border: none;
  padding: 8px 16px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.ad-btn:hover {
  background: var(--accent-red);
  color: #fff;
}

/* Responsive adjustment */
@media (max-width: 1000px) {
  .ads-panel {
    min-height: 300px; /* Mobile par thoda chota dikhega */
  }
}

/* HERO */
.live-hero { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 60px 0 40px; position: relative; overflow: hidden; }
.live-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at top left, rgba(230,57,70,0.1) 0%, transparent 60%); pointer-events: none; }
.live-hero-content { position: relative; z-index: 1; }
.live-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--accent-red); color: #fff; padding: 5px 14px; border-radius: 2px; font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.12em; margin-bottom: 16px; }
.live-badge.offline { background: var(--text-muted); }
.live-dot { width: 8px; height: 8px; background: #fff; border-radius: 50%; animation: blink 1s ease-in-out infinite; display: inline-block; }
.live-hero-title { font-family: var(--font-display); font-size: clamp(2rem,5vw,4rem); letter-spacing: 0.04em; margin-bottom: 10px; }
.live-hero-sub { font-size: 1rem; color: var(--text-secondary); }

/* LAYOUT */
.live-layout { display: contents; grid-template-columns: 1fr 360px; gap: 40px; padding: 50px 0 80px; align-items: start; }
.live-sidebar { position: sticky; top: 120px; display: flex; flex-direction: column; gap: 20px; }

/* PLAYER */
.live-player { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 40px; }
.yt-frame-wrap { width: 100%; aspect-ratio: 16/9; background: #000; position: relative; }
.yt-iframe { width: 100%; height: 100%; border: 0; display: block; }
.player-bar { padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-top: 1px solid var(--border); flex-wrap: wrap; }
.player-channel { display: flex; align-items: center; gap: 12px; }
.channel-logo { width: 36px; height: 36px; background: var(--accent-red); color: #fff; font-family: var(--font-display); font-size: 13px; display: flex; align-items: center; justify-content: center; border-radius: 6px; flex-shrink: 0; }
.channel-name { font-weight: 600; font-size: 0.9rem; }
.channel-live { display: flex; align-items: center; gap: 5px; font-family: var(--font-mono); font-size: 10px; color: #10b981; margin-top: 2px; }
.yt-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #ff0000; color: #fff; border-radius: var(--radius); font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; transition: all 0.2s; text-decoration: none; }
.yt-btn:hover { background: #cc0000; transform: translateY(-1px); }

/* OFFLINE */
.live-offline { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 80px 20px; text-align: center; margin-bottom: 40px; }
.offline-icon { font-size: 4rem; margin-bottom: 16px; opacity: 0.5; }
.offline-title { font-family: var(--font-headline); font-size: 1.8rem; font-weight: 900; margin-bottom: 12px; }
.offline-sub { font-size: 0.95rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 28px; line-height: 1.7; }
.offline-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; font-family: var(--font-mono); font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; border-radius: var(--radius); transition: all 0.2s; cursor: pointer; border: 1px solid transparent; text-decoration: none; }
.btn-primary { background: var(--accent-red); color: #fff; border-color: var(--accent-red); }
.btn-primary:hover { background: #c62b38; }
.btn-outline { background: transparent; color: var(--text-secondary); border-color: var(--border-bright); }
.btn-outline:hover { color: var(--text-primary); border-color: var(--text-muted); }

/* SCHEDULE */
.schedule-list { display: flex; flex-direction: column; }
.schedule-item { display: flex; align-items: flex-start; gap: 20px; padding: 14px 16px; border-bottom: 1px solid var(--border); opacity: 0.45; border-radius: var(--radius); }
.schedule-item.active { opacity: 1; background: rgba(230,57,70,0.06); border-color: rgba(230,57,70,0.2); }
.schedule-item.past { opacity: 0.25; }
.schedule-time { min-width: 90px; }
.sch-time { font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); display: block; }
.sch-live-badge { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 10px; color: var(--accent-red); margin-top: 4px; }
.sch-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 3px; }
.sch-desc { font-size: 0.8rem; color: var(--text-muted); }
.schedule-dur { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-left: auto; white-space: nowrap; }

/* LIVE DOTS */
.live-dot-sm { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-red); display: inline-block; animation: tagPulse 1.5s infinite; }
.live-dot-sm.red { background: var(--accent-red); }

/* UPDATES */
.live-updates-panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.lup-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border); background: var(--bg-secondary); }
.lup-title { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; }
.lup-count { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
.lup-list { max-height: 400px; overflow-y: auto; }
.lup-item { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; gap: 14px; }
.lup-item.breaking { background: rgba(230,57,70,0.05); border-left: 3px solid var(--accent-red); }
.lup-time { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); flex-shrink: 0; padding-top: 2px; }
.lup-text { font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary); }

/* CHANNELS */
.widget { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px; }
.widget-header { margin-bottom: 14px; }
.widget-title { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-primary); }
.channels-list { display: flex; flex-direction: column; gap: 12px; }
.channel-item { display: flex; align-items: center; gap: 12px; }
.ch-icon { width: 36px; height: 36px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 12px; color: #fff; flex-shrink: 0; }
.ch-name { font-size: 0.85rem; font-weight: 600; }
.ch-desc { font-size: 0.75rem; color: var(--text-muted); }
.ch-watch { margin-left: auto; padding: 4px 12px; font-family: var(--font-mono); font-size: 10px; border: 1px solid var(--accent-red); color: var(--accent-red); border-radius: 2px; cursor: pointer; transition: all 0.2s; background: transparent; }
.ch-watch:hover { background: var(--accent-red); color: #fff; }

@media (max-width: 1000px) { .live-layout { grid-template-columns: 1fr; } .live-sidebar { position: static; } }
</style>
