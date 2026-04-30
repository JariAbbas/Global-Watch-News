<template>
  <div class="live-page">
    <!-- Live Hero -->
    <div class="live-hero">
      <div class="container live-hero-content">
        <div class="live-badge">
          <span class="live-dot"></span>
          LIVE NOW
        </div>
        <h1 class="live-hero-title">NewsWave Live Television</h1>
        <p class="live-hero-sub">24/7 breaking news coverage from around the world</p>
      </div>
    </div>

    <div class="container live-layout">
      <!-- Video Player -->
      <div class="live-main">
        <div class="live-player">
          <div class="player-screen">
            <div class="player-placeholder">
              <div class="player-icon">▶</div>
              <p class="player-text">Live Stream</p>
              <p class="player-sub">Click to watch NewsWave Live</p>
              <button class="btn btn-primary" style="margin-top:20px;">
                <span class="live-dot" style="background:#fff;"></span>
                Watch Live
              </button>
            </div>
            <div class="player-overlay-bar">
              <div class="player-channel">
                <span class="logo-mark" style="width:28px;height:28px;font-size:12px;">NW</span>
                <span style="font-family:var(--font-mono);font-size:11px;color:#fff;">NEWSWAVE HD</span>
              </div>
              <div class="player-badge">
                <span class="live-dot"></span>
                LIVE · {{ viewerCount }} watching
              </div>
            </div>
          </div>
          <div class="player-controls">
            <button class="pc-btn">⏮</button>
            <button class="pc-btn pc-play">▶</button>
            <button class="pc-btn">⏭</button>
            <div class="pc-volume">
              <span>🔊</span>
              <div class="volume-bar"><div class="volume-fill" style="width:70%"></div></div>
            </div>
            <div class="pc-spacer"></div>
            <div class="pc-quality">HD</div>
            <button class="pc-btn">⛶</button>
          </div>
        </div>

        <!-- Schedule -->
        <div class="schedule-section">
          <div class="section-header">
            <h2 class="section-title">Today's Schedule</h2>
            <span class="tag live">Live Now: {{ currentShow.title }}</span>
          </div>
          <div class="schedule-list">
            <div
              v-for="show in schedule"
              :key="show.time"
              class="schedule-item"
              :class="{ active: show.isLive, past: show.isPast }"
            >
              <div class="schedule-time">
                <span class="sch-time">{{ show.time }}</span>
                <span v-if="show.isLive" class="sch-live-badge">
                  <span class="live-dot" style="width:5px;height:5px;"></span> LIVE
                </span>
              </div>
              <div class="schedule-info">
                <div class="sch-title">{{ show.title }}</div>
                <div class="sch-desc">{{ show.desc }}</div>
              </div>
              <div class="schedule-dur">{{ show.duration }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar: Live Updates -->
      <aside class="live-sidebar">
        <div class="live-updates-panel">
          <div class="lup-header">
            <span class="lup-title">
              <span class="live-dot"></span>
              Live Updates
            </span>
            <span class="lup-count">{{ updates.length }} updates</span>
          </div>
          <div class="lup-list">
            <div
              v-for="(update, i) in updates"
              :key="i"
              class="lup-item"
              :class="{ breaking: update.breaking }"
            >
              <div class="lup-time">{{ update.time }}</div>
              <div class="lup-body">
                <span v-if="update.breaking" class="tag" style="font-size:9px;padding:2px 7px;margin-bottom:6px;">BREAKING</span>
                <p class="lup-text">{{ update.text }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Channels -->
        <div class="channels-panel widget">
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
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const viewerCount = ref('284,192')

const currentShow = { title: 'Morning Briefing with Aisha Khan' }

const schedule = [
  { time: '06:00 AM', title: 'Early Edition', desc: 'Overnight global developments', duration: '60 min', isPast: true },
  { time: '07:00 AM', title: 'World at Dawn', desc: 'International correspondents live', duration: '90 min', isPast: true },
  { time: '08:30 AM', title: 'Morning Briefing', desc: 'Top stories with Aisha Khan', duration: '60 min', isLive: true },
  { time: '09:30 AM', title: 'Markets Open', desc: 'Live trading floor coverage', duration: '30 min' },
  { time: '10:00 AM', title: 'In Depth', desc: 'Long-form investigative journalism', duration: '60 min' },
  { time: '12:00 PM', title: 'Midday Report', desc: 'Breaking noon headlines', duration: '30 min' },
  { time: '01:00 PM', title: 'Tech Today', desc: 'Technology and innovation news', duration: '60 min' },
  { time: '03:00 PM', title: 'The Rundown', desc: 'Afternoon global update', duration: '60 min' },
  { time: '05:00 PM', title: 'Evening Edition', desc: 'Today\'s biggest stories', duration: '90 min' },
  { time: '07:00 PM', title: 'Prime Time News', desc: 'NewsWave flagship broadcast', duration: '60 min' },
  { time: '09:00 PM', title: 'Analysis Hour', desc: 'Expert panel discussions', duration: '60 min' },
  { time: '11:00 PM', title: 'Night Desk', desc: 'Late-breaking global news', duration: '60 min' },
]

const updates = [
  { time: '09:41', text: 'Geneva Climate Summit: 196 nations sign historic carbon neutrality accord binding by 2045.', breaking: true },
  { time: '09:28', text: 'Fed Reserve Chair signals two rate cuts likely in H2 2026 barring inflation surprises.' },
  { time: '09:15', text: 'MIT quantum computer factors 2048-bit RSA key in under 4 seconds in landmark paper.', breaking: true },
  { time: '09:02', text: 'SpaceX Starship successfully completes cislunar refueling demonstration.' },
  { time: '08:55', text: 'Pakistan solar corridor reaches 80GW capacity, becomes world\'s 3rd largest solar producer.' },
  { time: '08:40', text: 'WHO declares global health emergency over antimicrobial resistance surge.' },
  { time: '08:30', text: 'S&P 500 futures point to fresh all-time high at open after blowout jobs report.' },
  { time: '08:12', text: 'Mars Colony Alpha crew marks one year anniversary with first Martian-grown meal.' },
  { time: '07:58', text: 'Champions League: Braga 4-1 Man City — complete quarter-final results inside.' },
]

const channels = [
  { name: 'NewsWave Main', short: 'NW', desc: 'Breaking news 24/7', color: '#e63946' },
  { name: 'NW Business', short: 'NB', desc: 'Markets & finance', color: '#059669' },
  { name: 'NW Sports', short: 'NS', desc: 'Live scores & analysis', color: '#d97706' },
  { name: 'NW World', short: 'NW', desc: 'International coverage', color: '#7c3aed' },
]
</script>

<style scoped>
/* HERO */
.live-hero {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 60px 0 40px;
  position: relative;
  overflow: hidden;
}
.live-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top left, rgba(230,57,70,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.live-hero-content { position: relative; z-index: 1; }
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-red);
  color: #fff;
  padding: 5px 14px;
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
}
.live-dot {
  width: 6px; height: 6px;
  background: #fff;
  border-radius: 50%;
  animation: blink 1s ease-in-out infinite;
  display: inline-block;
}
.live-badge .live-dot { background: #fff; }
.live-hero-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 4rem);
  letter-spacing: 0.04em;
  margin-bottom: 10px;
}
.live-hero-sub { font-size: 1rem; color: var(--text-secondary); }

/* LAYOUT */
.live-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 40px;
  padding: 50px 0 80px;
  align-items: start;
}
.live-sidebar { position: sticky; top: 120px; }

/* PLAYER */
.live-player {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 40px;
}
.player-screen {
  position: relative;
  aspect-ratio: 16/9;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: repeating-linear-gradient(
    0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px
  );
}
.player-placeholder { text-align: center; }
.player-icon {
  font-size: 3rem;
  width: 70px; height: 70px;
  background: rgba(255,255,255,0.08);
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.player-icon:hover { background: var(--accent-red); border-color: var(--accent-red); }
.player-text { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.06em; }
.player-sub { font-size: 0.82rem; color: var(--text-muted); margin-top: 4px; }
.player-overlay-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 12px 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.player-channel { display: flex; align-items: center; gap: 8px; }
.logo-mark {
  background: var(--accent-red);
  color: #fff;
  font-family: var(--font-display);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
}
.player-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: rgba(255,255,255,0.8);
  background: rgba(230,57,70,0.8);
  padding: 3px 10px;
  border-radius: 2px;
}
.player-controls {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid var(--border);
}
.pc-btn {
  width: 32px; height: 32px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.pc-btn:hover { background: rgba(255,255,255,0.1); color: var(--text-primary); }
.pc-play { background: var(--accent-red); border-color: var(--accent-red); color: #fff; }
.pc-volume { display: flex; align-items: center; gap: 8px; }
.volume-bar {
  width: 80px; height: 3px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}
.volume-fill { height: 100%; background: var(--accent-red); border-radius: 2px; }
.pc-spacer { flex: 1; }
.pc-quality {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent-cyan);
  border: 1px solid var(--accent-cyan);
  padding: 2px 6px;
  border-radius: 2px;
}

/* SCHEDULE */
.schedule-list { display: flex; flex-direction: column; }
.schedule-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  opacity: 0.5;
  transition: all 0.2s;
}
.schedule-item.active {
  opacity: 1;
  background: rgba(230,57,70,0.06);
  margin: 0 -16px;
  padding: 14px 16px;
  border-radius: var(--radius);
  border-color: rgba(230,57,70,0.2);
}
.schedule-item.past { opacity: 0.3; }
.schedule-time { min-width: 90px; }
.sch-time { font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); display: block; }
.sch-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent-red);
  margin-top: 4px;
}
.sch-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 3px; }
.sch-desc { font-size: 0.8rem; color: var(--text-muted); }
.schedule-dur { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-left: auto; white-space: nowrap; }

/* LIVE UPDATES */
.live-updates-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.lup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-secondary);
}
.lup-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary);
}
.lup-title .live-dot { background: var(--accent-red); animation: tagPulse 1.5s ease-in-out infinite; }
.lup-count { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
.lup-list { max-height: 460px; overflow-y: auto; }
.lup-item {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 14px;
}
.lup-item.breaking { background: rgba(230,57,70,0.05); border-left: 3px solid var(--accent-red); }
.lup-time { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); flex-shrink: 0; padding-top: 2px; }
.lup-text { font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary); }

/* CHANNELS */
.widget {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px;
}
.widget-header { margin-bottom: 14px; }
.widget-title { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-primary); }
.channels-list { display: flex; flex-direction: column; gap: 12px; }
.channel-item { display: flex; align-items: center; gap: 12px; }
.ch-icon {
  width: 36px; height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 12px;
  color: #fff;
  flex-shrink: 0;
}
.ch-name { font-size: 0.85rem; font-weight: 600; }
.ch-desc { font-size: 0.75rem; color: var(--text-muted); }
.ch-watch {
  margin-left: auto;
  padding: 4px 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}
.ch-watch:hover { background: var(--accent-red); color: #fff; }

@media (max-width: 1000px) {
  .live-layout { grid-template-columns: 1fr; }
  .live-sidebar { position: static; }
}
</style>
